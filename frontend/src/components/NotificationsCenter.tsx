import React, { useState } from 'react';
import { useDashboard } from '@hooks/useDashboard';

type NotificationFilter = 'all' | 'emails' | 'assessments' | 'system';

interface NotificationsCenterProps {
  onClose: () => void;
}

export const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ onClose }) => {
  const { notifications, markAsRead } = useDashboard();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'emails') return notification.type === 'email';
    if (activeFilter === 'assessments') return notification.type === 'assessment';
    if (activeFilter === 'system') return notification.type === 'update';
    return true;
  });

  // Detailed notification cards with specific content
  const detailedNotifications = [
    {
      id: '1',
      type: 'email',
      icon: '📧',
      iconBg: 'bg-blue-500',
      title: 'PMO Review Request',
      description: 'John Smith requested review of Q4 data quality assessment report. Please provide feedback by Oct 2.',
      timestamp: '2h ago',
      actions: [
        { label: 'Open Email', style: 'primary' },
        { label: 'Dismiss', style: 'secondary' }
      ],
      highlighted: true,
      highlightColor: 'border-l-blue-500'
    },
    {
      id: '2',
      type: 'assessment',
      icon: '📊',
      iconBg: 'bg-error-500',
      title: 'Assessment Due Tomorrow',
      description: 'Finance DQ Assessment deadline: Oct 1, 2025. Current completion: 85%',
      timestamp: '5h ago',
      actions: [
        { label: 'Continue Assessment', style: 'error' },
        { label: 'Snooze', style: 'secondary' }
      ],
      highlighted: true,
      highlightColor: 'border-l-error-500'
    },
    {
      id: '3',
      type: 'system',
      icon: '✅',
      iconBg: 'bg-success-500',
      title: 'Training Session Completed',
      description: 'Data Quality Fundamentals - 24 attendees. Feedback survey responses: 22/24 submitted.',
      timestamp: '1d ago',
      actions: [
        { label: 'View Results', style: 'secondary' }
      ],
      highlighted: false
    },
    {
      id: '4',
      type: 'system',
      icon: '📄',
      iconBg: 'bg-gray-500',
      title: 'Draft Auto-Saved',
      description: 'Your work on \'DQ Strategy Section 3\' has been automatically saved.',
      timestamp: '1d ago',
      actions: [],
      highlighted: false
    },
    {
      id: '5',
      type: 'system',
      icon: '🔗',
      iconBg: 'bg-gray-500',
      title: 'SharePoint Connection Verified',
      description: 'Successfully connected to PMO SharePoint folder. 156 documents indexed.',
      timestamp: '2d ago',
      actions: [],
      highlighted: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-gray-800 rounded-lg p-1"
              >
                <img
                  src="/logo.png"
                  alt="AI4DM Logo"
                  className="h-12 w-auto object-cover"
                />
              </button>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Notifications Center</p>
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

          {/* Title and Mark All Read */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">All Notifications</h2>
              <p className="text-gray-400 text-base">{unreadCount} unread messages</p>
            </div>
            <button
              onClick={() => {
                notifications.forEach(n => markAsRead(n.id));
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200 underline text-sm"
            >
              Mark all read
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`pb-2 text-base font-medium transition-colors duration-200 ${
                activeFilter === 'all'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('emails')}
              className={`pb-2 text-base font-medium transition-colors duration-200 ${
                activeFilter === 'emails'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Emails
            </button>
            <button
              onClick={() => setActiveFilter('assessments')}
              className={`pb-2 text-base font-medium transition-colors duration-200 ${
                activeFilter === 'assessments'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Assessments
            </button>
            <button
              onClick={() => setActiveFilter('system')}
              className={`pb-2 text-base font-medium transition-colors duration-200 ${
                activeFilter === 'system'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              System
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto p-8 space-y-4" style={{ maxHeight: 'calc(90vh - 250px)' }}>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                <span className="text-3xl">✨</span>
              </div>
              <p className="text-gray-400 font-medium">No notifications in this category</p>
            </div>
          ) : (
            detailedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-800 rounded-xl p-6 border-l-4 ${
                  notification.highlighted ? notification.highlightColor : 'border-l-transparent'
                } border-r border-t border-b border-gray-700 hover:bg-gray-750 transition-all duration-200`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-xl">{notification.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{notification.title}</h3>
                      <span className="text-sm text-gray-400 ml-4">{notification.timestamp}</span>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-4">{notification.description}</p>

                    {/* Action Buttons */}
                    {notification.actions.length > 0 && (
                      <div className="flex items-center space-x-3">
                        {notification.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              action.style === 'primary'
                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                : action.style === 'error'
                                ? 'bg-error-500 text-white hover:bg-error-600'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
