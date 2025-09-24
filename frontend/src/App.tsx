import React, { useState, useCallback } from 'react';
import { ToastProvider } from '@contexts/ToastContext';
import { ToolsProvider } from '@contexts/ToolsContext';
import { ChatProvider } from '@contexts/ChatContext';
import { ToastContainer } from '@ui/ToastContainer';
import { FileUpload } from '@components/FileUpload';
import { FileList } from '@components/FileList';
import { QuickInstructionInput } from '@components/QuickInstructionInput';
import { ChatInterface } from '@components/ChatInterface';
import { ToolsModal } from '@components/ToolsModal';
import { OutputDisplay } from '@components/OutputDisplay';
import { WORKSTREAMS } from '@domain/models';
import type { FileItem, ProcessedFile } from '@domain/models';
import { useToast } from '@hooks/useToast';
import { useChat } from '@hooks/useChat';

const AppContent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [outputFiles, setOutputFiles] = useState<ProcessedFile[]>([]);
  const { addToast } = useToast();
  const { messages } = useChat();

  const handleFilesAdded = useCallback((newFiles: FileItem[]): void => {
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleFileRemove = useCallback((fileId: string): void => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    addToast('File removed', 'info');
  }, [addToast]);

  const handleDownload = useCallback((file: ProcessedFile): void => {
    addToast(`Downloading ${file.name}...`, 'info');
  }, [addToast]);

  const handleDownloadAll = useCallback((): void => {
    addToast('Downloading all files...', 'info');
  }, [addToast]);

  const hasStartedChat = messages.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI4DM</h1>
              <p className="text-sm text-gray-600 mt-1">AI Agents for Data Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">v2.0.0</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instruction Input - Always at top */}
        <div className="mb-8">
          <QuickInstructionInput uploadedFiles={uploadedFiles} />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - File Management */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Files</h3>
              <FileUpload onFilesAdded={handleFilesAdded} />
            </div>

            <FileList
              files={uploadedFiles}
              onRemove={handleFileRemove}
              title="Uploaded Files"
            />
          </div>

          {/* Center Column - Chat Interface or Welcome */}
          <div className="lg:col-span-2 space-y-6">
            <ChatInterface uploadedFiles={uploadedFiles.map(f => f.file.name)} />

            {/* Output Files - Show when conversation started */}
            {hasStartedChat && (
              <OutputDisplay
                files={outputFiles}
                onDownload={handleDownload}
                onDownloadAll={handleDownloadAll}
              />
            )}
          </div>
        </div>

        {/* Workstream Cards - Moved to bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">AI4DM Workstreams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WORKSTREAMS.map(workstream => (
              <div key={workstream.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{workstream.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    workstream.status === 'active' ? 'bg-green-100 text-green-700' :
                    workstream.status === 'planned' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {workstream.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{workstream.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      <ToolsModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <ToolsProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </ToolsProvider>
    </ToastProvider>
  );
};
