import { spawn } from 'child_process';
import path from 'path';

const JUPYTER_PORT = 8888;
export const JUPYTER_HTTP = `http://localhost:${JUPYTER_PORT}`;
export const JUPYTER_WS   = `ws://localhost:${JUPYTER_PORT}`;

// Persist the process reference across Next.js hot-reloads in dev mode
if (!global.__jupyterProc) {
  global.__jupyterProc   = null;
  global.__jupyterReady  = false;
  global.__jupyterLogs   = [];
}

export function getStatus() {
  return {
    running : !!global.__jupyterProc && global.__jupyterReady,
    url     : JUPYTER_HTTP,
    port    : JUPYTER_PORT,
    logs    : global.__jupyterLogs.slice(-20)
  };
}

export function startServer() {
  if (global.__jupyterProc) {
    return Promise.resolve({ already: true, url: JUPYTER_HTTP });
  }

  const notebookDir = path.join(process.cwd(), 'app', 'ipynb', 'notebooks');

  return new Promise((resolve, reject) => {
    const args = [
      'server',
      '--no-browser',
      `--port=${JUPYTER_PORT}`,
      '--ServerApp.token=',
      '--ServerApp.password=',
      '--ServerApp.allow_origin=*',
      '--ServerApp.allow_remote_access=True',
      '--ServerApp.disable_check_xsrf=True',
      '--ServerApp.open_browser=False',
      `--notebook-dir=${notebookDir}`
    ];

    let proc;
    try {
      proc = spawn('jupyter', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (spawnErr) {
      return reject(new Error(`Could not spawn jupyter: ${spawnErr.message}. Is Jupyter installed? Run: pip install jupyter_server`));
    }

    global.__jupyterProc = proc;
    global.__jupyterLogs = [];

    const timeout = setTimeout(() => {
      if (!global.__jupyterReady) {
        proc.kill();
        global.__jupyterProc = null;
        reject(new Error('Jupyter Server did not start within 20 s. Check that jupyter_server is installed.'));
      }
    }, 20_000);

    function onData(data) {
      const text = data.toString();
      global.__jupyterLogs.push(text.trim());
      // Jupyter Server prints its URL to stderr
      if (
        (text.includes('Jupyter Server') && text.includes('is running')) ||
        text.includes(`localhost:${JUPYTER_PORT}`) ||
        text.includes('http://127.0.0.1')
      ) {
        if (!global.__jupyterReady) {
          global.__jupyterReady = true;
          clearTimeout(timeout);
          resolve({ url: JUPYTER_HTTP });
        }
      }
    }

    proc.stdout.on('data', onData);
    proc.stderr.on('data', onData);

    proc.on('error', err => {
      clearTimeout(timeout);
      global.__jupyterProc  = null;
      global.__jupyterReady = false;
      reject(new Error(`Jupyter process error: ${err.message}`));
    });

    proc.on('exit', (code) => {
      global.__jupyterProc  = null;
      global.__jupyterReady = false;
    });
  });
}

export function stopServer() {
  if (global.__jupyterProc) {
    global.__jupyterProc.kill();
    global.__jupyterProc  = null;
    global.__jupyterReady = false;
    global.__jupyterLogs  = [];
  }
}
