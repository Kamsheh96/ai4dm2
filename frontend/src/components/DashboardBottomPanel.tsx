import React, { useState } from 'react';
import { useDashboard } from '@hooks/useDashboard';
import { NotificationsCenter } from './NotificationsCenter';
import { AIAssessmentChat } from './AIAssessmentChat';

export const DashboardBottomPanel: React.FC = () => {
  const { notifications, unreadCount } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  // Get preview notifications (first 3)
  const previewNotifications = notifications.slice(0, 3);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'email': return '📧';
      case 'assessment': return '📊';
      case 'update': return '✅';
      default: return '🔔';
    }
  };

  // Active workstreams data
  const activeWorkstreams = [
    {
      id: 'dq-pmo',
      title: 'DQ Assessment - PMO',
      description: 'Quarterly data quality review for Project Management Office',
      progress: 65,
      dueDate: 'Oct 15',
      tasksLeft: 12,
      status: 'Active',
      statusColor: 'bg-white/20 text-white',
      progressColor: 'bg-white/80'
    },
    {
      id: 'dq-training',
      title: 'DQ Training - Finance',
      description: 'Training materials and session planning for finance team',
      progress: 40,
      dueDate: 'Oct 22',
      tasksLeft: 8,
      status: 'In Progress',
      statusColor: 'bg-error-500 text-white',
      progressColor: 'bg-error-500'
    },
    {
      id: 'strategy',
      title: 'Strategy Refinement',
      description: 'Q1 2026 data quality strategy development',
      progress: 15,
      dueDate: 'Nov 6',
      tasksLeft: 20,
      status: 'Planning',
      statusColor: 'bg-secondary-500 text-white',
      progressColor: 'bg-secondary-500'
    }
  ];

  // Quick actions data
  const quickActions = [
    { icon: '📄', label: 'New Assessment', action: 'new-assessment' },
    { icon: '📤', label: 'Agent Send', action: 'agent-send' },
    { icon: '🔗', label: 'Connect KB', action: 'connect-kb' },
    { icon: '🛠️', label: 'Manage Tools', action: 'manage-tools' }
  ];

  return (
    <div className="mt-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-white/10 shadow-2xl p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Notifications & Updates */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-lg">🔔</span>
              </div>
              <h3 className="text-lg font-bold text-white">Notifications & Updates</h3>
            </div>
            {unreadCount > 0 && (
              <span className="bg-error-500 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* Notification Preview Cards */}
          <div className="space-y-2">
            {previewNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3 transition-all duration-200 cursor-pointer border border-white/5"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{notification.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{formatTimestamp(notification.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <button
            onClick={() => setShowNotifications(true)}
            className="w-full py-2 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors duration-200"
          >
            View All Notifications
          </button>
        </div>

        {/* Middle Column: Active Workstreams */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <h3 className="text-lg font-bold text-white">Active Workstreams</h3>
          </div>

          {/* Workstream Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeWorkstreams.map((workstream) => (
              <div
                key={workstream.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${workstream.statusColor}`}>
                    • {workstream.status}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="text-white font-bold text-sm mb-2">{workstream.title}</h4>
                <p className="text-gray-400 text-xs mb-4 line-clamp-2">{workstream.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-white">{workstream.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${workstream.progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${workstream.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Due: {workstream.dueDate}</span>
                  <span>{workstream.tasksLeft} tasks left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Context & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">

        {/* AI Agent Context */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <h3 className="text-lg font-bold text-white">AI Agent Context</h3>
          </div>

          {/* Context Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Workstream:</span>
              <span className="text-sm font-semibold text-white">DQ Assessment - PMO</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Current Task:</span>
              <span className="text-sm font-semibold text-white">Section 3 Draft</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Last Interaction:</span>
              <span className="text-sm font-semibold text-white">15 min ago</span>
            </div>

            {/* Continue Working Button */}
            <button
              onClick={() => setShowAIChat(true)}
              className="w-full mt-4 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            >
              Continue Working
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning-500 to-accent-500 flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.action}
                className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] group"
              >
                <div className="text-center">
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">
                    {action.icon}
                  </span>
                  <span className="text-sm font-semibold text-white">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNotifications && <NotificationsCenter onClose={() => setShowNotifications(false)} />}
      {showAIChat && <AIAssessmentChat onClose={() => setShowAIChat(false)} />}
    </div>
  );
};
