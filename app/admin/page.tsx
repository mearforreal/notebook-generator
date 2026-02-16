import CSVUploadZone from '@/components/csv-upload/CSVUploadZone';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            CSV Data Cleaning Studio
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Upload a CSV file to generate a Jupyter notebook with automated data cleaning code.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
          <CSVUploadZone />
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How it works
          </h2>
          <ol className="space-y-2 text-blue-800 dark:text-blue-200">
            <li className="flex gap-3">
              <span className="font-bold">1.</span>
              <span>Upload your raw CSV file using the form above</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">2.</span>
              <span>The system generates a Jupyter notebook with data cleaning code</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">3.</span>
              <span>Open the generated notebook in Jupyter or JupyterLab</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">4.</span>
              <span>Execute the cells to clean your data and export a cleaned CSV</span>
            </li>
          </ol>
        </div>

        <div className="mt-6 p-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Notebook Features
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Data inspection and overview
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Missing value detection and handling
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Duplicate removal
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Data type conversions
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Outlier detection with visualizations
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Export cleaned CSV
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
