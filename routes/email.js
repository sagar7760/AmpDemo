const express = require('express');
const router = express.Router();
const Joi = require('joi');
const EmailService = require('../services/EmailService');
const EmailLog = require('../models/EmailLog');

// Validation schema for email sending
const sendEmailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().min(1).max(200).default('Update Your Resume - Hirefy'),
  applicantName: Joi.string().min(1).max(100).default('Applicant'),
  jobTitle: Joi.string().min(1).max(200).default('Software Developer'),
  companyName: Joi.string().min(1).max(100).default('Hirefy')
});

// Send AMP/Static Email with automatic fallback
router.post('/send', async (req, res) => {
  try {
    // Validate request
    const { error, value } = sendEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    const { to, subject, applicantName, jobTitle, companyName } = value;

    // Initialize email service
    const emailService = new EmailService();

    // Send email with automatic AMP/static fallback
    const result = await emailService.sendResumeUpdateEmail({
      to,
      subject,
      applicantName,
      jobTitle,
      companyName,
      serverUrl: `${req.protocol}://${req.get('host')}`,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully with automatic fallback',
      data: result
    });

  } catch (error) {
    console.error('❌ Route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Get email logs (for monitoring)
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, email } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (email) query.recipientEmail = email;

    const logs = await EmailLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await EmailLog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching email logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email logs',
      details: error.message
    });
  }
});

// Send bulk emails
router.post('/send-bulk', async (req, res) => {
  try {
    const { recipients } = req.body;
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array is required'
      });
    }

    // Validate each recipient
    const validationErrors = [];
    const validatedRecipients = [];

    for (let i = 0; i < recipients.length; i++) {
      const { error, value } = sendEmailSchema.validate(recipients[i]);
      if (error) {
        validationErrors.push(`Recipient ${i + 1}: ${error.details[0].message}`);
      } else {
        validatedRecipients.push({
          ...value,
          serverUrl: `${req.protocol}://${req.get('host')}`,
          userAgent: req.get('User-Agent'),
          ipAddress: req.ip
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for some recipients',
        details: validationErrors
      });
    }

    // Send bulk emails
    const emailService = new EmailService();
    const results = await emailService.sendBulkResumeEmails(validatedRecipients);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      message: `Bulk email sending completed: ${successCount} sent, ${failureCount} failed`,
      data: {
        results,
        summary: {
          total: results.length,
          sent: successCount,
          failed: failureCount
        }
      }
    });

  } catch (error) {
    console.error('❌ Bulk email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send bulk emails',
      details: error.message
    });
  }
});

// Test email connection
router.get('/test-connection', async (req, res) => {
  try {
    const emailService = new EmailService();
    const result = await emailService.testConnection();
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      details: error.message
    });
  }
});

// Get email statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const emailService = new EmailService();
    const stats = await emailService.getEmailStats(parseInt(days));

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        period: `Last ${days} days`
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email statistics',
      details: error.message
    });
  }
});

module.exports = router;
