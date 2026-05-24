const { validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Enroll student in course
const enrollInCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      studentId,
      courseId,
      enrolledAt: new Date()
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      enrollment: {
        id: enrollment._id,
        studentId: enrollment.studentId,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment'
    });
  }
};

// Get student's enrollments
const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'title description category thumbnail')
      .sort({ enrolledAt: -1 });

    const formattedEnrollments = enrollments
      .filter(enrollment => enrollment.courseId !== null)
      .map(enrollment => ({
        courseId: enrollment.courseId._id,
        enrolledAt: enrollment.enrolledAt,
        completedModules: enrollment.completedModules,
        progress: enrollment.progress,
        course: {
          id: enrollment.courseId._id,
          title: enrollment.courseId.title,
          description: enrollment.courseId.description,
          category: enrollment.courseId.category,
          thumbnail: enrollment.courseId.thumbnail
        }
      }));

    res.json({
      success: true,
      enrollments: formattedEnrollments
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrollments'
    });
  }
};

// Get enrollment status for a specific course
const getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollment = await Enrollment.findOne({ studentId, courseId });

    if (!enrollment) {
      return res.json({
        success: true,
        isEnrolled: false,
        enrolledAt: null,
        completedModules: [],
        progress: 0
      });
    }

    res.json({
      success: true,
      isEnrolled: true,
      enrolledAt: enrollment.enrolledAt,
      completedModules: enrollment.completedModules,
      progress: enrollment.progress
    });
  } catch (error) {
    console.error('Get enrollment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking enrollment status'
    });
  }
};

// Update course progress
const updateProgress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId } = req.params;
    const { completedModules } = req.body;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({ studentId, courseId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update completed modules and calculate progress
    enrollment.completedModules = completedModules || [];
    
    // For demo purposes, assume each course has 5 modules
    const totalModules = 5;
    const progress = Math.round((enrollment.completedModules.length / totalModules) * 100);
    enrollment.progress = Math.min(progress, 100);

    await enrollment.save();

    res.json({
      success: true,
      progress: enrollment.progress,
      completedModules: enrollment.completedModules
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress'
    });
  }
};

// Unenroll from course (bonus feature)
const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOneAndDelete({ studentId, courseId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during unenrollment'
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  updateProgress,
  unenrollFromCourse
};