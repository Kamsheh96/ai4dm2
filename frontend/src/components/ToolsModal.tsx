import React, { useState, useMemo } from 'react';
import { useTools } from '@hooks/useTools';
import { TOOL_CATEGORIES } from '@domain/tools';
import type { ToolCategory } from '@domain/tools';
import { ToolCard } from './ToolCard';

export const ToolsModal: React.FC = () => {
  const { availableTools, selectedTools, isToolsModalOpen, toggleTool, closeToolsModal } = useTools();
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] flex flex-col my-2">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Data Management Tools</h2>
              </div>
              <button
                onClick={closeToolsModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and Filters in collapsible section */}
            <details className="group" open>
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-3">
                Search & Filters
              </summary>

              {/* Search Bar */}
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-1 mb-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2 py-1 rounded-full text-xs transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({availableTools.length})
                </button>
                {categories.map(category => {
                  const toolCount = availableTools.filter(tool => tool.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {TOOL_CATEGORIES[category]?.name.split(' ')[0]} ({toolCount})
                    </button>
                  );
                })}
              </div>
            </details>

          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600">
                  {searchQuery ? `No tools match "${searchQuery}".` : 'No tools available in this category.'}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-primary-600 hover:text-primary-700 ml-1"
                    >
                      Clear search
                    </button>
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isSelected={selectedTools.includes(tool.id)}
                    onToggle={() => toggleTool(tool.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {selectedTools.length > 0 ? (
                  <>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={handleClearAllSelections}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Clear selections
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-600">
                    No tools selected
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={closeToolsModal}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={closeToolsModal}
                  className="btn-primary flex items-center justify-center w-full sm:w-auto"
                  disabled={selectedTools.length === 0}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Continue{selectedTools.length > 0 ? ` (${selectedTools.length})` : ''}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};