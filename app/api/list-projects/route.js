import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const ipynbDir = path.join(process.cwd(), 'app', 'ipynb');

    // Check if directory exists
    try {
      await fs.access(ipynbDir);
    } catch {
      return NextResponse.json({ projects: [] });
    }

    // Read all directories
    const entries = await fs.readdir(ipynbDir, { withFileTypes: true });

    // Filter for project folders (exclude uploads, notebooks, cleaned)
    const excludedFolders = ['uploads', 'notebooks', 'cleaned'];
    const projectFolders = entries.filter(
      entry => entry.isDirectory() && !excludedFolders.includes(entry.name)
    );

    // Get details for each project
    const projects = await Promise.all(
      projectFolders.map(async (folder) => {
        const projectPath = path.join(ipynbDir, folder.name);

        // Check what files exist
        const hasTutorial = await fileExists(path.join(projectPath, 'page.js'));
        const hasCharts = await fileExists(path.join(projectPath, 'charts', 'page.js'));
        const hasNotebook = await fileExists(path.join(projectPath, 'notebook.ipynb'));
        const hasRawCsv = await fileExists(path.join(projectPath, 'raw.csv'));
        const hasCleanedCsv = await fileExists(path.join(projectPath, 'cleaned.csv'));

        // Get creation time
        const stats = await fs.stat(projectPath);

        return {
          name: folder.name,
          hasTutorial,
          hasCharts,
          hasNotebook,
          hasCsvs: hasRawCsv || hasCleanedCsv,
          created: stats.birthtime.toISOString()
        };
      })
    );

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.created) - new Date(a.created));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error listing projects:', error);
    return NextResponse.json(
      { error: 'Failed to list projects', details: error.message },
      { status: 500 }
    );
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
