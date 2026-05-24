import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();
  const { showSuccess, showError } = useToast();

  // UI State as per spec
  const [courseDetails, setCourseDetails] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);   // page load
  const [isEnrolling, setIsEnrolling] = useState(false); // enroll action
  const [error, setError] = useState(null);

  // Step 1: load course details on mount / courseId change
  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  // Step 2: once course is loaded AND user is a logged-in student, check enrollment
  useEffect(() => {
    if (isAuthenticated && isStudent && courseDetails) {
      checkEnrollmentStatus();
    } else if (!isAuthenticated) {
      // Ensure not enrolled state for public users
      setIsEnrolled(false);
    }
  }, [isAuthenticated, isStudent, courseDetails]);

  // GET /api/courses/:courseId
  const loadCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseService.getCourse(courseId);
      if (response.success) {
        setCourseDetails(response.course);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Course not found');
      } else {
        setError('Failed to load course details. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

// GET /api/enrollments/:courseId
   const checkEnrollmentStatus = async () => {
    try {
      const response = await enrollmentService.getEnrollmentStatus(courseId);
      if (response.success) {
        setIsEnrolled(response.isEnrolled);
      }
    } catch (err) {
      // Silently fall back to not-enrolled; don't block the page
      setIsEnrolled(false);
    }
  };

  // Enroll button handler — covers all three cases from the spec
  const handleEnroll = async () => {
    // Not logged in → redirect to /login, return here after
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${courseId}` } } });
      return;
    }

    // Logged in but not a student
    if (!isStudent) {
      showError('Only students can enroll in courses');
      return;
    }

    setIsEnrolling(true);
    try {
      // POST /api/enrollments { courseId }
      const response = await enrollmentService.enrollInCourse(courseId);
      if (response.success) {
        setIsEnrolled(true);
        showSuccess('Enrolled successfully! Welcome to the course.');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // Already enrolled
        setIsEnrolled(true);
        showError('Already enrolled in this course');
      } else {
        showError(err.response?.data?.message || 'Failed to enroll. Please try again.');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <span className="text-6xl mb-4 block">📭</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-500 mb-6">
            The course you're looking for might have been removed or doesn't exist.
          </p>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            ← Back to Course Catalog
          </button>
        </div>
      </div>
    );
  }

  if (!courseDetails) return null;

  // ── Enrollment button — three visual states ────────────────────────────────
  const EnrollButton = () => {
    // Student already enrolled
    if (isAuthenticated && isStudent && isEnrolled) {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <span>✅</span>
            <span>Already enrolled</span>
          </div>
          <button
            onClick={() => navigate('/student')}
            className="w-full btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    // Student not yet enrolled
    if (isAuthenticated && isStudent && !isEnrolled) {
      return (
        <button
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnrolling ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Enrolling…
            </span>
          ) : (
            'Enroll in Course'
          )}
        </button>
      );
    }

    // Admin viewing the page
    if (isAuthenticated && !isStudent) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-yellow-800 text-sm">
            👤 You're logged in as an admin. Only students can enroll.
          </p>
        </div>
      );
    }

    // Not logged in
    return (
      <div className="space-y-3">
        <button onClick={handleEnroll} className="w-full btn-primary">
          Login to Enroll
        </button>
        <p className="text-sm text-gray-500 text-center">
          Sign in with a student account to enroll in this course.
        </p>
      </div>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back link */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mb-6 text-sm font-medium"
        >
          ← Back to Course Catalog
        </button>

        {/* ── Hero card: thumbnail + core info + enroll ── */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Large thumbnail image */}
            <div className="flex-shrink-0">
              <img
                src={courseDetails.thumbnail || 'https://via.placeholder.com/600x400?text=Course+Thumbnail'}
                alt={courseDetails.title}
                className="w-full h-64 lg:h-72 object-cover rounded-lg shadow"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=Course+Thumbnail';
                }}
              />
            </div>

            {/* Right column */}
            <div className="flex flex-col justify-between gap-6">
              <div>
                {/* Category badge */}
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wide mb-3">
                  {courseDetails.category}
                </span>

                {/* Title — large heading */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                  {courseDetails.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-col gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>
                      Created by{' '}
                      <span className="font-medium text-gray-700">
                        {courseDetails.createdBy?.email || 'Instructor'}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>
                      <span className="font-medium text-gray-700">
                        {courseDetails.enrollmentCount ?? 0}
                      </span>{' '}
                      student{courseDetails.enrollmentCount !== 1 ? 's' : ''} enrolled
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>Created {formatDate(courseDetails.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Enroll button area */}
              <EnrollButton />
            </div>
          </div>
        </div>

        {/* ── Full description ── */}
        <div className="card p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About This Course</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {courseDetails.description}
          </p>
        </div>

        {/* ── Course info panel ── */}
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-gray-500 font-medium">Category</dt>
              <dd className="text-gray-900">{courseDetails.category}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-gray-500 font-medium">Instructor</dt>
              <dd className="text-gray-900">
                {courseDetails.createdBy?.email || 'Instructor'}
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-gray-500 font-medium">Students Enrolled</dt>
              <dd className="text-gray-900">{courseDetails.enrollmentCount ?? 0}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-gray-500 font-medium">Published</dt>
              <dd className="text-gray-900">{formatDate(courseDetails.createdAt)}</dd>
            </div>
          </dl>
        </div>

        {/* ── Bottom CTA for unauthenticated visitors ── */}
        {!isAuthenticated && (
          <div className="mt-6 card p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready to start learning?
            </h3>
            <p className="text-gray-600 mb-5">
              Sign in to enroll and track your progress.
            </p>
            <button onClick={handleEnroll} className="btn-primary px-8 py-2.5">
              Sign In to Enroll
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetail;
