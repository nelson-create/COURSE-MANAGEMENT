const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

    // Create admin user (let the model handle password hashing)
    const admin = await User.create({
      email: 'admin@courseplatform.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Created admin user:', admin.email);

    // Create student users (let the model handle password hashing)
    const student1 = await User.create({
      email: 'john@student.com',
      password: 'student123',
      role: 'student'
    });

    const student2 = await User.create({
      email: 'jane@student.com',
      password: 'student123',
      role: 'student'
    });
    console.log('Created student users');

    // Create sample courses
    const courses = await Course.insertMany([
      {
        title: 'Complete JavaScript Bootcamp',
        description: 'Learn JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Master the principles of user interface and user experience design with hands-on projects.',
        category: 'Design',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'React Native Mobile Development',
        description: 'Build cross-platform mobile applications using React Native and modern development practices.',
        category: 'Mobile Development',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'Data Science with Python',
        description: 'Comprehensive course covering data analysis, visualization, and machine learning with Python.',
        category: 'Data Science',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
        createdBy: admin._id
      },
      {
        title: 'Full Stack Web Development',
        description: 'Learn to build complete web applications from frontend to backend using modern technologies.',
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        createdBy: admin._id
      }
    ]);
    console.log('Created sample courses');

    // Create sample enrollments
    await Enrollment.insertMany([
      {
        studentId: student1._id,
        courseId: courses[0]._id,
        completedModules: ['module1', 'module2'],
        progress: 20
      },
      {
        studentId: student1._id,
        courseId: courses[1]._id,
        completedModules: ['module1'],
        progress: 10
      },
      {
        studentId: student2._id,
        courseId: courses[0]._id,
        completedModules: ['module1', 'module2', 'module3'],
        progress: 30
      },
      {
        studentId: student2._id,
        courseId: courses[2]._id,
        completedModules: [],
        progress: 0
      }
    ]);
    console.log('Created sample enrollments');

    console.log('\n=== SEED DATA COMPLETE ===');
    console.log('Admin Login: admin@courseplatform.com / admin123');
    console.log('Student Login 1: john@student.com / student123');
    console.log('Student Login 2: jane@student.com / student123');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();