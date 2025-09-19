import React, { useState, useRef, useEffect } from 'react';

interface InstructionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  maxLength?: number;
}

export const InstructionInput: React.FC<InstructionInputProps> = ({
  value,
  onChange,
  onSubmit,
  isProcessing,
  maxLength = 2000
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey && !isProcessing && value.trim()) {
      onSubmit();
    }
  };

  const handleClear = (): void => {
    if (window.confirm('Are you sure you want to clear the instructions?')) {
      onChange('');
    }
  };

  const remainingChars = maxLength - value.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
        <span className={`text-sm ${isNearLimit ? 'text-amber-500' : 'text-gray-500'}`}>
          {remainingChars} characters remaining
        </span>
      </div>

      <div className={`relative rounded-lg border-2 transition-colors ${
        isFocused ? 'border-primary-500' : 'border-gray-300'
      }`}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your instructions for the AI agent..."
          className="w-full p-4 resize-none outline-none rounded-lg min-h-[120px] max-h-[400px]"
          maxLength={maxLength}
          disabled={isProcessing}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> to submit
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleClear}
            disabled={!value || isProcessing}
            className="btn-secondary"
          >
            Clear
          </button>
          <button
            onClick={onSubmit}
            disabled={!value.trim() || isProcessing}
            className="btn-primary"
          >
            {isProcessing ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙</span>
                Processing...
              </>
            ) : (
              'Process Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};