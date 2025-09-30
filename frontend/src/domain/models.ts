export interface AgentRequest {
  id: string;
  instructions: string;
  attachedFiles: FileItem[];
  timestamp: Date;
  status: RequestStatus;
}

export interface AgentResponse {
  requestId: string;
  outputFiles: ProcessedFile[];
  logs: string[];
  timestamp: Date;
  processingTime: number;
}

export interface FileItem {
  id: string;
  file: File;
  uploadedAt: Date;
  status: FileStatus;
}

export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string | Blob;
  url?: string;
  metadata: FileMetadata;
}

export interface FileMetadata {
  originalName: string;
  processedAt: Date;
  processingAgent?: string;
  tags?: string[];
}

export type RequestStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'error';
export type FileStatus = 'uploading' | 'uploaded' | 'processing' | 'processed' | 'error';

export interface WorkstreamInfo {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'planned' | 'completed';
  deadline?: Date;
  progress?: number;
  owner?: string;
}

export interface Notification {
  id: string;
  type: 'email' | 'assessment' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  sender?: string;
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
}

export interface Assessment {
  id: string;
  title: string;
  type: 'data_quality' | 'compliance' | 'governance' | 'security';
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  workstreamId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface WorkstreamContext {
  workstreamId: string;
  chatHistory: ChatMessage[];
  drafts: Draft[];
  lastAccessed: Date;
  files: FileItem[];
}

export interface Draft {
  id: string;
  workstreamId: string;
  title: string;
  content: string;
  type: 'report' | 'email' | 'document' | 'analysis';
  lastModified: Date;
  status: 'draft' | 'review' | 'completed';
  version: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: Date;
  tools?: string[];
  files?: string[];
}

export interface KnowledgeBase {
  id: string;
  name: string;
  type: 'sharepoint' | 'confluence' | 'local' | 'database';
  url?: string;
  connected: boolean;
  lastSync?: Date;
  status: 'active' | 'error' | 'syncing';
}

export const WORKSTREAMS: WorkstreamInfo[] = [
  {
    id: 'sas',
    name: 'Single-Agent Systems',
    description: 'Specialized AI agents for core data management functions',
    status: 'active',
    progress: 65,
    owner: 'Data Management Team'
  },
  {
    id: 'mas',
    name: 'Multi-Agent Systems',
    description: 'Collaborative AI teams for complex governance workflows',
    status: 'planned',
    progress: 20,
    owner: 'Architecture Team'
  },
  {
    id: 'rca',
    name: 'Regulatory & Compliance Agents',
    description: 'AI agents trained on regulations and standards',
    status: 'planned',
    progress: 15,
    owner: 'Compliance Team'
  },
  {
    id: 'tools',
    name: 'Community Tooling',
    description: 'Open-source AI-accessible tools and APIs',
    status: 'active',
    progress: 80,
    owner: 'Engineering Team'
  },
  {
    id: 'dq-pmo',
    name: 'DQ Assessment for PMO',
    description: 'Data quality assessment for Project Management Office',
    status: 'active',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    progress: 45,
    owner: 'DQ Manager'
  },
  {
    id: 'strategy-doc',
    name: 'Data Strategy Document',
    description: 'Enterprise data management strategy documentation',
    status: 'active',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    progress: 30,
    owner: 'Data Manager'
  }
];