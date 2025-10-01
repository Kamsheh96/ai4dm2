import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useTools } from '@hooks/useTools';
import { useToast } from '@hooks/useToast';
import type { ChatMessage } from '@domain/tools';
import type { FileItem } from '@domain/models';

interface ChatWorkspaceProps {
  uploadedFiles: FileItem[];
  onFilesAdded: (files: FileItem[]) => void;
  onFileRemove: (fileId: string) => void;
  maxLength?: number;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  uploadedFiles,
  onFilesAdded,
  onFileRemove,
  maxLength = 2000
}) => {
  const [instruction, setInstruction] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { messages, addMessage, isProcessing, setProcessing } = useChat();
  const { selectedTools, getSelectedToolsData, openToolsModal } = useTools();
  const { addToast } = useToast();

  const isExpanded = messages.length > 0;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && !isExpanded) {
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          window.scrollTo(0, scrollTop);
        }
      });
    }
  }, [instruction, isExpanded]);

  // Auto-scroll to show the top of the last message
  useEffect(() => {
    if (lastMessageRef.current && isExpanded) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (lastMessageRef.current) {
          const container = lastMessageRef.current.parentElement;
          if (container) {
            // Scroll container so the last message top is visible near the top
            const messageTop = lastMessageRef.current.offsetTop;
            container.scrollTo({
              top: messageTop - 20, // 20px padding from top
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  }, [messages, isProcessing, isExpanded]);

  const handleSubmit = async (): Promise<void> => {
    if (!instruction.trim() || isProcessing) return;

    const selectedToolsData = getSelectedToolsData();
    const fileNames = uploadedFiles.map(f => f.file.name);

    addMessage(
      instruction,
      'user',
      selectedTools,
      fileNames.length > 0 ? fileNames : undefined
    );

    setProcessing(true);
    addToast('Processing your request...', 'info');

    // Simulate AI processing
    setTimeout(() => {
      const toolsUsed = selectedToolsData.length > 0 ? selectedToolsData.slice(0, 3).map(t => t.id) : undefined;

      let response = `I've analyzed your request`;

      if (selectedToolsData.length > 0) {
        response += ` using ${selectedToolsData.length} specialized tool${selectedToolsData.length > 1 ? 's' : ''}`;
      }

      if (fileNames.length > 0) {
        response += ` and processed ${fileNames.length} file${fileNames.length > 1 ? 's' : ''}`;
      }

      response += `. Here's what I found:\n\n`;
      response += `📊 Analysis complete! Based on your instruction "${instruction.slice(0, 50)}${instruction.length > 50 ? '...' : ''}"\n\n`;

      if (selectedToolsData.length > 0) {
        response += `🔧 Tools Applied:\n`;
        selectedToolsData.slice(0, 3).forEach(tool => {
          response += `• ${tool.icon} ${tool.name}: ${tool.description}\n`;
        });
        response += `\n`;
      }

      if (fileNames.length > 0) {
        response += `📁 Files Processed:\n`;
        fileNames.forEach(name => {
          response += `• ${name}\n`;
        });
        response += `\n`;
      }

      response += `✅ The analysis has been completed successfully. You can now continue the conversation or upload additional files.`;

      addMessage(response, 'assistant', toolsUsed, fileNames.length > 0 ? fileNames : undefined);
      setProcessing(false);
      addToast('Request processed successfully!', 'success');
    }, 2000 + Math.random() * 2000);

    setInstruction('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey && !isProcessing && instruction.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: FileItem[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file,
      uploadedAt: new Date(),
      status: 'uploaded'
    }));

    onFilesAdded(newFiles);
    addToast(`${newFiles.length} file(s) added`, 'success');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
                ? 'bg-warning-900/50 text-warning-200 border border-warning-700'
                : 'bg-gray-800 text-white border border-gray-700'
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

            {message.tools && message.tools.length > 0 && (
              <div className="mt-3 pt-3 border-t border-opacity-20 border-current">
                <p className="text-xs opacity-75 mb-2 font-semibold">Tools used:</p>
                <div className="flex flex-wrap gap-2">
                  {message.tools.map(toolId => {
                    const selectedToolsData = getSelectedToolsData();
                    const tool = selectedToolsData.find(t => t.id === toolId);
                    return tool ? (
                      <span
                        key={toolId}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                          isUser
                            ? 'bg-white/20 backdrop-blur-sm'
                            : 'bg-primary-900/50 text-primary-300 border border-primary-700'
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
                          : 'bg-gray-700 text-gray-200 border border-gray-600'
                      }`}
                    >
                      📄 {filename}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`text-xs text-gray-400 mt-2 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft ${
          isUser
            ? 'order-2 ml-3 bg-gradient-to-br from-primary-600 to-secondary-600'
            : 'order-1 mr-3 bg-gradient-to-br from-gray-700 to-gray-800'
        }`}>
          {isUser ? (
            <span className="text-white text-lg">👤</span>
          ) : isSystem ? (
            <span className="text-warning-400 text-lg">⚠️</span>
          ) : (
            <span className="text-white text-lg">🤖</span>
          )}
        </div>
      </div>
    );
  };

  const remainingChars = maxLength - instruction.length;
  const isNearLimit = remainingChars < 100;
  const selectedToolsData = getSelectedToolsData();

  return (
    <div
      className={`bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8 transition-all duration-500 ease-in-out ${
        isExpanded ? 'animate-slide-up' : 'animate-fade-in'
      }`}
      style={{
        minHeight: isExpanded ? 'calc(100vh - 300px)' : 'auto'
      }}
    >
      <div className="space-y-6">
        {/* Compact Mode: Instruction Input Only */}
        {!isExpanded && (
          <>
            {/* Tools Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={openToolsModal}
                  className="flex items-center space-x-2 px-4 py-2.5 min-h-[44px] bg-gray-700 text-primary-300 rounded-2xl font-medium hover:bg-gray-600 hover:shadow-soft hover:scale-105 transition-all duration-200 border border-gray-600 touch-manipulation"
                >
                  <span className="text-lg">🛠️</span>
                  <span className="font-semibold">Tools</span>
                  {selectedTools.length > 0 && (
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                      {selectedTools.length}
                    </span>
                  )}
                </button>

                {selectedToolsData.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-300 font-medium hidden sm:inline">Active:</span>
                    {selectedToolsData.slice(0, 3).map(tool => (
                      <span
                        key={tool.id}
                        className="text-xs bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-gray-600 hover:scale-105 transition-transform duration-200"
                        title={tool.name}
                      >
                        {tool.icon} {tool.name.split(' ')[0]}
                      </span>
                    ))}
                    {selectedToolsData.length > 3 && (
                      <span className="text-xs bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-gray-600">
                        +{selectedToolsData.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <span className={`text-sm font-semibold ${isNearLimit ? 'text-warning-400' : 'text-gray-300'}`}>
                {remainingChars} chars remaining
              </span>
            </div>

            {/* Input Area */}
            <div className={`relative rounded-3xl border-2 transition-all duration-200 ${
              isFocused
                ? 'border-primary-500 bg-gray-700 shadow-medium scale-[1.01]'
                : 'border-gray-600 bg-gray-700 hover:bg-gray-650'
            }`}>
              <textarea
                ref={textareaRef}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your AI assistant anything about data management..."
                className="w-full p-6 resize-none outline-none rounded-3xl min-h-[100px] max-h-[240px] text-base bg-transparent text-white placeholder:text-gray-400 scrollbar-custom"
                maxLength={maxLength}
                disabled={isProcessing}
              />
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="bg-gray-700 rounded-2xl p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <h4 className="text-sm font-bold text-white">Attached Files ({uploadedFiles.length})</h4>
                  </div>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((fileItem) => (
                    <div
                      key={fileItem.id}
                      className="flex items-center justify-between bg-gray-800 rounded-xl p-3 hover:bg-gray-750 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white truncate">{fileItem.file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(fileItem.file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onFileRemove(fileItem.id)}
                        className="flex-shrink-0 ml-2 p-1.5 text-gray-400 hover:text-error-400 hover:bg-error-900/30 rounded-lg transition-all duration-200"
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
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-xs text-gray-300 font-medium hidden sm:block">
                  Press <kbd className="px-2 py-1 bg-gray-700 rounded-lg border border-gray-600 font-semibold text-white">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-700 rounded-lg border border-gray-600 font-semibold text-white">Enter</kbd> to send
                </p>
              </div>

              <div className="flex space-x-3 w-full sm:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={handleFileUploadClick}
                  disabled={isProcessing}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 min-h-[44px] bg-gray-700 text-gray-200 rounded-2xl font-medium border border-gray-600 hover:bg-gray-600 hover:border-primary-500 hover:text-primary-300 hover:shadow-soft hover:scale-105 active:scale-95 transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1 sm:flex-none"
                  title="Attach files"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="hidden sm:inline">Attach</span>
                  {uploadedFiles.length > 0 && (
                    <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {uploadedFiles.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setInstruction('')}
                  disabled={!instruction || isProcessing}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!instruction.trim() || isProcessing}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">🚀</span>
                      <span>Send</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Expanded Mode: Full Chat Interface */}
        {isExpanded && (
          <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 350px)' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-custom" style={{ maxHeight: 'calc(100vh - 550px)', minHeight: '400px' }}>
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                return (
                  <div key={message.id} ref={isLastMessage ? lastMessageRef : null}>
                    {renderMessage(message)}
                  </div>
                );
              })}

              {/* AI Thinking Indicator */}
              {isProcessing && (
                <div className="flex justify-start mb-4" ref={!messages.length ? lastMessageRef : null}>
                  <div className="order-2 max-w-[80%]">
                    <div className="bg-gray-800 text-white rounded-2xl px-6 py-4 shadow-soft border border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-200">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                  <div className="order-1 mr-3 w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-soft">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Input Area in Expanded Mode */}
            <div className="border-t border-gray-700 p-4">
              {/* Top Action Bar */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openToolsModal}
                    className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-gray-700 text-primary-300 rounded-2xl font-medium hover:bg-gray-600 hover:shadow-soft hover:scale-105 transition-all duration-200 border border-gray-600 touch-manipulation"
                  >
                    <span className="text-lg">🛠️</span>
                    <span className="font-semibold hidden sm:inline">Tools</span>
                    {selectedTools.length > 0 && (
                      <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                        {selectedTools.length}
                      </span>
                    )}
                  </button>
                  {selectedToolsData.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedToolsData.slice(0, 2).map(tool => (
                        <span
                          key={tool.id}
                          className="text-xs bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-gray-600 hidden md:inline-block"
                          title={tool.name}
                        >
                          {tool.icon} {tool.name.split(' ')[0]}
                        </span>
                      ))}
                      {selectedToolsData.length > 2 && (
                        <span className="text-xs bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-gray-600 hidden md:inline-block">
                          +{selectedToolsData.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (confirm('Clear all messages and start a new conversation?')) {
                      window.location.reload();
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 min-h-[44px] bg-gray-700 text-gray-200 rounded-2xl font-medium hover:bg-error-900/50 hover:text-error-300 hover:border-error-700 hover:shadow-soft hover:scale-105 transition-all duration-200 border border-gray-600 touch-manipulation"
                  title="Clear chat and start over"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="font-semibold hidden sm:inline">Clear Chat</span>
                </button>
              </div>

              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Continue the conversation..."
                    className="w-full p-4 resize-none outline-none rounded-2xl min-h-[60px] max-h-[120px] text-base bg-gray-700 text-white border-2 border-gray-600 focus:border-primary-500 focus:bg-gray-650 placeholder:text-gray-400 scrollbar-custom transition-all duration-200"
                    maxLength={maxLength}
                    disabled={isProcessing}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleFileUploadClick}
                    disabled={isProcessing}
                    className="p-3 min-h-[44px] min-w-[44px] bg-gray-700 text-gray-200 rounded-xl font-medium border border-gray-600 hover:bg-gray-600 hover:border-primary-500 hover:text-primary-300 hover:shadow-soft hover:scale-105 active:scale-95 transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Attach files"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!instruction.trim() || isProcessing}
                    className="p-3 min-h-[44px] min-w-[44px] bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:shadow-soft hover:scale-105 active:scale-95 transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {uploadedFiles.map((fileItem) => (
                    <span
                      key={fileItem.id}
                      className="inline-flex items-center space-x-2 text-xs bg-gray-700 text-gray-200 px-3 py-1.5 rounded-full font-semibold border border-gray-600"
                    >
                      <span>📄 {fileItem.file.name}</span>
                      <button
                        onClick={() => onFileRemove(fileItem.id)}
                        className="hover:text-error-400 transition-colors"
                        aria-label={`Remove ${fileItem.file.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};