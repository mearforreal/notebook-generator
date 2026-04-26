import Link from 'next/link';

export const metadata = {
  title: 'How to Use Notebook Studio',
  description: 'Step-by-step guide for using Notebook Studio to clean data, generate notebooks, and build tutorials.',
};

const steps = [
  {
    id: 1,
    icon: '📓',
    tab: 'Notebook Builder',
    title: 'Upload a CSV and Build a Notebook',
    color: 'blue',
    intro:
      'The Notebook Builder takes your raw CSV file and generates a ready-to-run Jupyter notebook with data cleaning steps you choose.',
    instructions: [
      'Go to the Administrator Dashboard and click the Notebook Builder tab.',
      'Click "Choose File" (or drag and drop) to select a CSV file from your computer. Files up to 10 MB are supported.',
      'Check or uncheck the cleaning steps you want included — missing value handling, duplicate removal, outlier detection, and more.',
      'Click Generate Notebook. The notebook (.ipynb file) is saved to the server automatically.',
      'The project name is derived from your filename. You will see it appear in the Projects tab once generated.',
    ],
    tips: [
      'Your CSV must have a header row — the first row should contain column names.',
      'Numeric columns get mean-fill for missing values; text columns get mode-fill.',
      'You can re-upload the same file with different options to create multiple notebook variants.',
    ],
  },
  {
    id: 2,
    icon: '▶️',
    tab: 'Notebook Runner',
    title: 'Run the Notebook on the Server',
    color: 'green',
    intro:
      'The Notebook Runner executes your .ipynb file on the server using Jupyter. You see text output, tables, and charts right in the browser — no local Jupyter installation required.',
    instructions: [
      'Switch to the Notebook Runner tab.',
      'Select your notebook from the dropdown list.',
      'Click Run Notebook. Execution happens server-side; a progress indicator shows while it runs.',
      'Once finished, all cell outputs — print statements, DataFrames, and matplotlib charts — render inline on the page.',
      'If a cell fails, the error message is shown next to that cell so you can diagnose the problem.',
    ],
    tips: [
      'Notebooks with many rows or heavy visualizations take longer — give it up to 60 seconds.',
      'Chart images are embedded as base64 PNGs and display directly without any extra setup.',
      'Run the notebook again at any time to pick up changes you made to the .ipynb file.',
    ],
  },
  {
    id: 3,
    icon: '📚',
    tab: 'Tutorial Builder',
    title: 'Convert a Notebook into a Tutorial',
    color: 'purple',
    intro:
      'The Tutorial Builder transforms an executed notebook into a structured, human-readable tutorial page with explanations alongside every code block and output.',
    instructions: [
      'Switch to the Tutorial Builder tab.',
      'Pick the notebook you want to turn into a tutorial from the dropdown.',
      'Click Generate Tutorial. The builder reads the notebook cells and wraps each one in explanatory prose.',
      'The tutorial is saved as a standalone Next.js page inside your project folder.',
      'A direct link to the finished tutorial page appears when generation is complete — click it to preview.',
    ],
    tips: [
      'Run the notebook first (Step 2) so that output cells are populated before building the tutorial.',
      'Generated tutorials are accessible from the Projects tab as well.',
      'Each tutorial page is self-contained and can be shared as a URL.',
    ],
  },
  {
    id: 4,
    icon: '📊',
    tab: 'Charts Builder',
    title: 'Generate Interactive Charts',
    color: 'orange',
    intro:
      'The Charts Builder reads your cleaned CSV data and produces interactive Chart.js visualizations — bar, line, pie, and scatter — that embed directly into a project page.',
    instructions: [
      'Switch to the Charts Builder tab.',
      'Select the project (CSV dataset) you want to visualize.',
      'Choose which columns to use for the X axis and Y axis, then pick a chart type.',
      'Click Generate Charts. The builder creates a React page with live Chart.js components.',
      'Navigate to the resulting project link to see the interactive charts.',
    ],
    tips: [
      'Numeric columns work best on the Y axis; category or date columns work well on the X axis.',
      'You can generate multiple chart pages for the same dataset with different column combinations.',
      'Charts pages are also listed in the Projects tab for easy access.',
    ],
  },
  {
    id: 5,
    icon: '📁',
    tab: 'Projects',
    title: 'Browse All Your Projects',
    color: 'zinc',
    intro:
      'The Projects tab is your central library. Every notebook, tutorial, and charts page you have generated is listed here with direct links.',
    instructions: [
      'Click the Projects tab on the Administrator Dashboard.',
      'The list shows all projects grouped by name, with links to notebooks, tutorials, and chart pages.',
      'Click any link to open that artifact in a new tab.',
      'Use the delete button to remove a project and all its associated files.',
    ],
    tips: [
      'Projects are stored in the app/ipynb/ directory on the server.',
      'Deleting a project removes the CSV, the notebook, the tutorial page, and any charts pages.',
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; badge: string; num: string; dot: string; tip: string }> = {
  blue: {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    num: 'bg-blue-600 text-white',
    dot: 'bg-blue-400',
    tip: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
  },
  green: {
    border: 'border-green-200 dark:border-green-800',
    bg: 'bg-green-50 dark:bg-green-900/20',
    badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    num: 'bg-green-600 text-white',
    dot: 'bg-green-400',
    tip: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  },
  purple: {
    border: 'border-purple-200 dark:border-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
    num: 'bg-purple-600 text-white',
    dot: 'bg-purple-400',
    tip: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300',
  },
  orange: {
    border: 'border-orange-200 dark:border-orange-800',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
    num: 'bg-orange-500 text-white',
    dot: 'bg-orange-400',
    tip: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300',
  },
  zinc: {
    border: 'border-zinc-200 dark:border-zinc-700',
    bg: 'bg-zinc-50 dark:bg-zinc-800/40',
    badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
    num: 'bg-zinc-600 text-white',
    dot: 'bg-zinc-400',
    tip: 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300',
  },
};

export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <div className="max-w-4xl mx-auto py-12 px-6">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/administrator"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-6 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            How to Use Notebook Studio
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Notebook Studio turns a raw CSV file into cleaned data, a Jupyter notebook, an educational
            tutorial, and interactive charts — all without leaving your browser.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-10 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{s.tab}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Follow the steps below in order for the smoothest workflow. Each step builds on the previous one.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => {
            const c = colorMap[step.color];
            return (
              <div
                key={step.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl border ${c.border} shadow-sm overflow-hidden`}
              >
                {/* Step header */}
                <div className={`${c.bg} px-6 py-4 flex items-center gap-4 border-b ${c.border}`}>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${c.num}`}>
                    {step.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{step.icon}</span>
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {step.title}
                      </h2>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
                        {step.tab} tab
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {step.intro}
                  </p>

                  {/* Instructions */}
                  <ol className="space-y-3">
                    {step.instructions.map((text, i) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Tips */}
                  <div className={`rounded-lg border p-4 space-y-2 ${c.tip}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">Tips</p>
                    {step.tips.map((tip, i) => (
                      <p key={i} className="text-xs leading-relaxed">
                        {tip}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Heart Analysis callout */}
        <div className="mt-8">
          <Link
            href="/heart-analysis"
            className="flex items-center gap-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-5 hover:shadow-md transition-shadow group"
          >
            <span className="text-3xl">❤️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-800 dark:text-red-300">Heart Disease Analysis — Bonus Tool</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-0.5">
                A dedicated analysis page: upload a heart-disease CSV, choose a field, and instantly get
                distribution plots, pie charts, violin plots, heatmaps, pair plots, and joint plots.
              </p>
            </div>
            <span className="text-red-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* CSV Upload shortcut */}
        <div className="mt-4">
          <Link
            href="/admin"
            className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-6 py-5 hover:shadow-md transition-shadow group"
          >
            <span className="text-3xl">🧹</span>
            <div className="flex-1">
              <p className="font-semibold text-blue-800 dark:text-blue-300">CSV Data Cleaning Studio — Quick Upload</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                Drag and drop a CSV to immediately generate a data-cleaning Jupyter notebook with a
                single click — no tab navigation required.
              </p>
            </div>
            <span className="text-blue-400 text-xl group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/administrator"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow-sm transition-colors text-sm"
          >
            Open the Dashboard
            <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
