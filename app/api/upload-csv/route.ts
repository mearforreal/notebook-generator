import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { validateCSVFile } from '@/lib/csv-validator';
import { generateTimestampedFilename, ensureDirectoryExists } from '@/lib/file-utils';
import { generateCleaningNotebook } from '@/lib/notebook-generator';
import { UploadResponse } from '@/types/notebook.types';

export async function POST(request: NextRequest) {
  try {
    // Extract FormData from request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json<UploadResponse>(
        {
          success: false,
          message: 'No file provided',
          error: 'Please select a file to upload'
        },
        { status: 400 }
      );
    }

    // Validate the file
    const validation = validateCSVFile(file);
    if (!validation.valid) {
      return NextResponse.json<UploadResponse>(
        {
          success: false,
          message: 'File validation failed',
          error: validation.error
        },
        { status: 400 }
      );
    }

    // Generate timestamped filename
    const timestampedFilename = generateTimestampedFilename(file.name);
    const baseNameWithoutExt = path.basename(timestampedFilename, '.csv');

    // Define directory paths
    const uploadsDir = path.join(process.cwd(), 'app', 'ipynb', 'uploads');
    const notebooksDir = path.join(process.cwd(), 'app', 'ipynb', 'notebooks');
    const cleanedDir = path.join(process.cwd(), 'app', 'ipynb', 'cleaned');

    // Ensure directories exist
    await ensureDirectoryExists(uploadsDir);
    await ensureDirectoryExists(notebooksDir);
    await ensureDirectoryExists(cleanedDir);

    // Define file paths
    const csvPath = path.join(uploadsDir, timestampedFilename);
    const notebookFilename = `${baseNameWithoutExt}_cleaning.ipynb`;
    const notebookPath = path.join(notebooksDir, notebookFilename);
    const cleanedCsvPath = path.join(cleanedDir, `${baseNameWithoutExt}_cleaned.csv`);

    // Save CSV file
    const csvBuffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(csvPath, csvBuffer);

    // Generate notebook
    const notebook = generateCleaningNotebook(timestampedFilename, csvPath);

    // Save notebook as JSON
    await fs.promises.writeFile(
      notebookPath,
      JSON.stringify(notebook, null, 2),
      'utf-8'
    );

    // Return success response with file paths
    return NextResponse.json<UploadResponse>(
      {
        success: true,
        message: 'File uploaded and notebook generated successfully',
        csvPath: `app/ipynb/uploads/${timestampedFilename}`,
        notebookPath: `app/ipynb/notebooks/${notebookFilename}`,
        cleanedPath: `app/ipynb/cleaned/${baseNameWithoutExt}_cleaned.csv`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<UploadResponse>(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
