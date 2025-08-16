const mongoose = require('mongoose');

const resumeSubmissionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    portfolioUrl: {
      type: String,
      trim: true
    }
  },
  professionalSummary: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  experience: [{
    company: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String
    },
    description: {
      type: String,
      trim: true
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  }],
  education: [{
    institution: {
      type: String,
      required: true,
      trim: true
    },
    degree: {
      type: String,
      required: true,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    graduationYear: {
      type: String
    },
    gpa: {
      type: String,
      trim: true
    }
  }],
  skills: [{
    category: {
      type: String,
      required: true,
      trim: true
    },
    items: [{
      type: String,
      trim: true
    }]
  }],
  submissionMetadata: {
    userAgent: String,
    ipAddress: String,
    submissionSource: {
      type: String,
      enum: ['amp_email', 'web_form', 'api'],
      default: 'amp_email'
    },
    emailMessageId: String
  },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'approved', 'rejected'],
    default: 'submitted'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
resumeSubmissionSchema.index({ email: 1, createdAt: -1 });
resumeSubmissionSchema.index({ status: 1, createdAt: -1 });
resumeSubmissionSchema.index({ 'personalInfo.fullName': 'text', 'professionalSummary': 'text' });

// Update lastUpdated on save
resumeSubmissionSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('ResumeSubmission', resumeSubmissionSchema);
