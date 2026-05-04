'use client';

import { Bar, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement
);

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="mb-8">
          <a href="/administrator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Back to Administrator Dashboard
          </a>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Heart Disease EDA — Chart.js Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Interactive Chart.js visualizations · §2 Distplot · §3 Pie · §4 Heatmap · §5 Box/Violin · §6 Joint Scatter · §7 Pair Plot
          </p>
          <a href="/ipynb/fak_job_1" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">
            View Tutorial Walkthrough →
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Missingness */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Missing Data Analysis</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Percentage of null / empty values per column</p>
        <div className="h-80">
          <Bar data={{ labels: ["location","department","salary_range","company_profile","description","requirements","benefits","telecommuting","has_company_logo","has_questions","employment_type","required_experience","required_education","industry","function","fraudulent"], datasets: [{ label: 'Missing (%)', data: ["1.87","13.43","11.19","59.50","80.84","21.86","1.08","0.77","1.17","1.57","2.15","2.49","2.81","3.63","4.70","7.49"], backgroundColor: 'rgba(239,68,68,0.6)', borderColor: 'rgba(239,68,68,1)', borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } } } }} />
        </div>
      </div>
      {/* job_id Histogram */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">job_id Distribution</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Frequency histogram — 10 bins</p>
        <div className="h-80">
          <Bar data={{ labels: ["895.0","2682.9","4470.8","6258.7","8046.6","9834.5","11622.4","13410.3","15198.2","16986.0"], datasets: [{ label: 'Frequency', data: [1788,1788,1788,1788,1788,1788,1788,1788,1788,1788], backgroundColor: 'rgba(59,130,246,0.6)', borderColor: 'rgba(59,130,246,1)', borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } } } }} />
        </div>
      </div>
      {/* §2 job_id Distplot */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§2 Univariate Distribution — job_id</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Histogram (bars) + KDE density estimate (line) · Range: 1.0–17880.0 · Mean: 8940.5</p>
        <div className="h-80">
          <Bar
            data={{
              labels: ["448.0","1341.9","2235.9","3129.8","4023.8","4917.7","5811.7","6705.6","7599.6","8493.5","9387.5","10281.4","11175.4","12069.3","12963.3","13857.2","14751.2","15645.1","16539.1","17433.0"],
              datasets: [
                { type: 'bar', label: 'Frequency', data: [894,894,894,894,894,894,894,894,894,894,894,894,894,894,894,894,894,894,894,894], backgroundColor: 'rgba(99,102,241,0.45)', borderColor: 'rgba(99,102,241,0.8)', borderWidth: 1, yAxisID: 'y' },
                { type: 'line', label: 'KDE (density)', data: [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05], borderColor: 'rgba(245,158,11,1)', borderWidth: 2.5, pointRadius: 0, tension: 0.4, fill: false, yAxisID: 'y2' }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Count' }, position: 'left' },
                y2: { beginAtZero: true, title: { display: true, text: 'Density' }, position: 'right', grid: { drawOnChartArea: false } }
              }
            }}
          />
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
