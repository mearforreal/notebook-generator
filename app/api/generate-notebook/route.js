import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { generateCustomNotebook } from "@/lib/custom-notebook-generator";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const stepsJson = formData.get("steps");

    // Validate file
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only CSV files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    // Parse steps
    let steps;
    try {
      steps = JSON.parse(stepsJson);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid steps format" },
        { status: 400 },
      );
    }

    // Validate required steps
    if (!steps.imports || !steps.load_csv || !steps.save_cleaned) {
      return NextResponse.json(
        {
          error:
            "Required steps (imports, load_csv, save_cleaned) must be selected",
        },
        { status: 400 },
      );
    }

    // Save CSV file
    const timestamp = Date.now();
    const sanitizedName = sanitizeFilename(file.name);
    const filename = `${timestamp}_${sanitizedName}`;

    const uploadsDir = path.join(process.cwd(), "app", "ipynb", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const csvPath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(csvPath, buffer);

    // Generate notebook
    const notebook = generateCustomNotebook(file.name, csvPath, steps);

    // Save notebook
    const notebooksDir = path.join(process.cwd(), "app", "ipynb", "notebooks");
    await fs.mkdir(notebooksDir, { recursive: true });

    const notebookFilename = `${timestamp}_${sanitizedName.replace(".csv", "_cleaning.ipynb")}`;
    const notebookPath = path.join(notebooksDir, notebookFilename);
    await fs.writeFile(notebookPath, JSON.stringify(notebook, null, 2));

    // Return notebook as download
    const notebookBuffer = Buffer.from(JSON.stringify(notebook, null, 2));

    return new NextResponse(notebookBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/x-ipynb+json",
        "Content-Disposition": `attachment; filename="${file.name.replace(".csv", "_cleaning.ipynb")}"`,
      },
    });
  } catch (error) {
    console.error("Error generating notebook:", error);
    return NextResponse.json(
      { error: "Failed to generate notebook", details: error.message },
      { status: 500 },
    );
  }
}
