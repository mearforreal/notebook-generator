'use client';

import { useState, useCallback } from 'react';
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
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement
);

// ── CSV helpers ───────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ''; });
    return row;
  });
  return { headers, rows };
}

function getNumericColumns(headers, rows) {
  return headers.filter(h => {
    const sample = rows.slice(0, 20).map(r => r[h]).filter(v => v !== '');
    return sample.length > 0 && sample.every(v => !isNaN(Number(v)));
  });
}

function colValues(rows, col, asNumber = true) {
  return rows.map(r => r[col]).filter(v => v !== '').map(v => asNumber ? Number(v) : v);
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

function stdDev(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length);
}

function histogram(values, bins = 20) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  const labels = Array.from({ length: bins }, (_, i) =>
    (min + (i + 0.5) * width).toFixed(2)
  );
  values.forEach(v => {
    let idx = Math.floor((v - min) / width);
    if (idx === bins) idx = bins - 1;
    counts[idx]++;
  });
  return { labels, counts, min, max, width };
}

function gaussianKDE(values, evalPoints) {
  const n = values.length;
  const bw = 1.06 * stdDev(values) * Math.pow(n, -0.2) || 0.1;
  return evalPoints.map(x => {
    const sum = values.reduce((acc, xi) => {
      const z = (x - xi) / bw;
      return acc + Math.exp(-0.5 * z * z);
    }, 0);
    return sum / (n * bw * Math.sqrt(2 * Math.PI));
  });
}

function quartiles(sorted) {
  const n = sorted.length;
  return {
    min: sorted[0],
    q1: sorted[Math.floor(n * 0.25)],
    median: sorted[Math.floor(n * 0.5)],
    q3: sorted[Math.floor(n * 0.75)],
    max: sorted[n - 1],
  };
}

function pearsonCorr(a, b) {
  const ma = mean(a), mb = mean(b);
  const num = a.reduce((acc, ai, i) => acc + (ai - ma) * (b[i] - mb), 0);
  const den = Math.sqrt(
    a.reduce((acc, ai) => acc + (ai - ma) ** 2, 0) *
    b.reduce((acc, bi) => acc + (bi - mb) ** 2, 0)
  );
  return den === 0 ? 0 : num / den;
}

function linearRegression(x, y) {
  const mx = mean(x), my = mean(y);
  const num = x.reduce((acc, xi, i) => acc + (xi - mx) * (y[i] - my), 0);
  const den = x.reduce((acc, xi) => acc + (xi - mx) ** 2, 0);
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: my - slope * mx };
}

const PALETTE = [
  '#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6',
  '#06b6d4','#f97316','#ec4899','#84cc16','#14b8a6',
  '#a78bfa','#fb923c',
];

// ── Chart components ──────────────────────────────────────────────────────────

function DistplotChart({ values, field }) {
  const { labels, counts } = histogram(values, 20);
  const kde = gaussianKDE(values, labels.map(Number));
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Frequency',
            data: counts,
            backgroundColor: 'rgba(99,102,241,0.45)',
            borderColor: 'rgba(99,102,241,0.8)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'KDE (density)',
            data: kde,
            borderColor: '#f59e0b',
            borderWidth: 2.5,
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            yAxisID: 'y2',
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${field} — Distribution Plot (Histogram + KDE)` },
          legend: { position: 'top' },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Count' }, position: 'left' },
          y2: { beginAtZero: true, title: { display: true, text: 'Density' }, position: 'right', grid: { drawOnChartArea: false } },
        },
      }}
    />
  );
}

function PieChart({ values, field, isNumeric }) {
  let labels, counts;
  if (isNumeric) {
    const nums = values.map(Number);
    const { labels: l, counts: c } = histogram(nums, 7);
    labels = l; counts = c;
  } else {
    const freq = {};
    values.forEach(v => { freq[String(v)] = (freq[String(v)] || 0) + 1; });
    labels = Object.keys(freq);
    counts = Object.values(freq);
  }
  return (
    <Pie
      data={{
        labels,
        datasets: [{
          data: counts,
          backgroundColor: PALETTE.slice(0, labels.length),
          borderColor: '#fff',
          borderWidth: 2,
        }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${field} — Pie Chart` },
          legend: { position: 'right' },
        },
      }}
    />
  );
}

function ViolinChart({ values, field }) {
  const nums = [...values.map(Number)].sort((a, b) => a - b);
  const { labels, counts } = histogram(nums, 18);
  const q = quartiles(nums);
  const maxCount = Math.max(...counts);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Bar
          data={{
            labels,
            datasets: [{
              label: 'Frequency',
              data: counts,
              backgroundColor: counts.map((_, i) => {
                const val = Number(labels[i]);
                if (val >= q.q1 && val <= q.q3) return 'rgba(139,92,246,0.7)';
                return 'rgba(139,92,246,0.25)';
              }),
              borderColor: 'rgba(139,92,246,0.9)',
              borderWidth: 1,
            }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: { display: true, text: `${field} — Violin Plot (IQR highlighted)` },
              legend: { display: false },
            },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } } },
          }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        {[
          { label: 'Min', value: q.min },
          { label: 'Q1', value: q.q1 },
          { label: 'Median', value: q.median },
          { label: 'Q3', value: q.q3 },
          { label: 'Max', value: q.max },
          { label: 'Mean', value: mean(nums) },
          { label: 'Std', value: stdDev(nums) },
        ].map(s => (
          <div key={s.label} className="bg-purple-50 dark:bg-purple-900/20 rounded px-3 py-1.5 text-center">
            <div className="text-purple-600 dark:text-purple-400 font-semibold">{s.value.toFixed(2)}</div>
            <div className="text-zinc-500 dark:text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapChart({ rows, numericCols }) {
  const cols = numericCols.slice(0, 13);
  const cache = {};
  const getVals = (c) => {
    if (!cache[c]) cache[c] = colValues(rows, c);
    return cache[c];
  };

  const matrix = cols.map(c1 => cols.map(c2 => {
    const a = getVals(c1), b = getVals(c2);
    const n = Math.min(a.length, b.length);
    return pearsonCorr(a.slice(0, n), b.slice(0, n));
  }));

  const cellColor = (v) => {
    if (v >= 0) {
      const t = v;
      return `rgb(${Math.round(255)},${Math.round(255 * (1 - t))},${Math.round(255 * (1 - t))})`;
    }
    const t = -v;
    return `rgb(${Math.round(255 * (1 - t))},${Math.round(255 * (1 - t))},${Math.round(255)})`;
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Pearson Correlation Heatmap — all numeric columns
      </h3>
      <div className="overflow-auto">
        <table className="border-collapse text-xs mx-auto">
          <thead>
            <tr>
              <th className="p-1" />
              {cols.map(c => (
                <th
                  key={c}
                  className="p-1 text-zinc-700 dark:text-zinc-300 font-medium text-center"
                  style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: 80 }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((c1, i) => (
              <tr key={c1}>
                <td className="p-1 font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap pr-3">{c1}</td>
                {cols.map((_, j) => {
                  const v = matrix[i][j];
                  return (
                    <td
                      key={j}
                      className="w-10 h-10 text-center font-semibold"
                      style={{
                        backgroundColor: cellColor(v),
                        color: Math.abs(v) > 0.55 ? 'white' : '#333',
                        minWidth: 40,
                      }}
                      title={`${c1} × ${cols[j]}: ${v.toFixed(3)}`}
                    >
                      {v.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="w-4 h-4 rounded" style={{ background: 'rgb(0,0,255)' }} />
        <span>−1 (negative)</span>
        <div className="w-4 h-4 rounded ml-2" style={{ background: 'rgb(255,255,255)', border: '1px solid #ccc' }} />
        <span>0 (none)</span>
        <div className="w-4 h-4 rounded ml-2" style={{ background: 'rgb(255,0,0)' }} />
        <span>+1 (positive)</span>
      </div>
    </div>
  );
}

function PairplotChart({ rows, numericCols, selectedField }) {
  const others = numericCols.filter(c => c !== selectedField).slice(0, 6);
  const xVals = colValues(rows, selectedField);

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        {selectedField} vs each other numeric column
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {others.map(other => {
          const yVals = colValues(rows, other);
          const n = Math.min(xVals.length, yVals.length);
          // Sample up to 300 points to keep rendering fast
          const step = Math.max(1, Math.floor(n / 300));
          const points = Array.from({ length: Math.ceil(n / step) }, (_, i) => ({
            x: xVals[i * step],
            y: yVals[i * step],
          }));
          return (
            <div key={other} className="h-52 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
              <Scatter
                data={{
                  datasets: [{
                    label: `${selectedField} vs ${other}`,
                    data: points,
                    backgroundColor: 'rgba(99,102,241,0.45)',
                    pointRadius: 3,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: { display: true, text: `vs ${other}`, font: { size: 11 } },
                    legend: { display: false },
                  },
                  scales: {
                    x: { title: { display: true, text: selectedField, font: { size: 10 } } },
                    y: { title: { display: true, text: other, font: { size: 10 } } },
                  },
                }}
              />
            </div>
          );
        })}
      </div>
      {others.length === 0 && (
        <p className="text-zinc-400 text-sm mt-4">No other numeric columns found for pair plot.</p>
      )}
    </div>
  );
}

function JointPlotChart({ rows, field1, field2 }) {
  const xVals = colValues(rows, field1);
  const yVals = colValues(rows, field2);
  const n = Math.min(xVals.length, yVals.length);
  const step = Math.max(1, Math.floor(n / 500));
  const points = Array.from({ length: Math.ceil(n / step) }, (_, i) => ({
    x: xVals[i * step],
    y: yVals[i * step],
  }));

  const { slope, intercept } = linearRegression(xVals.slice(0, n), yVals.slice(0, n));
  const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
  const regLine = [
    { x: xMin, y: slope * xMin + intercept },
    { x: xMax, y: slope * xMax + intercept },
  ];
  const r = pearsonCorr(xVals.slice(0, n), yVals.slice(0, n));

  return (
    <Scatter
      data={{
        datasets: [
          {
            label: 'Data points',
            data: points,
            backgroundColor: 'rgba(99,102,241,0.4)',
            pointRadius: 4,
          },
          {
            label: `OLS regression (r = ${r.toFixed(3)})`,
            data: regLine,
            type: 'line',
            borderColor: '#ef4444',
            borderWidth: 2.5,
            pointRadius: 0,
            showLine: true,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${field1} vs ${field2} — Joint Plot` },
          legend: { position: 'top' },
        },
        scales: {
          x: { title: { display: true, text: field1 } },
          y: { title: { display: true, text: field2 } },
        },
      }}
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const CHART_TYPES = [
  { value: 'distplot',  label: 'Distplot (Histogram + KDE)',  icon: '📊' },
  { value: 'pie',       label: 'Pie Chart',                   icon: '🥧' },
  { value: 'violin',    label: 'Violin Plot',                 icon: '🎻' },
  { value: 'heatmap',   label: 'Correlation Heatmap',         icon: '🔥' },
  { value: 'pairplot',  label: 'Pair Plot',                   icon: '🔵' },
  { value: 'jointplot', label: 'Joint Plot (Scatter + OLS)',  icon: '📐' },
];

const NUMERIC_ONLY = new Set(['distplot', 'violin', 'pairplot', 'jointplot']);

export default function HeartAnalysisPage() {
  const [csvData, setCsvData]         = useState(null);
  const [columns, setColumns]         = useState([]);
  const [numericCols, setNumericCols] = useState([]);
  const [selectedField, setSelectedField]   = useState('');
  const [selectedField2, setSelectedField2] = useState('');
  const [chartType, setChartType]     = useState('distplot');
  const [dragOver, setDragOver]       = useState(false);
  const [fileName, setFileName]       = useState('');

  const loadFile = useCallback((file) => {
    if (!file || !file.name.endsWith('.csv')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const { headers, rows } = parseCSV(e.target.result);
      const numeric = getNumericColumns(headers, rows);
      setColumns(headers);
      setNumericCols(numeric);
      setCsvData(rows);
      setSelectedField(numeric[0] || headers[0] || '');
      setSelectedField2(numeric[1] || headers[1] || '');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files[0]);
  }, [loadFile]);

  const needsTwoFields = chartType === 'jointplot';
  const needsField     = chartType !== 'heatmap';
  const fieldOptions   = NUMERIC_ONLY.has(chartType) ? numericCols : columns;

  const renderChart = () => {
    if (!csvData || (needsField && !selectedField)) return null;
    const isNumeric = numericCols.includes(selectedField);
    const vals = colValues(csvData, selectedField, isNumeric);

    switch (chartType) {
      case 'distplot':
        return <DistplotChart values={vals} field={selectedField} />;
      case 'pie':
        return <PieChart values={vals} field={selectedField} isNumeric={isNumeric} />;
      case 'violin':
        return <ViolinChart values={vals} field={selectedField} />;
      case 'heatmap':
        return <HeatmapChart rows={csvData} numericCols={numericCols} />;
      case 'pairplot':
        return <PairplotChart rows={csvData} numericCols={numericCols} selectedField={selectedField} />;
      case 'jointplot':
        return <JointPlotChart rows={csvData} field1={selectedField} field2={selectedField2} />;
      default:
        return null;
    }
  };

  const chartMeta = CHART_TYPES.find(ct => ct.value === chartType);
  const isPairOrHeatmap = chartType === 'pairplot' || chartType === 'heatmap';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      <div className="max-w-7xl mx-auto py-8 px-6">

        {/* Header */}
        <div className="mb-8">
          <a href="/administrator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </a>
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            ❤️ Heart Disease Analysis
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Upload a CSV, choose a column and chart type — visualize instantly with Chart.js.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── Controls Panel ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Upload */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">1. Upload CSV</h2>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 scale-105'
                    : csvData
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/10'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('ha-csv-input').click()}
              >
                <div className="text-5xl mb-3">{csvData ? '✅' : '❤️'}</div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {csvData ? fileName : 'Drop CSV here or click to browse'}
                </p>
                {csvData && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {csvData.length} rows · {columns.length} columns
                  </p>
                )}
                <input
                  id="ha-csv-input"
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => loadFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Options */}
            {csvData && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Chart Options</h2>

                {/* Chart type dropdown */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Chart Type
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {CHART_TYPES.map(ct => (
                      <option key={ct.value} value={ct.value}>
                        {ct.icon} {ct.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field dropdown */}
                {needsField && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {needsTwoFields ? 'X Field' : 'Field'}
                      {NUMERIC_ONLY.has(chartType) && (
                        <span className="ml-2 text-xs text-zinc-400">(numeric only)</span>
                      )}
                    </label>
                    <select
                      value={selectedField}
                      onChange={(e) => setSelectedField(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {fieldOptions.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Second field (joint plot only) */}
                {needsTwoFields && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Y Field
                    </label>
                    <select
                      value={selectedField2}
                      onChange={(e) => setSelectedField2(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {numericCols.filter(c => c !== selectedField).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Column badges */}
                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Columns detected:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {columns.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          if (fieldOptions.includes(c)) setSelectedField(c);
                        }}
                        className={`px-2 py-0.5 rounded text-xs transition-colors ${
                          numericCols.includes(c)
                            ? selectedField === c
                              ? 'bg-red-500 text-white'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 cursor-pointer'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">
                    <span className="inline-block w-3 h-3 rounded bg-blue-200 mr-1 align-middle" />
                    numeric &nbsp;
                    <span className="inline-block w-3 h-3 rounded bg-zinc-200 mr-1 align-middle" />
                    categorical
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Chart Panel ── */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              {!csvData ? (
                <div className="h-96 flex flex-col items-center justify-center text-zinc-400 gap-4">
                  <div className="text-7xl">📊</div>
                  <p className="text-lg">Upload a CSV file to begin analysis</p>
                  <p className="text-sm">Supports heart disease datasets and any tabular CSV</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">{chartMeta?.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {chartMeta?.label}
                        {needsField && selectedField ? ` — ${selectedField}` : ''}
                        {needsTwoFields && selectedField2 ? ` × ${selectedField2}` : ''}
                      </h2>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {csvData.length} rows · {numericCols.length} numeric columns
                      </p>
                    </div>
                  </div>
                  <div className={isPairOrHeatmap ? 'min-h-96' : 'h-96'}>
                    {renderChart()}
                  </div>
                </>
              )}
            </div>

            {/* Chart type quick-select */}
            {csvData && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2">
                {CHART_TYPES.map(ct => (
                  <button
                    key={ct.value}
                    onClick={() => setChartType(ct.value)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all ${
                      chartType === ct.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-red-300'
                    }`}
                  >
                    <span className="text-xl mb-1">{ct.icon}</span>
                    <span className="text-center leading-tight">
                      {ct.label.split('(')[0].trim()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
