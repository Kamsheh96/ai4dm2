import type { ToolMetrics, ToolDetails } from '@domain/tools';

// Default metrics for tools that don't have detailed metrics yet
export const getDefaultMetrics = (): ToolMetrics => ({
  speed: 3,
  quality: 4,
  cost: 'medium',
  reliability: 4,
  scalability: 3
});

export const getDefaultDetails = (name: string, description: string): ToolDetails => ({
  fullDescription: `${description}. This enterprise-grade tool provides automated solutions with industry-leading performance and reliability.`,
  keyFeatures: [
    'Automated processing',
    'Real-time monitoring',
    'Comprehensive reporting',
    'API integration support'
  ],
  useCases: [
    'Enterprise data management',
    'Compliance automation',
    'Performance optimization'
  ],
  limitations: [
    'Requires initial setup',
    'Learning curve for advanced features'
  ],
  alternatives: ['Custom solutions'],
  integrations: ['REST API', 'Webhooks']
});

// Detailed metrics for specific tools
export const TOOL_METRICS: Record<string, ToolMetrics> = {
  'multi-db-orchestrator': {
    speed: 5,
    quality: 5,
    cost: 'high',
    reliability: 4,
    scalability: 5
  },
  'privacy-analyzer': {
    speed: 3,
    quality: 5,
    cost: 'medium',
    reliability: 5,
    scalability: 4
  },
  'etl-builder': {
    speed: 4,
    quality: 4,
    cost: 'enterprise',
    reliability: 4,
    scalability: 5
  },
  'pii-detector': {
    speed: 5,
    quality: 4,
    cost: 'low',
    reliability: 5,
    scalability: 4
  },
  'predictive-engine': {
    speed: 2,
    quality: 5,
    cost: 'enterprise',
    reliability: 4,
    scalability: 5
  },
  'data-classifier': {
    speed: 4,
    quality: 4,
    cost: 'medium',
    reliability: 4,
    scalability: 4
  },
  'cloud-optimizer': {
    speed: 3,
    quality: 5,
    cost: 'high',
    reliability: 5,
    scalability: 5
  },
  'db-tuner': {
    speed: 4,
    quality: 5,
    cost: 'medium',
    reliability: 4,
    scalability: 3
  },
  'ccpa-enforcer': {
    speed: 4,
    quality: 5,
    cost: 'medium',
    reliability: 5,
    scalability: 4
  },
  'api-hub': {
    speed: 5,
    quality: 4,
    cost: 'low',
    reliability: 4,
    scalability: 5
  }
};

export const TOOL_DETAILS: Record<string, ToolDetails> = {
  'multi-db-orchestrator': {
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
  },
  'pii-detector': {
    fullDescription: 'Lightning-fast PII detection engine using machine learning to identify and classify personal data across structured and unstructured sources. Supports 50+ PII types and custom pattern detection.',
    keyFeatures: [
      'ML-based PII detection',
      '50+ PII type recognition',
      'Custom pattern creation',
      'False positive reduction',
      'Multi-language support'
    ],
    useCases: [
      'GDPR compliance scanning',
      'Data anonymization preparation',
      'Security audit automation',
      'Data leak prevention'
    ],
    limitations: [
      'May miss context-specific PII',
      'Requires training for custom patterns',
      'Limited image/PDF processing'
    ],
    alternatives: ['Microsoft Presidio', 'Google DLP', 'AWS Macie'],
    integrations: ['S3', 'Azure Blob', 'Databases', 'File systems', 'APIs']
  },
  'etl-builder': {
    fullDescription: 'Visual ETL pipeline builder with drag-and-drop interface for creating complex data workflows. Supports real-time streaming, batch processing, and hybrid architectures with built-in error handling and monitoring.',
    keyFeatures: [
      'Visual pipeline designer',
      'Real-time and batch processing',
      '200+ pre-built connectors',
      'Automatic error recovery',
      'Pipeline versioning and rollback'
    ],
    useCases: [
      'Data warehouse loading',
      'Real-time analytics pipelines',
      'Data lake ingestion',
      'API data integration'
    ],
    limitations: [
      'Steep learning curve for complex transformations',
      'Resource intensive for large datasets',
      'Limited custom code support'
    ],
    alternatives: ['Apache NiFi', 'Talend', 'Informatica', 'Airbyte'],
    integrations: ['Kafka', 'Spark', 'Airflow', 'dbt', 'Snowflake', 'Databricks']
  }
};