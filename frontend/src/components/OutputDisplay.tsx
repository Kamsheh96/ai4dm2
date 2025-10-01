import React from 'react';
import type { ProcessedFile } from '@domain/models';

interface OutputDisplayProps {
  files: ProcessedFile[];
  onDownload: (file: ProcessedFile) => void;
  onDownloadAll: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  files,
  onDownload,
  onDownloadAll
}) => {
  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (files.length === 0) {
    return (
      <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Output Files</h3>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-gray-300">No output files yet</p>
          <p className="text-sm text-gray-400 mt-1">Process a request to see output files here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Output Files ({files.length})</h3>
        {files.length > 0 && (
          <button
            onClick={onDownloadAll}
            className="btn-primary text-sm"
          >
            Download All
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-650 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-success-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-300">{file.type}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-300">{formatFileSize(file.size)}</span>
                  {file.metadata.processingAgent && (
                    <>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-300">by {file.metadata.processingAgent}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onDownload(file)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-600 border border-gray-500 text-gray-200 rounded-lg hover:bg-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <span className="text-sm">Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};