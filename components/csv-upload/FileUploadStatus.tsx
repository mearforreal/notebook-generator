import React from 'react';
import { UploadResponse } from '@/types/notebook.types';

interface FileUploadStatusProps {
  uploadResult: UploadResponse | null;
  error: string | null;
  onReset: () => void;
}

export default function FileUploadStatus({ uploadResult, error, onReset }: FileUploadStatusProps) {
  if (error) {
    return (
      <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">Upload Failed</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={onReset}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (uploadResult?.success) {
    return (
      <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">Success!</h3>
            <p className="text-green-700 dark:text-green-300 mb-4">{uploadResult.message}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-900 dark:text-green-100">CSV File:</span>
                <code className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">
                  {uploadResult.csvPath}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-900 dark:text-green-100">Notebook:</span>
                <code className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">
                  {uploadResult.notebookPath}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-900 dark:text-green-100">Cleaned CSV:</span>
                <code className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded">
                  {uploadResult.cleanedPath}
                </code>
              </div>
            </div>

            {uploadResult.notebookPath && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                  <strong>Next Steps:</strong>
                </p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Open the notebook file in Jupyter or JupyterLab</li>
                  <li>Execute all cells to clean your data</li>
                  <li>Find the cleaned CSV in the specified path</li>
                </ol>
              </div>
            )}

            <button
              onClick={onReset}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              Upload Another File
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
