// Vercel serverless function entry point
const serverless = require('serverless-http');

// Initialize the app
const app = require('../backend/server.js');

// Export the serverless handler
module.exports = serverless(app);