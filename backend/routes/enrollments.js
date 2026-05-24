const express = require('express');
const { body } = require('express-validator');
const {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  updateProgress,
  unenrollFromCourse
} = require('../controllers/enrollmentController');
const { verifyToken, roleCheck } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const enrollmentValidation = [
  body('courseId')
    .isMongoId()
    .withMessage('Valid course ID is required')
];

const progressValidation = [
  body('completedModules')
    .isArray()
    .withMessage('Completed modules must be an array'),
  body('completedModules.*')
    .isString()
    .withMessage('Each module ID must be a string')
];

// Routes
router.post('/', verifyToken, roleCheck('student'), enrollmentValidation, enrollInCourse);
router.get('/my', verifyToken, roleCheck('student'), getMyEnrollments);
router.get('/:courseId', verifyToken, roleCheck('student'), getEnrollmentStatus);
router.put('/:courseId/progress', verifyToken, roleCheck('student'), progressValidation, updateProgress);
router.delete('/:courseId', verifyToken, roleCheck('student'), unenrollFromCourse);

module.exports = router;