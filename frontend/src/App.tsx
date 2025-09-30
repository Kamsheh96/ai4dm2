import React, { useState, useCallback } from 'react';
import { ToastProvider } from '@contexts/ToastContext';
import { ToolsProvider } from '@contexts/ToolsContext';
import { ChatProvider } from '@contexts/ChatContext';
import { DashboardProvider } from '@contexts/DashboardContext';
import { ToastContainer } from '@ui/ToastContainer';
import { ChatWorkspace } from '@components/ChatWorkspace';
import { ToolsModal } from '@components/ToolsModal';
import { OutputDisplay } from '@components/OutputDisplay';
import { DashboardHome } from '@components/DashboardHome';
import { KnowledgeBaseManager } from '@components/KnowledgeBaseManager';
import type { FileItem, ProcessedFile } from '@domain/models';
import { useToast } from '@hooks/useToast';
import { useChat } from '@hooks/useChat';
import { useDashboard } from '@hooks/useDashboard';

type View = 'dashboard' | 'chat' | 'knowledge-base';

const AppContent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [outputFiles] = useState<ProcessedFile[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { addToast } = useToast();
  const { messages } = useChat();
  const { unreadCount } = useDashboard();

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
      {/* Premium Header with Glass Effect and Navigation */}
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

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2.5 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft'
                    : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-soft'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
                {unreadCount > 0 && currentView !== 'dashboard' && (
                  <span className="bg-error-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2.5 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'chat'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft'
                    : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-soft'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="hidden sm:inline">Chat</span>
              </button>

              <button
                onClick={() => setCurrentView('knowledge-base')}
                className={`px-4 py-2.5 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'knowledge-base'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft'
                    : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-soft'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="hidden sm:inline">Knowledge Bases</span>
              </button>

              <span className="text-sm text-gray-500 font-medium hidden md:inline ml-4">v2.0.0</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content with Generous Spacing */}
      <div className="safe-max-width safe-padding py-12">
        {/* Dashboard View */}
        {currentView === 'dashboard' && <DashboardHome />}

        {/* Chat View */}
        {currentView === 'chat' && (
          <>
            <div className="mb-12 animate-fade-in">
              <ChatWorkspace
                uploadedFiles={uploadedFiles}
                onFilesAdded={handleFilesAdded}
                onFileRemove={handleFileRemove}
              />
            </div>

            {hasStartedChat && (
              <div className="mt-8 animate-slide-up">
                <OutputDisplay
                  files={outputFiles}
                  onDownload={handleDownload}
                  onDownloadAll={handleDownloadAll}
                />
              </div>
            )}
          </>
        )}

        {/* Knowledge Base View */}
        {currentView === 'knowledge-base' && <KnowledgeBaseManager />}
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
      <DashboardProvider>
        <ToolsProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </ToolsProvider>
      </DashboardProvider>
    </ToastProvider>
  );
};
