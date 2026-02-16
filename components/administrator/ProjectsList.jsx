'use client';

import { useState, useEffect } from 'react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/list-projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (folderName) => {
    if (!confirm(`Are you sure you want to delete the project "${folderName}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/delete-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName })
      });

      if (!response.ok) throw new Error('Failed to delete project');

      // Refresh the list
      fetchProjects();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-sm text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Generated Projects
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          View and manage all generated tutorials and charts dashboards.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-300 dark:border-zinc-700 p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
            No projects yet
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Use the Tutorial Builder or Charts Builder to create your first project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div
              key={project.name}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {project.name}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.hasTutorial && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        📚 Tutorial
                      </span>
                    )}
                    {project.hasCharts && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        📊 Charts
                      </span>
                    )}
                    {project.hasNotebook && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        📓 Notebook
                      </span>
                    )}
                    {project.hasCsvs && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        📄 CSVs
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.hasTutorial && (
                      <a
                        href={`/ipynb/${project.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        View Tutorial
                      </a>
                    )}

                    {project.hasCharts && (
                      <a
                        href={`/ipynb/${project.name}/charts`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Charts
                      </a>
                    )}

                    <button
                      onClick={() => deleteProject(project.name)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Created: {new Date(project.created).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <strong>💡 Tip:</strong> Each project can have a tutorial walkthrough and/or a charts dashboard. Use the Tutorial Builder and Charts Builder tabs to generate them.
        </p>
      </div>
    </div>
  );
}
