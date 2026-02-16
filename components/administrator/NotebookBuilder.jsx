'use client';

import { useState } from 'react';

export default function NotebookBuilder() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cleaning step options
  const [steps, setSteps] = useState({
    imports: true,
    load_csv: true,
    preview: true,
    missingness: true,
    normalize_text: false,
    split_location: false,
    parse_salary: false,
    normalize_binary: false,
    drop_duplicates: true,
    save_cleaned: true
  });

  const stepDescriptions = {
    imports: 'Import required libraries (pandas, numpy, matplotlib)',
    load_csv: 'Load CSV file into DataFrame',
    preview: 'Display data overview and basic statistics',
    missingness: 'Analyze and handle missing values',
    normalize_text: 'Normalize text fields (lowercase, strip whitespace)',
    split_location: 'Split location column into city, state, country',
    parse_salary: 'Parse and normalize salary range fields',
    normalize_binary: 'Normalize binary columns (Yes/No → 1/0)',
    drop_duplicates: 'Remove duplicate rows',
    save_cleaned: 'Export cleaned data to CSV'
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleStepToggle = (step) => {
    setSteps(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    // Validate that at least imports, load_csv, and save_cleaned are selected
    if (!steps.imports || !steps.load_csv || !steps.save_cleaned) {
      setError('Required steps: imports, load_csv, and save_cleaned must be selected');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('steps', JSON.stringify(steps));

      const response = await fetch('/api/generate-notebook', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate notebook');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.csv', '_cleaning.ipynb');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Notebook generated and downloaded successfully!');
      setFile(null);
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
          Generate Cleaning Notebook
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload a CSV file and select the data cleaning steps to include in your Jupyter notebook.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M24 14v20m-10-10h20" />
            </svg>
            <div className="mt-4">
              <label htmlFor="csv-file" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {file ? file.name : 'Click to upload CSV file'}
                </span>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                CSV files up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Cleaning Steps Selection */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Select Cleaning Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(steps).map((step) => (
              <label
                key={step}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  steps[step]
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={steps[step]}
                  onChange={() => handleStepToggle(step)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  disabled={step === 'imports' || step === 'load_csv' || step === 'save_cleaned'}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {step.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    {(step === 'imports' || step === 'load_csv' || step === 'save_cleaned') && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Required)</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {stepDescriptions[step]}
                  </p>
                </div>
              </label>
            ))}
          </div>
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
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Generating Notebook...' : 'Generate Notebook'}
        </button>
      </form>
    </div>
  );
}
