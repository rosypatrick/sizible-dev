/**
 * Sizible Fashion Style Advice - Backend Server
 * 
 * This is the main entry point for the backend server of the Sizible Fashion Style Advice application.
 * It sets up Express with middleware and routes.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes (will be implemented later)
// const retailerRoutes = require('./routes/retailerRoutes');
// const consumerRoutes = require('./routes/consumerRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Sizible Fashion Style Advice API',
    status: 'Server is running',
    version: '0.1.0'
  });
});

// Routes (will be implemented later)
// app.use('/api/retailer', retailerRoutes);
// app.use('/api/consumer', consumerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;