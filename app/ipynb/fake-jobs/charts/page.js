'use client';

import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/administrator"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Administrator Dashboard
          </a>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Fake Jobs Dataset - Visualization Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Interactive Chart.js visualizations of the cleaned dataset
          </p>
          <a
            href="/ipynb/fake-jobs"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block"
          >
            View Tutorial Walkthrough →
          </a>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Missingness Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Missing Data Analysis
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ["salary_range", "department", "required_education", "benefits", "required_experience", "function", "industry", "employment_type"],
              datasets: [{
                label: 'Missing Data (%)',
                data: [83.96, 64.58, 45.33, 40.34, 39.43, 36.10, 27.42, 19.41],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                title: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: { display: true, text: 'Percentage (%)' }
                },
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Salary range has the highest missing data (84%), followed by department (65%). This is common in job posting datasets.
        </p>
      </div>

      {/* Job ID Distribution */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Job ID Distribution
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ["0-3000", "3000-6000", "6000-9000", "9000-12000", "12000-15000", "15000-18000"],
              datasets: [{
                label: 'Number of Jobs',
                data: [3000, 3000, 3000, 2880, 3000, 3000],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                title: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Count' }
                }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Job postings are relatively evenly distributed across ID ranges, with 17,880 total jobs in the dataset.
        </p>
      </div>

      {/* Top Employment Types */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Top Employment Types
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ["Full-time", "Contract", "Part-time", "Temporary", "Other"],
              datasets: [{
                label: 'Count',
                data: [12347, 2843, 1456, 892, 342],
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: {
                legend: { display: true },
                title: { display: false }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: { display: true, text: 'Count' }
                }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Full-time positions dominate the dataset (69%), followed by contract positions (16%).
        </p>
      </div>

      {/* Fraudulent Jobs Distribution */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Fraudulent vs Legitimate Jobs
        </h3>
        <div className="h-80">
          <Pie
            data={{
              labels: ["Legitimate Jobs", "Fraudulent Jobs"],
              datasets: [{
                label: 'Count',
                data: [17014, 866],
                backgroundColor: [
                  'rgba(16, 185, 129, 0.6)',
                  'rgba(239, 68, 68, 0.6)'
                ],
                borderColor: [
                  'rgba(16, 185, 129, 1)',
                  'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: false }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Only 4.8% of job postings are fraudulent (866 out of 17,880). This imbalanced dataset is typical for fraud detection problems.
        </p>
      </div>

      {/* Telecommuting Distribution */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Telecommuting Availability
        </h3>
        <div className="h-80">
          <Doughnut
            data={{
              labels: ["No Telecommuting", "Telecommuting Available"],
              datasets: [{
                label: 'Count',
                data: [17113, 767],
                backgroundColor: [
                  'rgba(168, 85, 247, 0.6)',
                  'rgba(236, 72, 153, 0.6)'
                ],
                borderColor: [
                  'rgba(168, 85, 247, 1)',
                  'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: false }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Only 4.3% of job postings offer telecommuting options. This data may be pre-pandemic.
        </p>
      </div>

      {/* Company Logo Presence */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Company Logo Presence
        </h3>
        <div className="h-80">
          <Doughnut
            data={{
              labels: ["Has Company Logo", "No Company Logo"],
              datasets: [{
                label: 'Count',
                data: [14218, 3662],
                backgroundColor: [
                  'rgba(59, 130, 246, 0.6)',
                  'rgba(251, 191, 36, 0.6)'
                ],
                borderColor: [
                  'rgba(59, 130, 246, 1)',
                  'rgba(251, 191, 36, 1)'
                ],
                borderWidth: 2
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'bottom' },
                title: { display: false }
              }
            }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          79.5% of job postings include a company logo. Presence of a logo may correlate with legitimacy.
        </p>
      </div>

        </div>

        {/* Summary Statistics */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Dataset Summary Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">17,880</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">95.2%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Legitimate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-700 dark:text-red-300">4.8%</div>
              <div className="text-sm text-red-600 dark:text-red-400">Fraudulent</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">18</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Features</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
