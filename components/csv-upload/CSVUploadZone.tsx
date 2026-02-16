'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { validateCSVFile } from '@/lib/csv-validator';
import { UploadResponse } from '@/types/notebook.types';
import FileUploadStatus from './FileUploadStatus';

export default function CSVUploadZone() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    setUploadResult(null);

    // Client-side validation
    const validation = validateCSVFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        setUploadResult(result);
        setSelectedFile(null);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {/* Upload Zone */}
      {!uploadResult && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploading}
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-zinc-400 dark:text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Maximum file size: 10MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && !uploadResult && (
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
            disabled={uploading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload and Generate Notebook'
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            disabled={uploading}
            className="px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Status Display */}
      <FileUploadStatus
        uploadResult={uploadResult}
        error={error}
        onReset={handleReset}
      />
    </div>
  );
}
