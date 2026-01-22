const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/measurements', require('./routes/measurements'));
app.use('/api/tanks', require('./routes/tanks'));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Water Management API is running',
    timestamp: new Date().toISOString(),
    database: 'SQLite'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
  console.log('Health check: http://localhost:' + PORT + '/api/health');
});