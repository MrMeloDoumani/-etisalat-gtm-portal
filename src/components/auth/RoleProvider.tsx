"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserRole {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  department: string;
  canApprove: boolean;
  canExport: boolean;
  canViewAnalytics: boolean;
}

interface RoleContextType {
  currentUser: UserRole | null;
  setCurrentUser: (user: UserRole | null) => void;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserRole | null>(null);

  useEffect(() => {
    // In a real app, this would come from authentication
    // For demo, we'll set a default Director role
    const demoUser: UserRole = {
      id: "yasser-director",
      name: "Yasser Omar Zaki Shaaban",
      level: 1, // Director level
      permissions: [
        "create_campaigns",
        "approve_budgets", 
        "view_analytics",
        "export_documents",
        "manage_team",
        "approve_content"
      ],
      department: "GTM",
      canApprove: true,
      canExport: true,
      canViewAnalytics: true,
    };
    
    setCurrentUser(demoUser);
  }, []);

  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) || false;
  };

  const canAccess = (resource: string): boolean => {
    if (!currentUser) return false;
    
    // Role-based access logic
    switch (resource) {
      case "analytics":
        return currentUser.level <= 2; // Director and Senior Managers
      case "budget_approval":
        return currentUser.level === 1; // Director only
      case "content_creation":
        return true; // All users
      case "team_management":
        return currentUser.level <= 2; // Director and Senior Managers
      default:
        return true;
    }
  };

  return (
    <RoleContext.Provider value={{
      currentUser,
      setCurrentUser,
      hasPermission,
      canAccess
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
