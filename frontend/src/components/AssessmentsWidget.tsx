import React from 'react';
import { useDashboard } from '@hooks/useDashboard';
import type { Assessment } from '@domain/models';

export const AssessmentsWidget: React.FC = () => {
  const { assessments, updateAssessmentStatus, getUpcomingAssessments } = useDashboard();

  const upcomingAssessments = getUpcomingAssessments();

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const dueDate = new Date(date);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `Due in ${diffDays} days`;
    if (diffDays < 30) return `Due in ${Math.ceil(diffDays / 7)} weeks`;
    return dueDate.toLocaleDateString();
  };

  const getAssessmentIcon = (type: Assessment['type']): string => {
    switch (type) {
      case 'data_quality': return '📊';
      case 'compliance': return '✅';
      case 'governance': return '🏛️';
      case 'security': return '🔒';
      default: return '📋';
    }
  };

  const getStatusBadge = (status: Assessment['status']): { text: string; className: string } => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', className: 'badge-success' };
      case 'in_progress':
        return { text: 'In Progress', className: 'badge-info' };
      case 'overdue':
        return { text: 'Overdue', className: 'badge-error' };
      case 'not_started':
      default:
        return { text: 'Not Started', className: 'badge-warning' };
    }
  };

  const getPriorityColor = (priority: Assessment['priority']): string => {
    switch (priority) {
      case 'high': return 'border-l-4 border-error-500';
      case 'medium': return 'border-l-4 border-warning-500';
      case 'low': return 'border-l-4 border-gray-400';
      default: return '';
    }
  };

  const handleStatusChange = (assessmentId: string, newStatus: Assessment['status']): void => {
    updateAssessmentStatus(assessmentId, newStatus);
  };

  return (
    <div className="card-glass h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center shadow-soft">
            <span className="text-white text-xl">📅</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upcoming Assessments</h2>
            <span className="text-sm text-gray-600 font-medium">
              {upcomingAssessments.length} due soon
            </span>
          </div>
        </div>
      </div>

      {/* Assessments List */}
      <div className="space-y-3">
        {upcomingAssessments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <p className="text-gray-600 font-medium">All clear!</p>
            <p className="text-sm text-gray-500 mt-1">No upcoming assessments</p>
          </div>
        ) : (
          upcomingAssessments.map((assessment, index) => {
            const statusBadge = getStatusBadge(assessment.status);
            const isDueSoon = new Date(assessment.dueDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

            return (
              <div
                key={assessment.id}
                className={`group relative p-4 rounded-2xl bg-white border border-gray-200 hover:shadow-soft hover:scale-[1.01] transition-all duration-200 animate-scale-in ${getPriorityColor(assessment.priority)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent-100 to-secondary-100 flex items-center justify-center">
                    <span className="text-lg">{getAssessmentIcon(assessment.type)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                        {assessment.title}
                      </h4>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className={`font-semibold ${isDueSoon ? 'text-error-600' : 'text-gray-700'}`}>
                          {formatDueDate(assessment.dueDate)}
                        </span>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{assessment.assignedTo}</span>
                      </div>

                      <div className="flex items-center text-xs">
                        <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className={`font-semibold ${
                          assessment.priority === 'high' ? 'text-error-600' :
                          assessment.priority === 'medium' ? 'text-warning-600' :
                          'text-gray-600'
                        }`}>
                          {assessment.priority.charAt(0).toUpperCase() + assessment.priority.slice(1)} Priority
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {assessment.status === 'not_started' && (
                        <button
                          onClick={() => handleStatusChange(assessment.id, 'in_progress')}
                          className="text-xs px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold transition-colors duration-200"
                        >
                          Start
                        </button>
                      )}
                      {assessment.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(assessment.id, 'completed')}
                          className="text-xs px-3 py-1.5 bg-success-500 text-white rounded-lg hover:bg-success-600 font-semibold transition-colors duration-200"
                        >
                          Complete
                        </button>
                      )}
                      <button className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View All Link */}
      {assessments.length > upcomingAssessments.length && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full py-2.5 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-200">
            View All Assessments ({assessments.length})
          </button>
        </div>
      )}
    </div>
  );
};