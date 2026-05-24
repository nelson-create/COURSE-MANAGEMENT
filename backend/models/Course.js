const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Other']
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Course+Thumbnail'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for category filtering
courseSchema.index({ category: 1 });

module.exports = mongoose.model('Course', courseSchema);