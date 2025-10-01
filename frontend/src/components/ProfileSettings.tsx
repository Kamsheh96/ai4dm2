import React, { useState } from 'react';

type SettingsSection = 'profile' | 'tools' | 'knowledge' | 'integrations' | 'notifications' | 'preferences';

interface ProfileSettingsProps {
  onClose?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');

  const sidebarItems: { id: SettingsSection; icon: string; label: string }[] = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'tools', icon: '🔧', label: 'Tools Collection' },
    { id: 'knowledge', icon: '📚', label: 'Knowledge Bases' },
    { id: 'integrations', icon: '🔗', label: 'Integrations' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'preferences', icon: '⚙️', label: 'Preferences' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 overflow-hidden">
      {/* Header Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-gray-900 rounded-lg p-1"
          >
            <img
              src="/logo.png"
              alt="AI4DM Logo"
              className="h-12 w-auto object-cover"
            />
          </button>
          <h1 className="text-xl font-bold text-white">Settings & Tools Management</h1>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar */}
        <div className="w-56 bg-gray-800 border-r border-gray-700 p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeSection === 'profile' && (
            <div className="max-w-5xl">
              {/* Profile Header */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">Profile Settings</h2>
                <p className="text-gray-400 text-lg">Manage your account and preferences</p>
              </div>

              {/* User Profile Card */}
              <div className="bg-gray-800 rounded-2xl p-8 mb-6 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">DM</span>
                    </div>

                    {/* User Info */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">Sarah Chen</h3>
                      <p className="text-gray-400 text-lg mb-1">Data Quality Manager</p>
                      <p className="text-gray-500 text-sm">sarah.chen@company.com</p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button className="px-6 py-2.5 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Statistics Cards Grid */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Active Workstreams */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Active Workstreams</p>
                  <p className="text-5xl font-bold text-white mb-2">3</p>
                  <p className="text-gray-500 text-sm">2 in progress, 1 planning</p>
                </div>

                {/* Tools Installed */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Tools Installed</p>
                  <p className="text-5xl font-bold text-white mb-2">8</p>
                  <p className="text-gray-500 text-sm">12 available to add</p>
                </div>

                {/* Connected Sources */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Connected Sources</p>
                  <p className="text-5xl font-bold text-error-500 mb-2">4</p>
                  <p className="text-gray-500 text-sm">SharePoint, Email, Drive</p>
                </div>

                {/* Agent Interactions */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Agent Interactions</p>
                  <p className="text-5xl font-bold text-secondary-500 mb-2">247</p>
                  <p className="text-gray-500 text-sm">This month</p>
                </div>
              </div>

              {/* Account Details Section */}
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">Account Details</h3>

                <div className="space-y-5">
                  {/* Department */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-gray-400 text-base">Department</span>
                    <span className="text-white text-base font-medium">Data Management Office</span>
                  </div>

                  {/* Role */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-gray-400 text-base">Role</span>
                    <span className="text-white text-base font-medium">Data Quality Manager</span>
                  </div>

                  {/* Access Level */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-gray-400 text-base">Access Level</span>
                    <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full font-medium">
                      Manager
                    </span>
                  </div>

                  {/* Account Status */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-700">
                    <span className="text-gray-400 text-base">Account Status</span>
                    <span className="px-3 py-1 bg-success-500 text-white text-sm rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center justify-between py-4">
                    <span className="text-gray-400 text-base">Member Since</span>
                    <span className="text-white text-base font-medium">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder content for other sections */}
          {activeSection === 'tools' && (
            <div className="max-w-5xl">
              <h2 className="text-4xl font-bold text-white mb-2">Tools Collection</h2>
              <p className="text-gray-400 text-lg mb-8">Manage your AI tools and integrations</p>
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
                <span className="text-6xl mb-4 block">🔧</span>
                <p className="text-gray-400">Tools management interface coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'knowledge' && (
            <div className="max-w-5xl">
              <h2 className="text-4xl font-bold text-white mb-2">Knowledge Bases</h2>
              <p className="text-gray-400 text-lg mb-8">Connect and manage your knowledge sources</p>
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
                <span className="text-6xl mb-4 block">📚</span>
                <p className="text-gray-400">Knowledge base management interface coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="max-w-5xl">
              <h2 className="text-4xl font-bold text-white mb-2">Integrations</h2>
              <p className="text-gray-400 text-lg mb-8">Connect external services and applications</p>
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
                <span className="text-6xl mb-4 block">🔗</span>
                <p className="text-gray-400">Integrations interface coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="max-w-5xl">
              <h2 className="text-4xl font-bold text-white mb-2">Notification Settings</h2>
              <p className="text-gray-400 text-lg mb-8">Manage your notification preferences</p>
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
                <span className="text-6xl mb-4 block">🔔</span>
                <p className="text-gray-400">Notification settings interface coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="max-w-5xl">
              <h2 className="text-4xl font-bold text-white mb-2">Preferences</h2>
              <p className="text-gray-400 text-lg mb-8">Customize your application experience</p>
              <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
                <span className="text-6xl mb-4 block">⚙️</span>
                <p className="text-gray-400">Preferences interface coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
