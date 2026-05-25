const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Import models after connection
    const Course = require('./models/Course');
    const Enrollment = require('./models/Enrollment');
    
    // Check courses
    const courseCount = await Course.countDocuments();
    console.log(`Total courses in DB: ${courseCount}`);
    
    const courses = await Course.find().limit(5);
    console.log('First 5 courses:', JSON.stringify(courses, null, 2));
    
    // Check enrollments
    const enrollmentCount = await Enrollment.countDocuments();
    console.log(`Total enrollments in DB: ${enrollmentCount}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB();