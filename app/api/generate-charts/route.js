import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((header, index) => { row[header] = values[index] ?? ''; });
    rows.push(row);
  }
  return { headers, rows };
}

// ─── Statistics Helpers ───────────────────────────────────────────────────────

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pearsonCorr(x, y) {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  let num = 0, dx2 = 0, dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

function linearRegression(x, y) {
  const n = x.length;
  const mx = mean(x), my = mean(y);
  let num = 0, denom = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    denom += (x[i] - mx) ** 2;
  }
  const slope = denom === 0 ? 0 : num / denom;
  const intercept = my - slope * mx;
  return { slope, intercept };
}

function boxStats(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)];
  const median = sorted[Math.floor(n * 0.5)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  const whiskerLow = sorted.find(v => v >= lower) ?? sorted[0];
  const whiskerHigh = [...sorted].reverse().find(v => v <= upper) ?? sorted[n - 1];
  return { min: sorted[0], max: sorted[n - 1], q1, median, q3, whiskerLow, whiskerHigh, mean: mean(arr) };
}

function computeHistBins(values, binCount = 20) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / binCount || 1;
  const bins = Array(binCount).fill(0);
  const labels = [];
  for (let i = 0; i < binCount; i++) {
    const s = min + i * binSize;
    const e = s + binSize;
    labels.push(((s + e) / 2).toFixed(1));
    values.forEach(v => {
      if (v >= s && (i === binCount - 1 ? v <= e : v < e)) bins[i]++;
    });
  }
  return { bins, labels };
}

// ─── Data Analysis ────────────────────────────────────────────────────────────

function analyzeData(headers, rows) {
  const analysis = {
    missingness: {},
    numeric: {},
    categorical: {},
    binary: {}
  };

  headers.forEach(header => {
    const values = rows.map(row => row[header]);
    const nonEmpty = values.filter(v => v !== '' && v !== null && v !== undefined);
    const missingCount = values.length - nonEmpty.length;
    if (missingCount > 0) {
      analysis.missingness[header] = {
        count: missingCount,
        percentage: (missingCount / values.length) * 100
      };
    }
    const numericValues = nonEmpty.map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (numericValues.length > nonEmpty.length * 0.8) {
      analysis.numeric[header] = numericValues;
    } else {
      const unique = [...new Set(nonEmpty)];
      const counts = {};
      nonEmpty.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
      if (unique.length === 2) {
        analysis.binary[header] = counts;
      } else if (unique.length <= 20) {
        analysis.categorical[header] = counts;
      }
    }
  });

  return analysis;
}

// ─── Chart Generators ─────────────────────────────────────────────────────────

function genMissingness(analysis) {
  if (Object.keys(analysis.missingness).length === 0) return '';
  const labels = Object.keys(analysis.missingness);
  const data = labels.map(l => analysis.missingness[l].percentage.toFixed(2));
  return `
      {/* Missingness */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Missing Data Analysis</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Percentage of null / empty values per column</p>
        <div className="h-80">
          <Bar data={{ labels: ${JSON.stringify(labels)}, datasets: [{ label: 'Missing (%)', data: ${JSON.stringify(data)}, backgroundColor: 'rgba(239,68,68,0.6)', borderColor: 'rgba(239,68,68,1)', borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Percentage (%)' } } } }} />
        </div>
      </div>`;
}

function genNumericHistogram(analysis) {
  const cols = Object.keys(analysis.numeric).slice(0, 4);
  return cols.map(col => {
    const { bins, labels } = computeHistBins(analysis.numeric[col], 10);
    return `
      {/* ${col} Histogram */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">${col} Distribution</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Frequency histogram — 10 bins</p>
        <div className="h-80">
          <Bar data={{ labels: ${JSON.stringify(labels)}, datasets: [{ label: 'Frequency', data: ${JSON.stringify(bins)}, backgroundColor: 'rgba(59,130,246,0.6)', borderColor: 'rgba(59,130,246,1)', borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Count' } } } }} />
        </div>
      </div>`;
  }).join('');
}

