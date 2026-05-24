const User = require('./models/User');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@courseplatform.com' });
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    console.log('Admin user found:', admin.email);
    console.log('Admin role:', admin.role);

    // Test password comparison
    const isValid = await admin.comparePassword('admin123');
    console.log('Password valid:', isValid);

    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testAuth();