import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const anthropic = new Anthropic();

function sanitizeFolderName(name) {
  return name
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

function escapeJSX(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}');
}

async function generateExplanation(code, stepNumber) {
  if (!code || !code.trim()) {
    return 'This cell contains no executable code.';
  }

  const response = await anthropic.messages.create({
    model: '`claude`-haiku-4-5',///    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `You are a data science educator writing a tutorial. Explain what this Python code does in 2-4 sentences. Focus on: what problem it solves, what transformation it performs, and why it matters in a data cleaning workflow. Be concise and beginner-friendly. Do not include code, headers, or bullet points — plain prose only.

\`\`\`python
${code}
\`\`\``,
      },
    ],
  });

  return response.content[0].text.trim();
}

function generateTutorialPage(notebookData, folderName, rawCsvName, cleanedCsvName, explanations) {
  const cells = notebookData.cells || [];
  const codeCells = cells.filter(cell => cell.cell_type === 'code');

  let cellsContent = '';

  // Generate intro row
  cellsContent += `
      {/* Introduction Row */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">
          Data Cleaning Tutorial
        </h2>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p><strong>Raw Dataset:</
          strong> ${rawCsvName}</p>
          <p><strong>Cleaned Dataset:</strong> ${cleanedCsvName}</p>
          <p><strong>Purpose:</strong> This tutorial demonstrates the step-by-step data cleaning process applied to transform the raw dataset into a cleaned, analysis-ready format.</p>
        </div>
      </div>
`;

  // Generate rows for each code cell
  codeCells.forEach((cell, index) => {
    const code = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
    const escapedCode = escapeJSX(code);
    const explanation = escapeJSX(explanations[index] || 'No explanation available for this step.');

    cellsContent += `
      {/* Step ${index + 1} */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step ${index + 1}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{\`${escapedCode}\`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                Execute the notebook to see output
              </p>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-900 dark:text-yellow-200">
                {\`${explanation}\`}
              </p>
            </div>
          </div>
        </div>
      </div>
`;
  });

  // Add link to charts
  cellsContent += `
      {/* Charts Link */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
          📊 Visualize Your Data
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
          View interactive charts and visualizations of the cleaned dataset.
        </p>
        <a
          href="/ipynb/${folderName}/charts"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          View Charts Dashboard →
        </a>
      </div>
`;

  return `export default function TutorialPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/administrator"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Administrator Dashboard
          </a>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Data Cleaning Walkthrough
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Step-by-step tutorial with code, outputs, and explanations
          </p>
        </div>

        {/* Tutorial Content */}
        <div className="space-y-6">
${cellsContent}
        </div>
      </div>
    </div>
  );
}
`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const notebookFile = formData.get('notebook');
    const rawCsvFile = formData.get('rawCsv');
    const cleanedCsvFile = formData.get('cleanedCsv');
    const folderName = formData.get('folderName');

    // Validate files
    if (!notebookFile || !rawCsvFile || !cleanedCsvFile || !folderName) {
      return NextResponse.json(
        { error: 'Missing required files or folder name' },
        { status: 400 }
      );
    }

    if (!notebookFile.name.endsWith('.ipynb')) {
      return NextResponse.json(
        { error: 'Invalid notebook file type' },
        { status: 400 }
      );
    }

    if (!rawCsvFile.name.endsWith('.csv') || !cleanedCsvFile.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Invalid CSV file type' },
        { status: 400 }
      );
    }

    // Validate folder name
    if (!/^[a-zA-Z0-9_-]+$/.test(folderName)) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      );
    }

    // Parse notebook
    const notebookBuffer = Buffer.from(await notebookFile.arrayBuffer());
    const notebookData = JSON.parse(notebookBuffer.toString());

    // Generate Claude explanations for each code cell in parallel
    const cells = notebookData.cells || [];
    const codeCells = cells.filter(cell => cell.cell_type === 'code');

    const explanations = await Promise.all(
      codeCells.map((cell, index) => {
        const code = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        return generateExplanation(code, index + 1);
      })
    );

    // Create folder structure
    const sanitizedFolderName = sanitizeFolderName(folderName);
    const tutorialDir = path.join(process.cwd(), 'app', 'ipynb', sanitizedFolderName);
    await fs.mkdir(tutorialDir, { recursive: true });

    // Save CSV files
    const rawCsvBuffer = Buffer.from(await rawCsvFile.arrayBuffer());
    const cleanedCsvBuffer = Buffer.from(await cleanedCsvFile.arrayBuffer());

    await fs.writeFile(path.join(tutorialDir, 'raw.csv'), rawCsvBuffer);
    await fs.writeFile(path.join(tutorialDir, 'cleaned.csv'), cleanedCsvBuffer);
    await fs.writeFile(path.join(tutorialDir, 'notebook.ipynb'), notebookBuffer);

    // Generate tutorial page with AI explanations
    const tutorialPageContent = generateTutorialPage(
      notebookData,
      sanitizedFolderName,
      rawCsvFile.name,
      cleanedCsvFile.name,
      explanations
    );

    const pageJsPath = path.join(tutorialDir, 'page.js');
    await fs.writeFile(pageJsPath, tutorialPageContent);

    return NextResponse.json({
      success: true,
      url: `/ipynb/${sanitizedFolderName}`,
      message: 'Tutorial page generated successfully'
    });
  } catch (error) {
    console.error('Error generating tutorial:', error);
    return NextResponse.json(
      { error: 'Failed to generate tutorial', details: error.message },
      { status: 500 }
    );
  }
}
