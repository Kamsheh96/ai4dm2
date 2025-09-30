import React, { createContext, useCallback, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ChatMessage } from '@domain/tools';

interface ChatContextValue {
  messages: ChatMessage[];
  isProcessing: boolean;
  currentWorkstream: string | null;
  addMessage: (content: string, type: ChatMessage['type'], tools?: string[], files?: string[]) => void;
  setProcessing: (processing: boolean) => void;
  clearMessages: () => void;
  setCurrentWorkstream: (workstreamId: string | null) => void;
  loadWorkstreamHistory: (workstreamId: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'ai4dm_workstream_chats';

// Helper to load chat history from storage
function loadChatHistory(): Record<string, ChatMessage[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      Object.keys(parsed).forEach(workstreamId => {
        parsed[workstreamId] = parsed[workstreamId].map((msg: ChatMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      });
      return parsed;
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return {};
}

// Helper to save chat history to storage
function saveChatHistory(history: Record<string, ChatMessage[]>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWorkstream, setCurrentWorkstreamState] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => loadChatHistory());

  // Auto-save chat history when messages change
  useEffect(() => {
    if (currentWorkstream && messages.length > 0) {
      setChatHistory(prev => {
        const updated = {
          ...prev,
          [currentWorkstream]: messages
        };
        saveChatHistory(updated);
        return updated;
      });
    }
  }, [messages, currentWorkstream]);

  const addMessage = useCallback((
    content: string,
    type: ChatMessage['type'],
    tools?: string[],
    files?: string[]
  ): void => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: new Date(),
      ...(tools && { tools }),
      ...(files && { files })
    };

    setMessages(prev => [...prev, newMessage]);
  }, []);

  const setProcessing = useCallback((processing: boolean): void => {
    setIsProcessing(processing);
  }, []);

  const clearMessages = useCallback((): void => {
    setMessages([]);
  }, []);

  const setCurrentWorkstream = useCallback((workstreamId: string | null): void => {
    // Save current messages before switching
    if (currentWorkstream && messages.length > 0) {
      setChatHistory(prev => {
        const updated = {
          ...prev,
          [currentWorkstream]: messages
        };
        saveChatHistory(updated);
        return updated;
      });
    }

    setCurrentWorkstreamState(workstreamId);

    // Load history for new workstream
    if (workstreamId && chatHistory[workstreamId]) {
      setMessages(chatHistory[workstreamId]);
    } else {
      setMessages([]);
    }
  }, [currentWorkstream, messages, chatHistory]);

  const loadWorkstreamHistory = useCallback((workstreamId: string): void => {
    if (chatHistory[workstreamId]) {
      setMessages(chatHistory[workstreamId]);
      setCurrentWorkstreamState(workstreamId);
    }
  }, [chatHistory]);

  const value: ChatContextValue = {
    messages,
    isProcessing,
    currentWorkstream,
    addMessage,
    setProcessing,
    clearMessages,
    setCurrentWorkstream,
    loadWorkstreamHistory
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext };
export default ChatContext;