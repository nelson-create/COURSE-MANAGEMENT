const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

dotenv.config();

const testModels = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test User model
    console.log('\n=== Testing User Model ===');
    const users = await User.find().limit(3);
    users.forEach(user => {
      console.log(`User: ${user.email} | Role: ${user.role} | Created: ${user.createdAt}`);
    });

    // Test Course model with population
    console.log('\n=== Testing Course Model ===');
    const courses = await Course.find()
      .populate('createdBy', 'email role')
      .limit(3);
    
    courses.forEach(course => {
      console.log(`Course: ${course.title}`);
      console.log(`  Category: ${course.category}`);
      console.log(`  Created by: ${course.createdBy.email} (${course.createdBy.role})`);
      console.log(`  Created: ${course.createdAt}`);
    });

    // Test Enrollment model with population
    console.log('\n=== Testing Enrollment Model ===');
    const enrollments = await Enrollment.find()
      .populate('studentId', 'email')
      .populate('courseId', 'title category')
      .limit(3);
    
    enrollments.forEach(enrollment => {
      console.log(`Enrollment:`);
      console.log(`  Student: ${enrollment.studentId.email}`);
      console.log(`  Course: ${enrollment.courseId.title} (${enrollment.courseId.category})`);
      console.log(`  Progress: ${enrollment.progress}%`);
      console.log(`  Completed Modules: ${enrollment.completedModules.length}`);
      console.log(`  Enrolled: ${enrollment.enrolledAt}`);
    });

    // Test indexes
    console.log('\n=== Testing Indexes ===');
    const userIndexes = await User.collection.getIndexes();
    const courseIndexes = await Course.collection.getIndexes();
    const enrollmentIndexes = await Enrollment.collection.getIndexes();
    
    console.log('User indexes:', Object.keys(userIndexes));
    console.log('Course indexes:', Object.keys(courseIndexes));
    console.log('Enrollment indexes:', Object.keys(enrollmentIndexes));

    // Test duplicate enrollment prevention
    console.log('\n=== Testing Duplicate Prevention ===');
    try {
      const student = await User.findOne({ role: 'student' });
      const course = await Course.findOne();
      
      // Try to create duplicate enrollment
      await Enrollment.create({
        studentId: student._id,
        courseId: course._id
      });
      console.log('ERROR: Duplicate enrollment was allowed!');
    } catch (error) {
      console.log('✅ Duplicate enrollment prevented:', error.code === 11000 ? 'Unique constraint working' : error.message);
    }

    console.log('\n=== Model Testing Complete ===');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
};

testModels();