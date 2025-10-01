import React, { useState } from 'react';
import { NotificationsCenter } from './NotificationsCenter';
import { AIAssessmentChat } from './AIAssessmentChat';

export const DashboardBottomPanel: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

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
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Active Workstreams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary-500 to-accent-500 flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <h3 className="text-lg font-bold text-white">Active Workstreams</h3>
            </div>
            <button
              onClick={() => setShowNotifications(true)}
              className="text-sm text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200"
            >
              View All →
            </button>
          </div>

          {/* Workstreams List */}
          <div className="space-y-3">
            {activeWorkstreams.map((workstream) => (
              <div
                key={workstream.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-1">{workstream.title}</h4>
                    <p className="text-xs text-gray-400">{workstream.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${workstream.statusColor}`}>
                    {workstream.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-white">{workstream.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
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
