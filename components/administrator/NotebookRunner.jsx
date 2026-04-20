'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── SSE output rendering ─────────────────────────────────────────────────────

function StreamOut({ text, name }) {
  return (
    <pre className={`text-xs font-mono whitespace-pre-wrap p-3 rounded mt-1 border ${
      name === 'stderr'
        ? 'bg-red-950/40 text-red-300 border-red-800'
        : 'bg-zinc-800 text-zinc-200 border-zinc-700'
    }`}>{text}</pre>
  );
}

function ErrorOut({ ename, evalue, traceback }) {
  return (
    <div className="mt-1 rounded border border-red-700 overflow-hidden">
      <div className="bg-red-900/60 px-3 py-1.5 text-xs font-bold text-red-200">
        {ename}: {evalue}
      </div>
      <pre className="bg-zinc-900 text-red-300 text-xs font-mono whitespace-pre-wrap p-3">{traceback}</pre>
    </div>
  );
}

function DataOut({ data }) {
  if (!data) return null;
  if (data['image/png']) {
    return <img src={`data:image/png;base64,${data['image/png']}`} alt="output" className="max-w-full rounded mt-2 border border-zinc-600" />;
  }
  if (data['image/svg+xml']) {
    return <div className="mt-2 bg-white rounded p-2 border border-zinc-300" dangerouslySetInnerHTML={{ __html: data['image/svg+xml'] }} />;
  }
  if (data['text/html']) {
    return <div className="mt-2 overflow-x-auto text-sm notebook-html" dangerouslySetInnerHTML={{ __html: data['text/html'] }} />;
  }
  if (data['text/plain']) {
    return <pre className="text-xs font-mono text-zinc-200 bg-zinc-800 border border-zinc-700 p-3 rounded mt-1 whitespace-pre-wrap">{data['text/plain']}</pre>;
  }
  return null;
}

function CellOutput({ out }) {
  if (out.output_type === 'stream')        return <StreamOut text={out.text} name={out.name} />;
  if (out.output_type === 'error')         return <ErrorOut  ename={out.ename} evalue={out.evalue} traceback={out.traceback} />;
  if (out.output_type === 'execute_result') return <DataOut data={out.data} />;
  if (out.output_type === 'display_data')  return <DataOut data={out.data} />;
  return null;
}

// ─── Single notebook cell ─────────────────────────────────────────────────────

function NotebookCell({ cell, onRun, canRun, kernelBusy }) {
  const isCode     = cell.cell_type === 'code';
  const isRunning  = cell.running;
  const hasOutputs = cell.outputs?.length > 0;

  return (
    <div className={`rounded-lg border transition-all ${
      isRunning
        ? 'border-emerald-500 shadow-md shadow-emerald-900/30'
        : isCode
          ? 'border-zinc-700 bg-zinc-900'
          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40'
    }`}>
      {/* Cell header */}
      <div className={`flex items-center justify-between px-3 py-1.5 border-b text-xs font-medium ${
        isCode
          ? 'border-zinc-700 bg-zinc-800/60 text-zinc-400'
          : 'border-zinc-200 dark:border-zinc-700 text-zinc-500'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isCode ? 'bg-emerald-500' : 'bg-blue-400'}`} />
          {isCode
            ? <span>In [{cell.execution_count ?? ' '}]</span>
            : <span>Markdown</span>
          }
          {isRunning && (
            <span className="flex items-center gap-1 text-emerald-400">
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              running
            </span>
          )}
        </div>
        {isCode && (
          <button
            onClick={() => onRun(cell.id)}
            disabled={!canRun || kernelBusy}
            title={!canRun ? 'Start a kernel first' : kernelBusy ? 'Kernel busy' : 'Run cell (Shift+Enter)'}
            className="px-2 py-0.5 rounded text-xs bg-emerald-700 hover:bg-emerald-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white transition-colors"
          >
            ▶ Run
          </button>
        )}
      </div>

      {/* Source */}
      <div className="p-3">
        {isCode ? (
          <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-5">{cell.source}</pre>
        ) : (
          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{cell.source}</p>
        )}
      </div>

      {/* Outputs */}
      {isCode && hasOutputs && (
        <div className="border-t border-zinc-700 px-3 pb-3 pt-2 space-y-1">
          {cell.outputs.map((out, i) => <CellOutput key={i} out={out} />)}
        </div>
      )}
    </div>
  );
}

// ─── Server status badge ──────────────────────────────────────────────────────

