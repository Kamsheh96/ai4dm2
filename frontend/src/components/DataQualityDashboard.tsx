import React, { useState } from 'react';
import type { DataQualityResult, QualityDimension } from '@utils/dataQualityAnalysis';

interface DataQualityDashboardProps {
  result: DataQualityResult;
}

export const DataQualityDashboard: React.FC<DataQualityDashboardProps> = ({ result }) => {
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 75) return 'from-blue-500 to-cyan-600';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fair': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'poor': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderDimensionCard = (key: string, dimension: QualityDimension) => {
    const isExpanded = expandedDimension === key;

    return (
      <div
        key={key}
        className="bg-gray-700 rounded-2xl p-5 border border-gray-600 hover:border-primary-500 transition-all duration-200 hover:shadow-soft cursor-pointer"
        onClick={() => setExpandedDimension(isExpanded ? null : key)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreColor(dimension.score)} flex items-center justify-center shadow-soft`}>
              <span className="text-white text-xl font-bold">{dimension.score}</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">{dimension.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(dimension.status)} font-semibold`}>
                {dimension.status.toUpperCase()}
              </span>
            </div>
          </div>
          <svg
            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getScoreColor(dimension.score)} transition-all duration-500 rounded-full`}
            style={{ width: `${dimension.score}%` }}
          />
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-600 animate-fade-in">
            {dimension.issues.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-bold text-error-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Issues Found ({dimension.issues.length})
                </h5>
                <ul className="space-y-1">
                  {dimension.issues.map((issue, idx) => (
                    <li key={idx} className="text-xs text-gray-300 pl-5 relative">
                      <span className="absolute left-0">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dimension.recommendations.length > 0 && (
              <div>
                <h5 className="text-sm font-bold text-primary-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Recommendations
                </h5>
                <ul className="space-y-1">
                  {dimension.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-gray-300 pl-5 relative">
                      <span className="absolute left-0">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl my-4 animate-scale-in">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Data Quality Assessment</h3>
            <p className="text-sm text-white/80">{result.fileName}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-primary-900/30 to-secondary-900/30 rounded-2xl p-6 mb-6 border border-primary-700/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
                {result.overallScore}
              </div>
              <div className="text-white text-lg font-semibold">Overall Quality Score</div>
              <div className="text-gray-300 text-sm mt-1">{result.summary}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="text-3xl font-bold text-white">{result.totalRecords.toLocaleString()}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Total Records</div>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <div className="text-3xl font-bold text-white">{result.totalColumns}</div>
                <div className="text-xs text-gray-400 font-medium mt-1">Total Columns</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Quality Dimensions
            <span className="ml-2 text-xs text-gray-400 font-normal">(Click to expand)</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderDimensionCard('completeness', result.dimensions.completeness)}
            {renderDimensionCard('consistency', result.dimensions.consistency)}
            {renderDimensionCard('validity', result.dimensions.validity)}
            {renderDimensionCard('accuracy', result.dimensions.accuracy)}
            {renderDimensionCard('uniqueness', result.dimensions.uniqueness)}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-start space-x-3 bg-primary-900/20 border border-primary-700/50 rounded-xl p-4">
            <svg className="w-6 h-6 text-primary-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-bold text-white mb-1">Next Steps</h5>
              <p className="text-sm text-gray-300 leading-relaxed">
                Review the detailed findings above for each quality dimension. Address critical issues first, starting with dimensions scoring below 75. 
                Implement the recommended improvements to enhance your data quality and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
