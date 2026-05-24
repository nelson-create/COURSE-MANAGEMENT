# Database Schema Documentation

## Overview
This document describes the MongoDB database schema for the Course Management Platform using Mongoose ODM.

## Core Principles
- **Lean schemas** without nested data
- **References (ObjectId)** with populate() for related data
- **Indexes** for frequent queries and constraints
- **Validation** at schema level
- **Middleware** for data processing

---

## User Model

### Schema
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'student'], default: 'student'),
  createdAt: Date (default: Date.now)
}
```

### Indexes
- `email` (unique) - for authentication and user lookup

### Middleware
- **Pre-save**: Hash password with bcrypt (salt rounds: 10)

### Methods
- `comparePassword(candidatePassword)` - Compare plain text with hashed password

### Validation
- Email format validation with regex
- Password minimum length: 6 characters
- Role restricted to 'admin' or 'student'

---

## Course Model

### Schema
```javascript
{
  title: String (required, max: 100 chars),
  description: String (required, max: 1000 chars),
  category: String (required, enum: predefined categories),
  thumbnail: String (optional, default: placeholder URL),
  createdBy: ObjectId (ref: 'User', required),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Indexes
- `category` - for filtering courses by category

### Middleware
- **Pre-save**: Update `updatedAt` timestamp

### Categories
- Programming
- Design
- Business
- Marketing
- Data Science
- Other

### Relationships
- `createdBy` → User (admin who created the course)

---

## Enrollment Model

### Schema
```javascript
{
  studentId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  enrolledAt: Date (default: Date.now),
  completedModules: [String] (default: []),
  progress: Number (0-100, default: 0)
}
```

### Indexes
- `[studentId, courseId]` (compound, unique) - Prevent duplicate enrollments

### Relationships
- `studentId` → User (student enrolled in course)
- `courseId` → Course (course the student is enrolled in)

### Business Rules
- One student can enroll only once per course (enforced by unique compound index)
- Progress calculated as percentage of completed modules
- completedModules stores array of module identifiers

---

## Database Relationships

```
User (Admin) ──┐
               ├─→ Course ──→ Enrollment ←── User (Student)
User (Admin) ──┘
```

### Relationship Details
1. **User → Course**: One admin can create many courses (`createdBy`)
2. **Course → Enrollment**: One course can have many enrollments
3. **User → Enrollment**: One student can have many enrollments
4. **Unique Constraint**: One student per course (compound index)

---

## Query Patterns

### Frequent Queries
1. **Find courses by category** (indexed)
   ```javascript
   Course.find({ category: 'Programming' })
   ```

2. **Find user by email** (indexed, unique)
   ```javascript
   User.findOne({ email: 'user@example.com' })
   ```

3. **Check enrollment status** (compound indexed)
   ```javascript
   Enrollment.findOne({ studentId, courseId })
   ```

4. **Get student's enrollments with course details**
   ```javascript
   Enrollment.find({ studentId }).populate('courseId')
   ```

5. **Get course with creator details**
   ```javascript
   Course.findById(id).populate('createdBy', 'email role')
   ```

### Performance Optimizations
- Indexes on frequently queried fields
- Selective field population to reduce data transfer
- Compound index for enrollment uniqueness and lookups

---

## Data Integrity

### Constraints
- **Email uniqueness**: Prevents duplicate user accounts
- **Enrollment uniqueness**: Prevents duplicate course enrollments
- **Required fields**: Ensures data completeness
- **Enum validation**: Restricts roles and categories to valid values

### Cascading Operations
- **Course deletion**: Automatically removes all related enrollments
- **User deletion**: Would require cleanup of created courses and enrollments (not implemented)

---

## Sample Data Structure

### User Document
```json
{
  "_id": "ObjectId",
  "email": "admin@courseplatform.com",
  "password": "$2a$10$hashedPassword...",
  "role": "admin",
  "createdAt": "2026-05-24T05:06:51.000Z"
}
```

### Course Document
```json
{
  "_id": "ObjectId",
  "title": "Complete JavaScript Bootcamp",
  "description": "Learn JavaScript from basics to advanced concepts...",
  "category": "Programming",
  "thumbnail": "https://images.unsplash.com/photo-1627398242454...",
  "createdBy": "ObjectId (User)",
  "createdAt": "2026-05-24T05:06:52.000Z",
  "updatedAt": "2026-05-24T05:06:52.000Z"
}
```

### Enrollment Document
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId (User)",
  "courseId": "ObjectId (Course)",
  "enrolledAt": "2026-05-24T05:06:52.000Z",
  "completedModules": ["module1", "module2"],
  "progress": 20
}
```