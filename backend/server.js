try {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Warning: Could not set custom DNS servers:', err.message);
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE CONNECTION
========================= */
let dbConnectionPromise = null;

const ensureDBConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch(err => {
      dbConnectionPromise = null;
      throw err;
    });
  }
  
  return dbConnectionPromise;
};

/* =========================
   DB MIDDLEWARE FOR API ROUTES
========================= */
const dbMiddleware = async (req, res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* =========================
   TEST ROUTE
========================= */
app.get('/test', (req, res) => {
  res.json({ message: "SERVER WORKING PERFECTLY" });
});

/* =========================
   ROUTES
========================= */
app.use('/api/auth', dbMiddleware, require('./routes/auth'));
app.use('/api/courses', dbMiddleware, require('./routes/courses'));
app.use('/api/enrollments', dbMiddleware, require('./routes/enrollments'));

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Course Management API is running',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

/* =========================
   ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error'
  });
});

/* =========================
   404 HANDLER
========================= */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* =========================
   START SERVER
========================= */
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  ensureDBConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }).catch(err => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}

module.exports = app;