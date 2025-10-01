import React, { useState } from 'react';
import { useDashboard } from '@hooks/useDashboard';
import type { Notification } from '@domain/models';

export const NotificationWidget: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotification,
    clearAllNotifications
  } = useDashboard();

  const [showAll, setShowAll] = useState(false);

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

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

  const getNotificationIcon = (type: Notification['type']): string => {
    switch (type) {
      case 'email': return '📧';
      case 'assessment': return '📊';
      case 'update': return '🔔';
      case 'alert': return '⚠️';
      default: return '📬';
    }
  };

  const getPriorityColor = (priority?: Notification['priority']): string => {
    switch (priority) {
      case 'high': return 'text-error-600';
      case 'medium': return 'text-warning-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleNotificationClick = (notification: Notification): void => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-soft">
            <span className="text-white text-xl">🔔</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-sm text-primary-400 font-semibold">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-gray-400 hover:text-error-400 font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-error-900/30"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-700 flex items-center justify-center">
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-gray-300 font-medium">All caught up!</p>
            <p className="text-sm text-gray-400 mt-1">No new notifications</p>
          </div>
        ) : (
          <>
            {displayedNotifications.map((notification, index) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer animate-scale-in ${
                  notification.read
                    ? 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-700'
                    : 'bg-gray-700 border-primary-500/30 hover:shadow-soft hover:scale-[1.01]'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Priority Indicator */}
                {!notification.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-r-full"></div>
                )}

                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h4>
                      {notification.priority && (
                        <span className={`text-xs font-bold ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className={`text-sm mb-2 ${notification.read ? 'text-gray-400' : 'text-gray-300'}`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        {notification.sender && (
                          <span className="font-medium">{notification.sender}</span>
                        )}
                        {notification.source && !notification.sender && (
                          <span className="font-medium">{notification.source}</span>
                        )}
                        <span>•</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-error-400 transition-all duration-200 p-1 rounded-lg hover:bg-error-900/30"
                        aria-label="Clear notification"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show More/Less Toggle */}
            {notifications.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-3 text-sm font-semibold text-primary-400 hover:text-primary-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                {showAll ? 'Show Less' : `Show ${notifications.length - 5} More`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};