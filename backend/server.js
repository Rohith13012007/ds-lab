const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const experimentRoutes = require('./routes/experimentRoutes');

// Load Environment Variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS Policy restriction: Origin not allowed'), false);
  },
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Primary API Routes
app.use('/api/experiments', experimentRoutes);

// Fallback 404 Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Node.js Express Backend running on PORT: ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api/experiments`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
