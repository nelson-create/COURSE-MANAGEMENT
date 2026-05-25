try {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Warning: Could not set custom DNS servers:', err.message);
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

/* =========================
   DEBUG LOGS (IMPORTANT)
========================= */
console.log("SERVER STARTED");
console.log("ENV:", process.env.NODE_ENV);

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
   TEST ROUTE (VERY IMPORTANT)
========================= */
app.get('/test', (req, res) => {
  res.json({ message: "SERVER WORKING PERFECTLY" });
});

/* =========================
   ROUTE DEBUG LOGS
========================= */
console.log("AUTH ROUTE LOADED");
console.log("COURSES ROUTE LOADED");
console.log("ENROLLMENTS ROUTE LOADED");



/* =========================
   ROUTES
========================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Course Management API is running',
    timestamp: new Date().toISOString()
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

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;