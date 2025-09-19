import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@hooks/useChat';
import { useTools } from '@hooks/useTools';
import { useToast } from '@hooks/useToast';
import type { FileItem } from '@domain/models';

interface QuickInstructionInputProps {
  uploadedFiles: FileItem[];
  maxLength?: number;
}

export const QuickInstructionInput: React.FC<QuickInstructionInputProps> = ({
  uploadedFiles,
  maxLength = 2000
}) => {
  const [instruction, setInstruction] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const remainingChars = maxLength - instruction.length;
  const isNearLimit = remainingChars < 100;
  const selectedToolsData = getSelectedToolsData();

  return (
    <div className="card">
      <div className="space-y-4">
        {/* Tools Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={openToolsModal}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
            >
              <span>🛠️</span>
              <span className="font-medium">Tools</span>
              {selectedTools.length > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {selectedTools.length}
                </span>
              )}
            </button>

            {selectedToolsData.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-600">Active:</span>
                <div className="flex space-x-1">
                  {selectedToolsData.slice(0, 3).map(tool => (
                    <span
                      key={tool.id}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      title={tool.name}
                    >
                      {tool.icon} {tool.name.split(' ')[0]}
                    </span>
                  ))}
                  {selectedToolsData.length > 3 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      +{selectedToolsData.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className={`text-sm ${isNearLimit ? 'text-amber-500' : 'text-gray-500'}`}>
            {remainingChars} chars
          </span>
        </div>

        {/* Input Area */}
        <div className={`relative rounded-lg border-2 transition-colors ${
          isFocused ? 'border-primary-500' : 'border-gray-300'
        }`}>
          <textarea
            ref={textareaRef}
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI assistant anything about data management..."
            className="w-full p-4 resize-none outline-none rounded-lg min-h-[80px] max-h-[200px]"
            maxLength={maxLength}
            disabled={isProcessing}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> to send
            </p>
            {uploadedFiles.length > 0 && (
              <span className="text-xs text-green-600">
                📎 {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setInstruction('')}
              disabled={!instruction || isProcessing}
              className="btn-secondary text-sm"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              disabled={!instruction.trim() || isProcessing}
              className="btn-primary text-sm"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};