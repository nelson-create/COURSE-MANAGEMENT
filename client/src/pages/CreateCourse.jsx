import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useToast } from '../context/ToastContext';

const CreateCourse = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    thumbnail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Web Development',
    'Mobile Development', 
    'Data Science',
    'Design',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Thumbnail URL validation (optional but must be valid URL if provided)
    if (formData.thumbnail && formData.thumbnail.trim()) {
      const urlPattern = /^https?:\/\/.+\..+/;
      if (!urlPattern.test(formData.thumbnail.trim())) {
        newErrors.thumbnail = 'Please enter a valid URL (must start with http:// or https://)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await courseService.createCourse(formData);
      if (response.success) {
        showSuccess('Course created successfully!');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Create course error:', error);
      const message = error.response?.data?.message || 'Failed to create course';
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600">
            Fill in the details below to create a new course for your students.
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter course title (5-100 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
                <p className="text-gray-400 text-xs ml-auto">
                  {formData.title.length}/100
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Enter a detailed course description (20-1000 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
                <p className="text-gray-400 text-xs ml-auto">
                  {formData.description.length}/1000
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                className={`input-field ${errors.thumbnail ? 'border-red-500' : ''}`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
              )}
              {formData.thumbnail && !errors.thumbnail && (
                <p className="text-green-600 text-sm mt-1">✓ Valid URL format</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Course...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;