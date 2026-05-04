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
                {`This code imports the essential Python libraries needed for data analysis and visualization work. Pandas provides tools to load and manipulate tabular data, NumPy enables numerical computations, and Matplotlib allows you to create charts and visualizations. The warnings filter suppresses unnecessary alert messages that can clutter your output during analysis. While this snippet doesn't solve a specific data problem on its own, it's a crucial setup step that every data cleaning and analysis project needs, establishing a clean working environment where you can focus on transforming and exploring your data rather than managing library notifications.`}
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
                {`This code loads a CSV file containing fake job posting data into a pandas DataFrame and displays confirmation information about the dataset. It solves the fundamental first step of any data analysis workflow: getting your data into Python so you can work with it. By printing the shape of the dataset, it immediately tells you how many rows and columns you're dealing with, which gives you a quick sense of your data's size and scope. This matters because understanding what data you have before cleaning and analyzing it helps you plan your next steps and identify potential issues early on.`}
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
                {`This code performs an initial exploratory inspection of a dataset by displaying its structure, size, and basic characteristics. It shows you the first and last few rows, reveals how many rows and columns exist, identifies all column names and their data types, and computes summary statistics like mean and standard deviation. This reconnaissance step is essential in data cleaning because it helps you quickly spot obvious issues like missing values, incorrect data types, unexpected ranges, or suspicious patterns before diving into deeper analysis. By understanding your data's shape and content upfront, you can make informed decisions about which cleaning and transformation steps to prioritize.`}
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
                {`This code identifies and repairs missing values in a dataset, which is a critical first step in data cleaning since incomplete data can break analyses and models. It starts by scanning the entire dataframe to count missing values in each column and calculates what percentage of the data is missing, then displays this summary in a sorted table so you can see which columns need attention. The code then automatically fills missing values using intelligent strategies: numeric columns get filled with their mean (average) value, while categorical columns get filled with their mode (most frequent value), which preserves the statistical properties of each column type. This matters because most machine learning algorithms and statistical analyses cannot handle missing data, so this approach removes a major obstacle before moving forward with analysis while making reasonable assumptions about what the missing values should be.`}
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
                {`This code standardizes text data by removing extra whitespace from the beginning and end of values in all text columns of a dataset. Text inconsistencies like leading or trailing spaces can cause serious problems during analysis—for example, "New York " and "New York" would be treated as different categories when they're actually the same. By normalizing these columns early in your data cleaning workflow, you ensure that downstream operations like grouping, merging, and comparisons work correctly and don't create duplicate entries due to formatting differences. The code also includes an optional step to convert all text to lowercase, which further standardizes data when case variations don't carry meaningful information.`}
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
                {`This code solves the problem of messy, combined location data by splitting a single location column into separate city, state, and country columns. It first searches for any column containing "location," then uses the comma as a delimiter to break the text into individual components, removing extra whitespace from each piece. This transformation is essential in data cleaning because it converts unstructured location information into structured, queryable fields that enable filtering, grouping, and analysis by geographic region. By splitting these values early in your workflow, you make downstream analysis more flexible and accurate.`}
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
                {`This code solves the common problem of salary data being stored as text strings (like "\$50,000-\$60,000") rather than numbers, which prevents mathematical analysis. It automatically identifies any columns with "salary" in their name and extracts the first numeric value from each entry, converting it into a proper numeric format that pandas can use for calculations. This transformation is essential in data cleaning because salary information is often messy and text-based when imported from real-world sources, but analysts need numeric values to compute averages, compare compensation, or build predictive models. By creating clean numeric versions of salary columns, this code prepares the data for meaningful statistical analysis and visualization.`}
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
                {`This code automatically finds text-based binary columns in a dataset (like "Yes/No" or "True/False") and converts them to numeric 1/0 values that machine learning algorithms can process. It intelligently identifies which unique values should map to 1 versus 0 by checking for common affirmative terms like "yes" or "true." This transformation is crucial in data cleaning because many datasets contain categorical binary information that needs to be converted to numbers before training models, and automating this process saves time while ensuring consistency across multiple columns.`}
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
                {`This code identifies and removes duplicate rows from a dataset, which is a critical step in data cleaning because duplicate records can skew analysis results and waste computational resources. It counts the rows before and after removal, then reports how many duplicates were found and what percentage they represent, giving you visibility into data quality issues. By resetting the index afterward, it ensures your dataset has clean, sequential row labels, making it safe to use in downstream analysis. This matters because many real-world datasets contain accidental duplicates from data collection errors or merges, and removing them is one of the first things data scientists do before modeling or analysis.`}
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
                {`This code saves cleaned data to a new CSV file while providing a summary of the transformation results. It constructs an organized output path based on the original file location, creates a "cleaned" subdirectory if needed, and exports the processed DataFrame without row indices. The script then displays useful information about the final dataset—including its dimensions, data types, missing values, and unique value counts—which helps you verify that the cleaning process worked correctly and understand what your data looks like before moving to analysis. This matters in data workflows because documenting and validating your cleaned output ensures reproducibility, catches potential errors, and provides a clear handoff point between data preparation and downstream modeling or visualization tasks.`}
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
          href="/ipynb/fj3/charts"
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
