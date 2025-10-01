import React from 'react';

interface ComingSoonProps {
  onClose: () => void;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ onClose }) => {
  const upcomingFeatures = [
    {
      icon: '📧',
      name: 'Agent Send Email Integration',
      description: 'Right-click on completed drafts and select "Agent Send" to have the AI agent send emails automatically'
    },
    {
      icon: '👥',
      name: 'Real-time Team Collaboration',
      description: 'Multi-user collaboration with presence tracking, real-time updates, and conflict resolution'
    },
    {
      icon: '✅',
      name: 'Data Quality Assessment Agent',
      description: 'AI agent to assess data quality across completeness, consistency, validity, accuracy, and uniqueness dimensions'
    },
    {
      icon: '⚖️',
      name: 'Regulatory Compliance Checker',
      description: 'Check data practices against GDPR, PDPL, and other regulatory requirements with gap analysis'
    },
    {
      icon: '🏗️',
      name: 'Data Modeling Assistant Agent',
      description: 'Generate conceptual and logical data models from business requirements following DMBoK standards'
    },
    {
      icon: '🤝',
      name: 'Multi-Agent Coordination System',
      description: 'Orchestrate multiple specialized agents to work together on complex data management projects'
    },
    {
      icon: '📚',
      name: 'Business Glossary Integration',
      description: 'Upload and integrate business terminology so AI agents understand organization-specific context'
    },
    {
      icon: '🎤',
      name: 'Stakeholder Workshop Assistant',
      description: 'Process workshop recordings/transcripts to extract decisions, action items, and requirements automatically'
    },
    {
      icon: '🔗',
      name: 'Data Classification API',
      description: 'RESTful API for programmatic data classification services with token-based authentication'
    },
    {
      icon: '📖',
      name: 'DMBoK Knowledge API',
      description: 'Programmatic access to DMBoK knowledge and best practices for AI agents'
    }
  ];


  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="hover:opacity-80 transition-opacity duration-200 cursor-pointer bg-gray-900 rounded-lg p-1"
            >
              <img
                src="/logo.png"
                alt="AI4DM Logo"
                className="h-12 w-auto object-cover"
              />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Coming Soon</h1>
              <p className="text-sm text-gray-400 mt-1">Future features and enhancements in development</p>
            </div>
          </div>
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          <div className="bg-gradient-to-br from-primary-900/30 to-secondary-900/30 border border-primary-600/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Upcoming Features</h2>
                <p className="text-gray-300 leading-relaxed">
                  AI4DM is continuously evolving with exciting new capabilities on the horizon. Here are the planned enhancements
                  that will expand the platform's functionality and value.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-primary-600/50 transition-all duration-200 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600/20 to-secondary-600/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>

                {/* Feature Name */}
                <h3 className="text-lg font-bold text-white mb-3">{feature.name}</h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Footer Summary */}
          <div className="mt-8 bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Development in Progress</h3>
                <p className="text-gray-300 leading-relaxed">
                  These features are actively being developed and will be rolled out progressively. Stay tuned for updates
                  as we continue to enhance the AI4DM platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
