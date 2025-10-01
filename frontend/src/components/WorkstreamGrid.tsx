import React from 'react';
import { useDashboard } from '@hooks/useDashboard';
import { useChat } from '@hooks/useChat';
import { WORKSTREAMS } from '@domain/models';
import type { WorkstreamInfo } from '@domain/models';
import { useToast } from '@hooks/useToast';

export const WorkstreamGrid: React.FC = () => {
  const { selectedWorkstream, setSelectedWorkstream } = useDashboard();
  const { setCurrentWorkstream } = useChat();
  const { addToast } = useToast();

  const handleWorkstreamSelect = (workstream: WorkstreamInfo): void => {
    setSelectedWorkstream(workstream.id);
    setCurrentWorkstream(workstream.id);
    addToast(`Switched to ${workstream.name}`, 'success');
  };

  const formatDeadline = (deadline?: Date): string | null => {
    if (!deadline) return null;
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    return dueDate.toLocaleDateString();
  };

  return (
    <div className="animate-fade-in animate-delay-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">My Workstreams</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Select a workstream to continue working with context-aware AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKSTREAMS.map((workstream, index) => {
          const isSelected = selectedWorkstream === workstream.id;
          const deadline = formatDeadline(workstream.deadline);

          return (
            <button
              key={workstream.id}
              onClick={() => handleWorkstreamSelect(workstream)}
              className={`group text-left bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 relative overflow-hidden animate-scale-in ${
                isSelected ? 'ring-4 ring-primary-500 ring-opacity-50' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-medium">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary-400 transition-all duration-200 pr-10">
                    {workstream.name}
                  </h3>
                  <span className={`inline-flex text-xs px-3 py-1.5 rounded-full font-semibold ${
                    workstream.status === 'active'
                      ? 'badge-success'
                      : workstream.status === 'planned'
                      ? 'badge-warning'
                      : 'badge-info'
                  }`}>
                    {workstream.status.charAt(0).toUpperCase() + workstream.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {workstream.description}
              </p>

              {/* Progress Bar */}
              {typeof workstream.progress === 'number' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-primary-400">{workstream.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${workstream.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2 text-xs text-gray-300">
                {workstream.owner && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{workstream.owner}</span>
                  </div>
                )}

                {deadline && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`font-semibold ${
                      deadline.includes('Overdue') || deadline.includes('today') || deadline.includes('tomorrow')
                        ? 'text-error-400'
                        : 'text-gray-300'
                    }`}>
                      {deadline}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover Effect Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/10 group-hover:to-secondary-500/10 transition-all duration-300 pointer-events-none rounded-3xl"></div>
            </button>
          );
        })}
      </div>

      {/* Active Workstream Indicator */}
      {selectedWorkstream && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary-900/30 to-secondary-900/30 border border-primary-600 animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-soft">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Active Context: {WORKSTREAMS.find(w => w.id === selectedWorkstream)?.name}
              </p>
              <p className="text-xs text-gray-300">
                AI agent will use this workstream context for all interactions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};