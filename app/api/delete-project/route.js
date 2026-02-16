import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { folderName } = await request.json();

    if (!folderName) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    // Validate folder name (prevent path traversal)
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Prevent deletion of system folders
    const excludedFolders = ['uploads', 'notebooks', 'cleaned'];
    if (excludedFolders.includes(folderName)) {
      return NextResponse.json(
        { error: 'Cannot delete system folders' },
        { status: 400 }
      );
    }

    const projectPath = path.join(process.cwd(), 'app', 'ipynb', folderName);

    // Check if folder exists
    try {
      await fs.access(projectPath);
    } catch {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the folder recursively
    await fs.rm(projectPath, { recursive: true, force: true });

    return NextResponse.json({
      success: true,
      message: `Project "${folderName}" deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error.message },
      { status: 500 }
    );
  }
}
