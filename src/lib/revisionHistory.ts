interface Revision {
  id: string;
  version: number;
  content: string;
  type: 'conversation' | 'document' | 'project' | 'strategy';
  author: string;
  timestamp: Date;
  changes: string;
  parentId?: string;
  isDraft: boolean;
  tags: string[];
  metadata?: Record<string, any>;
}

interface RevisionOptions {
  maxRevisions?: number;
  autoSave?: boolean;
  saveInterval?: number; // milliseconds
}

export class RevisionHistory {
  private revisions: Map<string, Revision[]> = new Map();
  private autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();
  private options: RevisionOptions;

  constructor(options: RevisionOptions = {}) {
    this.options = {
      maxRevisions: 50,
      autoSave: true,
      saveInterval: 30000, // 30 seconds
      ...options
    };
  }

  createRevision(
    itemId: string,
    content: string,
    type: Revision['type'],
    author: string,
    changes: string,
    metadata?: Record<string, any>
  ): Revision {
    const existingRevisions = this.revisions.get(itemId) || [];
    const version = existingRevisions.length + 1;
    
    const revision: Revision = {
      id: `${itemId}-v${version}`,
      version,
      content,
      type,
      author,
      timestamp: new Date(),
      changes,
      isDraft: false,
      tags: [],
      metadata
    };

    // Add to revisions
    const newRevisions = [...existingRevisions, revision];
    
    // Limit revisions if needed
    if (this.options.maxRevisions && newRevisions.length > this.options.maxRevisions) {
      newRevisions.splice(0, newRevisions.length - this.options.maxRevisions);
    }
    
    this.revisions.set(itemId, newRevisions);
    
    // Auto-save to localStorage
    this.saveToStorage(itemId);
    
    return revision;
  }

  createDraft(
    itemId: string,
    content: string,
    type: Revision['type'],
    author: string,
    metadata?: Record<string, any>
  ): Revision {
    const existingRevisions = this.revisions.get(itemId) || [];
    const version = existingRevisions.length + 1;
    
    const draft: Revision = {
      id: `${itemId}-draft-${Date.now()}`,
      version,
      content,
      type,
      author,
      timestamp: new Date(),
      changes: "Draft created",
      isDraft: true,
      tags: ['draft'],
      metadata
    };

    // Add draft to revisions
    const newRevisions = [...existingRevisions, draft];
    this.revisions.set(itemId, newRevisions);
    
    // Set up auto-save if enabled
    if (this.options.autoSave) {
      this.setupAutoSave(itemId, content, type, author, metadata);
    }
    
    return draft;
  }

  getRevisions(itemId: string): Revision[] {
    return this.revisions.get(itemId) || [];
  }

  getRevision(itemId: string, version: number): Revision | null {
    const revisions = this.getRevisions(itemId);
    return revisions.find(r => r.version === version) || null;
  }

  getLatestRevision(itemId: string): Revision | null {
    const revisions = this.getRevisions(itemId);
    return revisions[revisions.length - 1] || null;
  }

  getDrafts(itemId: string): Revision[] {
    return this.getRevisions(itemId).filter(r => r.isDraft);
  }

  updateDraft(
    itemId: string,
    content: string,
    changes: string,
    author: string
  ): Revision | null {
    const revisions = this.getRevisions(itemId);
    const latestDraft = revisions.find(r => r.isDraft);
    
    if (!latestDraft) {
      return null;
    }

    const updatedDraft: Revision = {
      ...latestDraft,
      content,
      changes: `${latestDraft.changes}; ${changes}`,
      timestamp: new Date(),
      author
    };

    // Replace the draft
    const newRevisions = revisions.map(r => 
      r.id === latestDraft.id ? updatedDraft : r
    );
    this.revisions.set(itemId, newRevisions);
    
    return updatedDraft;
  }

