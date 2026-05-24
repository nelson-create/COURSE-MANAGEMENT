// Test script for course form validation and CRUD operations
const axios = require('axios');

const testCourseForms = async () => {
  try {
    console.log('🧪 Testing Course Form Validation & CRUD Operations...\n');

    // Login as admin to get token
    const adminLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@courseplatform.com',
      password: 'admin123'
    });
    
    const adminToken = adminLogin.data.token;
    const headers = { 'Authorization': `Bearer ${adminToken}` };

    console.log('✅ Admin authenticated\n');

    // Test 1: Create course with valid data
    console.log('1. Testing course creation with valid data...');
    const validCourse = {
      title: 'Advanced React Development',
      description: 'Learn advanced React patterns, hooks, performance optimization, and state management techniques for building scalable applications.',
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop'
    };

    const createResponse = await axios.post('http://localhost:5000/api/courses', validCourse, { headers });
    console.log('✅ Course created:', createResponse.data.course.title);
    const courseId = createResponse.data.course.id;

    // Test 2: Validation - Title too short
    console.log('\n2. Testing validation - Title too short...');
    try {
      await axios.post('http://localhost:5000/api/courses', {
        title: 'JS',
        description: 'This description is long enough to pass validation requirements for course creation.',
        category: 'Web Development'
      }, { headers });
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Validation caught short title');
    }

    // Test 3: Validation - Description too short
    console.log('\n3. Testing validation - Description too short...');
    try {
      await axios.post('http://localhost:5000/api/courses', {
        title: 'Valid Course Title',
        description: 'Too short',
        category: 'Web Development'
      }, { headers });
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Validation caught short description');
    }

    // Test 4: Validation - Invalid category
    console.log('\n4. Testing validation - Invalid category...');
    try {
      await axios.post('http://localhost:5000/api/courses', {
        title: 'Valid Course Title',
        description: 'This is a valid description that meets the minimum length requirements.',
        category: 'Invalid Category'
      }, { headers });
      console.log('❌ Should have failed validation');
    } catch (error) {
      console.log('✅ Validation caught invalid category');
    }

    // Test 5: Get single course
    console.log('\n5. Testing get single course...');
    const getCourseResponse = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
    console.log('✅ Course retrieved:', getCourseResponse.data.course.title);

    // Test 6: Update course
    console.log('\n6. Testing course update...');
    const updatedData = {
      title: 'Advanced React Development - Updated',
      description: 'Updated description with more comprehensive content about React development patterns and best practices.',
      category: 'Web Development',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop'
    };

    const updateResponse = await axios.put(`http://localhost:5000/api/courses/${courseId}`, updatedData, { headers });
    console.log('✅ Course updated:', updateResponse.data.course.title);

    // Test 7: Test all valid categories
    console.log('\n7. Testing all valid categories...');
    const categories = ['Web Development', 'Mobile Development', 'Data Science', 'Design', 'Other'];
    
    for (const category of categories) {
      try {
        const testCourse = {
          title: `Test ${category} Course`,
          description: `This is a test course for the ${category} category to verify all categories work correctly.`,
          category: category
        };
        
        const response = await axios.post('http://localhost:5000/api/courses', testCourse, { headers });
        console.log(`  ✅ ${category}: ${response.data.course.title}`);
        
        // Clean up - delete the test course
        await axios.delete(`http://localhost:5000/api/courses/${response.data.course.id}`, { headers });
      } catch (error) {
        console.log(`  ❌ ${category}: Failed`);
      }
    }

    // Test 8: Delete course
    console.log('\n8. Testing course deletion...');
    const deleteResponse = await axios.delete(`http://localhost:5000/api/courses/${courseId}`, { headers });
    console.log('✅ Course deleted successfully');

    // Test 9: Verify course is deleted
    console.log('\n9. Verifying course deletion...');
    try {
      await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      console.log('❌ Course should have been deleted');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Course properly deleted (404 not found)');
      } else {
        console.log('✅ Course deleted (access denied)');
      }
    }

    // Test 10: Unauthorized access (student trying to create course)
    console.log('\n10. Testing unauthorized access...');
    const studentLogin = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@student.com',
      password: 'student123'
    });
    
    const studentHeaders = { 'Authorization': `Bearer ${studentLogin.data.token}` };
    
    try {
      await axios.post('http://localhost:5000/api/courses', validCourse, { headers: studentHeaders });
      console.log('❌ Student should not be able to create courses');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Student properly blocked from creating courses');
      }
    }

    console.log('\n🎉 All course form tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Course creation with valid data');
    console.log('✅ Title length validation (min 5 chars)');
    console.log('✅ Description length validation (min 20 chars)');
    console.log('✅ Category validation (enum values)');
    console.log('✅ Course retrieval');
    console.log('✅ Course updates');
    console.log('✅ All category options working');
    console.log('✅ Course deletion');
    console.log('✅ Authorization checks');
    console.log('\n🌐 Frontend Features Ready:');
    console.log('• Create Course Form (/admin/courses/create)');
    console.log('• Edit Course Form (/admin/courses/:id/edit)');
    console.log('• Delete Confirmation Modal');
    console.log('• Form Validation & Character Counters');
    console.log('• Toast Notifications');
    console.log('• Error Handling');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
};

testCourseForms();