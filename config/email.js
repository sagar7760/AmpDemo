const nodemailer = require('nodemailer');

const createTransporter = () => {
  try {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false // For development only
      }
    };

    console.log('📧 Email transporter configuration:', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      hasPassword: !!config.auth.pass
    });

    return nodemailer.createTransport(config);
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    throw error;
  }
};

module.exports = { createTransporter };
