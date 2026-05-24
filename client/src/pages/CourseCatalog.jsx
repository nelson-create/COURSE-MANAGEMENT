import React, { useState, useEffect } from 'react';
import { courseService } from '../services/courseService';
import { useToast } from '../context/ToastContext';
import StudentCourseCard from '../components/StudentCourseCard';

const CourseCatalog = () => {
  const { showError } = useToast();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Available categories
  const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Other'];

  // Load all courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseService.getAllCourses();
      
      if (response.success) {
        setAllCourses(response.courses);
        setCourses(response.courses);
      }
    } catch (error) {
      console.error('Load courses error:', error);
      const message = 'Failed to load courses. Please try again later.';
      setError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search and filter when terms change
  useEffect(() => {
    let filtered = [...allCourses];
    
    // Apply search filter (case-insensitive title match)
    if (searchTerm.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    setCourses(filtered);
  }, [searchTerm, selectedCategory, allCourses]);

  // Group courses by category for better organization
  const coursesByCategory = courses.reduce((acc, course) => {
    const category = course.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(course);
    return acc;
  }, {});

  const totalCourses = courses.length;
  const totalEnrollments = allCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

  // Clear filters handler
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Catalog
          </h1>
          <p className="text-gray-600 mb-4">
            Discover and explore our comprehensive collection of courses
          </p>
          
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span>📚</span>
              <span>{totalCourses} courses available</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{totalEnrollments} total enrollments</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search courses by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
          
          {/* Results Count */}
          {!isLoading && (
            <div className="mt-3 text-sm text-gray-600">
              {courses.length} course{courses.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadCourses}
              className="mt-2 text-red-700 hover:text-red-900 font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(coursesByCategory).map(([category, categoryCourses]) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {category}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {categoryCourses.length} course{categoryCourses.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                
                {/* Category Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {categoryCourses.map((course) => (
                    <StudentCourseCard
                      key={course.id}
                      course={course}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses match your search
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Browse All Courses Link */}
        {courses.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Ready to start learning?
              </h3>
              <p className="text-blue-700 mb-4">
                Click on any course above to view details and enroll
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-blue-600">
                <span>✨ Instant enrollment</span>
                <span>📈 Track your progress</span>
                <span>🎓 Learn at your own pace</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;