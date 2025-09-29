import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { ChatMessage } from '@domain/tools';

interface ChatContextValue {
  messages: ChatMessage[];
  isProcessing: boolean;
  addMessage: (content: string, type: ChatMessage['type'], tools?: string[], files?: string[]) => void;
  setProcessing: (processing: boolean) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const value: ChatContextValue = {
    messages,
    isProcessing,
    addMessage,
    setProcessing,
    clearMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext };
export default ChatContext;