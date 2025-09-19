import React, { useState } from 'react';
import type { DataTool, ToolMetrics } from '@domain/tools';
import { TOOL_CATEGORIES } from '@domain/tools';
import { TOOL_METRICS, TOOL_DETAILS, getDefaultMetrics, getDefaultDetails } from '@utils/toolMetrics';

interface ToolCardProps {
  tool: DataTool;
  isSelected: boolean;
  onToggle: () => void;
}

const MetricBar: React.FC<{ value: number; max?: number; label: string }> = ({
  value,
  max = 5,
  label
}) => {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-600 w-16">{label}</span>
      <div className="flex items-center space-x-2 flex-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 w-8">{value}/{max}</span>
      </div>
    </div>
  );
};

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

const CostIndicator: React.FC<{ cost: string }> = ({ cost }) => {
  const costLevels = {
    free: { label: 'Free', description: 'No cost - completely free to use', value: 0 },
    low: { label: 'Low', description: 'Affordable pricing - typically under $50/month', value: 1 },
    medium: { label: 'Medium', description: 'Standard pricing - typically $50-200/month', value: 2 },
    high: { label: 'High', description: 'Premium pricing - typically $200-500/month', value: 3 },
    enterprise: { label: 'Enterprise', description: 'Custom enterprise pricing - contact for quote', value: 4 }
  };

  const level = costLevels[cost as keyof typeof costLevels] || costLevels.medium;
  const percentage = (level.value / 4) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 w-16">Cost</span>
        <div className="flex items-center space-x-2 flex-1">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 w-16">{level.label}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 pl-16">{level.description}</p>
    </div>
  );
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isSelected, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get metrics and details, using defaults if not defined
  const metrics = tool.metrics || TOOL_METRICS[tool.id] || getDefaultMetrics();
  const details = tool.details || TOOL_DETAILS[tool.id] || getDefaultDetails(tool.name, tool.description);

  return (
    <div
      className={`border rounded-lg transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300'
      } ${isExpanded ? 'col-span-full' : ''}`}
    >
      {/* Main Card Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start space-x-2 flex-1">
            <span className="text-xl mt-0.5">{tool.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">{tool.name}</h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {isExpanded ? details.fullDescription : tool.description}
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 flex-shrink-0 mt-0.5"
          />
        </div>

        {/* Quick Metrics Preview */}
        {!isExpanded && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                TOOL_CATEGORIES[tool.category]?.color || 'bg-gray-100 text-gray-800'
              }`}>
                {TOOL_CATEGORIES[tool.category]?.name.split(' ')[0]}
              </span>
              <span className="text-xs text-gray-600">
                {tool.complexity} • {tool.estimatedTime} • <CostMiniDisplay cost={metrics.cost} />
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Learn More →
            </button>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  <MetricBar value={metrics.speed} label="Speed" />
                  <MetricBar value={metrics.quality} label="Quality" />
                  <MetricBar value={metrics.reliability} label="Reliability" />
                  <MetricBar value={metrics.scalability} label="Scalability" />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Information</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-600">Complexity:</span>
                    <span className={`ml-2 px-2 py-0.5 rounded ${
                      tool.complexity === 'basic' ? 'bg-green-100 text-green-700' :
                      tool.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tool.complexity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 text-gray-900">{tool.estimatedTime}</span>
                  </div>
                  <CostIndicator cost={metrics.cost} />
                </div>
              </div>
            </div>

            {/* Features and Use Cases */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Key Features</h4>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {details.keyFeatures.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary-500 mr-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Use Cases</h4>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {details.useCases.slice(0, 3).map((useCase, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-1">✓</span>
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Integrations</h4>
              <div className="flex flex-wrap gap-1">
                {details.integrations.slice(0, 6).map((integration, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded"
                  >
                    {integration}
                  </span>
                ))}
                {details.integrations.length > 6 && (
                  <span className="text-xs px-2 py-0.5 text-gray-500">
                    +{details.integrations.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Alternatives */}
            {details.alternatives.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Similar Tools</h4>
                <div className="flex flex-wrap gap-1">
                  {details.alternatives.map((alt, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                  isSelected
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {isSelected ? 'Remove from Collection' : 'Add to Collection'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Collapse ↑
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};