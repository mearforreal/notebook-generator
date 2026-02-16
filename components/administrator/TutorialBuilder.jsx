'use client';

import { useState } from 'react';

export default function TutorialBuilder() {
  const [notebookFile, setNotebookFile] = useState(null);
  const [rawCsvFile, setRawCsvFile] = useState(null);
  const [cleanedCsvFile, setCleanedCsvFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tutorialUrl, setTutorialUrl] = useState('');

  const handleFileChange = (setter, extension) => (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(extension)) {
      setter(file);
      setError('');
    } else {
      setError(`Please select a valid ${extension} file`);
      setter(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notebookFile || !rawCsvFile || !cleanedCsvFile || !folderName.trim()) {
      setError('Please provide all required files and folder name');
      return;
    }

    // Validate folder name (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      setError('Folder name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setTutorialUrl('');

    try {
      const formData = new FormData();
      formData.append('notebook', notebookFile);
      formData.append('rawCsv', rawCsvFile);
      formData.append('cleanedCsv', cleanedCsvFile);
      formData.append('folderName', folderName);

      const response = await fetch('/api/generate-tutorial', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate tutorial');
      }

      const data = await response.json();
      setSuccess('Tutorial page generated successfully!');
      setTutorialUrl(data.url);

      // Reset form
      setNotebookFile(null);
      setRawCsvFile(null);
      setCleanedCsvFile(null);
      setFolderName('');
      e.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Generate Tutorial Walkthrough
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload a Jupyter notebook and associated CSV files to create an educational tutorial page.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Folder Name Input */}
        <div>
          <label htmlFor="folder-name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Folder Name (for URL)
          </label>
          <input
            id="folder-name"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., fake-jobs"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Tutorial will be available at: /ipynb/{folderName || '<folder-name>'}/page.js
          </p>
        </div>

        {/* File Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Notebook File */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📓</div>
              <label htmlFor="notebook-file" className="cursor-pointer">
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {notebookFile ? notebookFile.name : 'Notebook (.ipynb)'}
                </span>
                <input
                  id="notebook-file"
                  type="file"
                  accept=".ipynb"
                  onChange={handleFileChange(setNotebookFile, '.ipynb')}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Jupyter notebook file
              </p>
            </div>
          </div>

          {/* Raw CSV File */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📄</div>
              <label htmlFor="raw-csv-file" className="cursor-pointer">
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {rawCsvFile ? rawCsvFile.name : 'Raw CSV'}
                </span>
                <input
                  id="raw-csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange(setRawCsvFile, '.csv')}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Original dataset
              </p>
            </div>
          </div>

          {/* Cleaned CSV File */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6">
            <div className="text-center">
              <div className="text-3xl mb-2">✨</div>
              <label htmlFor="cleaned-csv-file" className="cursor-pointer">
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {cleanedCsvFile ? cleanedCsvFile.name : 'Cleaned CSV'}
                </span>
                <input
                  id="cleaned-csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange(setCleanedCsvFile, '.csv')}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Processed dataset
              </p>
            </div>
          </div>
        </div>

        {/* Tutorial Layout Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Tutorial Layout
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• One row per notebook code cell</li>
            <li>• Each row contains: code block, output block, and explanation</li>
            <li>• Automatic syntax highlighting</li>
            <li>• Link to charts dashboard</li>
          </ul>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            {tutorialUrl && (
              <a
                href={tutorialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
              >
                View Tutorial →
              </a>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!notebookFile || !rawCsvFile || !cleanedCsvFile || !folderName.trim() || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Generating Tutorial...' : 'Generate Tutorial'}
        </button>
      </form>
    </div>
  );
}
