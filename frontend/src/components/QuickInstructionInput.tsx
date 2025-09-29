import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useTools } from '@hooks/useTools';
import { useToast } from '@hooks/useToast';
import type { FileItem } from '@domain/models';

interface QuickInstructionInputProps {
  uploadedFiles: FileItem[];
  onFilesAdded?: (files: FileItem[]) => void;
  maxLength?: number;
}

export const QuickInstructionInput: React.FC<QuickInstructionInputProps> = ({
  uploadedFiles,
  onFilesAdded,
  maxLength = 2000
}) => {
  const [instruction, setInstruction] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addMessage, isProcessing, setProcessing } = useChat();
  const { selectedTools, getSelectedToolsData, openToolsModal } = useTools();
  const { addToast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      // Prevent layout shift by using requestAnimationFrame
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          // Restore scroll position to prevent jumping
          window.scrollTo(0, scrollTop);
        }
      });
    }
  }, [instruction]);

  const handleSubmit = async (): Promise<void> => {
    if (!instruction.trim() || isProcessing) return;

    const selectedToolsData = getSelectedToolsData();
    const fileNames = uploadedFiles.map(f => f.file.name);

    // Add user message
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
      response += `📊 Analysis complete! Based on your instruction "${instruction.slice(0, 50)}${instruction.length > 50 ? '...' : ''}", I've executed the following:\n\n`;

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

      response += `✅ The analysis has been completed successfully. You can now upload additional files or ask follow-up questions to continue the conversation.`;

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
    if (!files || files.length === 0 || !onFilesAdded) return;

    const newFiles: FileItem[] = Array.from(files).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file,
      uploadedAt: new Date(),
      status: 'uploaded'
    }));

    onFilesAdded(newFiles);
    addToast(`${newFiles.length} file(s) added`, 'success');

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const remainingChars = maxLength - instruction.length;
  const isNearLimit = remainingChars < 100;
  const selectedToolsData = getSelectedToolsData();

  return (
    <div className="card-gradient">
      <div className="space-y-6">
        {/* Tools Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={openToolsModal}
              className="flex items-center space-x-2 px-4 py-2.5 min-h-[44px] bg-white/80 backdrop-blur-sm text-primary-700 rounded-2xl font-medium hover:bg-white hover:shadow-soft hover:scale-105 transition-all duration-200 border border-primary-200/50 touch-manipulation"
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
                <span className="text-sm text-gray-700 font-medium hidden sm:inline">Active:</span>
                {selectedToolsData.slice(0, 3).map(tool => (
                  <span
                    key={tool.id}
                    className="text-xs bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full font-semibold border border-gray-200/50 hover:scale-105 transition-transform duration-200"
                    title={tool.name}
                  >
                    {tool.icon} {tool.name.split(' ')[0]}
                  </span>
                ))}
                {selectedToolsData.length > 3 && (
                  <span className="text-xs bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full font-semibold border border-gray-200/50">
                    +{selectedToolsData.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <span className={`text-sm font-semibold ${isNearLimit ? 'text-warning-600' : 'text-gray-600'}`}>
            {remainingChars} chars remaining
          </span>
        </div>

        {/* Input Area with Glassmorphism */}
        <div className={`relative rounded-3xl border-2 transition-all duration-200 ${
          isFocused
            ? 'border-primary-500 bg-white shadow-medium scale-[1.01]'
            : 'border-white/50 bg-white/80 backdrop-blur-sm hover:bg-white/90'
        }`}>
          <textarea
            ref={textareaRef}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI assistant anything about data management..."
            className="w-full p-6 resize-none outline-none rounded-3xl min-h-[100px] max-h-[240px] text-base bg-transparent placeholder:text-gray-400 scrollbar-custom"
            maxLength={maxLength}
            disabled={isProcessing}
          />
        </div>

        {/* Controls - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-xs text-gray-600 font-medium hidden sm:block">
              Press <kbd className="px-2 py-1 bg-white/80 rounded-lg border border-gray-200 font-semibold">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white/80 rounded-lg border border-gray-200 font-semibold">Enter</kbd> to send
            </p>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            {/* File Upload Button */}
            {onFilesAdded && (
              <button
                onClick={handleFileUploadClick}
                disabled={isProcessing}
                className="inline-flex items-center space-x-2 px-4 py-2.5 min-h-[44px] bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-medium border border-gray-200 hover:bg-white hover:border-primary-300 hover:text-primary-700 hover:shadow-soft hover:scale-105 active:scale-95 transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1 sm:flex-none"
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
            )}

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
      </div>
    </div>
  );
};