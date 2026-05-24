import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, courseName, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Delete Course
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Are you sure?
              </h3>
              <p className="text-gray-600 mt-1">
                This action cannot be undone. This will permanently delete the course:
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-medium text-gray-900">"{courseName}"</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              <strong>Warning:</strong> All student enrollments for this course will also be deleted.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 btn-secondary disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;