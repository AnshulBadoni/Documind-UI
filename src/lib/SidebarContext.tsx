"use client";

import React, { createContext, useContext, useState } from "react";

type Session = { session_id: string; title: string; created_at: string };

type SidebarContextType = {
  sessions: Session[];
  setSessions: (s: Session[]) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  onSessionSelect: ((id: string) => void) | null;
  setOnSessionSelect: (fn: ((id: string) => void) | null) => void;
  onNewChat: (() => void) | null;
  setOnNewChat: (fn: (() => void) | null) => void;
};

const SidebarContext = createContext<SidebarContextType>({
  sessions: [],
  setSessions: () => {},
  activeSessionId: null,
  setActiveSessionId: () => {},
  onSessionSelect: null,
  setOnSessionSelect: () => {},
  onNewChat: null,
  setOnNewChat: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [onSessionSelect, setOnSessionSelectRaw] = useState<((id: string) => void) | null>(null);
  const [onNewChat, setOnNewChatRaw] = useState<(() => void) | null>(null);

  // Wrap setters to handle function values properly (React state + functions)
  const setOnSessionSelect = (fn: ((id: string) => void) | null) => {
    setOnSessionSelectRaw(() => fn);
  };
  const setOnNewChat = (fn: (() => void) | null) => {
    setOnNewChatRaw(() => fn);
  };

  return (
    <SidebarContext.Provider
      value={{
        sessions,
        setSessions,
        activeSessionId,
        setActiveSessionId,
        onSessionSelect,
        setOnSessionSelect,
        onNewChat,
        setOnNewChat,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
