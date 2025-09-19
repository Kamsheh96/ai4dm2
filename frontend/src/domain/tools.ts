export interface ToolMetrics {
  speed: number; // 1-5
  quality: number; // 1-5
  cost: 'free' | 'low' | 'medium' | 'high' | 'enterprise';
  reliability: number; // 1-5
  scalability: number; // 1-5
}

export interface ToolDetails {
  fullDescription: string;
  keyFeatures: string[];
  useCases: string[];
  limitations: string[];
  alternatives: string[];
  integrations: string[];
}

export interface DataTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  isActive: boolean;
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  icon: string;
  metrics: ToolMetrics;
  details: ToolDetails;
}

export type ToolCategory =
  | 'compliance'
  | 'database'
  | 'privacy'
  | 'integration'
  | 'analytics'
  | 'classification'
  | 'storage'
  | 'performance'
  | 'security';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tools?: string[];
  files?: string[];
}

export interface ToolsState {
  selectedTools: string[];
  availableTools: DataTool[];
  isToolsModalOpen: boolean;
}

export const DATA_TOOLS: DataTool[] = [
  {
    id: 'gdpr-scanner',
    name: 'GDPR Compliance Scanner',
    description: 'Automated GDPR regulation compliance checking',
    category: 'compliance',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '5-10 min',
    icon: '🛡️',
    metrics: {
      speed: 4,
      quality: 5,
      cost: 'medium',
      reliability: 5,
      scalability: 4
    },
    details: {
      fullDescription: 'Enterprise-grade automated scanner that analyzes your data processing activities, identifies GDPR compliance gaps, and provides actionable recommendations. Uses AI to interpret complex GDPR articles and map them to your specific business context.',
      keyFeatures: [
        'Real-time compliance monitoring',
        'Automated data mapping and classification',
        'Privacy Impact Assessment (PIA) generation',
        'Cookie consent verification',
        'Data retention policy checks'
      ],
      useCases: [
        'Pre-audit compliance assessment',
        'Continuous compliance monitoring',
        'Third-party vendor assessment',
        'Website and app compliance checking'
      ],
      limitations: [
        'Requires initial configuration time',
        'May need customization for specific industries',
        'Limited support for non-EU regulations'
      ],
      alternatives: ['OneTrust', 'TrustArc', 'Enzuzo'],
      integrations: ['Salesforce', 'Microsoft 365', 'AWS', 'Google Cloud']
    }
  },
  {
    id: 'multi-db-orchestrator',
    name: 'Multi-DB Query Orchestrator',
    description: 'Cross-database query execution and optimization',
    category: 'database',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '10-15 min',
    icon: '🗄️',
    metrics: {
      speed: 5,
      quality: 5,
      cost: 'high',
      reliability: 4,
      scalability: 5
    },
    details: {
      fullDescription: 'Advanced cross-database orchestration platform that seamlessly executes queries across heterogeneous database systems including SQL, NoSQL, and cloud databases. Features intelligent query optimization and automatic data type conversion.',
      keyFeatures: [
        'Cross-platform query execution',
        'Automatic query optimization',
        'Transaction management across databases',
        'Real-time data synchronization',
        'Query result caching and federation'
      ],
      useCases: [
        'Multi-cloud database management',
        'Data warehouse federation',
        'Real-time analytics across systems',
        'Database migration projects'
      ],
      limitations: [
        'Complex initial configuration',
        'Network latency impacts performance',
        'Limited support for proprietary databases'
      ],
      alternatives: ['Presto', 'Apache Drill', 'Denodo'],
      integrations: ['PostgreSQL', 'MongoDB', 'MySQL', 'Oracle', 'Snowflake', 'BigQuery']
    }
  },
  {
    id: 'privacy-analyzer',
    name: 'Privacy Impact Analyzer',
    description: 'Privacy risk assessment and mitigation',
    category: 'privacy',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '8-12 min',
    icon: '🔒'
  },
  {
    id: 'etl-builder',
    name: 'Real-time ETL Pipeline Builder',
    description: 'Automated data integration workflows',
    category: 'integration',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '15-20 min',
    icon: '⚡'
  },
  {
    id: 'pii-detector',
    name: 'PII Detection Shield',
    description: 'Personal identifiable information discovery',
    category: 'privacy',
    isActive: false,
    complexity: 'basic',
    estimatedTime: '3-5 min',
    icon: '👁️'
  },
  {
    id: 'predictive-engine',
    name: 'Predictive Analytics Engine',
    description: 'Advanced statistical modeling and forecasting',
    category: 'analytics',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '20-30 min',
    icon: '📈'
  },
  {
    id: 'data-classifier',
    name: 'Data Classification Engine',
    description: 'Intelligent data categorization and tagging',
    category: 'classification',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '8-10 min',
    icon: '🏷️'
  },
  {
    id: 'cloud-optimizer',
    name: 'Cloud Storage Optimizer',
    description: 'Multi-cloud data placement and cost optimization',
    category: 'storage',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '10-15 min',
    icon: '☁️'
  },
  {
    id: 'db-tuner',
    name: 'Database Performance Tuner',
    description: 'Automated index and query optimization',
    category: 'performance',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '12-18 min',
    icon: '⚡'
  },
  {
    id: 'ccpa-enforcer',
    name: 'CCPA Rights Enforcer',
    description: 'California Consumer Privacy Act compliance',
    category: 'compliance',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '6-8 min',
    icon: '⚖️'
  },
  {
    id: 'api-hub',
    name: 'API Integration Hub',
    description: 'RESTful and GraphQL service connector',
    category: 'integration',
    isActive: false,
    complexity: 'basic',
    estimatedTime: '5-8 min',
    icon: '🔗'
  },
  {
    id: 'data-lake-organizer',
    name: 'Data Lake Organizer',
    description: 'Structured and unstructured data management',
    category: 'storage',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '15-25 min',
    icon: '🏞️'
  },
  {
    id: 'sql-migrator',
    name: 'SQL Migration Assistant',
    description: 'Database schema and data migration tool',
    category: 'database',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '10-12 min',
    icon: '🔄'
  },
  {
    id: 'bi-generator',
    name: 'BI Dashboard Generator',
    description: 'Automated report and visualization builder',
    category: 'analytics',
    isActive: false,
    complexity: 'basic',
    estimatedTime: '5-10 min',
    icon: '📊'
  },
  {
    id: 'warehouse-architect',
    name: 'Data Warehouse Architect',
    description: 'Dimensional modeling and star schema builder',
    category: 'database',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '20-30 min',
    icon: '🏗️'
  },
  {
    id: 'consent-tracker',
    name: 'Consent Management Tracker',
    description: 'User consent lifecycle monitoring',
    category: 'compliance',
    isActive: false,
    complexity: 'basic',
    estimatedTime: '4-6 min',
    icon: '✅'
  },
  {
    id: 'stream-monitor',
    name: 'Stream Processing Monitor',
    description: 'Real-time data flow analytics and alerting',
    category: 'performance',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '12-15 min',
    icon: '🌊'
  },
  {
    id: 'data-vault-modeler',
    name: 'Data Vault Modeler',
    description: 'Enterprise data warehouse methodology implementation',
    category: 'database',
    isActive: false,
    complexity: 'advanced',
    estimatedTime: '25-35 min',
    icon: '🏛️'
  },
  {
    id: 'anomaly-detector',
    name: 'Anomaly Detection Scanner',
    description: 'Statistical outlier and fraud detection',
    category: 'security',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '8-12 min',
    icon: '🚨'
  },
  {
    id: 'backup-validator',
    name: 'Backup Recovery Validator',
    description: 'Automated disaster recovery testing and verification',
    category: 'security',
    isActive: false,
    complexity: 'intermediate',
    estimatedTime: '10-15 min',
    icon: '💾'
  }
];

export const TOOL_CATEGORIES: Record<ToolCategory, { name: string; color: string }> = {
  compliance: { name: 'Compliance & Legal', color: 'bg-blue-100 text-blue-800' },
  database: { name: 'Database Management', color: 'bg-green-100 text-green-800' },
  privacy: { name: 'Privacy & Security', color: 'bg-red-100 text-red-800' },
  integration: { name: 'Data Integration', color: 'bg-purple-100 text-purple-800' },
  analytics: { name: 'Analytics & BI', color: 'bg-yellow-100 text-yellow-800' },
  classification: { name: 'Data Classification', color: 'bg-indigo-100 text-indigo-800' },
  storage: { name: 'Storage & Cloud', color: 'bg-gray-100 text-gray-800' },
  performance: { name: 'Performance & Monitoring', color: 'bg-orange-100 text-orange-800' },
  security: { name: 'Security & Backup', color: 'bg-pink-100 text-pink-800' }
};