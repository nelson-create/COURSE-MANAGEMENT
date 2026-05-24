const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create course (Admin only)
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, category, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      category,
      thumbnail,
      createdBy: req.user.id
    });

    await course.save();

    res.status(201).json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail,
        createdBy: course.createdBy,
        createdAt: course.createdAt
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating course'
    });
  }
};

// Get all courses (Public)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('createdBy', 'email')
      .select('title description category thumbnail createdBy createdAt')
      .sort({ createdAt: -1 });

    // Get enrollment counts for each course
    const coursesWithEnrollmentCount = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });
        return {
          id: course._id,
          title: course.title,
          description: course.description,
          category: course.category,
          thumbnail: course.thumbnail,
          createdBy: course.createdBy,
          createdAt: course.createdAt,
          enrollmentCount
        };
      })
    );

    res.json({
      success: true,
      courses: coursesWithEnrollmentCount
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses'
    });
  }
};

// Get single course (Public)
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('createdBy', 'email role');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollmentCount = await Enrollment.countDocuments({ courseId: course._id });

    let enrolledStudents = [];
    // If requester is admin, include enrolled students list
    if (req.user && req.user.role === 'admin') {
      const enrollments = await Enrollment.find({ courseId: course._id })
        .populate('studentId', 'email')
        .select('studentId enrolledAt progress');
      
      enrolledStudents = enrollments.map(enrollment => ({
        studentEmail: enrollment.studentId.email,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress
      }));
    }

    res.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail,
        createdBy: course.createdBy,
        createdAt: course.createdAt,
        enrollmentCount,
        enrolledStudents
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course'
    });
  }
};

// Update course (Admin only - must be course creator)
const updateCourse = async (req, res) => {
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
    const { title, description, category, thumbnail } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit courses you created.'
      });
    }

    // Update course
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.thumbnail = thumbnail || course.thumbnail;

    await course.save();

    res.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        description: course.description,
        category: course.category,
        thumbnail: course.thumbnail,
        createdBy: course.createdBy,
        updatedAt: course.updatedAt
      }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course'
    });
  }
};

// Delete course (Admin only - must be course creator)
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete courses you created.'
      });
    }

    // Delete all enrollments for this course (cascade delete)
    await Enrollment.deleteMany({ courseId: course._id });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({
      success: true,
      message: 'Course and all related enrollments deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course'
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};