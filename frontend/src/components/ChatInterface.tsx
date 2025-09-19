import React, { useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useTools } from '@hooks/useTools';
import type { ChatMessage } from '@domain/tools';

interface ChatInterfaceProps {
  uploadedFiles: string[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ uploadedFiles }) => {
  const { messages, isProcessing } = useChat();
  const { getSelectedToolsData } = useTools();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if user is near the bottom or if it's a new message
    const scrollContainer = messagesEndRef.current?.parentElement;
    if (scrollContainer && messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom || messages.length === 1) {
        // Use a slight delay to ensure DOM has updated
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }, 10);
      }
    }
  }, [messages]);

  const formatTimestamp = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderMessage = (message: ChatMessage): JSX.Element => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
          <div
            className={`rounded-lg px-4 py-3 ${
              isUser
                ? 'bg-primary-600 text-white'
                : isSystem
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>

            {message.tools && message.tools.length > 0 && (
              <div className="mt-2 pt-2 border-t border-opacity-20 border-white">
                <p className="text-xs opacity-75 mb-1">Tools used:</p>
                <div className="flex flex-wrap gap-1">
                  {message.tools.map(toolId => {
                    const selectedTools = getSelectedToolsData();
                    const tool = selectedTools.find(t => t.id === toolId);
                    return tool ? (
                      <span
                        key={toolId}
                        className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
                      >
                        {tool.icon} {tool.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {message.files && message.files.length > 0 && (
              <div className="mt-2 pt-2 border-t border-opacity-20 border-white">
                <p className="text-xs opacity-75 mb-1">Files:</p>
                <div className="flex flex-wrap gap-1">
                  {message.files.map(filename => (
                    <span
                      key={filename}
                      className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
                    >
                      📄 {filename}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'order-2 ml-2 bg-primary-600' : 'order-1 mr-2 bg-gray-300'
        }`}>
          {isUser ? (
            <span className="text-white text-sm">👤</span>
          ) : isSystem ? (
            <span className="text-yellow-600 text-sm">⚠️</span>
          ) : (
            <span className="text-gray-600 text-sm">🤖</span>
          )}
        </div>
      </div>
    );
  };

  if (messages.length === 0) {
    return (
      <div className="card h-96">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h3>
          <p className="text-gray-600 max-w-md">
            Enter your first instruction above to begin an AI-powered data management session.
            Select tools to enhance your assistant's capabilities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-96">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map(renderMessage)}
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="order-2 max-w-[80%]">
                <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
              <div className="order-1 mr-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">🤖</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};