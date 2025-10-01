import React, { useState } from 'react';
import { useDashboard } from '@hooks/useDashboard';
import { useToast } from '@hooks/useToast';
import type { KnowledgeBase } from '@domain/models';

export const KnowledgeBaseManager: React.FC = () => {
  const { knowledgeBases, addKnowledgeBase, removeKnowledgeBase, connectKnowledgeBase, disconnectKnowledgeBase } = useDashboard();
  const { addToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKbName, setNewKbName] = useState('');
  const [newKbType, setNewKbType] = useState<KnowledgeBase['type']>('sharepoint');
  const [newKbUrl, setNewKbUrl] = useState('');

  const handleAddKnowledgeBase = (): void => {
    if (!newKbName.trim()) {
      addToast('Please enter a name for the knowledge base', 'error');
      return;
    }

    if ((newKbType === 'sharepoint' || newKbType === 'confluence') && !newKbUrl.trim()) {
      addToast('Please enter a URL for the knowledge base', 'error');
      return;
    }

    addKnowledgeBase({
      name: newKbName,
      type: newKbType,
      ...(newKbUrl && { url: newKbUrl })
    });

    addToast(`Knowledge base "${newKbName}" added successfully`, 'success');
    setShowAddModal(false);
    setNewKbName('');
    setNewKbUrl('');
    setNewKbType('sharepoint');
  };

  const handleConnect = async (kb: KnowledgeBase): Promise<void> => {
    try {
      addToast(`Connecting to ${kb.name}...`, 'info');
      await connectKnowledgeBase(kb.id);
      addToast(`Successfully connected to ${kb.name}`, 'success');
    } catch (error) {
      addToast(`Failed to connect to ${kb.name}`, 'error');
    }
  };

  const handleDisconnect = (kb: KnowledgeBase): void => {
    disconnectKnowledgeBase(kb.id);
    addToast(`Disconnected from ${kb.name}`, 'info');
  };

  const handleRemove = (kb: KnowledgeBase): void => {
    if (confirm(`Are you sure you want to remove "${kb.name}"?`)) {
      removeKnowledgeBase(kb.id);
      addToast(`Removed ${kb.name}`, 'info');
    }
  };

  const getKbIcon = (type: KnowledgeBase['type']): string => {
    switch (type) {
      case 'sharepoint': return '📊';
      case 'confluence': return '🔗';
      case 'local': return '📁';
      case 'database': return '🗄️';
      default: return '📚';
    }
  };

  const getStatusBadge = (kb: KnowledgeBase): { text: string; className: string } => {
    if (kb.status === 'syncing') {
      return { text: 'Syncing...', className: 'badge-info' };
    }
    if (kb.status === 'error') {
      return { text: 'Error', className: 'badge-error' };
    }
    if (kb.connected) {
      return { text: 'Connected', className: 'badge-success' };
    }
    return { text: 'Disconnected', className: 'badge-warning' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Knowledge Bases</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Connect AI agents to your enterprise knowledge sources
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Knowledge Base</span>
        </button>
      </div>

      {/* Knowledge Bases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBases.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-700 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Knowledge Bases Yet</h3>
            <p className="text-gray-300 mb-6">
              Connect to SharePoint, Confluence, or other knowledge sources
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add Your First Knowledge Base
            </button>
          </div>
        ) : (
          knowledgeBases.map((kb, index) => {
            const statusBadge = getStatusBadge(kb);
            return (
              <div
                key={kb.id}
                className="card-interactive group animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-secondary-500 flex items-center justify-center shadow-soft flex-shrink-0">
                      <span className="text-white text-xl">{getKbIcon(kb.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg mb-1 truncate">
                        {kb.name}
                      </h3>
                      <span className={`inline-flex text-xs px-3 py-1 rounded-full font-semibold ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium capitalize">{kb.type}</span>
                  </div>

                  {kb.url && (
                    <div className="flex items-center text-sm text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="font-medium truncate">{kb.url}</span>
                    </div>
                  )}

                  {kb.lastSync && (
                    <div className="flex items-center text-sm text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">
                        Last sync: {new Date(kb.lastSync).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-700">
                  {kb.connected ? (
                    <>
                      <button
                        onClick={() => handleDisconnect(kb)}
                        disabled={kb.status === 'syncing'}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-warning-700 bg-warning-50 hover:bg-warning-100 rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        Disconnect
                      </button>
                      <button
                        onClick={() => handleConnect(kb)}
                        disabled={kb.status === 'syncing'}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {kb.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(kb)}
                      disabled={kb.status === 'syncing'}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-soft hover:scale-105 rounded-xl transition-all duration-200 disabled:opacity-50"
                    >
                      Connect
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(kb)}
                    className="px-4 py-2 text-sm font-semibold text-error-700 bg-error-50 hover:bg-error-100 rounded-xl transition-all duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Knowledge Base</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Knowledge Base Name
                </label>
                <input
                  type="text"
                  value={newKbName}
                  onChange={(e) => setNewKbName(e.target.value)}
                  placeholder="e.g., PMO SharePoint Site"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-primary-500 outline-none transition-all duration-200 text-base placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newKbType}
                  onChange={(e) => setNewKbType(e.target.value as KnowledgeBase['type'])}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-primary-500 outline-none transition-all duration-200 text-base"
                >
                  <option value="sharepoint">SharePoint</option>
                  <option value="confluence">Confluence</option>
                  <option value="local">Local Folder</option>
                  <option value="database">Database</option>
                </select>
              </div>

              {(newKbType === 'sharepoint' || newKbType === 'confluence') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newKbUrl}
                    onChange={(e) => setNewKbUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-600 bg-gray-700 text-white focus:border-primary-500 outline-none transition-all duration-200 text-base placeholder:text-gray-400"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddKnowledgeBase}
                  className="flex-1 btn-primary"
                >
                  Add Knowledge Base
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};