function genTopCategories(analysis) {
  const cols = Object.keys(analysis.categorical).slice(0, 4);
  return cols.map(col => {
    const sorted = Object.entries(analysis.categorical[col]).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const labels = sorted.map(([l]) => l);
    const data = sorted.map(([, c]) => c);
    return `
      {/* ${col} Top Categories */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Top ${col} Categories</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Count per category value</p>
        <div className="h-80">
          <Bar data={{ labels: ${JSON.stringify(labels)}, datasets: [{ label: 'Count', data: ${JSON.stringify(data)}, backgroundColor: 'rgba(16,185,129,0.6)', borderColor: 'rgba(16,185,129,1)', borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', scales: { x: { beginAtZero: true, title: { display: true, text: 'Count' } } } }} />
        </div>
      </div>`;
  }).join('');
}

function genBinarySplit(analysis) {
  const cols = Object.keys(analysis.binary).slice(0, 4);
  return cols.map(col => {
    const labels = Object.keys(analysis.binary[col]);
    const data = Object.values(analysis.binary[col]);
    return `
      {/* ${col} Binary Split */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">${col} Distribution</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Proportion of each binary value</p>
        <div className="h-80">
          <Pie data={{ labels: ${JSON.stringify(labels)}, datasets: [{ data: ${JSON.stringify(data)}, backgroundColor: ['rgba(168,85,247,0.6)','rgba(236,72,153,0.6)'], borderColor: ['rgba(168,85,247,1)','rgba(236,72,153,1)'], borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>`;
  }).join('');
}

// EDA §2 — Univariate Distribution (distplot-style: histogram + KDE approximation)
function genDistributionHistogram(analysis) {
  const cols = Object.keys(analysis.numeric);
  return cols.map(col => {
    const values = analysis.numeric[col];
    const { bins, labels } = computeHistBins(values, 20);
    // Gaussian KDE approximation: smooth with a simple moving average
    const total = bins.reduce((a, b) => a + b, 0);
    const density = bins.map(b => parseFloat((b / total).toFixed(4)));
    // 3-point moving average for KDE-like smoothing
    const kde = density.map((v, i) => {
      if (i === 0) return parseFloat(((density[0] + density[1]) / 2).toFixed(4));
      if (i === density.length - 1) return parseFloat(((density[i - 1] + density[i]) / 2).toFixed(4));
      return parseFloat(((density[i - 1] + density[i] + density[i + 1]) / 3).toFixed(4));
    });
    const minV = Math.min(...values).toFixed(1);
    const maxV = Math.max(...values).toFixed(1);
    const meanV = mean(values).toFixed(1);
    return `
      {/* §2 ${col} Distplot */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§2 Univariate Distribution — ${col}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Histogram (bars) + KDE density estimate (line) · Range: ${minV}–${maxV} · Mean: ${meanV}</p>
        <div className="h-80">
          <Bar
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [
                { type: 'bar', label: 'Frequency', data: ${JSON.stringify(bins)}, backgroundColor: 'rgba(99,102,241,0.45)', borderColor: 'rgba(99,102,241,0.8)', borderWidth: 1, yAxisID: 'y' },
                { type: 'line', label: 'KDE (density)', data: ${JSON.stringify(kde)}, borderColor: 'rgba(245,158,11,1)', borderWidth: 2.5, pointRadius: 0, tension: 0.4, fill: false, yAxisID: 'y2' }
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
      </div>`;
  }).join('');
}

// EDA §3 — Categorical Proportionality (pie charts for all categorical + binary columns)
function genPieCategorical(analysis) {
  const PALETTE = [
    'rgba(59,130,246,0.7)','rgba(16,185,129,0.7)','rgba(245,158,11,0.7)',
    'rgba(239,68,68,0.7)','rgba(168,85,247,0.7)','rgba(236,72,153,0.7)',
    'rgba(20,184,166,0.7)','rgba(234,179,8,0.7)'
  ];
  const allCols = [
    ...Object.keys(analysis.categorical),
    ...Object.keys(analysis.binary)
  ];
  return allCols.map(col => {
    const counts = analysis.categorical[col] || analysis.binary[col];
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(([l]) => l);
    const data = sorted.map(([, c]) => c);
    const total = data.reduce((a, b) => a + b, 0);
    const pcts = data.map(d => ((d / total) * 100).toFixed(1));
    const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);
    return `
      {/* §3 ${col} Pie */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§3 Categorical Proportions — ${col}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">n = ${total} · ${labels.map((l, i) => l + ': ' + pcts[i] + '%').join(' · ')}</p>
        <div className="h-72">
          <Pie
            data={{ labels: ${JSON.stringify(labels)}, datasets: [{ data: ${JSON.stringify(data)}, backgroundColor: ${JSON.stringify(colors)}, borderWidth: 2 }] }}
            options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (ctx) => ctx.label + ': ' + ctx.raw + ' (' + (ctx.raw / ${total} * 100).toFixed(1) + '%)' } } } }}
          />
        </div>
      </div>`;
  }).join('');
}

