import React from 'react';
import type { DataTool } from '@domain/tools';
import { TOOL_CATEGORIES } from '@domain/tools';
import { TOOL_METRICS, getDefaultMetrics } from '@utils/toolMetrics';

interface ToolCardProps {
  tool: DataTool;
  isSelected: boolean;
  onToggle: () => void;
  onViewDetails: () => void;
}

const CostMiniDisplay: React.FC<{ cost: string }> = ({ cost }) => {
  const costLevels = {
    free: { label: 'Free', symbol: 'FREE' },
    low: { label: 'Low cost', symbol: '$' },
    medium: { label: 'Medium cost', symbol: '$$' },
    high: { label: 'High cost', symbol: '$$$' },
    enterprise: { label: 'Enterprise pricing', symbol: '$$$$' }
  };

  const level = costLevels[cost as keyof typeof costLevels] || costLevels.medium;

  return (
    <span className="text-xs text-gray-600 font-medium">
      {level.symbol}
    </span>
  );
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isSelected, onToggle, onViewDetails }) => {
  // Get metrics, using defaults if not defined
  const metrics = tool.metrics || TOOL_METRICS[tool.id] || getDefaultMetrics();

  return (
    <div
      className={`border-2 rounded-2xl transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-secondary-50/30 shadow-soft'
          : 'border-gray-200/50 bg-white/80 backdrop-blur-sm hover:border-primary-300 hover:shadow-soft hover:scale-[1.02]'
      }`}
    >
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft ${
              isSelected
                ? 'bg-gradient-to-br from-primary-600 to-secondary-600'
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
              <span className={`text-2xl ${isSelected ? 'filter brightness-110' : ''}`}>{tool.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base leading-snug">{tool.name}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 text-primary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all duration-200 hover:scale-110"
            />
          </div>
        </div>

        {/* Quick Metrics Preview and Action */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-soft ${
              TOOL_CATEGORIES[tool.category]?.color || 'bg-gray-100 text-gray-800'
            }`}>
              {TOOL_CATEGORIES[tool.category]?.name.split(' ')[0]}
            </span>
            <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-white/50 rounded-full">
              {tool.complexity}
            </span>
            <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-white/50 rounded-full">
              {tool.estimatedTime}
            </span>
            <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-white/50 rounded-full">
              <CostMiniDisplay cost={metrics.cost} />
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="w-full px-4 py-2.5 text-sm text-primary-600 hover:text-primary-700 font-semibold hover:bg-primary-50 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-transparent hover:border-primary-200"
          >
            <span>View Full Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};