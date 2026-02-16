import { JupyterNotebook, NotebookCell, NotebookMetadata } from '@/types/notebook.types';

/**
 * Creates a markdown cell for the notebook
 */
function createMarkdownCell(content: string): NotebookCell {
  return {
    cell_type: 'markdown',
    execution_count: null,
    metadata: {},
    source: content.split('\n').map(line => line + '\n')
  };
}

/**
 * Creates a code cell for the notebook
 */
function createCodeCell(code: string): NotebookCell {
  return {
    cell_type: 'code',
    execution_count: null,
    metadata: {},
    source: code.split('\n').map(line => line + '\n'),
    outputs: []
  };
}

/**
 * Generates a complete Jupyter notebook for CSV data cleaning
 */
export function generateCleaningNotebook(csvFilename: string, csvPath: string): JupyterNotebook {
  const metadata: NotebookMetadata = {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3'
    },
    language_info: {
      codemirror_mode: {
        name: 'ipython',
        version: 3
      },
      file_extension: '.py',
      mimetype: 'text/x-python',
      name: 'python',
      nbconvert_exporter: 'python',
      pygments_lexer: 'ipython3',
      version: '3.8.0'
    }
  };

  const cells: NotebookCell[] = [
    // Cell 1: Title and instructions
    createMarkdownCell(
      `# Data Cleaning Notebook: ${csvFilename}\n\n` +
      `This notebook was automatically generated to help you clean your CSV data.\n\n` +
      `**Instructions:**\n` +
      `1. Execute each cell in order (Shift+Enter)\n` +
      `2. Review the output and modify code as needed\n` +
      `3. The final cell will export your cleaned data\n\n` +
      `**Original file:** \`${csvFilename}\``
    ),

    // Cell 2: Import libraries
    createCodeCell(
      `# Import required libraries\n` +
      `import pandas as pd\n` +
      `import numpy as np\n` +
      `import matplotlib.pyplot as plt\n` +
      `import warnings\n` +
      `warnings.filterwarnings('ignore')\n\n` +
      `print("Libraries imported successfully!")`
    ),

    // Cell 3: Load CSV file
    createCodeCell(
      `# Load the CSV file\n` +
      `csv_path = r"${csvPath}"\n` +
      `df = pd.read_csv(csv_path)\n\n` +
      `print(f"Data loaded successfully!")\n` +
      `print(f"Shape: {df.shape}")`
    ),

    // Cell 4: Display data info
    createCodeCell(
      `# Display basic information about the dataset\n` +
      `print("=" * 50)\n` +
      `print("DATASET OVERVIEW")\n` +
      `print("=" * 50)\n\n` +
      `print("\\nFirst 5 rows:")\n` +
      `display(df.head())\n\n` +
      `print("\\nDataset shape:")\n` +
      `print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")\n\n` +
      `print("\\nColumn data types:")\n` +
      `print(df.dtypes)\n\n` +
      `print("\\nBasic statistics:")\n` +
      `display(df.describe())`
    ),

    // Cell 5: Check missing values
    createCodeCell(
      `# Check for missing values\n` +
      `print("=" * 50)\n` +
      `print("MISSING VALUES ANALYSIS")\n` +
      `print("=" * 50)\n\n` +
      `missing_data = df.isnull().sum()\n` +
      `missing_percent = (missing_data / len(df)) * 100\n\n` +
      `missing_df = pd.DataFrame({\n` +
      `    'Missing Count': missing_data,\n` +
      `    'Percentage': missing_percent\n` +
      `})\n\n` +
      `missing_df = missing_df[missing_df['Missing Count'] > 0].sort_values('Missing Count', ascending=False)\n\n` +
      `if len(missing_df) > 0:\n` +
      `    print(f"\\nColumns with missing values:")\n` +
      `    display(missing_df)\n` +
      `else:\n` +
      `    print("\\nNo missing values found!")`
    ),

    // Cell 6: Handle missing values
    createCodeCell(
      `# Handle missing values\n` +
      `print("=" * 50)\n` +
      `print("HANDLING MISSING VALUES")\n` +
      `print("=" * 50)\n\n` +
      `# Strategy 1: Drop rows with missing values (use with caution)\n` +
      `# df_cleaned = df.dropna()\n\n` +
      `# Strategy 2: Fill numeric columns with mean\n` +
      `numeric_cols = df.select_dtypes(include=[np.number]).columns\n` +
      `for col in numeric_cols:\n` +
      `    if df[col].isnull().sum() > 0:\n` +
      `        df[col].fillna(df[col].mean(), inplace=True)\n` +
      `        print(f"Filled missing values in '{col}' with mean")\n\n` +
      `# Strategy 3: Fill categorical columns with mode\n` +
      `categorical_cols = df.select_dtypes(include=['object']).columns\n` +
      `for col in categorical_cols:\n` +
      `    if df[col].isnull().sum() > 0:\n` +
      `        df[col].fillna(df[col].mode()[0] if len(df[col].mode()) > 0 else 'Unknown', inplace=True)\n` +
      `        print(f"Filled missing values in '{col}' with mode")\n\n` +
      `print(f"\\nMissing values after cleaning: {df.isnull().sum().sum()}")`
    ),

    // Cell 7: Remove duplicates
    createCodeCell(
      `# Remove duplicate rows\n` +
      `print("=" * 50)\n` +
      `print("DUPLICATE DETECTION")\n` +
      `print("=" * 50)\n\n` +
      `initial_rows = len(df)\n` +
      `df.drop_duplicates(inplace=True)\n` +
      `final_rows = len(df)\n` +
      `duplicates_removed = initial_rows - final_rows\n\n` +
      `print(f"\\nInitial rows: {initial_rows}")\n` +
      `print(f"Final rows: {final_rows}")\n` +
      `print(f"Duplicates removed: {duplicates_removed}")`
    ),

    // Cell 8: Data type conversions
    createCodeCell(
      `# Data type conversions\n` +
      `print("=" * 50)\n` +
      `print("DATA TYPE CONVERSIONS")\n` +
      `print("=" * 50)\n\n` +
      `# Example: Convert date columns (uncomment and modify as needed)\n` +
      `# date_columns = ['date_column_name']\n` +
      `# for col in date_columns:\n` +
      `#     if col in df.columns:\n` +
      `#         df[col] = pd.to_datetime(df[col], errors='coerce')\n` +
      `#         print(f"Converted '{col}' to datetime")\n\n` +
      `# Example: Convert to categorical (for memory efficiency)\n` +
      `# for col in categorical_cols:\n` +
      `#     if df[col].nunique() < 50:  # If fewer than 50 unique values\n` +
      `#         df[col] = df[col].astype('category')\n` +
      `#         print(f"Converted '{col}' to category")\n\n` +
      `print("\\nCurrent data types:")\n` +
      `print(df.dtypes)`
    ),

    // Cell 9: Outlier detection
    createCodeCell(
      `# Detect outliers using box plots\n` +
      `print("=" * 50)\n` +
      `print("OUTLIER DETECTION")\n` +
      `print("=" * 50)\n\n` +
      `numeric_cols = df.select_dtypes(include=[np.number]).columns\n\n` +
      `if len(numeric_cols) > 0:\n` +
      `    # Calculate number of rows needed for subplots\n` +
      `    n_cols = min(3, len(numeric_cols))\n` +
      `    n_rows = (len(numeric_cols) + n_cols - 1) // n_cols\n` +
      `    \n` +
      `    fig, axes = plt.subplots(n_rows, n_cols, figsize=(15, 5 * n_rows))\n` +
      `    axes = axes.flatten() if len(numeric_cols) > 1 else [axes]\n` +
      `    \n` +
      `    for idx, col in enumerate(numeric_cols):\n` +
      `        axes[idx].boxplot(df[col].dropna())\n` +
      `        axes[idx].set_title(f'Box Plot: {col}')\n` +
      `        axes[idx].set_ylabel('Value')\n` +
      `    \n` +
      `    # Hide empty subplots\n` +
      `    for idx in range(len(numeric_cols), len(axes)):\n` +
      `        axes[idx].set_visible(False)\n` +
      `    \n` +
      `    plt.tight_layout()\n` +
      `    plt.show()\n` +
      `    \n` +
      `    print(f"\\nBox plots generated for {len(numeric_cols)} numeric columns")\n` +
      `else:\n` +
      `    print("\\nNo numeric columns found for outlier detection")`
    ),

    // Cell 10: Export cleaned data
    createCodeCell(
      `# Export cleaned data\n` +
      `print("=" * 50)\n` +
      `print("EXPORT CLEANED DATA")\n` +
      `print("=" * 50)\n\n` +
      `# Generate output path\n` +
      `import os\n` +
      `base_name = os.path.splitext(os.path.basename(csv_path))[0]\n` +
      `output_dir = os.path.join(os.path.dirname(csv_path), '..', 'cleaned')\n` +
      `os.makedirs(output_dir, exist_ok=True)\n` +
      `output_path = os.path.join(output_dir, f"{base_name}_cleaned.csv")\n\n` +
      `# Export to CSV\n` +
      `df.to_csv(output_path, index=False)\n\n` +
      `print(f"\\nCleaned data exported successfully!")\n` +
      `print(f"Output file: {output_path}")\n` +
      `print(f"\\nFinal dataset shape: {df.shape}")\n` +
      `print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")`
    )
  ];

  return {
    cells,
    metadata,
    nbformat: 4,
    nbformat_minor: 5
  };
}
