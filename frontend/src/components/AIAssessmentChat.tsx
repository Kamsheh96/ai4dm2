import React, { useState } from 'react';

interface AIAssessmentChatProps {
  onClose?: () => void;
}

export const AIAssessmentChat: React.FC<AIAssessmentChatProps> = ({ onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [agentSend, setAgentSend] = useState(false);

  const handleSendMessage = (): void => {
    if (inputMessage.trim()) {
      // Handle sending message
      setInputMessage('');
    }
  };

  const handleSuggestedAction = (action: string): void => {
    console.log('Action clicked:', action);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-white">AI Agent - DQ Assessment PMO</h1>
              <span className="px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-semibold">
                Active Context
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Section 3 Draft • Last edited 15 min ago</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium">
              Change
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* AI Welcome Message */}
        <div className="flex items-start space-x-3 max-w-4xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
              <p className="text-white leading-relaxed mb-3">
                Welcome back! I've loaded your <span className="font-semibold">PMO Data Quality Assessment</span> context.
                You were working on <span className="font-semibold">Section 3: Data Governance Framework</span>.
              </p>
              <p className="text-white leading-relaxed">
                Current progress: <span className="font-semibold text-primary-400">65% complete</span>.
                Would you like to continue where you left off?
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">2 minutes ago</p>
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-start space-x-3 max-w-4xl ml-auto flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-warning-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">👤</span>
          </div>
          <div className="flex-1 text-right">
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl p-5 inline-block text-left">
              <p className="text-white leading-relaxed">
                Yes, let's continue with Section 3. Can you show me what we have so far?
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">Just now</p>
          </div>
        </div>

        {/* AI Response with Section Content */}
        <div className="flex items-start space-x-3 max-w-4xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div className="flex-1">
            <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 mb-3">
              <p className="text-gray-400 mb-4">Here's Section 3 of your assessment:</p>

              {/* Section Content Display Card */}
              <div className="bg-black rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">3. Data Governance Framework</h3>

                <p className="text-gray-300 leading-relaxed mb-4">
                  The PMO has established a comprehensive data governance structure to ensure data quality
                  standards are maintained across all project deliverables.
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Components:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">•</span>
                      <span>Data Stewardship roles assigned across 5 business units</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">•</span>
                      <span>Monthly Data Quality Council meetings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">•</span>
                      <span>Established escalation procedures for critical issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-400 mr-2">•</span>
                      <span>Quarterly metrics reporting to executive leadership</span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">
                  <span className="font-semibold text-white">Key Findings:</span> The governance framework
                  has significantly improved data quality metrics, with a 23% reduction in data errors
                  over the past quarter.
                </p>

                {/* Status Badge */}
                <div className="flex items-center justify-start mt-6">
                  <span className="px-4 py-2 bg-error-500 text-white rounded-lg text-sm font-semibold">
                    Draft - Section Incomplete
                  </span>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex items-center justify-between mb-4">
              <button className="text-sm text-gray-400 hover:text-white underline transition-colors duration-200">
                Continue Draft
              </button>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={agentSend}
                  onChange={() => setAgentSend(!agentSend)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-400">Agent Send</span>
              </label>
            </div>

            {/* Suggested Actions */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">Suggested Actions</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSuggestedAction('add-metrics')}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📊</span>
                    <span className="text-white text-sm font-medium">Add Metrics Table</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSuggestedAction('review-docs')}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📄</span>
                    <span className="text-white text-sm font-medium">Review SharePoint Docs</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSuggestedAction('generate-recs')}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">💡</span>
                    <span className="text-white text-sm font-medium">Generate Recommendations</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSuggestedAction('create-summary')}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📝</span>
                    <span className="text-white text-sm font-medium">Create Summary</span>
                  </div>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">Just now</p>
          </div>
        </div>
      </div>

      {/* Message Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about this assessment or continue drafting..."
            className="flex-1 bg-gray-900 text-white rounded-xl px-5 py-3 border border-gray-700 focus:outline-none focus:border-primary-500 transition-colors duration-200"
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