  publishDraft(itemId: string, author: string): Revision | null {
    const revisions = this.getRevisions(itemId);
    const latestDraft = revisions.find(r => r.isDraft);
    
    if (!latestDraft) {
      return null;
    }

    const publishedRevision: Revision = {
      ...latestDraft,
      isDraft: false,
      changes: `${latestDraft.changes}; Published`,
      timestamp: new Date(),
      author,
      tags: latestDraft.tags.filter(tag => tag !== 'draft')
    };

    // Replace the draft with published version
    const newRevisions = revisions.map(r => 
      r.id === latestDraft.id ? publishedRevision : r
    );
    this.revisions.set(itemId, newRevisions);
    
    // Clear auto-save timer
    this.clearAutoSave(itemId);
    
    return publishedRevision;
  }

  deleteDraft(itemId: string): boolean {
    const revisions = this.getRevisions(itemId);
    const draftIndex = revisions.findIndex(r => r.isDraft);
    
    if (draftIndex === -1) {
      return false;
    }

    // Remove the draft
    const newRevisions = revisions.filter((_, index) => index !== draftIndex);
    this.revisions.set(itemId, newRevisions);
    
    // Clear auto-save timer
    this.clearAutoSave(itemId);
    
    return true;
  }

  compareRevisions(itemId: string, version1: number, version2: number): {
    changes: string[];
    added: string[];
    removed: string[];
  } {
    const rev1 = this.getRevision(itemId, version1);
    const rev2 = this.getRevision(itemId, version2);
    
    if (!rev1 || !rev2) {
      return { changes: [], added: [], removed: [] };
    }

    // Simple diff implementation
    const lines1 = rev1.content.split('\n');
    const lines2 = rev2.content.split('\n');
    
    const added = lines2.filter(line => !lines1.includes(line));
    const removed = lines1.filter(line => !lines2.includes(line));
    
    return {
      changes: [...added, ...removed],
      added,
      removed
    };
  }

  getRevisionHistory(itemId: string): Array<{
    version: number;
    author: string;
    timestamp: Date;
    changes: string;
    isDraft: boolean;
    contentPreview: string;
  }> {
    return this.getRevisions(itemId).map(rev => ({
      version: rev.version,
      author: rev.author,
      timestamp: rev.timestamp,
      changes: rev.changes,
      isDraft: rev.isDraft,
      contentPreview: rev.content.substring(0, 100) + (rev.content.length > 100 ? '...' : '')
    }));
  }

  private setupAutoSave(
    itemId: string, 
    content: string, 
    type: Revision['type'], 
    author: string,
    metadata?: Record<string, any>
  ) {
    // Clear existing timer
    this.clearAutoSave(itemId);
    
    const timer = setInterval(() => {
      this.updateDraft(itemId, content, "Auto-saved", author);
    }, this.options.saveInterval);
    
    this.autoSaveTimers.set(itemId, timer);
  }

  private clearAutoSave(itemId: string) {
    const timer = this.autoSaveTimers.get(itemId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(itemId);
    }
  }

  private saveToStorage(itemId: string) {
    try {
      const revisions = this.getRevisions(itemId);
      localStorage.setItem(`revisions_${itemId}`, JSON.stringify(revisions));
    } catch (error) {
      console.error('Failed to save revisions to storage:', error);
    }
  }

  loadFromStorage(itemId: string): boolean {
    try {
      const stored = localStorage.getItem(`revisions_${itemId}`);
      if (stored) {
        const revisions = JSON.parse(stored).map((rev: any) => ({
          ...rev,
          timestamp: new Date(rev.timestamp)
        }));
        this.revisions.set(itemId, revisions);
        return true;
      }
    } catch (error) {
      console.error('Failed to load revisions from storage:', error);
    }
    return false;
  }

  exportRevisions(itemId: string): string {
    const revisions = this.getRevisions(itemId);
    return JSON.stringify({
      itemId,
      exportedAt: new Date().toISOString(),
      revisions: revisions.map(rev => ({
        ...rev,
        timestamp: rev.timestamp.toISOString()
      }))
    }, null, 2);
  }

  importRevisions(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      const revisions = parsed.revisions.map((rev: any) => ({
        ...rev,
        timestamp: new Date(rev.timestamp)
      }));
      this.revisions.set(parsed.itemId, revisions);
      return true;
    } catch (error) {
      console.error('Failed to import revisions:', error);
      return false;
    }
  }
}

export const revisionHistory = new RevisionHistory();
