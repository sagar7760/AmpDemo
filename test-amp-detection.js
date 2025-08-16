// Simple test to verify AMP detection
const EmailService = require('./services/EmailService');

const emailService = new EmailService();

const testEmails = [
  'swatibhadrapur@gmail.com',
  'sagarsoradi11@outlook.com',
  'user@protonmail.com',
  'user@company.com'
];

console.log('🔍 Testing AMP Detection:');
testEmails.forEach(email => {
  const isSupported = emailService.isAmpSupported(email);
  console.log(`${email} → ${isSupported ? '🚀 AMP' : '📄 Static'}`);
});

console.log('\n📧 Supported domains:', emailService.ampSupportedDomains);
