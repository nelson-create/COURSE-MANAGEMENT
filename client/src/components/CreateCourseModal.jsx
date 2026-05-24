import React, { useState } from 'react';

const CreateCourseModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Web Development',
    thumbnail: initialData?.thumbnail || ''
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
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        thumbnail: ''
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter course description (20-1000 characters)"
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
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
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (initialData ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseModal;