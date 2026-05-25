try {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('Warning: Could not set custom DNS servers:', err.message);
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleared existing data');

    // Create admin users (model handles password hashing)
    const admin = await User.create({
      email: 'admin@gisul.com',
      password: 'Admin@123',
      role: 'admin'
    });
    const admin2 = await User.create({
      email: 'admin@courseplatform.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Created admin users');

    // Create student users (model handles password hashing)
    const student = await User.create({
      email: 'student@gisul.com',
      password: 'Student@123',
      role: 'student'
    });
    const student2 = await User.create({
      email: 'john@student.com',
      password: 'student123',
      role: 'student'
    });
    const student3 = await User.create({
      email: 'jane@student.com',
      password: 'student123',
      role: 'student'
    });
    console.log('Created student users');

    // Create sample courses
    const courses = await Course.insertMany([
      {
        title: 'React Basics',
        description: 'Learn React fundamentals including components, props, and hooks.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-37b5c7c8c8d9?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'Node.js API Development',
        description: 'Build scalable APIs with Express and MongoDB.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab82?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'Data Science 101',
        description: 'Introduction to data analysis and machine learning basics.',
        category: 'Data Science',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        createdBy: admin._id
      }
    ]);
    console.log('Created sample courses');

    // Create sample enrollment for React Basics
    await Enrollment.create({
      studentId: student._id,
      courseId: courses[0]._id,
      completedModules: ['module-1', 'module-2'],
      progress: 40
    });
    console.log('Created sample enrollment');

    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('Admin Login 1: admin@gisul.com / Admin@123');
    console.log('Admin Login 2: admin@courseplatform.com / admin123');
    console.log('Student Login 1: student@gisul.com / Student@123');
    console.log('Student Login 2: john@student.com / student123');
    console.log('Student Login 3: jane@student.com / student123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();