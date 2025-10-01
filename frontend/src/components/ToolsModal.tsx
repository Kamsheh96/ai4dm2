import React, { useState, useMemo } from 'react';
import { useTools } from '@hooks/useTools';
import { TOOL_CATEGORIES } from '@domain/tools';
import type { ToolCategory, DataTool } from '@domain/tools';
import { ToolCard } from './ToolCard';
import { ToolDetailsModal } from './ToolDetailsModal';

export const ToolsModal: React.FC = () => {
  const { availableTools, selectedTools, isToolsModalOpen, toggleTool, closeToolsModal } = useTools();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTool, setDetailTool] = useState<DataTool | null>(null);

  const filteredTools = useMemo(() => {
    let tools = availableTools;

    // Filter by category
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        TOOL_CATEGORIES[tool.category]?.name.toLowerCase().includes(query)
      );
    }

    return tools;
  }, [availableTools, selectedCategory, searchQuery]);

  const categories = Object.keys(TOOL_CATEGORIES) as ToolCategory[];

  const handleClearAllSelections = () => {
    selectedTools.forEach(toolId => {
      toggleTool(toolId);
    });
  };

  if (!isToolsModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden animate-fade-in">
      <div className="flex h-full items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="bg-gray-800 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-glow w-full h-full sm:h-[98vh] md:h-[96vh] flex flex-col border border-gray-700 animate-scale-in overflow-hidden">
          {/* Header with Gradient */}
          <div className="p-6 border-b border-gray-700 flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-800 to-gray-850 rounded-t-3xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-soft">
                  <span className="text-white text-2xl">🛠️</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Data Management Tools</h2>
                  <p className="text-sm text-gray-300 font-medium">Select specialized tools to enhance your AI assistant</p>
                </div>
              </div>
              <button
                onClick={closeToolsModal}
                className="p-3 min-h-[44px] min-w-[44px] hover:bg-gray-700 hover:shadow-soft rounded-2xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search tools by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-gray-700 text-white hover:bg-gray-650 transition-all duration-200 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 touch-manipulation min-h-[44px] ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft hover:scale-105'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-soft hover:scale-105 border border-gray-600'
                  }`}
                >
                  All Tools ({availableTools.length})
                </button>
                {categories.map(category => {
                  const toolCount = availableTools.filter(tool => tool.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 touch-manipulation min-h-[44px] ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-soft hover:scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-soft hover:scale-105 border border-gray-600'
                      }`}
                    >
                      {TOOL_CATEGORIES[category]?.name.split(' ')[0]} ({toolCount})
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-grow bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900">
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-900/50 to-secondary-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft border border-gray-700">
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No tools found</h3>
                <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
                  {searchQuery ? `No tools match "${searchQuery}". Try adjusting your search or browse all categories.` : 'No tools available in this category.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-semibold hover:shadow-soft hover:scale-105 transition-all duration-200"
                  >
                    Clear search and view all tools
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ToolCard
                      tool={tool}
                      isSelected={selectedTools.includes(tool.id)}
                      onToggle={() => toggleTool(tool.id)}
                      onViewDetails={() => setDetailTool(tool)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tool Details Modal */}
          {detailTool && (
            <ToolDetailsModal
              tool={detailTool}
              isSelected={selectedTools.includes(detailTool.id)}
              onToggle={() => toggleTool(detailTool.id)}
              onClose={() => setDetailTool(null)}
            />
          )}

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 bg-gradient-to-br from-gray-800 to-gray-850 flex-shrink-0 rounded-b-3xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {selectedTools.length > 0 ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-soft">
                        <span className="text-white font-bold">{selectedTools.length}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-xs text-gray-400">Ready to enhance your assistant</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClearAllSelections}
                      className="text-sm text-gray-300 hover:text-error-400 font-semibold hover:scale-105 transition-all duration-200"
                    >
                      Clear all
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">🛠️</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">No tools selected</p>
                      <p className="text-xs text-gray-400">Select tools to continue</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={closeToolsModal}
                  className="btn-secondary w-full sm:w-auto min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={closeToolsModal}
                  className="btn-primary flex items-center justify-center w-full sm:w-auto min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={selectedTools.length === 0}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continue with {selectedTools.length > 0 ? selectedTools.length : 'selected'} tool{selectedTools.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};