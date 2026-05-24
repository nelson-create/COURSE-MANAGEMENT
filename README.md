
# COURSE-MANAGEMENT
A full-stack MERN application for managing online courses with role-based access control, built with React 18, Node.js, Express, and MongoDB.
=======
# Course Management Platform

A full-stack MERN application for managing online courses with role-based access control.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of courses, enrollments, and statistics
- **Course Management**: Create, edit, and delete courses
- **Student Tracking**: View enrollment counts and student progress
- **Role-based Access**: Admin-only course management interface

### Student Features
- **Course Browsing**: View available courses (Coming in Phase 4)
- **Enrollment**: Enroll in courses
- **Progress Tracking**: Track learning progress

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Admin and Student access levels
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data synchronization
- **Input Validation**: Client and server-side validation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd course-management-platform
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course-management
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Setup Frontend
```bash
cd ../client
npm install --force
```

### 5. Seed Database (Optional)
```bash
cd ../backend
npm run seed
```

This creates demo users and sample courses:
- **Admin**: admin@courseplatform.com / admin123
- **Student**: john@student.com / student123
- **Student**: jane@student.com / student123

**Demo Credentials (from seed.js):**
- **Admin**: admin@gisul.com / Admin@123
- **Student**: student@gisul.com / Student@123

## 🏃‍♂️ Running the Application

### Development Mode (Both servers)
From the root directory:
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:5175

### Individual Servers

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

**Production build:**
```bash
npm run build
npm start
```

## 📱 Usage

### 1. Access the Application
Open your browser and navigate to http://localhost:5175

### 2. Login
Use the demo credentials:
- **Admin**: admin@gisul.com / Admin@123
- **Student**: student@gisul.com / Student@123

### 3. Admin Dashboard
After logging in as admin:
- View course statistics
- Create new courses
- Edit existing courses
- Delete courses
- Track student enrollments

### 4. Student Interface
After logging in as student:
- Browse available courses
- Enroll in courses
- Track learning progress

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'student']),
  createdAt: Date
}
```

### Course Model
```javascript
{
  title: String (required),
  description: String (required),
  category: String (required),
  thumbnail: String (optional),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Model
```javascript
{
  studentId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  enrolledAt: Date,
  completedModules: [String],
  progress: Number (0-100)
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)

### Enrollments
- `POST /api/enrollments` - Enroll in course (student only)
- `GET /api/enrollments/my` - Get student's enrollments
- `GET /api/enrollments/:courseId` - Get enrollment status
- `PUT /api/enrollments/:courseId/progress` - Update progress

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication
- **Role-based Access**: Route and API protection
- **Input Validation**: Server-side validation
- **CORS Configuration**: Cross-origin request handling
- **Error Handling**: Secure error responses

## 🎨 UI Components

### Reusable Components
- **ProtectedRoute**: Role-based route protection
- **Navbar**: Navigation with auth state
- **CourseCard**: Course display component
- **CreateCourseModal**: Course creation/editing form

### Pages
- **Login**: Authentication page
- **AdminDashboard**: Course management interface
- **StudentDashboard**: Student learning interface (Phase 4)

## 🚧 Development Status

### ✅ Completed (Phases 1-3)
- Backend API with authentication
- Database models and relationships
- Admin dashboard and course management
- JWT authentication system
- Role-based access control

### 🔄 In Progress (Phase 4)
- Student course browsing interface
- Enrollment functionality
- Progress tracking system
- Course detail pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally
- Check the MONGODB_URI in .env file
- Verify database permissions

**Port Already in Use:**
- Change PORT in backend/.env
- Update proxy configuration in client/vite.config.js

**Frontend Build Errors:**
- Run `npm install --force` in client directory
- Clear node_modules and reinstall dependencies

**Authentication Issues:**
- Check JWT_SECRET in .env file
- Verify token expiration settings
- Clear browser localStorage

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Check that both servers are running

## ⚠️ Known Limitations

- **Demo Data**: The seed script clears all existing data before seeding
- **Module Tracking**: Progress tracking uses hardcoded 5 modules per course
- **Image URLs**: Course thumbnails use external Unsplash URLs
- **Single Instructor**: All courses are created by the admin user in seed data
- **No Payment**: Enrollment is free with no payment integration
- **No Bulk Operations**: Courses must be managed individually
- **Limited Search**: Search is client-side only (not server-side)

## 📞 Support

For support and questions, please open an issue in the repository.

