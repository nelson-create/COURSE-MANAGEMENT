import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';

const MODULES = [
  { id: 'module-1', title: 'Introduction', description: 'Get started with this course' },
  { id: 'module-2', title: 'Core Concepts', description: 'Learn the fundamental concepts' },
  { id: 'module-3', title: 'Advanced Topics', description: 'Dive deeper into advanced material' },
  { id: 'module-4', title: 'Practical Examples', description: 'Apply your knowledge with examples' },
  { id: 'module-5', title: 'Final Project', description: 'Complete your learning with a project' },
];

const CourseLearn = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [course, setCourse] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadCourseAndProgress();
  }, [courseId]);

  const loadCourseAndProgress = async () => {
    try {
      setIsLoading(true);
      
      // Load course details
      const courseResponse = await courseService.getCourse(courseId);
      if (courseResponse.success) {
        setCourse(courseResponse.course);
      }

      // Load enrollment progress
      const enrollmentResponse = await enrollmentService.getEnrollmentStatus(courseId);
      if (enrollmentResponse.success) {
        setCompletedModules(enrollmentResponse.completedModules || []);
      }
    } catch (error) {
      console.error('Load course learn error:', error);
      showError('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModule = async (moduleId) => {
    try {
      setIsUpdating(true);
      
      let newCompletedModules;
      if (completedModules.includes(moduleId)) {
        // Remove module
        newCompletedModules = completedModules.filter(m => m !== moduleId);
      } else {
        // Add module
        newCompletedModules = [...completedModules, moduleId];
      }

      const response = await enrollmentService.updateProgress(courseId, newCompletedModules);
      
      if (response.success) {
        setCompletedModules(newCompletedModules);
        showSuccess(
          completedModules.includes(moduleId) 
            ? 'Module marked as incomplete' 
            : 'Module marked complete'
        );
      }
    } catch (error) {
      console.error('Update progress error:', error);
      showError('Failed to update progress');
    } finally {
      setIsUpdating(false);
    }
  };

  const isModuleCompleted = (moduleId) => completedModules.includes(moduleId);
  const progress = Math.round((completedModules.length / MODULES.length) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h1>
          <button onClick={() => navigate('/student')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors mb-4 text-sm font-medium"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {course.category}
          </span>
        </div>

        {/* Progress Summary */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {completedModules.length} of {MODULES.length} modules completed
            </span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Modules List */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h2>
          <div className="space-y-3">
            {MODULES.map((module, index) => {
              const completed = isModuleCompleted(module.id);
              return (
                <div
                  key={module.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {completed ? '✓' : index + 1}
                        </span>
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{module.description}</p>
                    </div>
                    <button
                      onClick={() => toggleModule(module.id)}
                      disabled={isUpdating}
                      className={`ml-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                        completed
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isUpdating ? '...' : completed ? 'Undo' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="card p-6 mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-center">
            <span className="text-4xl mb-2 block">🎉</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Course Completed!</h3>
            <p className="text-gray-600">Congratulations on finishing all modules!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLearn;