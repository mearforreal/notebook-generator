# Notebook Studio - Administrator Dashboard

> **Graduate Data Analysis and Visualization Project**
> Automate data cleaning, generate educational tutorials, and visualize insights

## 📋 Project Overview

Notebook Studio is a Next.js 16.1.6 application designed for data science administrators to automate the transformation of raw datasets into:

1. **Functional Jupyter notebooks** (.ipynb) with selectable cleaning steps
2. **Interactive educational tutorials** with code, outputs, and explanations
3. **Visual data dashboards** using Chart.js for analysis

The platform bridges the gap between raw data and accessible insights through a centralized Administrator Dashboard, requiring minimal programming knowledge.

## 🎯 Key Features

### 1. **Notebook Builder** (CSV → .ipynb)
- Upload CSV files (up to 10MB)
- Select data cleaning steps via checkboxes:
  - `imports` - Library imports (required)
  - `load_csv` - Load CSV file (required)
  - `preview` - Data overview and statistics
  - `missingness` - Missing value analysis and handling
  - `normalize_text` - Text normalization
  - `split_location` - Location parsing (for datasets with location columns)
  - `parse_salary` - Salary parsing (for datasets with salary columns)
  - `normalize_binary` - Binary column normalization (Yes/No → 1/0)
  - `drop_duplicates` - Duplicate removal
  - `save_cleaned` - Export cleaned CSV (required)
- Download generated Jupyter notebook

### 2. **Tutorial Builder** (.ipynb → Walkthrough)
- Upload Jupyter notebook (.ipynb)
- Upload raw CSV and cleaned CSV
- Automatically generates tutorial page with:
  - One row per code cell
  - Code block with syntax highlighting
  - Output block (placeholder for execution results)
  - Explanation block (for adding educational notes)
  - Link to charts dashboard
- Tutorial pages available at `/ipynb/<folder-name>`

### 3. **Charts Builder** (Cleaned CSV → Chart.js)
- Upload cleaned CSV file
- Select chart types via checkboxes:
  - `missingness` - Missing data visualization
  - `numeric_histogram` - Distribution of numeric columns
  - `top_categories` - Top category frequencies
  - `binary_split` - Binary column pie/bar charts
- Generate interactive Chart.js visualizations
- Charts pages available at `/ipynb/<folder-name>/charts`

## 🏗️ Technical Architecture

### Path Conventions
```
app/
├── administrator/          # Admin dashboard
│   └── page.js            # Main dashboard with three builders
├── ipynb/
│   ├── uploads/           # Uploaded CSV files
│   ├── notebooks/         # Generated .ipynb files
│   ├── cleaned/           # Cleaned CSV outputs
│   └── <folder>/          # Generated content folders
│       ├── page.js        # Tutorial page
│       └── charts/
│           └── page.js    # Charts dashboard
└── api/
    ├── generate-notebook/ # Notebook generation API
    ├── generate-tutorial/ # Tutorial generation API
    └── generate-charts/   # Charts generation API

components/
└── administrator/         # Admin tool components
    ├── NotebookBuilder.jsx
    ├── TutorialBuilder.jsx
    └── ChartsBuilder.jsx

lib/
├── custom-notebook-generator.js  # Notebook creation logic
├── csv-validator.ts              # File validation
└── file-utils.ts                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (recommended)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the repository**
   ```bash
   cd notebook-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000/administrator
   ```

### Build for Production
```bash
npm run build
npm start
```

## 📖 Usage Guide

### Workflow 1: Generate Cleaning Notebook

1. Navigate to **Administrator Dashboard** (`/administrator`)
2. Click on **Notebook Builder** tab
3. Upload a CSV file (e.g., `fake_job_postings.csv`)
4. Select desired cleaning steps (checkboxes)
5. Click **Generate Notebook**
6. Download the generated `.ipynb` file
7. Open in Jupyter Lab/Notebook and execute cells

### Workflow 2: Generate Tutorial Walkthrough

1. After executing the notebook, navigate to **Tutorial Builder** tab
2. Enter a folder name (e.g., `fake-jobs`)
3. Upload:
   - The `.ipynb` notebook file
   - Raw CSV file
   - Cleaned CSV file (output from notebook execution)
4. Click **Generate Tutorial**
5. View tutorial at `/ipynb/<folder-name>`

### Workflow 3: Generate Charts Dashboard

1. Navigate to **Charts Builder** tab
2. Enter the same folder name used in Tutorial Builder
3. Upload the cleaned CSV file
4. Select chart types (checkboxes)
5. Click **Generate Charts Dashboard**
6. View charts at `/ipynb/<folder-name>/charts`

## 📊 Example: Fake Jobs Dataset

The project includes a complete example using the Fake Jobs dataset:

- **Dataset**: 17,880 job postings with 18 features
- **Fraud Detection**: Dataset contains fraudulent job postings (4.8%)
- **Tutorial**: Available at `/ipynb/fake-jobs`
- **Charts**: Available at `/ipynb/fake-jobs/charts`

### Key Insights from Example:
- 84% of salary_range values are missing
- 65% of department values are missing
- No duplicate rows found
- Full-time positions dominate (69%)
- 79.5% of postings include company logos

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16.1.6 (React 19.2.3) |
| **Language** | TypeScript / JavaScript |
| **Styling** | TailwindCSS 4 |
| **Charts** | Chart.js 4.5.1, react-chartjs-2 5.3.1 |
| **File Operations** | Node.js fs/path (built-in) |
| **Notebook Format** | Jupyter nbformat 4.5 |

## 📁 Project Structure

```
notebook-studio/
├── app/
│   ├── administrator/           # Admin dashboard
│   ├── ipynb/                   # Generated content & data
│   │   ├── fake-jobs/          # Example: Fake Jobs dataset
│   │   │   ├── page.js         # Tutorial walkthrough
│   │   │   └── charts/page.js  # Charts dashboard
│   │   ├── uploads/            # Raw CSV uploads
│   │   ├── notebooks/          # Generated .ipynb files
│   │   └── cleaned/            # Cleaned CSV outputs
│   ├── api/
│   │   ├── generate-notebook/  # Notebook generation endpoint
│   │   ├── generate-tutorial/  # Tutorial generation endpoint
│   │   └── generate-charts/    # Charts generation endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   └── administrator/          # Admin components
│       ├── NotebookBuilder.jsx
│       ├── TutorialBuilder.jsx
│       └── ChartsBuilder.jsx
├── lib/
│   ├── custom-notebook-generator.js  # Notebook logic
│   ├── notebook-generator.ts         # Original generator
│   ├── csv-validator.ts              # Validation utilities
│   ├── file-utils.ts                 # File utilities
│   └── types/notebook.types.ts       # TypeScript types
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🎓 Educational Context

