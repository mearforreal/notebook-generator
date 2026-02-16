'use client';

import { useState } from 'react';

export default function ChartsBuilder() {
  const [cleanedCsvFile, setCleanedCsvFile] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chartsUrl, setChartsUrl] = useState('');

  // Chart type options
  const [charts, setCharts] = useState({
    missingness: true,
    numeric_histogram: true,
    top_categories: true,
    binary_split: true
  });

  const chartDescriptions = {
    missingness: 'Visualize missing data patterns across all columns',
    numeric_histogram: 'Distribution histograms for numeric columns',
    top_categories: 'Bar charts showing top categories in categorical columns',
    binary_split: 'Pie charts for binary (Yes/No, True/False) columns'
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      setCleanedCsvFile(file);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setCleanedCsvFile(null);
    }
  };

  const handleChartToggle = (chart) => {
    setCharts(prev => ({ ...prev, [chart]: !prev[chart] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cleanedCsvFile || !folderName.trim()) {
      setError('Please provide cleaned CSV file and folder name');
      return;
    }

    // Validate folder name
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      setError('Folder name can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    // Check at least one chart is selected
    if (!Object.values(charts).some(v => v)) {
      setError('Please select at least one chart type');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setChartsUrl('');

    try {
      const formData = new FormData();
      formData.append('cleanedCsv', cleanedCsvFile);
      formData.append('folderName', folderName);
      formData.append('charts', JSON.stringify(charts));

      const response = await fetch('/api/generate-charts', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate charts');
      }

      const data = await response.json();
      setSuccess('Charts dashboard generated successfully!');
      setChartsUrl(data.url);

      // Reset form
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
          Generate Charts Dashboard
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload a cleaned CSV file and select chart types to visualize your data using Chart.js.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Folder Name Input */}
        <div>
          <label htmlFor="charts-folder-name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            Folder Name (for URL)
          </label>
          <input
            id="charts-folder-name"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g., fake-jobs"
            className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Charts will be available at: /ipynb/{folderName || '<folder-name>'}/charts
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📊</div>
            <label htmlFor="cleaned-csv-file" className="cursor-pointer">
              <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {cleanedCsvFile ? cleanedCsvFile.name : 'Click to upload Cleaned CSV'}
              </span>
              <input
                id="cleaned-csv-file"
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

        {/* Chart Type Selection */}
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Select Chart Types
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(charts).map((chart) => (
              <label
                key={chart}
                className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  charts[chart]
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={charts[chart]}
                  onChange={() => handleChartToggle(chart)}
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {chart.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {chartDescriptions[chart]}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Chart.js Info */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
            📊 Chart.js Features
          </h3>
          <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1">
            <li>• Interactive and responsive charts</li>
            <li>• Automatic color schemes</li>
            <li>• Hover tooltips with data details</li>
            <li>• Legend for data series</li>
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
            {chartsUrl && (
              <a
                href={chartsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-green-700 dark:text-green-300 hover:underline"
              >
                View Charts Dashboard →
              </a>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!cleanedCsvFile || !folderName.trim() || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Generating Charts...' : 'Generate Charts Dashboard'}
        </button>
      </form>
    </div>
  );
}
