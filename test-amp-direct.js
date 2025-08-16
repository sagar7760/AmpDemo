/**
 * Test AMP email sending without database
 */

const nodemailer = require('nodemailer');
const { generateAmpEmailTemplate } = require('./templates/ampEmail');
require('dotenv').config();

// AMP detection function
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

async function testAmpEmail() {
  console.log('📧 Testing AMP Email Sending (No Database)\n');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('✅ Email transporter created');

    // Test connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Test email
    const testEmail = 'swatibhadrapur@gmail.com';
    const isAmp = isAmpSupported(testEmail);

    // Generate email content
    const emailContent = generateAmpEmailTemplate({
      applicantName: 'Test User',
      jobTitle: 'Developer',
      companyName: 'TestCorp',
      serverUrl: 'http://localhost:3000'
    });

    console.log(`📧 Generated email content: AMP=${emailContent.amp.length} chars, HTML=${emailContent.html.length} chars`);

    // Prepare mail options
    const mailOptions = {
      from: {
        name: 'TestCorp - Resume Update',
        address: process.env.SMTP_USER
      },
      to: testEmail,
      subject: 'AMP Test Email',
      html: emailContent.html,
      headers: {
        'X-Email-Type': 'AMP-Test',
        'X-AMP-Supported': isAmp.toString()
      }
    };

    // Add AMP content if supported
    if (isAmp) {
      mailOptions.amp = emailContent.amp;
      console.log('🚀 Adding AMP content to email (Gmail should show interactive version)');
    } else {
      console.log('📄 Sending static HTML only (non-AMP client)');
    }

    console.log(`📮 Sending email to ${testEmail}...`);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`📨 Message ID: ${info.messageId}`);
    console.log(`📧 AMP content included: ${!!mailOptions.amp}`);
    console.log('\n📱 Check your Gmail inbox:');
    console.log('   - If you see "AMP Interactive Email" in header → AMP version received');
    console.log('   - If you see "Static HTML Email" in header → HTML fallback received');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAmpEmail();
