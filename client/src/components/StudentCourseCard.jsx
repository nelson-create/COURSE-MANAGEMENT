import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentCourseCard = ({ course }) => {
  const navigate = useNavigate();

  if (!course) {
    return null;
  }

  const handleCardClick = () => {
    if (course.id) {
      navigate(`/courses/${course.id}`);
    }
  };

  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div className="mb-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Course+Thumbnail';
          }}
        />
      </div>

      {/* Course Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {truncateDescription(course.description)}
        </p>
        
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {course.category}
        </span>
      </div>

      {/* Course Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <span>👥</span>
          <span>{course.enrollmentCount || 0} students enrolled</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>{formatDate(course.createdAt)}</span>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="flex items-center text-sm text-gray-600">
        <span>👨‍🏫</span>
        <span className="ml-1">
          By {typeof course.createdBy === 'object' 
            ? course.createdBy?.email || 'Instructor' 
            : course.createdBy || 'Instructor'}
        </span>
      </div>

      {/* Hover Effect Indicator */}
      <div className="mt-4 text-center">
        <span className="text-blue-600 text-sm font-medium">
          Click to view details →
        </span>
      </div>
    </div>
  );
};

export default StudentCourseCard;