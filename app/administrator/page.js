'use client';

import { useState } from 'react';
import ProjectsList from '@/components/administrator/ProjectsList';
import NotebookBuilder from '@/components/administrator/NotebookBuilder';
import TutorialBuilder from '@/components/administrator/TutorialBuilder';
import ChartsBuilder from '@/components/administrator/ChartsBuilder';
import NotebookRunner from '@/components/administrator/NotebookRunner';

export default function AdministratorDashboard() {
  const [activeTab, setActiveTab] = useState('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'notebook', label: 'Notebook Builder', icon: '📓' },
    { id: 'runner', label: 'Notebook Runner', icon: '▶️' },
    { id: 'tutorial', label: 'Tutorial Builder', icon: '📚' },
    { id: 'charts', label: 'Charts Builder', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Notebook Studio
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Administrator Dashboard — Automate data cleaning, generate tutorials, and visualize insights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'projects' && <ProjectsList />}
            {activeTab === 'notebook' && <NotebookBuilder />}
            {activeTab === 'runner'   && <NotebookRunner />}
            {activeTab === 'tutorial' && <TutorialBuilder />}
            {activeTab === 'charts' && <ChartsBuilder />}
          </div>
        </div>

        {/* Heart Analysis Quick Link */}
        <div className="mt-6">
          <a
            href="/heart-analysis"
            className="flex items-center gap-3 bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl px-6 py-4 hover:shadow-md transition-shadow"
          >
            <span className="text-3xl">❤️</span>
            <div>
              <div className="font-semibold text-red-800 dark:text-red-300">Heart Disease Analysis</div>
              <div className="text-sm text-red-600 dark:text-red-400">
                Upload CSV → select field → distplot, pie, violin, heatmap, pairplot, joint plot
              </div>
            </div>
            <span className="ml-auto text-red-400 text-xl">→</span>
          </a>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              📁 Projects
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              View all generated tutorials and charts with direct links to each project.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              📓 Notebook Builder
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Upload CSV files and generate custom Jupyter notebooks with selectable data cleaning steps.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              ▶️ Notebook Runner
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Execute notebooks on the server via Jupyter. Outputs — text, tables, and charts — display inline. No local Jupyter needed.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              📚 Tutorial Builder
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Transform notebooks into educational walkthroughs with code, outputs, and explanations.
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              📊 Charts Builder
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Generate interactive Chart.js visualizations from cleaned datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
