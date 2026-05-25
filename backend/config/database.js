const mongoose = require('mongoose');

const connectDB = async () => {
  // Return cached connection if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('Database already connected (cached)');
    return mongoose.connection;
  }

  // Log public IP in development to help with MongoDB Atlas whitelisting
  if (process.env.NODE_ENV !== 'production') {
    try {
      const https = require('https');
      await new Promise((resolve) => {
        https.get('https://api.ipify.org?format=json', (resp) => {
          let data = '';
          resp.on('data', (chunk) => { data += chunk; });
          resp.on('end', () => {
            try {
              const ip = JSON.parse(data).ip;
              console.log(`Your public IP address is: ${ip}`);
              console.log('Please whitelist this IP in MongoDB Atlas Network Access (Security > Network Access)');
              resolve();
            } catch (e) {
              resolve();
            }
          });
        }).on('error', () => resolve());
      });
    } catch (e) {
      // Ignore IP fetch errors
    }
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;