function ServerBadge({ status }) {
  const map = {
    unknown : { dot: 'bg-zinc-400',  text: 'Unknown'  },
    stopped : { dot: 'bg-red-500',   text: 'Stopped'  },
    starting: { dot: 'bg-yellow-400 animate-pulse', text: 'Starting…' },
    running : { dot: 'bg-emerald-500', text: 'Running' }
  };
  const s = map[status] || map.unknown;
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      Jupyter Server: {s.text}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotebookRunner() {
  // Server
  const [serverStatus, setServerStatus]  = useState('unknown');
  const [serverError,  setServerError]   = useState('');

  // Kernel
  const [kernelId,     setKernelId]      = useState(null);
  const [kernelStatus, setKernelStatus]  = useState('idle'); // 'idle' | 'busy'
  const [kernelError,  setKernelError]   = useState('');

  // Notebooks
  const [notebooks,    setNotebooks]     = useState([]);
  const [loadingList,  setLoadingList]   = useState(true);

  // Cells
  const [cells,        setCells]         = useState([]);
  const [notebookName, setNotebookName]  = useState('');
  const [loadingNb,    setLoadingNb]     = useState(false);

  // UI
  const [runError,     setRunError]      = useState('');
  const bottomRef = useRef(null);

  // ── Polling: check server status every 5 s ────────────────────────────────
  useEffect(() => {
    checkServer();
    const id = setInterval(checkServer, 5_000);
    return () => clearInterval(id);
  }, []);

  // ── Load notebook list on mount ───────────────────────────────────────────
  useEffect(() => { fetchNotebooks(); }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  async function checkServer() {
    try {
      const res  = await fetch('/api/jupyter-server');
      const data = await res.json();
      setServerStatus(data.running ? 'running' : 'stopped');
    } catch {
      setServerStatus('stopped');
    }
  }

  async function fetchNotebooks() {
    setLoadingList(true);
    try {
      const res  = await fetch('/api/list-notebooks');
      const data = await res.json();
      setNotebooks(data.notebooks || []);
    } catch {
      setNotebooks([]);
    } finally {
      setLoadingList(false);
    }
  }

  async function startServer() {
    setServerStatus('starting');
    setServerError('');
    try {
      const res  = await fetch('/api/jupyter-server', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');
      setServerStatus('running');
    } catch (err) {
      setServerError(err.message);
      setServerStatus('stopped');
    }
  }

  async function stopServer() {
    await fetch('/api/jupyter-server', { method: 'DELETE' });
    setServerStatus('stopped');
    setKernelId(null);
    setKernelStatus('idle');
  }

  async function createKernel() {
    setKernelError('');
    try {
      const res  = await fetch('/api/jupyter-kernel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create kernel');
      setKernelId(data.id);
      setKernelStatus('idle');
    } catch (err) {
      setKernelError(err.message);
    }
  }

  async function shutdownKernel() {
    if (!kernelId) return;
    await fetch('/api/jupyter-kernel', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kernelId }) });
    setKernelId(null);
    setKernelStatus('idle');
  }

  async function loadNotebook(name) {
    setLoadingNb(true);
    setCells([]);
    setRunError('');
    try {
      const res  = await fetch(`/api/load-notebook?name=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCells(data.cells);
      setNotebookName(name);
    } catch (err) {
      setRunError(err.message);
    } finally {
      setLoadingNb(false);
    }
  }

  // ── SSE-based cell execution ──────────────────────────────────────────────

  const executeCell = useCallback(async (cellId) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.cell_type !== 'code' || !kernelId) return;

    // Reset cell outputs and mark as running
    setCells(prev => prev.map(c =>
      c.id === cellId ? { ...c, outputs: [], running: true, execution_count: null } : c
    ));
    setKernelStatus('busy');
    setRunError('');

    try {
      const res = await fetch('/api/jupyter-execute', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ kernelId, code: cell.source, cellId })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Execute request failed');
      }

      // Parse SSE stream
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = '';

      let currentEvent = '';
      let currentData  = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep the incomplete last line

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            currentData = line.slice(6).trim();
          } else if (line === '') {
            // Blank line = dispatch event
            if (currentData) {
              try {
                const payload = JSON.parse(currentData);

                if (currentEvent === 'output') {
                  setCells(prev => prev.map(c =>
                    c.id === cellId
                      ? { ...c, outputs: [...c.outputs, payload] }
                      : c
                  ));
                } else if (currentEvent === 'reply') {
                  setCells(prev => prev.map(c =>
                    c.id === cellId
                      ? { ...c, execution_count: payload.execution_count }
                      : c
                  ));
                } else if (currentEvent === 'done') {
                  setCells(prev => prev.map(c =>
                    c.id === cellId ? { ...c, running: false } : c
                  ));
                  setKernelStatus('idle');
                } else if (currentEvent === 'error') {
                  setRunError(payload.message);
                  setKernelStatus('idle');
                }
              } catch { /* bad JSON */ }
              currentEvent = '';
              currentData  = '';
            }
          }
        }
      }
    } catch (err) {
      setRunError(err.message);
      setCells(prev => prev.map(c => c.id === cellId ? { ...c, running: false } : c));
      setKernelStatus('idle');
    }
  }, [cells, kernelId]);

  // Execute all code cells in order
  async function executeAll() {
    const codeCells = cells.filter(c => c.cell_type === 'code');
    for (const cell of codeCells) {
      await executeCell(cell.id);
    }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const canRun     = serverStatus === 'running' && !!kernelId;
  const codeCells  = cells.filter(c => c.cell_type === 'code').length;
  const cellsDone  = cells.filter(c => c.execution_count !== null).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Notebook Runner
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Runs notebooks in a live Jupyter kernel — no local Jupyter window required.
          Outputs stream back in real time via WebSocket → SSE.
        </p>
      </div>

      {/* ── Control bar ── */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 space-y-3">
        {/* Server row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <ServerBadge status={serverStatus} />
          <div className="flex gap-2">
            {serverStatus !== 'running' ? (
              <button
                onClick={startServer}
                disabled={serverStatus === 'starting'}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-500 disabled:cursor-not-allowed text-white transition-colors"
              >
                {serverStatus === 'starting' ? 'Starting…' : 'Start Jupyter Server'}
              </button>
            ) : (
              <button
                onClick={stopServer}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Stop Server
              </button>
            )}
          </div>
        </div>

        {serverError && (
          <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded p-2">
            {serverError}
            <br/>
            <span className="text-red-500">Make sure Jupyter Server is installed: <code>pip install jupyter_server</code></span>
          </div>
        )}

        {/* Kernel row */}
        {serverStatus === 'running' && (
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${kernelId ? (kernelStatus === 'busy' ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400') : 'bg-zinc-500'}`} />
              <span className="text-zinc-400">
                Kernel: {kernelId
                  ? <span className="text-zinc-300 font-mono">{kernelId.slice(0, 8)}… ({kernelStatus})</span>
                  : <span className="text-zinc-500">none</span>
                }
              </span>
            </div>
            <div className="flex gap-2">
              {!kernelId ? (
                <button
                  onClick={createKernel}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  + Start Kernel
                </button>
              ) : (
                <button
                  onClick={shutdownKernel}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-600 hover:bg-zinc-500 text-white transition-colors"
                >
                  Shutdown Kernel
                </button>
              )}
            </div>
          </div>
        )}

        {kernelError && (
          <p className="text-xs text-red-400">{kernelError}</p>
        )}
      </div>

      {/* ── Notebook selector ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Select Notebook</h3>
          <button onClick={fetchNotebooks} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Refresh</button>
        </div>

        {loadingList ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : notebooks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-5 text-center text-sm text-zinc-500">
            No notebooks yet. Generate one in the Notebook Builder tab.
          </div>
        ) : (
          <div className="space-y-1.5">
            {notebooks.map(nb => (
              <button
                key={nb.name}
                onClick={() => loadNotebook(nb.name)}
                className={`w-full text-left rounded-lg border px-4 py-2.5 transition-all ${
                  notebookName === nb.name
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                <span className="text-sm font-mono text-zinc-900 dark:text-zinc-100">{nb.name}</span>
                <span className="text-xs text-zinc-400 ml-3">{nb.sizeKb} KB · {new Date(nb.modified).toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Notebook toolbar ── */}
      {cells.length > 0 && (
        <div className="flex items-center justify-between bg-zinc-900 rounded-lg border border-zinc-700 px-4 py-2.5">
          <div className="text-xs text-zinc-400">
            <span className="font-mono text-zinc-200">{notebookName}</span>
            <span className="ml-3">{codeCells} code cells</span>
            {cellsDone > 0 && <span className="ml-2 text-emerald-400">· {cellsDone} executed</span>}
            {kernelStatus === 'busy' && <span className="ml-2 text-yellow-400 animate-pulse">· kernel busy…</span>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCells(prev => prev.map(c => ({ ...c, outputs: [], execution_count: null, running: false })))}
              className="px-3 py-1 rounded text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
            >
              Clear Outputs
            </button>
            <button
              onClick={executeAll}
              disabled={!canRun || kernelStatus === 'busy'}
              className="px-3 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white transition-colors"
            >
              ▶▶ Run All
            </button>
          </div>
        </div>
      )}

      {/* ── Loading spinner for notebook ── */}
      {loadingNb && (
        <div className="text-sm text-zinc-400 flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          Loading notebook…
        </div>
      )}

      {/* ── Run error ── */}
      {runError && (
        <div className="bg-red-950/40 border border-red-800 rounded-lg p-3 text-sm text-red-300">
          {runError}
        </div>
      )}

      {/* ── Cells ── */}
      {!canRun && cells.length > 0 && (
        <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-700 rounded-lg px-3 py-2">
          ⚠ {serverStatus !== 'running' ? 'Start the Jupyter Server' : 'Start a kernel'} to enable cell execution.
        </div>
      )}

      <div className="space-y-3">
        {cells.map(cell => (
          <NotebookCell
            key={cell.id}
            cell={cell}
            onRun={executeCell}
            canRun={canRun}
            kernelBusy={kernelStatus === 'busy'}
          />
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
