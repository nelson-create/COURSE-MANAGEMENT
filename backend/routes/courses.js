const express = require('express');
const { body } = require('express-validator');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { verifyToken, roleCheck } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const courseValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('category')
    .isIn(['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Other'])
    .withMessage('Category must be one of: Web Development, Mobile Development, Data Science, Design, Other'),
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL')
];

// Routes
router.post('/', verifyToken, roleCheck('admin'), courseValidation, createCourse);
router.get('/', getAllCourses);
router.get('/:courseId', getCourseById);
router.put('/:courseId', verifyToken, roleCheck('admin'), courseValidation, updateCourse);
router.delete('/:courseId', verifyToken, roleCheck('admin'), deleteCourse);

module.exports = router;