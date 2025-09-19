import React, { useCallback, useState } from 'react';
import type { FileItem } from '@domain/models';
import { useToast } from '@hooks/useToast';

interface FileUploadProps {
  onFilesAdded: (files: FileItem[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesAdded,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024,
  acceptedTypes = ['*']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { addToast } = useToast();

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        addToast(`File "${file.name}" exceeds maximum size of ${maxFileSize / 1024 / 1024}MB`, 'error');
        continue;
      }

      if (acceptedTypes[0] !== '*' && !acceptedTypes.some(type => file.type.includes(type))) {
        addToast(`File type "${file.type}" is not accepted`, 'error');
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > maxFiles) {
      addToast(`Maximum ${maxFiles} files allowed`, 'warning');
      return validFiles.slice(0, maxFiles);
    }

    return validFiles;
  };

  const handleFiles = useCallback((files: FileList | null): void => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const validFiles = validateFiles(filesArray);

    if (validFiles.length > 0) {
      const fileItems: FileItem[] = validFiles.map(file => ({
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        uploadedAt: new Date(),
        status: 'uploaded'
      }));

      onFilesAdded(fileItems);
      addToast(`${validFiles.length} file(s) added successfully`, 'success');
    }
  }, [onFilesAdded, addToast, maxFiles, maxFileSize, acceptedTypes]);

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        accept={acceptedTypes[0] === '*' ? undefined : acceptedTypes.join(',')}
      />

      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="mt-2 text-sm text-gray-600">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Max {maxFiles} files, up to {maxFileSize / 1024 / 1024}MB each
      </p>
    </div>
  );
};