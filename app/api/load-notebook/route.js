import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name || !/^[\w\-. ]+\.ipynb$/.test(name)) {
      return NextResponse.json({ error: 'Invalid notebook name' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'app', 'ipynb', 'notebooks', name);

    let raw;
    try {
      raw = await fs.readFile(filePath, 'utf-8');
    } catch {
      return NextResponse.json({ error: 'Notebook not found' }, { status: 404 });
    }

    const notebook = JSON.parse(raw);

    // Return cells with source but empty outputs — outputs will come from live execution
    const cells = notebook.cells.map((cell, i) => ({
      id             : i,
      cell_type      : cell.cell_type,
      source         : Array.isArray(cell.source) ? cell.source.join('') : (cell.source || ''),
      execution_count: null,
      outputs        : []
    }));

    return NextResponse.json({
      name,
      cells,
      kernelName: notebook.metadata?.kernelspec?.name || 'python3',
      language  : notebook.metadata?.kernelspec?.language || 'python'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
