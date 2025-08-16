/**
 * Enhanced test to debug AMP email sending
 */
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAmpEmailSending() {
  console.log('🧪 Testing AMP Email Sending with Debug Info\n');

  const testEmail = {
    to: 'swatibhadrapur@gmail.com',  // Gmail should support AMP
    applicantName: 'Test User',
    jobTitle: 'Software Developer', 
    companyName: 'TestCorp'
  };

  try {
    console.log('📧 Sending test email to:', testEmail.to);
    
    const response = await axios.post(`${BASE_URL}/api/email/send`, testEmail);
    
    if (response.data.success) {
      console.log('✅ Email sent successfully!');
      console.log('📊 Response data:', JSON.stringify(response.data, null, 2));
    } else {
      console.log('❌ Email failed:', response.data.error);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.response?.data || error.message);
  }
}

testAmpEmailSending();
