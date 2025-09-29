import React from 'react';
import type { FileItem } from '@domain/models';

interface FileListProps {
  files: FileItem[];
  onRemove: (fileId: string) => void;
  title: string;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove, title }) => {
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (files.length === 0) {
    return (
      <div className="card-glass">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {title}
        </h3>
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-base font-medium">No files uploaded yet</p>
          <p className="text-gray-400 text-sm mt-2">Upload files to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {title}
        </h3>
        <span className="badge-info">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-3">
        {files.map((fileItem, index) => (
          <div
            key={fileItem.id}
            className="group flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-soft hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200 animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">{fileItem.file.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  {formatFileSize(fileItem.file.size)} · {formatDate(fileItem.uploadedAt)}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(fileItem.id)}
              className="flex-shrink-0 ml-3 p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
              aria-label={`Remove ${fileItem.file.name}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};