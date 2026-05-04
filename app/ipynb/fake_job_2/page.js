export default function TutorialPage() {
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

      {/* Introduction Row */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">
          Data Cleaning Tutorial
        </h2>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p><strong>Raw Dataset:</strong> fake_job_postings.csv</p>
          <p><strong>Cleaned Dataset:</strong> fake_job_postings_cleaned.csv</p>
          <p><strong>Purpose:</strong> This tutorial demonstrates the step-by-step data cleaning process applied to transform the raw dataset into a cleaned, analysis-ready format.</p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 1
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Import required libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')

print("Libraries imported successfully!")
`}</code>
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
                {`This code sets up the essential Python libraries needed for data analysis and visualization work. It imports pandas for working with data tables, NumPy for numerical operations, and Matplotlib for creating charts and plots, while suppressing warning messages that might clutter your output. While this code doesn't directly clean or transform data itself, it solves the foundational problem of preparing your environment before diving into any data science task. This initialization step matters because without these libraries properly loaded, you won't be able to read datasets, perform calculations, or visualize your findings—making it the necessary first step in virtually every data cleaning and analysis workflow.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 2
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Load the CSV file
csv_path = r"D:\\Gannon\\4semester\\jupyter\\notebook-studio\\app\\ipynb\\uploads\\1777313505416_fake_job_postings.csv"
df = pd.read_csv(csv_path)

print(f"Data loaded successfully!")
print(f"Shape: \{df.shape\}")
`}</code>
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
                {`This code loads a CSV file containing fake job postings data into a pandas DataFrame, which is the standard way to work with tabular data in Python. It then prints confirmation messages showing that the data loaded successfully and displays the dimensions of the dataset (number of rows and columns). This is a foundational step in any data analysis workflow because you need to first import your raw data before you can explore, clean, or analyze it. Checking the shape immediately helps you verify that the file loaded correctly and gives you a sense of how much data you're working with.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 3
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Display basic information about the dataset
print("=" * 50)
print("DATASET OVERVIEW")
print("=" * 50)

print("\\nFirst 5 rows:")
display(df.head())

print("\\nLast 5 rows:")
display(df.tail())

print("\\nDataset shape:")
print(f"Rows: \{df.shape[0]\}, Columns: \{df.shape[1]\}")

print("\\nColumn names:")
print(df.columns.tolist())

print("\\nColumn data types:")
print(df.dtypes)

print("\\nBasic statistics:")
display(df.describe())
`}</code>
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
                {`This code solves the fundamental problem of understanding your dataset before diving into analysis by providing a comprehensive overview of its structure and content. It performs multiple transformations that display key information: showing sample rows from the beginning and end of the data, revealing the total number of rows and columns, listing all column names, identifying each column's data type, and calculating summary statistics like mean and standard deviation. This matters in a data cleaning workflow because these checks help you quickly spot issues like incorrect data types, missing values, unexpected ranges, or structural problems that need fixing before further analysis. By examining this overview first, you can make informed decisions about what cleaning steps are necessary and avoid wasting time on analysis built on flawed data.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 4
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Check for missing values
print("=" * 50)
print("MISSING VALUES ANALYSIS")
print("=" * 50)

missing_data = df.isnull().sum()
missing_percent = (missing_data / len(df)) * 100

missing_df = pd.DataFrame(\{
    'Missing Count': missing_data,
    'Percentage': missing_percent
\})

missing_df = missing_df[missing_df['Missing Count'] > 0].sort_values('Missing Count', ascending=False)

if len(missing_df) > 0:
    print(f"\\nColumns with missing values:")
    display(missing_df)
    
    # Fill numeric columns with mean
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if df[col].isnull().sum() > 0:
            df[col].fillna(df[col].mean(), inplace=True)
            print(f"Filled missing values in '\{col\}' with mean")
    
    # Fill categorical columns with mode
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        if df[col].isnull().sum() > 0:
            df[col].fillna(df[col].mode()[0] if len(df[col].mode()) > 0 else 'Unknown', inplace=True)
            print(f"Filled missing values in '\{col\}' with mode")
else:
    print("\\nNo missing values found!")

print(f"\\nMissing values after cleaning: \{df.isnull().sum().sum()\}")
`}</code>
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
                {`This code identifies and repairs missing values in a dataset, which is one of the most common data quality issues you'll encounter. It first scans the entire dataframe to find which columns have gaps and how severe the problem is, then automatically fills those gaps using intelligent strategies: numeric columns get filled with their average value, while categorical columns get filled with their most frequent value. This matters because most machine learning algorithms can't handle missing data, so this cleaning step is essential before you can train models or perform meaningful analysis. By automating the detection and filling process with appropriate methods for each data type, the code saves time and ensures consistent handling across your entire dataset.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 5 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 5
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Normalize text columns
print("=" * 50)
print("TEXT NORMALIZATION")
print("=" * 50)

text_cols = df.select_dtypes(include=['object']).columns

for col in text_cols:
    # Strip whitespace
    df[col] = df[col].str.strip()
    # Convert to lowercase (optional - comment out if not needed)
    # df[col] = df[col].str.lower()
    print(f"Normalized text in column: \{col\}")

print(f"\\nText normalization complete for \{len(text_cols)\} columns")
`}</code>
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
                {`This code identifies all text columns in a dataset and cleans them by removing leading and trailing whitespace, with an optional conversion to lowercase. Text normalization solves the problem of inconsistent formatting where identical values might be stored differently (like "Apple" versus " Apple "), which can cause duplicates and incorrect groupings during analysis. By standardizing text format early in the data cleaning process, you prevent these inconsistencies from breaking downstream analyses, merges, and aggregations. This is a crucial step in data preparation because messy text is one of the most common data quality issues that can silently skew your results if left unaddressed.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 6 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 6
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Split location column into components
print("=" * 50)
print("LOCATION SPLITTING")
print("=" * 50)

# Check if location column exists
location_col = None
for col in df.columns:
    if 'location' in col.lower():
        location_col = col
        break

if location_col:
    print(f"Found location column: \{location_col\}")
    
    # Split by comma
    location_split = df[location_col].str.split(',', expand=True)
    
    if location_split.shape[1] >= 1:
        df['city'] = location_split[0].str.strip()
        print("Created 'city' column")
    
    if location_split.shape[1] >= 2:
        df['state'] = location_split[1].str.strip()
        print("Created 'state' column")
    
    if location_split.shape[1] >= 3:
        df['country'] = location_split[2].str.strip()
        print("Created 'country' column")
    
    print(f"\\nLocation split complete!")
    display(df[['city', 'state'] + (['country'] if 'country' in df.columns else [])].head())
else:
    print("No location column found - skipping split")
`}</code>
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
                {`This code solves the common data cleaning problem of extracting structured geographic information from a combined location field. It searches for a location column in your dataset, then splits it by commas to separate city, state, and country into individual columns, using \`.strip()\` to remove extra whitespace. This transformation matters because it converts messy, unstructured text into clean, separate fields that are much easier to analyze, filter, and aggregate by geographic region in later analysis. By creating these distinct columns, you enable more sophisticated operations like grouping sales by state or finding patterns across countries.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 7 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 7
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Parse salary range fields
print("=" * 50)
print("SALARY PARSING")
print("=" * 50)

# Find salary-related columns
salary_cols = [col for col in df.columns if 'salary' in col.lower()]

if salary_cols:
    print(f"Found salary columns: \{salary_cols\}")
    
    for col in salary_cols:
        # Extract numeric values from salary strings
        df[f'\{col\}_numeric'] = df[col].astype(str).str.extract(r'(\\d+)')[0]
        df[f'\{col\}_numeric'] = pd.to_numeric(df[f'\{col\}_numeric'], errors='coerce')
        print(f"Created numeric column: \{col\}_numeric")
    
    print(f"\\nSalary parsing complete!")
    display(df[[col for col in df.columns if 'salary' in col.lower()]].head())
else:
    print("No salary columns found - skipping parsing")
`}</code>
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
                {`This code solves the problem of extracting usable numbers from messy salary text fields that often contain currency symbols, commas, or other non-numeric characters. It automatically identifies all columns with "salary" in their name, then transforms them by extracting the first number found in each entry and converting it to a proper numeric data type that can be used for calculations and analysis. This transformation is crucial in data cleaning because salary data frequently arrives in human-readable formats (like "\$50,000-\$75,000") that computers can't perform arithmetic on, so converting it to clean numbers enables meaningful statistical analysis like calculating averages or filtering by pay range.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 8 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 8
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Normalize binary columns
print("=" * 50)
print("BINARY NORMALIZATION")
print("=" * 50)

# Find binary columns (Yes/No, True/False, etc.)
for col in df.select_dtypes(include=['object']).columns:
    unique_vals = df[col].dropna().unique()
    
    # Check if column has only 2 unique values
    if len(unique_vals) == 2:
        # Map to 1/0
        val1, val2 = unique_vals[0], unique_vals[1]
        
        # Determine which value should be 1
        if str(val1).lower() in ['yes', 'true', 't', '1']:
            df[col] = df[col].map(\{val1: 1, val2: 0\})
        elif str(val2).lower() in ['yes', 'true', 't', '1']:
            df[col] = df[col].map(\{val1: 0, val2: 1\})
        else:
            df[col] = df[col].map(\{val1: 1, val2: 0\})
        
        print(f"Normalized binary column '\{col\}': \{val1\}/\{val2\} → 1/0")

print("\\nBinary normalization complete!")
`}</code>
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
                {`This code identifies text-based binary columns in a dataset (like "Yes/No" or "True/False") and converts them to numeric 1/0 values. It automatically detects columns with exactly two unique values, intelligently maps the positive values to 1 and negative values to 0, and reports what was changed. This transformation matters in data cleaning because many machine learning algorithms require numeric inputs and work better with standardized binary encoding, while also making your dataset more compact and uniform for downstream analysis.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 9 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 9
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Remove duplicate rows
print("=" * 50)
print("DUPLICATE DETECTION AND REMOVAL")
print("=" * 50)

initial_rows = len(df)
df.drop_duplicates(inplace=True)
df.reset_index(drop=True, inplace=True)
final_rows = len(df)
duplicates_removed = initial_rows - final_rows

print(f"\\nInitial rows: \{initial_rows\}")
print(f"Final rows: \{final_rows\}")
print(f"Duplicates removed: \{duplicates_removed\}")

if duplicates_removed > 0:
    print(f"Removed \{duplicates_removed\} duplicate rows (\{(duplicates_removed/initial_rows)*100:.2f\}%)")
else:
    print("No duplicates found!")
`}</code>
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
                {`This code identifies and removes duplicate rows from a dataset, a common problem in data cleaning where the same record appears multiple times due to data entry errors or merging sources. It performs the transformation by using \`drop_duplicates()\` to eliminate exact row matches and \`reset_index()\` to renumber the rows sequentially afterward. This matters because duplicate records can skew analysis results, inflate counts, and lead to incorrect insights, so removing them is typically one of the first steps in preparing data for reliable analysis. The code also provides helpful feedback by comparing the before and after row counts and displaying what percentage of the data was affected.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 10 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 10
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Export cleaned data
print("=" * 50)
print("EXPORT CLEANED DATA")
print("=" * 50)

# Generate output path
import os
base_name = os.path.splitext(os.path.basename(csv_path))[0]
output_dir = os.path.join(os.path.dirname(csv_path), '..', 'cleaned')
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, f"\{base_name\}_cleaned.csv")

# Export to CSV
df.to_csv(output_path, index=False)

print(f"\\nCleaned data exported successfully!")
print(f"Output file: \{output_path\}")
print(f"\\nFinal dataset shape: \{df.shape\}")
print(f"Rows: \{df.shape[0]\}, Columns: \{df.shape[1]\}")

print("\\nColumn summary:")
display(pd.DataFrame(\{
    'Column': df.columns,
    'Type': df.dtypes.values,
    'Non-Null': df.count().values,
    'Unique': [df[col].nunique() for col in df.columns]
\}))
`}</code>
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
                {`This code solves the problem of saving cleaned data in an organized way while documenting what was accomplished during the data cleaning process. It takes a processed DataFrame and exports it to a CSV file in a dedicated "cleaned" folder, automatically generating a descriptive filename based on the original file. The code then performs a critical verification step by displaying the final dataset's shape, data types, and unique value counts—allowing you to confirm that cleaning operations preserved data integrity and didn't introduce unexpected issues. This matters in data cleaning workflows because exporting results systematically and generating a summary report ensures your work is reproducible, organized, and ready for downstream analysis or sharing with colleagues.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Link */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
          📊 Visualize Your Data
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
          View interactive charts and visualizations of the cleaned dataset.
        </p>
        <a
          href="/ipynb/fake_job_2/charts"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          View Charts Dashboard →
        </a>
      </div>

        </div>
      </div>
    </div>
  );
}
