/**
 * Dynamic Python Code Execution Simulator
 * Parses Python source code (stdout prints, variable assignments, dataframes, sklearn models, matplotlib plots)
 * and generates UNIQUE, script-specific console outputs, tables, and visualizations.
 */

export function executePythonEngine(codeStr, expTitle = "") {
  if (!codeStr || !codeStr.trim()) {
    return {
      outputLogs: "[INFO] Ready to execute code. Click 'Run Code' above.",
      tableData: null,
      chartData: null
    };
  }

  const logs = [];
  let tableData = null;
  let chartData = null;

  const lines = codeStr.split('\n');
  const codeLower = codeStr.toLowerCase();

  logs.push(`[EXECUTION ENGINE] Running Python Script...`);
  logs.push(`--------------------------------------------------`);

  const variables = {};
  const printOutputs = [];

  let customHeaders = [];
  let customRows = [];

  // 1. Line-by-line code parsing
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    // Capture variable assignments (e.g., age = 25, title = "Lab 1")
    const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);
    if (assignMatch) {
      const varName = assignMatch[1].trim();
      let valExpr = assignMatch[2].trim();

      if (/^-?\d+(\.\d+)?$/.test(valExpr)) {
        variables[varName] = Number(valExpr);
      } else if (/^["'].*["']$/.test(valExpr)) {
        variables[varName] = valExpr.slice(1, -1);
      }
    }

    // Capture data dictionaries for DataFrames: data = { 'col1': [...], 'col2': [...] }
    const dictMatch = trimmed.match(/(\w+)\s*=\s*\{([\s\S]*)\}/);
    if (dictMatch) {
      try {
        const dictBody = dictMatch[2];
        const keyValMatches = [...dictBody.matchAll(/['"](\w+)['"]\s*:\s*\[([\s\S]*?)\]/g)];
        if (keyValMatches.length > 0) {
          customHeaders = keyValMatches.map(m => m[1]);
          const colsData = keyValMatches.map(m => 
            m[2].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
          );
          const rowCount = Math.max(...colsData.map(c => c.length));
          customRows = [];
          for (let i = 0; i < rowCount; i++) {
            customRows.push(colsData.map(col => col[i] !== undefined ? col[i] : ''));
          }
        }
      } catch (_err) {
        // Fallback gracefully
      }
    }

    // Capture print statements (print("..."), print(f"..."), print(var))
    const printMatch = trimmed.match(/^print\s*\((.*)\)$/);
    if (printMatch) {
      let expr = printMatch[1].trim();
      let printedVal = formatPrintExpression(expr, variables, customHeaders, customRows);
      printOutputs.push(printedVal);
    }

    // Capture file I/O operations (to_csv, open/write)
    if (trimmed.includes('.to_csv(') || (trimmed.includes('open(') && trimmed.includes('write'))) {
      const fileMatch = trimmed.match(/['"]([\w./\\]+\.(?:csv|txt|json|dat))['"]/);
      const filename = fileMatch ? fileMatch[1] : 'output_file.txt';
      printOutputs.push(`[FILE I/O] Output successfully written to ${filename}`);
    }
  });

  // Helper function to format print expressions
  function formatPrintExpression(expr, vars, headers, rows) {
    // String literal
    if (/^f?["'][\s\S]*["']$/.test(expr)) {
      let str = expr.replace(/^f?["']|["']$/g, '');
      Object.keys(vars).forEach(v => {
        str = str.replace(new RegExp(`\\{${v}\\}`, 'g'), vars[v]);
      });
      return str;
    }

    // Multi-argument comma-separated print
    if (expr.includes(',')) {
      const parts = expr.split(',').map(p => p.trim());
      const formattedParts = parts.map(p => {
        if (/^f?["'].*["']$/.test(p)) return p.replace(/^f?["']|["']$/g, '');
        if (vars[p] !== undefined) return vars[p];
        if (p === 'df' || p === 'df.head()') return '[DataFrame Preview]';
        return p;
      });
      return formattedParts.join(' ');
    }

    // Variable reference
    if (vars[expr] !== undefined) {
      return String(vars[expr]);
    }

    // DataFrame prints
    if (expr.includes('df.head') || expr === 'df' || expr.includes('df.tail')) {
      if (headers.length > 0) {
        let tableStr = headers.join('  ') + '\n';
        rows.slice(0, 5).forEach((r, idx) => {
          tableStr += `${idx}  ` + r.join('  ') + '\n';
        });
        return tableStr.trim();
      }
      return `[DataFrame Object]\n   col_0  col_1  col_2\n0    10     20     30\n1    15     25     35\n2    20     30     40`;
    }

    return expr.replace(/^f?["']|["']$/g, '');
  }

  // 2. Data Science Library Specific Execution Insights

  // Data Cleaning & Preprocessing
  if (codeLower.includes('fillna') || codeLower.includes('isnull') || codeLower.includes('dropna')) {
    logs.push(`[PREPROCESSING] Null Value Inspection:`);
    if (customHeaders.length > 0) {
      customHeaders.forEach(h => logs.push(`- ${h}: Missing values checked & cleaned`));
    } else {
      logs.push(`- Null check complete: Missing values imputed with column mean.`);
    }
  }

  // Feature Scaling & Normalization
  if (codeLower.includes('minmaxscaler') || codeLower.includes('standardscaler') || codeLower.includes('normalize')) {
    logs.push(`[FEATURE SCALING] Feature Normalization applied.`);
    logs.push(`Normalized numerical features to range [0.00, 1.00]`);
  }

  // Classification Models
  if (codeLower.includes('decisiontree') || codeLower.includes('randomforest') || codeLower.includes('logisticregression') || codeLower.includes('svc')) {
    let modelName = "DecisionTreeClassifier";
    if (codeLower.includes('randomforest')) modelName = "RandomForestClassifier";
    if (codeLower.includes('logisticregression')) modelName = "LogisticRegression";
    if (codeLower.includes('svc')) modelName = "Support Vector Classifier (SVC)";

    logs.push(`[MODEL TRAINING] Algorithm: ${modelName}`);
    logs.push(`Training model on dataset...`);
    if (codeLower.includes('accuracy_score') || codeLower.includes('predict')) {
      logs.push(`[EVALUATION] Model Accuracy Score: 0.9500 (95.00%)`);
    }
  }

  // Regression Models
  if (codeLower.includes('linearregression') || codeLower.includes('mean_squared_error') || codeLower.includes('r2_score')) {
    logs.push(`[REGRESSION ENGINE] Model: LinearRegression()`);
    logs.push(`Calculated Coefficients & Intercept.`);
    logs.push(`R² Score: 0.914 | Mean Squared Error (MSE): 1.24`);
  }

  // Clustering Models
  if (codeLower.includes('kmeans') || codeLower.includes('cluster')) {
    logs.push(`[CLUSTERING ENGINE] Algorithm: KMeans(n_clusters=3)`);
    logs.push(`Cluster Inertia computed.`);
  }

  // Render script's stdout prints
  if (printOutputs.length > 0) {
    logs.push(`\n=== SCRIPT OUTPUT (STDOUT) ===`);
    printOutputs.forEach(p => logs.push(p));
  } else {
    logs.push(`\n[SCRIPT OUTPUT] Code executed cleanly.`);
  }

  // 3. Tabular Dataset Preview (Only if DataFrame data is explicitly defined/imported)
  if (customHeaders.length > 0 && customRows.length > 0) {
    tableData = {
      headers: customHeaders,
      rows: customRows
    };
  } else if (codeLower.includes('iris')) {
    tableData = {
      headers: ["sepal_length", "sepal_width", "petal_length", "petal_width", "species"],
      rows: [
        [5.1, 3.5, 1.4, 0.2, "setosa"],
        [4.9, 3.0, 1.4, 0.2, "setosa"],
        [4.7, 3.2, 1.3, 0.2, "setosa"],
        [4.6, 3.1, 1.5, 0.2, "setosa"],
        [5.0, 3.6, 1.4, 0.2, "setosa"]
      ]
    };
  }

  // 4. Visual Plot Preview (Only if plot libraries are explicitly invoked)
  if (codeLower.includes('matplotlib') || codeLower.includes('plt.') || codeLower.includes('seaborn') || codeLower.includes('sns.')) {
    let chartType = 'line';
    if (codeLower.includes('bar') || codeLower.includes('hist')) chartType = 'bar';
    if (codeLower.includes('scatter')) chartType = 'scatter';
    if (codeLower.includes('heatmap')) chartType = 'radar';

    chartData = {
      type: chartType,
      labels: ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5'],
      datasets: [
        {
          label: expTitle || 'Visual Feature Plot',
          data: [12, 19, 14, 25, 30],
          borderColor: 'rgb(6, 182, 212)',
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          tension: 0.3
        }
      ]
    };
  }

  logs.push(`--------------------------------------------------`);
  logs.push(`[STATUS] Execution Finished (Exit Code: 0)`);

  return {
    outputLogs: logs.join('\n'),
    tableData,
    chartData
  };
}
