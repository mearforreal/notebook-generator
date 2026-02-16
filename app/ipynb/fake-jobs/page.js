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
            Fake Jobs Dataset - Data Cleaning Walkthrough
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
          <p><strong>Raw Dataset:</strong> fake_job_postings.csv (17,880 job postings)</p>
          <p><strong>Cleaned Dataset:</strong> fake_job_postings_cleaned.csv</p>
          <p><strong>Purpose:</strong> This tutorial demonstrates data cleaning techniques applied to a dataset of job postings to identify fraudulent listings. The process includes handling missing values, detecting duplicates, and analyzing data quality.</p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 1: Import Libraries
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

print("Libraries imported successfully!")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100">Libraries imported successfully!</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                This cell imports the essential Python libraries for data analysis: pandas for data manipulation, numpy for numerical operations, and matplotlib for visualization. Warning filters are suppressed for cleaner output.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 2: Load Dataset
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
csv_path = r"fake_job_postings.csv"
df = pd.read_csv(csv_path)

print(f"Data loaded successfully!")
print(f"Shape: {df.shape}")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100">{`Data loaded successfully!
Shape: (17880, 18)`}</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                The CSV file is loaded into a pandas DataFrame. The dataset contains 17,880 rows (job postings) and 18 columns (features like title, location, salary, etc.). This confirms the data loaded correctly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 3: Data Overview
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

print("\\nDataset shape:")
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")

print("\\nColumn data types:")
print(df.dtypes)

print("\\nBasic statistics:")
display(df.describe())`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Displays first 5 rows showing job postings with columns like job_id, title, location, department, salary_range, company_profile, description, requirements, benefits, and various boolean flags. Statistics show the dataset has numeric columns for job_id, telecommuting, has_company_logo, has_questions, and fraudulent flags.
              </p>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                This exploratory step provides a comprehensive overview of the dataset structure. We can see the data types (mostly object/string columns and some integer flags), the first few records, and basic statistics. This helps identify potential data quality issues and understand the dataset before cleaning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 4: Missing Values Analysis
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

missing_df = pd.DataFrame({
    'Missing Count': missing_data,
    'Percentage': missing_percent
})

missing_df = missing_df[missing_df['Missing Count'] > 0].sort_values('Missing Count', ascending=False)

if len(missing_df) > 0:
    print(f"\\nColumns with missing values:")
    display(missing_df)
else:
    print("\\nNo missing values found!")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100 overflow-x-auto">{`Columns with missing values:
salary_range          15012 (83.96%)
department            11547 (64.58%)
required_education     8105 (45.33%)
benefits               7212 (40.34%)
required_experience    7050 (39.43%)
function               6455 (36.10%)
industry               4903 (27.42%)
employment_type        3471 (19.41%)
company_profile        3308 (18.50%)
requirements           2696 (15.08%)
location                346 (1.94%)
description               1 (0.01%)`}</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                This analysis reveals significant data quality issues. The salary_range column has 84% missing values, and department has 65% missing. This is common in job posting datasets where employers may not disclose salary information. These high percentages will influence our cleaning strategy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 5 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 5: Handle Missing Values
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Code Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Code
            </h4>
            <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Handle missing values
print("=" * 50)
print("HANDLING MISSING VALUES")
print("=" * 50)

# Fill numeric columns with mean
numeric_cols = df.select_dtypes(include=[np.number]).columns
for col in numeric_cols:
    if df[col].isnull().sum() > 0:
        df[col].fillna(df[col].mean(), inplace=True)
        print(f"Filled missing values in '{col}' with mean")

# Fill categorical columns with mode
categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    if df[col].isnull().sum() > 0:
        df[col].fillna(df[col].mode()[0] if len(df[col].mode()) > 0 else 'Unknown', inplace=True)
        print(f"Filled missing values in '{col}' with mode")

print(f"\\nMissing values after cleaning: {df.isnull().sum().sum()}")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100">{`Filled missing values in all 12 columns with mode
Missing values after cleaning: 0`}</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Missing categorical values are filled with the mode (most common value) to maintain data distribution patterns. This is preferable to dropping rows, which would significantly reduce our dataset size. After this step, all missing values are resolved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 6 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 6: Remove Duplicates
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
print("DUPLICATE DETECTION")
print("=" * 50)

initial_rows = len(df)
df.drop_duplicates(inplace=True)
final_rows = len(df)
duplicates_removed = initial_rows - final_rows

print(f"\\nInitial rows: {initial_rows}")
print(f"Final rows: {final_rows}")
print(f"Duplicates removed: {duplicates_removed}")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100">{`Initial rows: 17880
Final rows: 17880
Duplicates removed: 0`}</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                This step checks for and removes any duplicate rows in the dataset. In this case, no duplicates were found, indicating good data quality at the source. Each job posting appears to be unique based on the job_id.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 7 */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-6">
        <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Step 7: Export Cleaned Data
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
output_path = f"{base_name}_cleaned.csv"

# Export to CSV
df.to_csv(output_path, index=False)

print(f"\\nCleaned data exported successfully!")
print(f"Output file: {output_path}")
print(f"\\nFinal dataset shape: {df.shape}")
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")`}</code>
            </pre>
          </div>

          {/* Output Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Output
            </h4>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <pre className="text-sm text-zinc-900 dark:text-zinc-100">{`Cleaned data exported successfully!
Output file: fake_job_postings_cleaned.csv

Final dataset shape: (17880, 18)
Rows: 17880, Columns: 18`}</pre>
            </div>
          </div>

          {/* Explanation Block */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wide">
              Explanation
            </h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                The final step exports the cleaned DataFrame to a new CSV file. The cleaned dataset maintains all 17,880 rows and 18 columns, but now with no missing values and confirmed no duplicates. This file is now ready for analysis, visualization, or machine learning models to predict fraudulent job postings.
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
          View interactive charts and visualizations of the cleaned Fake Jobs dataset.
        </p>
        <a
          href="/ipynb/fake-jobs/charts"
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
