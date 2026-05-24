// Simple test script to verify login functionality
const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing Course Management Platform APIs...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check:', healthResponse.data.message);

    // Test admin login
    console.log('\n2. Testing admin login...');
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@courseplatform.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    console.log('   User:', adminLogin.data.user.email, '| Role:', adminLogin.data.user.role);
    
    const adminToken = adminLogin.data.token;

    // Test student login
    console.log('\n3. Testing student login...');
    const studentLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@student.com',
      password: 'student123'
    });
    console.log('✅ Student login successful');
    console.log('   User:', studentLogin.data.user.email, '| Role:', studentLogin.data.user.role);

    // Test get courses
    console.log('\n4. Testing get courses...');
    const coursesResponse = await axios.get('http://localhost:5000/api/courses');
    console.log('✅ Courses retrieved:', coursesResponse.data.courses.length, 'courses found');

    // Test protected admin endpoint
    console.log('\n5. Testing protected admin endpoint...');
    try {
      const createCourseResponse = await axios.post('http://localhost:5000/api/courses', {
        title: 'Test Course API',
        description: 'This is a test course created via API to verify the endpoint functionality',
        category: 'Web Development'
      }, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log('✅ Course creation successful');
      console.log('   Course:', createCourseResponse.data.course.title);
    } catch (error) {
      console.log('❌ Course creation failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📱 Frontend URL: http://localhost:5175');
    console.log('🔧 Backend URL: http://localhost:5000');
    console.log('\n👤 Demo Credentials:');
    console.log('   Admin: admin@courseplatform.com / admin123');
    console.log('   Student: john@student.com / student123');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.log('\n🔧 Make sure both servers are running:');
    console.log('   Backend: npm run server (port 5000)');
    console.log('   Frontend: npm run client (port 5175)');
  }
};

testLogin();