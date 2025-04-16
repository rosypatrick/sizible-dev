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
const { initializeDatabase } = require('./utils/setupDatabase');

// Load environment variables
dotenv.config();

// Import routes
// const retailerRoutes = require('./routes/retailerRoutes');
// const consumerRoutes = require('./routes/consumerRoutes');
const garmentRoutes = require('./routes/garmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); // Enable CORS for all routes
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with increased limit for CSV data
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// API Routes
// app.use('/api/retailers', retailerRoutes);
// app.use('/api/consumers', consumerRoutes);
app.use('/api/garments', garmentRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Initialize database tables and functions
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
});

module.exports = app;