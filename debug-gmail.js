/**
 * Debug Gmail AMP Detection
 */

const EmailService = require('./services/EmailService');

async function debugGmailDetection() {
  console.log('🔍 Debugging Gmail AMP Detection\n');
  
  const emailService = new EmailService();
  
  // Test different Gmail addresses
  const testEmails = [
    'test@gmail.com',
    'user@googlemail.com', 
    'swatibhadrapur@gmail.com',
    'someone@GMAIL.COM', // Test case sensitivity
    'test@outlook.com'   // Control (should be false)
  ];
  
  testEmails.forEach(email => {
    console.log(`\nTesting: ${email}`);
    const isSupported = emailService.isAmpSupported(email);
    console.log(`Result: ${isSupported ? 'AMP ✅' : 'Static ❌'}`);
  });

  console.log('\n📧 Now testing actual email sending to Gmail...\n');
  
  try {
    const result = await emailService.sendResumeUpdateEmail({
      to: 'swatibhadrapur@gmail.com',
      subject: 'Test AMP Email',
      applicantName: 'Test User',
      jobTitle: 'Developer',
      companyName: 'TestCorp',
      serverUrl: 'http://localhost:3000',
      userAgent: 'Test-Agent',
      ipAddress: '127.0.0.1'
    });
    
    console.log('📧 Email sending result:', result);
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
}

debugGmailDetection();
