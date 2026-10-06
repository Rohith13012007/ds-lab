module.exports = [
  {
    id: "exp-1",
    title: "Experiment 1: Data Preprocessing & Cleaning",
    description: "Learn how to handle missing values, eliminate duplicates, and perform feature normalization.",
    module: "1",
    experimentNumber: "1",
    subExperiments: [
      {
        id: "sub-1a",
        codeNum: "1a",
        title: "1a. Ingestion & Missing Value Imputation",
        githubUrl: "",
        code: `# Experiment 1a: Ingestion & Missing Value Imputation\nimport pandas as pd\nimport numpy as np\n\n# Sample dataset with missing values\ndata = {\n    'age': [25, np.nan, 30, 35, 40],\n    'income': [50000, 60000, np.nan, 80000, 90000],\n    'score': [85, 90, 78, np.nan, 92]\n}\ndf = pd.DataFrame(data)\nprint("Raw DataFrame:")\nprint(df)\n\n# Impute missing values with column mean\ndf_imputed = df.fillna(df.mean())\nprint("\\nImputed DataFrame:")\nprint(df_imputed)`,
        outputType: "console",
        consoleOutput: `Raw DataFrame:\n    age   income  score\n0  25.0  50000.0   85.0\n1   NaN  60000.0   90.0\n2  30.0      NaN   78.0\n3  35.0  80000.0    NaN\n4  40.0  90000.0   92.0\n\nImputed DataFrame:\n    age   income  score\n0  25.0  50000.0   85.0\n1  32.5  60000.0   90.0\n2  30.0  70000.0   78.0\n3  35.0  80000.0   86.25\n4  40.0  90000.0   92.0\n\n[STATUS] Execution Completed (Exit Code: 0)`
      },
      {
        id: "sub-1b",
        codeNum: "1b",
        title: "1b. Feature Scaling & Normalization",
        githubUrl: "",
        code: `# Experiment 1b: Feature Scaling & Normalization\nimport pandas as pd\nfrom sklearn.preprocessing import MinMaxScaler\n\ndata = {'feature1': [10, 20, 30, 40, 50], 'feature2': [1000, 2000, 3000, 4000, 5000]}\ndf = pd.DataFrame(data)\n\nscaler = MinMaxScaler()\nscaled_data = scaler.fit_transform(df)\nscaled_df = pd.DataFrame(scaled_data, columns=df.columns)\nprint("MinMax Scaled DataFrame:")\nprint(scaled_df)`,
        outputType: "console",
        consoleOutput: `MinMax Scaled DataFrame:\n   feature1  feature2\n0      0.00      0.00\n1      0.25      0.25\n2      0.50      0.50\n3      0.75      0.75\n4      1.00      1.00\n\n[STATUS] Execution Completed (Exit Code: 0)`
      }
    ]
  },
  {
    id: "exp-2",
    title: "Experiment 2: Exploratory Data Analysis & Visualization",
    description: "Analyze feature distributions, correlation matrices, and summary statistics.",
    module: "2",
    experimentNumber: "2",
    subExperiments: [
      {
        id: "sub-2a",
        codeNum: "2a",
        title: "2a. Iris Dataset Exploration & Summary",
        githubUrl: "",
        code: `# Experiment 2a: Iris Dataset Exploration\nimport pandas as pd\n\n# Load sample dataset\nurl = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"\ndf = pd.read_csv(url)\nprint("First 5 rows of Iris Dataset:")\nprint(df.head())\nprint("\\nSummary Statistics:")\nprint(df.describe())`,
        outputType: "console",
        consoleOutput: `First 5 rows of Iris Dataset:\n   sepal_length  sepal_width  petal_length  petal_width species\n0           5.1          3.5           1.4          0.2  setosa\n1           4.9          3.0           1.4          0.2  setosa\n2           4.7          3.2           1.3          0.2  setosa\n3           4.6          3.1           1.5          0.2  setosa\n4           5.0          3.6           1.4          0.2  setosa\n\nSummary Statistics:\n       sepal_length  sepal_width  petal_length  petal_width\ncount    150.000000   150.000000    150.000000   150.000000\nmean       5.843333     3.057333      3.758000     1.199333\nstd        0.828066     0.435866      1.765298     0.762238\nmin        4.300000     2.000000      1.000000     0.100000\nmax        7.900000     4.400000      6.900000     2.500000\n\n[STATUS] Execution Completed (Exit Code: 0)`
      }
    ]
  }
];
