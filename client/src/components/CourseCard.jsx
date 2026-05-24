import React from 'react';

const CourseCard = ({ course, onEdit, onDelete }) => {
  const handleDelete = () => {
    onDelete(course);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-200">
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
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {course.description}
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
          <span>{course.enrollmentCount || 0} enrolled</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>{formatDate(course.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 flex items-center justify-center space-x-1 btn-secondary text-sm"
        >
          <span>✏️</span>
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center space-x-1 btn-danger text-sm"
        >
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;