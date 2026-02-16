import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

function analyzeData(headers, rows) {
  const analysis = {
    missingness: {},
    numeric: {},
    categorical: {},
    binary: {}
  };

  headers.forEach(header => {
    const values = rows.map(row => row[header]);
    const nonEmptyValues = values.filter(v => v !== '' && v !== null && v !== undefined);

    // Missingness
    const missingCount = values.length - nonEmptyValues.length;
    if (missingCount > 0) {
      analysis.missingness[header] = {
        count: missingCount,
        percentage: (missingCount / values.length) * 100
      };
    }

    // Check if numeric
    const numericValues = nonEmptyValues
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (numericValues.length > nonEmptyValues.length * 0.8) {
      analysis.numeric[header] = numericValues;
    } else {
      // Categorical
      const uniqueValues = [...new Set(nonEmptyValues)];

      if (uniqueValues.length === 2) {
        // Binary
        const counts = {};
        nonEmptyValues.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
        });
        analysis.binary[header] = counts;
      } else if (uniqueValues.length <= 20) {
        // Categorical with reasonable unique values
        const counts = {};
        nonEmptyValues.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
        });
        analysis.categorical[header] = counts;
      }
    }
  });

  return analysis;
}

function generateChartsPage(folderName, analysis, selectedCharts) {
  let chartsContent = '';

  // Missingness Chart
  if (selectedCharts.missingness && Object.keys(analysis.missingness).length > 0) {
    const labels = Object.keys(analysis.missingness);
    const data = labels.map(label => analysis.missingness[label].percentage.toFixed(2));

    chartsContent += `
      {/* Missingness Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Missing Data Analysis
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Missing Data (%)',
                data: ${JSON.stringify(data)},
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
                }
              }
            }}
          />
        </div>
      </div>
`;
  }

  // Numeric Histograms
  if (selectedCharts.numeric_histogram && Object.keys(analysis.numeric).length > 0) {
    const numericColumns = Object.keys(analysis.numeric).slice(0, 4); // Limit to 4 charts

    numericColumns.forEach(column => {
      const values = analysis.numeric[column];
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = 10;
      const binSize = (max - min) / binCount;

      const bins = Array(binCount).fill(0);
      const labels = [];

      for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);

        values.forEach(v => {
          if (v >= binStart && (i === binCount - 1 ? v <= binEnd : v < binEnd)) {
            bins[i]++;
          }
        });
      }

      chartsContent += `
      {/* ${column} Histogram */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          ${column} Distribution
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Frequency',
                data: ${JSON.stringify(bins)},
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
      </div>
`;
    });
  }

  // Top Categories
  if (selectedCharts.top_categories && Object.keys(analysis.categorical).length > 0) {
    const categoricalColumns = Object.keys(analysis.categorical).slice(0, 4);

    categoricalColumns.forEach(column => {
      const counts = analysis.categorical[column];
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      const labels = sorted.map(([label]) => label);
      const data = sorted.map(([, count]) => count);

      chartsContent += `
      {/* ${column} Top Categories */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Top ${column} Categories
        </h3>
        <div className="h-80">
          <Bar
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Count',
                data: ${JSON.stringify(data)},
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
      </div>
`;
    });
  }

  // Binary Split
  if (selectedCharts.binary_split && Object.keys(analysis.binary).length > 0) {
    const binaryColumns = Object.keys(analysis.binary).slice(0, 4);

    binaryColumns.forEach(column => {
      const counts = analysis.binary[column];
      const labels = Object.keys(counts);
      const data = Object.values(counts);

      chartsContent += `
      {/* ${column} Binary Split */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          ${column} Distribution
        </h3>
        <div className="h-80">
          <Pie
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [{
                label: 'Count',
                data: ${JSON.stringify(data)},
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
      </div>
`;
    });
  }

  return `'use client';

import { Bar, Pie } from 'react-chartjs-2';
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
            Data Visualization Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Interactive Chart.js visualizations of the cleaned dataset
          </p>
          <a
            href="/ipynb/${folderName}"
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block"
          >
            View Tutorial Walkthrough →
          </a>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
${chartsContent}
        </div>
      </div>
    </div>
  );
}
`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cleanedCsvFile = formData.get('cleanedCsv');
    const folderName = formData.get('folderName');
    const chartsJson = formData.get('charts');

    // Validate inputs
    if (!cleanedCsvFile || !folderName || !chartsJson) {
      return NextResponse.json(
        { error: 'Missing required inputs' },
        { status: 400 }
      );
    }

    if (!cleanedCsvFile.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Parse charts selection
    const selectedCharts = JSON.parse(chartsJson);

    // Read and parse CSV
    const csvBuffer = Buffer.from(await cleanedCsvFile.arrayBuffer());
    const csvText = csvBuffer.toString();
    const { headers, rows } = parseCSV(csvText);

    // Analyze data
    const analysis = analyzeData(headers, rows);

    // Create folder structure
    const chartsDir = path.join(process.cwd(), 'app', 'ipynb', folderName, 'charts');
    await fs.mkdir(chartsDir, { recursive: true });

    // Save CSV file
    await fs.writeFile(path.join(chartsDir, 'data.csv'), csvBuffer);

    // Generate charts page
    const chartsPageContent = generateChartsPage(folderName, analysis, selectedCharts);
    const pageJsPath = path.join(chartsDir, 'page.js');
    await fs.writeFile(pageJsPath, chartsPageContent);

    return NextResponse.json({
      success: true,
      url: `/ipynb/${folderName}/charts`,
      message: 'Charts dashboard generated successfully'
    });
  } catch (error) {
    console.error('Error generating charts:', error);
    return NextResponse.json(
      { error: 'Failed to generate charts', details: error.message },
      { status: 500 }
    );
  }
}
