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
}

export const WORKSTREAMS: WorkstreamInfo[] = [
  {
    id: 'sas',
    name: 'Single-Agent Systems',
    description: 'Specialized AI agents for core data management functions',
    status: 'active'
  },
  {
    id: 'mas',
    name: 'Multi-Agent Systems',
    description: 'Collaborative AI teams for complex governance workflows',
    status: 'planned'
  },
  {
    id: 'rca',
    name: 'Regulatory & Compliance Agents',
    description: 'AI agents trained on regulations and standards',
    status: 'planned'
  },
  {
    id: 'tools',
    name: 'Community Tooling',
    description: 'Open-source AI-accessible tools and APIs',
    status: 'active'
  }
];