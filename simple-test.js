// Simple AMP detection test without database connection
const ampSupportedDomains = [
  'gmail.com', 
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.co.jp',
  'mail.ru'
];

function isAmpSupported(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  const isSupported = ampSupportedDomains.includes(domain);
  console.log(`🔍 AMP Detection: ${email} → domain: ${domain} → supported: ${isSupported}`);
  return isSupported;
}

// Test Gmail addresses
console.log('Testing Gmail AMP detection:');
console.log('Gmail test:', isAmpSupported('test@gmail.com'));
console.log('Gmail test 2:', isAmpSupported('swatibhadrapur@gmail.com'));
console.log('Outlook test:', isAmpSupported('test@outlook.com'));
console.log('Yahoo test:', isAmpSupported('test@yahoo.com'));
