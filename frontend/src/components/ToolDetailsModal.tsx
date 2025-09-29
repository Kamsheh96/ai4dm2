import React from 'react';
import type { DataTool } from '@domain/tools';
import { TOOL_CATEGORIES } from '@domain/tools';
import { TOOL_METRICS, TOOL_DETAILS, getDefaultMetrics, getDefaultDetails } from '@utils/toolMetrics';

interface ToolDetailsModalProps {
  tool: DataTool | null;
  isSelected: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const MetricBar: React.FC<{ value: number; max?: number; label: string }> = ({
  value,
  max = 5,
  label
}) => {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 font-semibold">{label}</span>
        <span className="text-sm text-gray-600 font-bold">{value}/{max}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300 shadow-soft"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 font-semibold">Cost</span>
        <span className="text-sm text-gray-600 font-bold">{level.label}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{level.description}</p>
    </div>
  );
};

export const ToolDetailsModal: React.FC<ToolDetailsModalProps> = ({ tool, isSelected, onToggle, onClose }) => {
  if (!tool) return null;

  const metrics = tool.metrics || TOOL_METRICS[tool.id] || getDefaultMetrics();
  const details = tool.details || TOOL_DETAILS[tool.id] || getDefaultDetails(tool.name, tool.description);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] overflow-hidden animate-fade-in">
      <div className="flex h-full items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-glow w-full max-w-6xl h-full sm:h-[96vh] flex flex-col border border-white/20 animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 flex-shrink-0 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft ${
                  isSelected
                    ? 'bg-gradient-to-br from-primary-600 to-secondary-600'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <span className="text-4xl">{tool.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{tool.name}</h2>
                  <p className="text-base text-gray-600 leading-relaxed">{details.fullDescription}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className={`text-sm px-4 py-2 rounded-full font-semibold shadow-soft ${
                      TOOL_CATEGORIES[tool.category]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {TOOL_CATEGORIES[tool.category]?.name}
                    </span>
                    <span className="text-sm text-gray-600 font-medium px-3 py-1.5 bg-white/80 rounded-full border border-gray-200">
                      {tool.complexity}
                    </span>
                    <span className="text-sm text-gray-600 font-medium px-3 py-1.5 bg-white/80 rounded-full border border-gray-200">
                      {tool.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 min-h-[44px] min-w-[44px] hover:bg-white/80 hover:shadow-soft rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation flex-shrink-0 ml-4"
                aria-label="Close details"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-br from-gray-50/50 via-white to-primary-50/20">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    <span>Performance Metrics</span>
                  </h3>
                  <div className="space-y-4">
                    <MetricBar value={metrics.speed} label="Speed" />
                    <MetricBar value={metrics.quality} label="Quality" />
                    <MetricBar value={metrics.reliability} label="Reliability" />
                    <MetricBar value={metrics.scalability} label="Scalability" />
                  </div>
                </div>

                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span>Pricing Information</span>
                  </h3>
                  <div className="space-y-4">
                    <CostIndicator cost={metrics.cost} />
                  </div>
                </div>
              </div>

              {/* Features and Use Cases */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    {details.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary-600 text-sm font-bold">✓</span>
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Use Cases</h3>
                  <ul className="space-y-3">
                    {details.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-sm font-bold">→</span>
                        </span>
                        <span className="text-sm text-gray-700 leading-relaxed">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Integrations */}
              <div className="card-glass p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Integrations & Compatibility</h3>
                <div className="flex flex-wrap gap-2">
                  {details.integrations.map((integration, i) => (
                    <span
                      key={i}
                      className="text-sm px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full font-semibold border border-gray-200 hover:scale-105 transition-transform duration-200"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alternatives */}
              {details.alternatives.length > 0 && (
                <div className="card-glass p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.alternatives.map((alt, i) => (
                      <span
                        key={i}
                        className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold border border-blue-200 hover:scale-105 transition-transform duration-200"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="p-6 border-t border-gray-200/50 bg-gradient-to-br from-white to-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onToggle}
                  className="w-6 h-6 text-primary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all duration-200"
                />
                <span className="text-sm font-semibold text-gray-900">
                  {isSelected ? 'Selected for use' : 'Select this tool'}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 min-h-[44px] bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold border border-gray-200 hover:bg-white hover:shadow-soft hover:scale-105 transition-all duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onToggle();
                    onClose();
                  }}
                  className={`px-6 py-3 min-h-[44px] rounded-2xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-soft ${
                    isSelected
                      ? 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:shadow-medium'
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-medium'
                  }`}
                >
                  {isSelected ? 'Remove & Close' : 'Add & Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};