This project is designed for the **Graduate Data Analysis and Visualization** course. It demonstrates:

- **Data Pipeline Automation**: Streamline data cleaning workflows
- **Educational Content Generation**: Transform technical code into tutorials
- **Data Visualization**: Present insights through interactive charts
- **Full-Stack Development**: Next.js API routes, React components, file I/O
- **Real-World Application**: Fraud detection in job postings

## 🔒 Security Features

- **File size limits**: 10MB maximum
- **File type validation**: CSV and .ipynb only
- **Filename sanitization**: Prevent path traversal attacks
- **MIME type checking**: Validate file contents
- **Folder name validation**: Alphanumeric, hyphens, underscores only

## 🐛 Troubleshooting

### Issue: Charts not displaying
**Solution**: Ensure Chart.js is properly registered in the component. The charts page uses `'use client'` directive for client-side rendering.

### Issue: Notebook generation fails
**Solution**: Check that required steps (imports, load_csv, save_cleaned) are selected. These are mandatory for valid notebooks.

### Issue: Tutorial page shows raw code
**Solution**: Ensure the notebook file is valid JSON and contains properly formatted cells.

### Issue: CSV upload fails
**Solution**: Verify file size is under 10MB and file extension is `.csv`.

## 🚦 API Endpoints

### POST `/api/generate-notebook`
**Request**: FormData with `file` (CSV) and `steps` (JSON)
**Response**: .ipynb file download

### POST `/api/generate-tutorial`
**Request**: FormData with `notebook`, `rawCsv`, `cleanedCsv`, `folderName`
**Response**: JSON with `url` to tutorial page

### POST `/api/generate-charts`
**Request**: FormData with `cleanedCsv`, `folderName`, `charts` (JSON)
**Response**: JSON with `url` to charts dashboard

## 📝 License

This project is created for educational purposes as part of the Graduate Data Analysis and Visualization course at Gannon University.

## 👨‍💻 Development Notes

- **Next.js 16.1.6** uses native FormData support
- **React 19.2.3** requires `'use client'` directive for interactive components
- **TailwindCSS 4** uses the new `@tailwindcss/postcss` plugin
- **Chart.js** requires manual registration of chart types and scales
- **Jupyter nbformat 4.5** requires specific cell structure with `source` as string arrays

## 🎉 Features Delivered

✅ Fully functional Administrator Dashboard
✅ Three builders (Notebook, Tutorial, Charts)
✅ Generated tutorial page for Fake Jobs dataset
✅ Charts page with 6 interactive visualizations
✅ Comprehensive README with run instructions
✅ TypeScript type safety throughout
✅ Responsive design with dark mode support
✅ Security-focused file handling

---

**Course**: Graduate Data Analysis and Visualization
**Project**: Notebook Studio - Admin Dashboard & Automated Insights
**Version**: 1.0.0
**Date**: February 2026
