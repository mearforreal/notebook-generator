import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Strip ANSI escape codes from traceback strings
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export async function POST(request) {
  try {
    const { notebookName } = await request.json();

    // Validate: only allow safe filenames
    if (!notebookName || !/^[\w\-. ]+\.ipynb$/.test(notebookName)) {
      return NextResponse.json({ error: 'Invalid notebook name' }, { status: 400 });
    }

    const notebooksDir = path.join(process.cwd(), 'app', 'ipynb', 'notebooks');
    const inputPath = path.join(notebooksDir, notebookName);

    // Confirm file exists
    try {
      await fs.access(inputPath);
    } catch {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    // Output directory for executed copies
    const executedDir = path.join(process.cwd(), 'app', 'ipynb', 'executed');
    await fs.mkdir(executedDir, { recursive: true });

    const outputName = notebookName.replace('.ipynb', '_executed.ipynb');
    const outputPath = path.join(executedDir, outputName);

    // Build command — use full Windows-compatible quoting
    const cmd = [
      'jupyter nbconvert',
      '--to notebook',
      '--execute',
      '--ExecutePreprocessor.timeout=120',
      '--ExecutePreprocessor.kernel_name=python3',
      `--output "${outputPath}"`,
      `"${inputPath}"`
    ].join(' ');

    let execError = null;
    try {
      await execAsync(cmd, { timeout: 130_000 });
    } catch (err) {
      // nbconvert exits non-zero on cell errors but still writes the file
      execError = err.stderr || err.message;
    }

    // Try to read the output notebook (may have partial results)
    let notebook;
    try {
      const raw = await fs.readFile(outputPath, 'utf-8');
      notebook = JSON.parse(raw);
    } catch {
      return NextResponse.json({
        error: execError
          ? `Execution failed: ${execError}`
          : 'Notebook did not produce output. Is Jupyter installed?'
      }, { status: 500 });
    }

    // Sanitise cells for JSON transport
    const cells = notebook.cells.map(cell => ({
      cell_type: cell.cell_type,
      source: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
      execution_count: cell.execution_count ?? null,
      outputs: (cell.outputs || []).map(out => {
        if (out.output_type === 'stream') {
          return {
            output_type: 'stream',
            name: out.name,
            text: Array.isArray(out.text) ? out.text.join('') : out.text
          };
        }
        if (out.output_type === 'error') {
          return {
            output_type: 'error',
            ename: out.ename,
            evalue: out.evalue,
            traceback: (out.traceback || []).map(stripAnsi).join('\n')
          };
        }
        // execute_result / display_data
        const data = {};
        if (out.data?.['image/png']) data['image/png'] = out.data['image/png'];
        if (out.data?.['image/svg+xml']) data['image/svg+xml'] = Array.isArray(out.data['image/svg+xml']) ? out.data['image/svg+xml'].join('') : out.data['image/svg+xml'];
        if (out.data?.['text/html'])  data['text/html']  = Array.isArray(out.data['text/html'])  ? out.data['text/html'].join('')  : out.data['text/html'];
        if (out.data?.['text/plain']) data['text/plain'] = Array.isArray(out.data['text/plain']) ? out.data['text/plain'].join('') : out.data['text/plain'];
        return { output_type: out.output_type, data };
      })
    }));

    return NextResponse.json({
      success: true,
      notebookName,
      cellCount: cells.length,
      execWarning: execError ? String(execError).slice(0, 400) : null,
      cells
    });
  } catch (err) {
    console.error('run-notebook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
