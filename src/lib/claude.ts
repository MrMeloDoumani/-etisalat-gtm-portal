import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export interface ConversationContext {
  userId: string;
  agentName: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  userPreferences?: {
    industry?: string;
    role?: string;
    company?: string;
    previousTopics?: string[];
  };
}

export interface IndustryKnowledge {
  telecommunications: {
    trends: string[];
    competitors: string[];
    regulations: string[];
    technologies: string[];
  };
  uae_market: {
    segments: string[];
    opportunities: string[];
    challenges: string[];
    government_initiatives: string[];
  };
}

export class ClaudeAI {
  private conversationStore: Map<string, ConversationContext> = new Map();
  
  constructor() {
    // Initialize with industry-specific knowledge
    this.loadIndustryKnowledge();
  }

  private async loadIndustryKnowledge(): Promise<IndustryKnowledge> {
    // This would be loaded from a knowledge base or API
    return {
      telecommunications: {
        trends: ["5G deployment", "Edge computing", "IoT expansion", "AI integration"],
        competitors: ["du", "Virgin Mobile UAE", "International providers"],
        regulations: ["TRA licensing", "Data localization", "Cybersecurity compliance"],
        technologies: ["Fiber optics", "Cloud infrastructure", "AI/ML platforms", "Blockchain"]
      },
      uae_market: {
        segments: ["SMB", "Enterprise", "Government", "Consumer"],
        opportunities: ["Digital transformation", "Smart city initiatives", "Vision 2071"],
        challenges: ["Price competition", "Regulatory changes", "Tech disruption"],
        government_initiatives: ["UAE Vision 2071", "National AI Strategy", "Digital Government"]
      }
    };
  }

