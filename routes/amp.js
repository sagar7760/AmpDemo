const express = require('express');
const router = express.Router();
const Joi = require('joi');
const ResumeSubmission = require('../models/ResumeSubmission');

// Validation schema for resume submission
const resumeSubmissionSchema = Joi.object({
  email: Joi.string().email().required(),
  personalInfo: Joi.object({
    fullName: Joi.string().min(1).max(100).required(),
    phone: Joi.string().max(20).allow(''),
    location: Joi.string().max(100).allow(''),
    linkedinUrl: Joi.string().uri().allow(''),
    portfolioUrl: Joi.string().uri().allow('')
  }).required(),
  professionalSummary: Joi.string().max(1000).allow(''),
  experience: Joi.array().items(
    Joi.object({
      company: Joi.string().min(1).max(100).required(),
      position: Joi.string().min(1).max(100).required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().allow(''),
      description: Joi.string().max(500).allow(''),
      isCurrent: Joi.boolean().default(false)
    })
  ).default([]),
  education: Joi.array().items(
    Joi.object({
      institution: Joi.string().min(1).max(100).required(),
      degree: Joi.string().min(1).max(100).required(),
      fieldOfStudy: Joi.string().max(100).allow(''),
      graduationYear: Joi.string().allow(''),
      gpa: Joi.string().allow('')
    })
  ).default([]),
  skills: Joi.array().items(
    Joi.object({
      category: Joi.string().min(1).max(50).required(),
      items: Joi.array().items(Joi.string().max(50)).default([])
    })
  ).default([])
});

// Handle AMP form submission
router.post('/submit', async (req, res) => {
  try {
    console.log('📨 Received AMP form submission:', req.body);

    // Validate the submission
    const { error, value } = resumeSubmissionSchema.validate(req.body);
    if (error) {
      console.error('❌ Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details[0].message
      });
    }

    // Add submission metadata
    const submissionData = {
      ...value,
      submissionMetadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        submissionSource: 'amp_email',
        emailMessageId: req.get('AMP-Email-Message-Id') || req.get('Message-Id')
      }
    };

    // Check if submission already exists for this email
    const existingSubmission = await ResumeSubmission.findOne({ 
      email: value.email 
    }).sort({ createdAt: -1 });

    let submission;
    
    if (existingSubmission) {
      // Update existing submission
      Object.assign(existingSubmission, submissionData);
      submission = await existingSubmission.save();
      console.log(`📝 Updated existing resume for ${value.email}`);
    } else {
      // Create new submission
      submission = new ResumeSubmission(submissionData);
      await submission.save();
      console.log(`✨ Created new resume submission for ${value.email}`);
    }

    // Respond with success (required for AMP)
    res.status(200).json({
      success: true,
      message: 'Resume updated successfully!',
      data: {
        submissionId: submission._id,
        email: submission.email,
        fullName: submission.personalInfo.fullName,
        submittedAt: submission.createdAt,
        status: submission.status
      }
    });

  } catch (error) {
    console.error('❌ Error processing AMP submission:', error);
    
    // Return error response compatible with AMP
    res.status(500).json({
      success: false,
      error: 'Failed to process submission',
      details: error.message
    });
  }
});

// AMP proxy endpoint (required for some AMP components)
router.get('/proxy', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AMP proxy endpoint active',
    timestamp: new Date().toISOString()
  });
});

// Get resume submissions (for admin/monitoring)
router.get('/submissions', async (req, res) => {
  try {
    const { page = 1, limit = 10, email, status } = req.query;
    
    const query = {};
    if (email) query.email = email;
    if (status) query.status = status;

    const submissions = await ResumeSubmission.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await ResumeSubmission.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
      details: error.message
    });
  }
});

// Get specific submission by ID
router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await ResumeSubmission.findById(req.params.id).select('-__v');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('❌ Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission',
      details: error.message
    });
  }
});

module.exports = router;
