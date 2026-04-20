import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const notebooksDir = path.join(process.cwd(), 'app', 'ipynb', 'notebooks');

    let files;
    try {
      files = await fs.readdir(notebooksDir);
    } catch {
      return NextResponse.json({ notebooks: [] });
    }

    const notebooks = await Promise.all(
      files
        .filter(f => f.endsWith('.ipynb'))
        .map(async name => {
          const filePath = path.join(notebooksDir, name);
          const stat = await fs.stat(filePath);
          return {
            name,
            created: stat.birthtime.toISOString(),
            modified: stat.mtime.toISOString(),
            sizeKb: Math.round(stat.size / 1024)
          };
        })
    );

    notebooks.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    return NextResponse.json({ notebooks });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