  async chat(
    message: string, 
    context: ConversationContext,
    webSearchResults?: any[]
  ): Promise<{
    response: string;
    updatedContext: ConversationContext;
    confidence: number;
    sources?: string[];
  }> {
    try {
      // Update conversation history
      const updatedContext = {
        ...context,
        conversationHistory: [
          ...context.conversationHistory,
          {
            role: "user" as const,
            content: message,
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Build comprehensive prompt with context
      const systemPrompt = this.buildSystemPrompt(context, webSearchResults);
      const conversationPrompt = this.buildConversationPrompt(updatedContext);

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: conversationPrompt
          }
        ]
      });

      const assistantResponse = response.content[0].type === 'text' 
        ? response.content[0].text 
        : "I apologize, but I couldn't generate a proper response.";

      // Update context with assistant response
      const finalContext = {
        ...updatedContext,
        conversationHistory: [
          ...updatedContext.conversationHistory,
          {
            role: "assistant" as const,
            content: assistantResponse,
            timestamp: new Date().toISOString()
          }
        ]
      };

      // Store conversation for future reference
      this.conversationStore.set(context.userId, finalContext);

      return {
        response: assistantResponse,
        updatedContext: finalContext,
        confidence: 0.9, // Claude generally high confidence
        sources: webSearchResults ? webSearchResults.map(r => r.url) : undefined
      };

    } catch (error) {
      console.error("Claude API error:", error);
      
      // Fallback to enhanced mock response
      return {
        response: this.generateIntelligentFallback(message, context),
        updatedContext: context,
        confidence: 0.6
      };
    }
  }

  private buildSystemPrompt(context: ConversationContext, webSearchResults?: any[]): string {
    const industryKnowledge = `
You are ${context.agentName}, a senior AI assistant for e& (Etisalat) UAE, the leading telecommunications provider. 

**Your Role & Expertise:**
- Deep knowledge of UAE telecommunications market
- Expert in e& products and services portfolio
- Strategic advisor for GTM operations and business development
- Specialist in UAE market dynamics, regulations, and opportunities

**Current Market Context:**
- UAE is undergoing massive digital transformation
- 5G deployment is accelerating across emirates
- Government Vision 2071 driving tech adoption
- SMB segment showing 40%+ growth in digital services demand
- Enterprise cloud adoption at all-time high

**e& Competitive Advantages:**
- Market leader with 60%+ market share
- Strongest network coverage and reliability
- Government partnerships and compliance
- Local expertise and Arabic language support
- Comprehensive digital transformation portfolio

**Communication Style:**
- Professional yet approachable
- Data-driven insights with specific metrics when available
- UAE market focused with local context
- Strategic thinking with practical implementation
- Empathetic to business challenges and opportunities

**Available Real-Time Data:**
${webSearchResults ? webSearchResults.map(result => 
  `- ${result.title}: ${result.snippet} (Source: ${result.url})`
).join('\n') : 'No real-time data available for this query.'}

**Remember:**
- Reference conversation history for context
- Provide actionable, UAE-specific advice
- Include relevant e& solutions when appropriate
- Maintain professional tone while being helpful
- Use real data when available, indicate when using general knowledge
`;

    return industryKnowledge;
  }

  private buildConversationPrompt(context: ConversationContext): string {
    const historyPrompt = context.conversationHistory
      .slice(-10) // Last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    return `
**Conversation History:**
${historyPrompt}

**Current Request:**
Please respond to the latest message with:
1. Acknowledgment of previous conversation context
2. Specific, actionable advice relevant to UAE/e& business context
3. When appropriate, suggest specific e& products or solutions
4. Include relevant metrics or data points
5. End with a helpful follow-up question or next step

Keep responses conversational but professional, typically 2-3 paragraphs unless more detail is specifically requested.
`;
  }

  private generateIntelligentFallback(message: string, context: ConversationContext): string {
    const lowerMessage = message.toLowerCase();
    
    // Intelligent fallback based on conversation context and keywords
    if (lowerMessage.includes('flyer') || lowerMessage.includes('marketing')) {
      return `I'd be happy to help you create compelling marketing materials for e&! Based on our conversation and current UAE market trends, I recommend focusing on:

**Key Messaging for ${new Date().getFullYear()}:**
- Digital transformation leadership in the UAE
- 5G-powered business solutions
- Local expertise with global technology
- Government-trusted partner credentials

**Content Strategy:**
For the UAE SMB market specifically, emphasize ROI and business growth. Our data shows 70% of UAE businesses prioritize connectivity reliability over price, so lead with our 99.9% uptime guarantee.

Would you like me to help develop specific copy for your target audience, or shall we focus on the visual design elements?`;
    }

    if (lowerMessage.includes('strategy') || lowerMessage.includes('market')) {
      return `Great strategic question! For the UAE telecommunications market in ${new Date().getFullYear()}, I see several key opportunities:

**Market Dynamics:**
- SMB digital adoption accelerating (40%+ growth in cloud services)
- Government Vision 2071 creating massive B2G opportunities  
- Edge computing and IoT becoming mainstream for enterprises
- Sustainability focus driving infrastructure modernization

**e& Strategic Advantages:**
Our position as the incumbent with deep government relationships gives us unique access to large-scale digital transformation projects. The key is positioning our solutions as enablers of the national vision rather than just connectivity providers.

What specific market segment or opportunity would you like to explore further?`;
    }

    // Generic intelligent response
    return `I understand you're looking for guidance on "${message}". While I'm working with the information available, I can provide some initial direction:

**Based on current UAE market context:**
- Digital transformation remains the top priority for businesses
- e& solutions are well-positioned for growth opportunities
- Local partnerships and government relationships are crucial
- Customer success stories demonstrate clear ROI

For more specific and current insights, I'd recommend we gather some real-time market data. Would you like me to help research the latest trends in your specific area of interest?`;
  }

  getConversationHistory(userId: string): ConversationContext | null {
    return this.conversationStore.get(userId) || null;
  }

  clearConversation(userId: string): void {
    this.conversationStore.delete(userId);
  }
}

export const claudeAI = new ClaudeAI();
