/**
 * Test script for AMP Email Backend
 * Run with: node test-email.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAILS = [
  {
    to: 'sagarsoradi011@gmail.com',      // AMP supported
    applicantName: 'John Doe',
    jobTitle: 'Software Developer',
    companyName: 'TechCorp'
  },
  {
    to: 'sagarsoradi11@outlook.com', // Non-AMP (static fallback)
    applicantName: 'Jane Smith', 
    jobTitle: 'UX Designer',
    companyName: 'DesignCorp'
  }
];

async function testEmailSending() {
  console.log('🧪 Testing AMP Email Backend\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.status);

    // Test email connection
    console.log('\n2. Testing email connection...');
    const connectionTest = await axios.get(`${BASE_URL}/api/email/test-connection`);
    console.log(connectionTest.data.success ? '✅' : '❌', 'Email connection:', connectionTest.data.message);

    // Test single email sending
    console.log('\n3. Testing single email sending...');
    for (const emailData of TEST_EMAILS) {
      try {
        console.log(`\n   Sending to ${emailData.to}...`);
        const response = await axios.post(`${BASE_URL}/api/email/send`, emailData);
        
        if (response.data.success) {
          console.log('   ✅ Email sent successfully');
          console.log(`   📧 Type: ${response.data.data.ampSupported ? 'AMP Interactive' : 'Static HTML'}`);
          console.log(`   📨 Message ID: ${response.data.data.messageId}`);
        } else {
          console.log('   ❌ Email failed:', response.data.error);
        }
      } catch (error) {
        console.log('   ❌ Error sending email:', error.response?.data?.error || error.message);
      }
    }

    // // Test bulk email sending
    // console.log('\n4. Testing bulk email sending...');
    // try {
    //   const bulkResponse = await axios.post(`${BASE_URL}/api/email/send-bulk`, {
    //     recipients: TEST_EMAILS
    //   });
      
    //   if (bulkResponse.data.success) {
    //     console.log('✅ Bulk email completed');
    //     console.log(`📊 Summary: ${bulkResponse.data.data.summary.sent} sent, ${bulkResponse.data.data.summary.failed} failed`);
    //   }
    // } catch (error) {
    //   console.log('❌ Bulk email failed:', error.response?.data?.error || error.message);
    // }

    // Test statistics
    console.log('\n5. Testing email statistics...');
    try {
      const stats = await axios.get(`${BASE_URL}/api/email/stats`);
      console.log('✅ Email statistics retrieved:');
      console.log(`   📈 Total sent: ${stats.data.data.totalSent}`);
      console.log(`   📈 AMP emails: ${stats.data.data.ampEmails}`);
      console.log(`   📈 Static emails: ${stats.data.data.staticEmails}`);
    } catch (error) {
      console.log('❌ Stats failed:', error.response?.data?.error || error.message);
    }

    // Test web form URLs
    console.log('\n6. Testing web form URLs...');
    const formUrl = `${BASE_URL}/api/form/resume-form?email=test@example.com&name=Test%20User&job=Developer&company=TestCorp`;
    console.log(`📝 Web form URL: ${formUrl}`);
    console.log('   (Open this URL in a browser to test the web form)');

    console.log('\n🎉 All tests completed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running with: npm run dev\n');
  }
}

// Additional utility functions for testing
async function testAmpDetection() {
  const testEmails = [
    'user@gmail.com',        // AMP supported ✅
    'user@yahoo.com',        // AMP supported ✅
    'user@mail.ru',          // AMP supported ✅
    'user@outlook.com',      // Not AMP supported ❌
    'user@hotmail.com',      // Not AMP supported ❌
    'user@protonmail.com',   // Not AMP supported ❌
    'user@company.com'       // Not AMP supported ❌
  ];

  console.log('\n🔍 Testing AMP Detection Logic:');
  
  // Simulate the detection logic (must match EmailService)
  const ampSupportedDomains = [
    'gmail.com', 
    'googlemail.com', 
    'yahoo.com', 
    'yahoo.co.uk', 
    'yahoo.ca', 
    'yahoo.co.jp', 
    'mail.ru'
  ];
  
  testEmails.forEach(email => {
    const domain = email.split('@')[1]?.toLowerCase();
    const isSupported = ampSupportedDomains.includes(domain);
    console.log(`   ${email.padEnd(25)} → ${isSupported ? '🚀 AMP Interactive' : '📄 Static HTML'}`);
  });
}

// Run tests
if (require.main === module) {
  testEmailSending();
  testAmpDetection();
}

module.exports = { testEmailSending, testAmpDetection };
