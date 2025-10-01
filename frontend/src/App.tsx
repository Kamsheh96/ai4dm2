import React, { useState, useCallback } from 'react';
import { ToastProvider } from '@contexts/ToastContext';
import { ToolsProvider } from '@contexts/ToolsContext';
import { ChatProvider } from '@contexts/ChatContext';
import { DashboardProvider } from '@contexts/DashboardContext';
import { AuthProvider } from '@contexts/AuthContext';
import { ToastContainer } from '@ui/ToastContainer';
import { ChatWorkspace } from '@components/ChatWorkspace';
import { ToolsModal } from '@components/ToolsModal';
import { OutputDisplay } from '@components/OutputDisplay';
import { DashboardHome } from '@components/DashboardHome';
import { KnowledgeBaseManager } from '@components/KnowledgeBaseManager';
import { ProfileSettings } from '@components/ProfileSettings';
import { Login } from '@components/Login';
import { ComingSoon } from '@components/ComingSoon';
import type { FileItem, ProcessedFile } from '@domain/models';
import { useToast } from '@hooks/useToast';
import { useChat } from '@hooks/useChat';
import { useDashboard } from '@hooks/useDashboard';
import { useAuth } from '@hooks/useAuth';

type View = 'chat' | 'dashboard' | 'knowledge-base' | 'settings' | 'coming-soon';

const AppContent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [outputFiles] = useState<ProcessedFile[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { isAuthenticated, username, login, logout } = useAuth();
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

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Premium Header with Dark Theme and Navigation */}
      <header className="bg-gray-800 sticky top-0 z-40 border-b border-gray-700 shadow-2xl">
        <div className="safe-max-width safe-padding py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-gray-900 rounded-lg p-1"
            >
              <img
                src="/logo.png"
                alt="AI4DM Logo"
                className="h-24 w-auto object-cover"
              />
            </button>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2.5 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
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
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
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
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="hidden sm:inline">Knowledge Bases</span>
              </button>

              <button
                onClick={() => setCurrentView('coming-soon')}
                className={`px-4 py-2.5 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentView === 'coming-soon'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">Coming Soon</span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-700">
                <button
                  onClick={() => setCurrentView('settings')}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                <div className="flex items-center space-x-3 bg-gray-700 rounded-2xl px-3 py-2">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-semibold text-white">{username}</span>
                    <span className="text-xs text-gray-400">Data Manager</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-gray-700 text-gray-300 hover:bg-error-900/30 hover:text-error-400 transition-all duration-200"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Settings View (Full Screen Overlay) */}
      {currentView === 'settings' && <ProfileSettings onClose={() => setCurrentView('dashboard')} />}

      {/* Coming Soon View (Full Screen Overlay) */}
      {currentView === 'coming-soon' && <ComingSoon onClose={() => setCurrentView('dashboard')} />}

      {/* Main Content with Generous Spacing */}
      {currentView !== 'settings' && currentView !== 'coming-soon' && (
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
      )}

      {/* Modals and Overlays */}
      <ToolsModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <DashboardProvider>
          <ToolsProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </ToolsProvider>
        </DashboardProvider>
      </ToastProvider>
    </AuthProvider>
  );
};
