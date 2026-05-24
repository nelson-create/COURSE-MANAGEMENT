const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Database already connected (cached)');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
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