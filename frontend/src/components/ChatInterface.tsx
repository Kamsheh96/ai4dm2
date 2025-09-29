import React, { useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useTools } from '@hooks/useTools';
import type { ChatMessage } from '@domain/tools';
import type { FileItem } from '@domain/models';

interface ChatInterfaceProps {
  uploadedFiles: FileItem[];
  onFilesAdded: (files: FileItem[]) => void;
  onFileRemove: (fileId: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ uploadedFiles, onFileRemove }) => {
  const { messages, isProcessing } = useChat();
  const { getSelectedToolsData } = useTools();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isProcessing]);

  const formatTimestamp = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderMessage = (message: ChatMessage): React.ReactElement => {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-scale-in`}
      >
        <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-2'}`}>
          <div
            className={`rounded-2xl px-6 py-4 shadow-soft ${
              isUser
                ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white'
                : isSystem
                ? 'bg-warning-100 text-warning-800 border border-warning-200'
                : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

            {message.tools && message.tools.length > 0 && (
              <div className="mt-3 pt-3 border-t border-opacity-20 border-current">
                <p className="text-xs opacity-75 mb-2 font-semibold">Tools used:</p>
                <div className="flex flex-wrap gap-2">
                  {message.tools.map(toolId => {
                    const selectedTools = getSelectedToolsData();
                    const tool = selectedTools.find(t => t.id === toolId);
                    return tool ? (
                      <span
                        key={toolId}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          isUser
                            ? 'bg-white/20 backdrop-blur-sm'
                            : 'bg-primary-100 text-primary-700 border border-primary-200'
                        }`}
                      >
                        {tool.icon} {tool.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {message.files && message.files.length > 0 && (
              <div className="mt-3 pt-3 border-t border-opacity-20 border-current">
                <p className="text-xs opacity-75 mb-2 font-semibold">Files:</p>
                <div className="flex flex-wrap gap-2">
                  {message.files.map(filename => (
                    <span
                      key={filename}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        isUser
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      📄 {filename}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`text-xs text-gray-500 mt-2 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft ${
          isUser
            ? 'order-2 ml-3 bg-gradient-to-br from-primary-600 to-secondary-600'
            : 'order-1 mr-3 bg-gradient-to-br from-gray-200 to-gray-300'
        }`}>
          {isUser ? (
            <span className="text-white text-lg">👤</span>
          ) : isSystem ? (
            <span className="text-warning-600 text-lg">⚠️</span>
          ) : (
            <span className="text-gray-600 text-lg">🤖</span>
          )}
        </div>
      </div>
    );
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="card-glass">
      <div className="flex flex-col" style={{ height: 'calc(100vh - 450px)', minHeight: '500px' }}>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-custom">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Start a Conversation</h3>
              <p className="text-gray-600 max-w-md leading-relaxed mb-6">
                Enter your first instruction above to begin an AI-powered data management session.
                Select tools and upload files to enhance your assistant's capabilities.
              </p>

              {/* Uploaded Files Section - Shown in empty state */}
              {uploadedFiles.length > 0 && (
                <div className="w-full max-w-2xl mt-8">
                  <div className="bg-primary-50/50 backdrop-blur-sm rounded-2xl p-4 border border-primary-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <h4 className="text-sm font-bold text-primary-900">Attached Files ({uploadedFiles.length})</h4>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {uploadedFiles.map((fileItem) => (
                        <div
                          key={fileItem.id}
                          className="flex items-center justify-between bg-white/80 rounded-xl p-3 hover:bg-white transition-all duration-200"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">{fileItem.file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(fileItem.file.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onFileRemove(fileItem.id)}
                            className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200"
                            aria-label={`Remove ${fileItem.file.name}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Messages */}
          {messages.map(renderMessage)}

          {/* AI Thinking Indicator */}
          {isProcessing && (
            <div className="flex justify-start mb-4">
              <div className="order-2 max-w-[80%]">
                <div className="bg-white/80 backdrop-blur-sm text-gray-900 rounded-2xl px-6 py-4 shadow-soft border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">AI is thinking...</span>
                  </div>
                </div>
              </div>
              <div className="order-1 mr-3 w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-soft">
                <span className="text-white text-lg">🤖</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};