// EDA §4 — Correlation Heatmap
function genCorrelationHeatmap(analysis) {
  const cols = Object.keys(analysis.numeric);
  if (cols.length < 2) return '';
  // Build correlation matrix
  const matrix = cols.map(c1 => cols.map(c2 => {
    const v = pearsonCorr(analysis.numeric[c1], analysis.numeric[c2]);
    return parseFloat(v.toFixed(2));
  }));

  // Render as an HTML table (CSS-coloured cells) — no extra Chart.js plugin needed
  const cellSize = Math.max(48, Math.floor(540 / cols.length));
  const rows = matrix.map((row, ri) => {
    const cells = row.map((val, ci) => {
      // colour: positive → blue, negative → red, zero → white
      const abs = Math.abs(val);
      let bg, fg;
      if (val > 0) {
        const alpha = (abs * 0.8 + 0.1).toFixed(2);
        bg = `rgba(59,130,246,${alpha})`;
        fg = abs > 0.5 ? '#fff' : '#1e3a5f';
      } else if (val < 0) {
        const alpha = (abs * 0.8 + 0.1).toFixed(2);
        bg = `rgba(239,68,68,${alpha})`;
        fg = abs > 0.5 ? '#fff' : '#7f1d1d';
      } else {
        bg = '#f4f4f5'; fg = '#18181b';
      }
      return `<td key={${ci}} style={{width:${cellSize},height:${cellSize},backgroundColor:'${bg}',color:'${fg}',textAlign:'center',fontSize:'0.72rem',fontWeight:600,border:'1px solid #e4e4e7',verticalAlign:'middle'}}>${val.toFixed(2)}</td>`;
    }).join('');
    return `<tr key={${ri}}><td style={{padding:'0 8px',fontSize:'0.72rem',fontWeight:700,whiteSpace:'nowrap',color:'#52525b'}}>${cols[ri]}</td>${cells}</tr>`;
  }).join('');

  const headerCells = cols.map((c, i) => `<th key={${i}} style={{width:${cellSize},fontSize:'0.68rem',fontWeight:700,color:'#52525b',textAlign:'center',padding:'4px 2px',whiteSpace:'nowrap',overflow:'hidden',maxWidth:${cellSize},textOverflow:'ellipsis'}}>${c}</th>`).join('');

  return `
      {/* §4 Correlation Heatmap */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 lg:col-span-2">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§4 Correlation Matrix Heatmap</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Pearson r between numeric features · Blue = positive · Red = negative · Diagonal = 1.0</p>
        <div style={{overflowX:'auto'}}>
          <table style={{borderCollapse:'collapse'}}>
            <thead><tr><th></th>${headerCells}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
}

// EDA §5 — Violin/Box Plots (grouped by a binary/categorical target)
function genViolinBox(analysis, rows, headers) {
  const numericCols = Object.keys(analysis.numeric);
  const groupCols = [...Object.keys(analysis.binary), ...Object.keys(analysis.categorical)];
  if (numericCols.length === 0 || groupCols.length === 0) return '';

  // Use first binary/categorical column as grouping variable
  const groupCol = groupCols[0];
  const groups = Object.keys(
    analysis.binary[groupCol] || analysis.categorical[groupCol]
  );

  const COLORS = ['rgba(59,130,246,0.7)', 'rgba(239,68,68,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)'];

  return numericCols.slice(0, 4).map(col => {
    // Compute box stats per group
    const statsPerGroup = groups.map(g => {
      const vals = rows
        .filter(r => r[groupCol] === g && r[col] !== '')
        .map(r => parseFloat(r[col]))
        .filter(v => !isNaN(v));
      return { group: g, stats: vals.length > 0 ? boxStats(vals) : null, n: vals.length };
    });

    // Build a grouped bar chart with Q1, Median, Q3 as stacked segments approximating a box
    // We use a floating bar chart: [min, max] range + median marker
    const floatData = statsPerGroup.map(s => s.stats ? [s.stats.whiskerLow, s.stats.whiskerHigh] : [0, 0]);
    const medianData = statsPerGroup.map(s => s.stats ? s.stats.median : 0);
    const q1Data = statsPerGroup.map(s => s.stats ? s.stats.q1 : 0);
    const q3Data = statsPerGroup.map(s => s.stats ? s.stats.q3 : 0);
    const meanData = statsPerGroup.map(s => s.stats ? parseFloat(s.stats.mean.toFixed(2)) : 0);
    const labels = statsPerGroup.map(s => `${s.group} (n=${s.n})`);

    const summary = statsPerGroup.map(s => s.stats
      ? `${s.group}: median=${s.stats.median.toFixed(1)} Q1=${s.stats.q1.toFixed(1)} Q3=${s.stats.q3.toFixed(1)}`
      : `${s.group}: no data`
    ).join(' · ');

    return `
      {/* §5 ${col} Box by ${groupCol} */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§5 Box Plot — ${col} by ${groupCol}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">${summary}</p>
        <div className="h-80">
          <Bar
            data={{
              labels: ${JSON.stringify(labels)},
              datasets: [
                { label: 'IQR Range (Q1–Q3)', data: ${JSON.stringify(q1Data.map((q1, i) => [q1, q3Data[i]]))}, backgroundColor: ${JSON.stringify(COLORS.slice(0, groups.length))}, borderColor: ${JSON.stringify(COLORS.slice(0, groups.length).map(c => c.replace('0.7', '1')))}, borderWidth: 2 },
                { type: 'scatter', label: 'Median', data: ${JSON.stringify(labels.map((l, i) => ({ x: l, y: medianData[i] })))}, pointStyle: 'line', pointRadius: 12, pointBorderWidth: 3, borderColor: 'rgba(15,23,42,0.9)', backgroundColor: 'rgba(15,23,42,0.9)' },
                { type: 'scatter', label: 'Mean', data: ${JSON.stringify(labels.map((l, i) => ({ x: l, y: meanData[i] })))}, pointStyle: 'crossRot', pointRadius: 8, pointBorderWidth: 2.5, borderColor: 'rgba(245,158,11,1)', backgroundColor: 'rgba(245,158,11,1)' }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { title: { display: true, text: '${col}' } }
              }
            }}
          />
        </div>
      </div>`;
  }).join('');
}

// EDA §6 — Joint Plot (Scatter + OLS Regression)
function genJointScatter(analysis) {
  const cols = Object.keys(analysis.numeric);
  if (cols.length < 2) return '';

  // Pick up to 3 meaningful pairs
  const pairs = [];
  for (let i = 0; i < Math.min(cols.length, 4); i++) {
    for (let j = i + 1; j < Math.min(cols.length, 4); j++) {
      if (pairs.length < 3) pairs.push([cols[i], cols[j]]);
    }
  }

  return pairs.map(([cx, cy]) => {
    const xVals = analysis.numeric[cx];
    const yVals = analysis.numeric[cy];
    const n = Math.min(xVals.length, yVals.length);
    // Sample max 300 points for readability
    const step = Math.max(1, Math.floor(n / 300));
    const scatter = [];
    for (let i = 0; i < n; i += step) scatter.push({ x: xVals[i], y: yVals[i] });

    const { slope, intercept } = linearRegression(xVals.slice(0, n), yVals.slice(0, n));
    const r = pearsonCorr(xVals.slice(0, n), yVals.slice(0, n));
    const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
    const regLine = [
      { x: parseFloat(xMin.toFixed(2)), y: parseFloat((slope * xMin + intercept).toFixed(2)) },
      { x: parseFloat(xMax.toFixed(2)), y: parseFloat((slope * xMax + intercept).toFixed(2)) }
    ];

    return `
      {/* §6 Joint ${cx} vs ${cy} */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§6 Joint Plot — ${cx} vs ${cy}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Pearson r = ${r.toFixed(3)} · OLS: y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}</p>
        <div className="h-80">
          <Scatter
            data={{
              datasets: [
                { label: 'Observations', data: ${JSON.stringify(scatter)}, backgroundColor: 'rgba(99,102,241,0.35)', pointRadius: 3 },
                { type: 'line', label: 'OLS Regression', data: ${JSON.stringify(regLine)}, borderColor: 'rgba(239,68,68,1)', borderWidth: 2.5, pointRadius: 0, fill: false }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: '${cx}' } },
                y: { title: { display: true, text: '${cy}' } }
              }
            }}
          />
        </div>
      </div>`;
  }).join('');
}

// EDA §7 — Pair Plot grid
function genPairPlot(analysis) {
  const cols = Object.keys(analysis.numeric).slice(0, 5); // cap at 5 for readability
  if (cols.length < 2) return '';

  let cells = '';
  for (let ri = 0; ri < cols.length; ri++) {
    for (let ci = 0; ci < cols.length; ci++) {
      const cx = cols[ci], cy = cols[ri];
      if (ri === ci) {
        // Diagonal — histogram
        const { bins, labels } = computeHistBins(analysis.numeric[cx], 15);
        cells += `
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 p-2">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 text-center mb-1">${cx}</p>
          <div style={{height:160}}>
            <Bar data={{ labels: ${JSON.stringify(labels)}, datasets: [{ data: ${JSON.stringify(bins)}, backgroundColor: 'rgba(99,102,241,0.6)', borderWidth: 0 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
          </div>
        </div>`;
      } else {
        // Off-diagonal — scatter
        const xVals = analysis.numeric[cx], yVals = analysis.numeric[cy];
        const n = Math.min(xVals.length, yVals.length);
        const step = Math.max(1, Math.floor(n / 150));
        const scatter = [];
        for (let k = 0; k < n; k += step) scatter.push({ x: xVals[k], y: yVals[k] });
        const r = pearsonCorr(xVals.slice(0, n), yVals.slice(0, n));
        cells += `
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 p-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mb-1">r=${r.toFixed(2)}</p>
          <div style={{height:160}}>
            <Scatter data={{ datasets: [{ data: ${JSON.stringify(scatter)}, backgroundColor: 'rgba(16,185,129,0.4)', pointRadius: 2 }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }} />
          </div>
        </div>`;
      }
    }
  }

  return `
      {/* §7 Pair Plot */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 lg:col-span-2">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">§7 Pair Plot — All Numeric Features</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Diagonal = univariate histogram · Off-diagonal = scatter with Pearson r · ${cols.length}×${cols.length} grid (${cols.join(', ')})</p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(${cols.length}, 1fr)', gap:'6px'}}>
          ${cells}
        </div>
      </div>`;
}

// ─── Page Generator ───────────────────────────────────────────────────────────

function generateChartsPage(folderName, analysis, selectedCharts, rows, headers) {
  let content = '';

  if (selectedCharts.missingness)             content += genMissingness(analysis);
  if (selectedCharts.numeric_histogram)       content += genNumericHistogram(analysis);
  if (selectedCharts.top_categories)          content += genTopCategories(analysis);
  if (selectedCharts.binary_split)            content += genBinarySplit(analysis);
  if (selectedCharts.distribution_histogram)  content += genDistributionHistogram(analysis);
  if (selectedCharts.pie_categorical)         content += genPieCategorical(analysis);
  if (selectedCharts.correlation_heatmap)     content += genCorrelationHeatmap(analysis);
  if (selectedCharts.violin_box)              content += genViolinBox(analysis, rows, headers);
  if (selectedCharts.joint_scatter)           content += genJointScatter(analysis);
  if (selectedCharts.pair_plot)               content += genPairPlot(analysis);

  return `'use client';

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
          <a href="/ipynb/${folderName}" className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">
            View Tutorial Walkthrough →
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
${content}
        </div>
      </div>
    </div>
  );
}
`;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const formData = await request.formData();
    const cleanedCsvFile = formData.get('cleanedCsv');
    const folderName = formData.get('folderName');
    const chartsJson = formData.get('charts');

    if (!cleanedCsvFile || !folderName || !chartsJson) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }
    if (!cleanedCsvFile.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    const selectedCharts = JSON.parse(chartsJson);
    const csvBuffer = Buffer.from(await cleanedCsvFile.arrayBuffer());
    const csvText = csvBuffer.toString();
    const { headers, rows } = parseCSV(csvText);
    const analysis = analyzeData(headers, rows);

    const chartsDir = path.join(process.cwd(), 'app', 'ipynb', folderName, 'charts');
    await fs.mkdir(chartsDir, { recursive: true });
    await fs.writeFile(path.join(chartsDir, 'data.csv'), csvBuffer);

    const pageContent = generateChartsPage(folderName, analysis, selectedCharts, rows, headers);
    await fs.writeFile(path.join(chartsDir, 'page.js'), pageContent);

    return NextResponse.json({
      success: true,
      url: `/ipynb/${folderName}/charts`,
      message: 'Charts dashboard generated successfully'
    });
  } catch (error) {
    console.error('Error generating charts:', error);
    return NextResponse.json({ error: 'Failed to generate charts', details: error.message }, { status: 500 });
  }
}
