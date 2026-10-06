export const initialProfile = {
  name: "M. Sandya Rani",
  rollNo: "24102A030063",
  branch: "Data Science",
  section: "1",
  professor: "Bosubabu",
  quote: "Small steps every day lead to big results.",
  photo: "/sandya.jpeg"
};

export const initialModules = [
  {
    id: "mod-1",
    moduleNumber: 1,
    title: "INTRODUCTION TO DATA SCIENCE",
    description: "Understand data sources, cleaning and preprocessing techniques.",
    icon: "Database",
    colorTheme: "blue",
    badgeColor: "from-blue-500 to-cyan-400",
    bgColor: "bg-blue-950/40",
    borderColor: "border-blue-500/30",
    btnColor: "bg-blue-600 hover:bg-blue-500",
    syllabus: [
      "1.1 Definition of data science",
      "1.2 Skills for data science",
      "1.3 Tools for data science",
      "1.4 Data types",
      "1.5 Data collections",
      "1.6 Data preprocessing"
    ],
    resources: [
      { name: "Module 1 Complete Lecture Notes.pdf", size: "2.4 MB", type: "pdf", date: "2026-09-15" },
      { name: "Lab_01_Preprocessing_Guide.ipynb", size: "1.1 MB", type: "ipynb", date: "2026-09-18" },
      { name: "housing_raw_dataset.csv", size: "450 KB", type: "csv", date: "2026-09-20" }
    ],
    summary: "Master fundamental data Wrangling skills. Learn how to ingest structured and unstructured datasets, resolve missing values, normalize scales, and prepare feature sets ready for machine learning algorithms."
  },
  {
    id: "mod-2",
    moduleNumber: 2,
    title: "DATA EXTRACTION",
    description: "Explore data using statistical methods and visualizations.",
    icon: "BarChart3",
    colorTheme: "purple",
    badgeColor: "from-purple-500 to-indigo-400",
    bgColor: "bg-purple-950/40",
    borderColor: "border-purple-500/30",
    btnColor: "bg-purple-600 hover:bg-purple-500",
    syllabus: [
      "2.1 Extracting meaning from data-Feature selection",
      "2.2 User retention",
      "2.3 Filters",
      "2.4 Wrappers",
      "2.5 Entropy",
      "2.6 Decision tree algorithm"
    ],
    resources: [
      { name: "Module 2 EDA Cheatsheet.pdf", size: "3.1 MB", type: "pdf", date: "2026-09-22" },
      { name: "Seaborn_Visualization_Masterclass.ipynb", size: "2.8 MB", type: "ipynb", date: "2026-09-25" },
      { name: "sales_data_eda.csv", size: "890 KB", type: "csv", date: "2026-09-27" }
    ],
    summary: "Learn to uncover hidden patterns and stories in data. Master statistical summary techniques and high-impact visualizations including distributions, scatter plots, pairplots, and heatmaps."
  },
  {
    id: "mod-3",
    moduleNumber: 3,
    title: "DATA VISUALIZATION",
    description: "Learn supervised & unsupervised learning techniques.",
    icon: "Brain",
    colorTheme: "green",
    badgeColor: "from-emerald-500 to-teal-400",
    bgColor: "bg-emerald-950/40",
    borderColor: "border-emerald-500/30",
    btnColor: "bg-emerald-600 hover:bg-emerald-500",
    syllabus: [
      "3.1 A Brief matplotlib API primer",
      "3.2 Bar plots",
      "3.3 Histograms ",
      "3.4 density plots",
      "3.5 Scatter plots",
      "3.6 Facet grids"
    ],
    resources: [
      { name: "Scikit-Learn Machine Learning Roadmap.pdf", size: "4.5 MB", type: "pdf", date: "2026-09-28" },
      { name: "Classification_Clustering_Workbench.ipynb", size: "3.9 MB", type: "ipynb", date: "2026-09-30" }
    ],
    summary: "Explore classical AI algorithms for classification, regression, and clustering. Build end-to-end predictive models using Scikit-Learn with cross-validation and hyperparameter tuning."
  },
  {
    id: "mod-4",
    moduleNumber: 4,
    title: "STATISTICAL THINKING",
    description: "Build neural networks and work with advanced models.",
    icon: "Network",
    colorTheme: "orange",
    badgeColor: "from-amber-500 to-orange-400",
    bgColor: "bg-amber-950/40",
    borderColor: "border-amber-500/30",
    btnColor: "bg-amber-600 hover:bg-amber-500",
    syllabus: [
      "4.1 Outliers",
      "4.2 Summarizing distributions",
      "4.3 Variance",
      "4.4 Reporting results",
      "4.5 Plotting PMFs",
      "4.6 Other visualizations"
    ],
    resources: [
      { name: "Deep Learning with PyTorch & TensorFlow.pdf", size: "5.2 MB", type: "pdf", date: "2026-10-01" },
      { name: "CNN_Image_Classification.ipynb", size: "4.1 MB", type: "ipynb", date: "2026-10-03" }
    ],
    summary: "Dive deep into modern neural network architectures. Learn how backpropagation works, build CNN models for image processing, and analyze sequential text/time-series data with RNNs."
  },
  {
    id: "mod-5",
    moduleNumber: 5,
    title: "TIME SERIES ANALYSIS AND PREDICTIVE MODELING",
    description: "Apply data science in real-world problems and projects.",
    icon: "FileCode",
    colorTheme: "pink",
    badgeColor: "from-pink-500 to-rose-400",
    bgColor: "bg-pink-950/40",
    borderColor: "border-pink-500/30",
    btnColor: "bg-pink-600 hover:bg-pink-500",
    syllabus: [
      "5.1 Importing and cleaning Plotting",
      "5.2 Moving averages",
      "5.3 Missing values",
      "5.4 Serial correlation",
      "5.5 Predictive modeling",
      "5.6 Sentiment analysis."
    ],
    resources: [
      { name: "Capstone Project Blueprints.pdf", size: "6.0 MB", type: "pdf", date: "2026-10-04" },
      { name: "Deploying_DS_Models_Guide.pdf", size: "2.1 MB", type: "pdf", date: "2026-10-05" }
    ],
    summary: "Bridge theory and industry practice. Solve end-to-end industry case studies, tackle imbalanced data, build recommender engines, and deploy models to web endpoints."
  }
];

export const initialExperiments = [
  {
    id: "exp-1",
    title: "Experiment 1: Data Preprocessing & Cleaning",
    description: "Learn how to handle missing values, eliminate duplicates, and perform feature normalization.",
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

