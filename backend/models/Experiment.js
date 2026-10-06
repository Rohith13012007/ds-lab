const mongoose = require('mongoose');

const SubExperimentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  codeNum: { type: String, default: '1a' },
  title: { type: String, required: true },
  githubUrl: { type: String, default: '' },
  code: { type: String, default: '' },
  outputType: { type: String, default: 'console' },
  consoleOutput: { type: String, default: '' },
  tableData: { type: mongoose.Schema.Types.Mixed, default: null },
  chartData: { type: mongoose.Schema.Types.Mixed, default: null }
}, { _id: false });

const ExperimentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  module: { type: String, default: '' },
  experimentNumber: { type: mongoose.Schema.Types.Mixed, default: null },
  subExperimentNumber: { type: mongoose.Schema.Types.Mixed, default: null },
  githubUrl: { type: String, default: '' },
  code: { type: String, default: '' },
  output: { type: String, default: '' },
  language: { type: String, default: 'python' },
  createdBy: { type: String, default: 'user' },
  subExperiments: [SubExperimentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Experiment', ExperimentSchema);
