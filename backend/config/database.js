const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log('Database already connected (cached)');
    return;
  }

  // Log public IP in development to help with MongoDB Atlas whitelisting
  if (process.env.NODE_ENV !== 'production') {
    const https = require('https');
    https.get('https://api.ipify.org?format=json', (resp) => {
      let data = '';
      resp.on('data', (chunk) => { data += chunk; });
      resp.on('end', () => {
        try {
          const ip = JSON.parse(data).ip;
          console.log(`Your public IP address is: ${ip}`);
          console.log('Please whitelist this IP in MongoDB Atlas Network Access (Security > Network Access)');
        } catch (e) {
          console.log('Could not parse IP response');
        }
      });
    }).on('error', (err) => {
      console.log('Error getting public IP:', err.message);
    });
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;