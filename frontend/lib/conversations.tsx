"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  artifact?: {
    id: string;
    title: string;
    type: "document" | "code" | "table";
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationsContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: () => Conversation;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

const STORAGE_KEY = "aps-assistant-conversations";

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const convos = parsed.map((c: Conversation) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setConversations(convos);
      }
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  }, []);

  // Save to localStorage when conversations change
  useEffect(() => {
    if (mounted && conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations, mounted]);

  const createConversation = (): Conversation => {
    const newConvo: Conversation = {
      id: `conv_${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConvo, ...prev]);
    setCurrentConversationId(newConvo.id);
    return newConvo;
  };

  const setCurrentConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          const updated = {
            ...c,
            messages: [...c.messages, message],
            updatedAt: new Date(),
          };
          // Auto-generate title from first user message
          if (c.title === "New Chat" && message.role === "user") {
            updated.title = message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "");
          }
          return updated;
        }
        return c;
      })
    );
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date() } : c))
    );
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        currentConversation,
        createConversation,
        setCurrentConversation,
        addMessage,
        updateConversationTitle,
        deleteConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error("useConversations must be used within a ConversationsProvider");
  }
  return context;
}

// Helper to format date for sidebar grouping
export function getDateGroup(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Previous 7 Days";
  return "Older";
}

