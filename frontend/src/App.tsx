import React, { useState, useCallback } from 'react';
import { ToastProvider } from '@contexts/ToastContext';
import { ToolsProvider } from '@contexts/ToolsContext';
import { ChatProvider } from '@contexts/ChatContext';
import { ToastContainer } from '@ui/ToastContainer';
import { ChatWorkspace } from '@components/ChatWorkspace';
import { ToolsModal } from '@components/ToolsModal';
import { OutputDisplay } from '@components/OutputDisplay';
import { WORKSTREAMS } from '@domain/models';
import type { FileItem, ProcessedFile } from '@domain/models';
import { useToast } from '@hooks/useToast';
import { useChat } from '@hooks/useChat';

const AppContent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [outputFiles] = useState<ProcessedFile[]>([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      {/* Premium Header with Glass Effect */}
      <header className="glass sticky top-0 z-40 border-b border-white/20 shadow-soft">
        <div className="safe-max-width safe-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center shadow-medium">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">AI4DM</h1>
                <p className="text-sm text-gray-600 mt-0.5 font-medium">AI Agents for Data Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500 font-medium">v2.0.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Generous Spacing */}
      <div className="safe-max-width safe-padding py-12">
        {/* Unified Chat Workspace - Expands after first message */}
        <div className="mb-12 animate-fade-in">
          <ChatWorkspace
            uploadedFiles={uploadedFiles}
            onFilesAdded={handleFilesAdded}
            onFileRemove={handleFileRemove}
          />
        </div>

        {/* Output Files - Show when conversation started */}
        {hasStartedChat && (
          <div className="mt-8 animate-slide-up">
            <OutputDisplay
              files={outputFiles}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
            />
          </div>
        )}

        {/* Workstream Cards - Premium Section */}
        <div className="section-divider"></div>

        <div className="mt-16 animate-fade-in animate-delay-200">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">AI4DM Workstreams</h2>
            <p className="text-gray-600 text-lg leading-relaxed">Specialized AI agents tailored for data management excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKSTREAMS.map((workstream, index) => (
              <div
                key={workstream.id}
                className="card-interactive group animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-gradient-primary transition-all duration-200">
                    {workstream.name}
                  </h3>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                    workstream.status === 'active'
                      ? 'badge-success'
                      : workstream.status === 'planned'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}>
                    {workstream.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{workstream.description}</p>
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
