const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  emailType: {
    type: String,
    required: true,
    enum: ['resume_update_request', 'confirmation', 'reminder']
  },
  status: {
    type: String,
    required: true,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  messageId: {
    type: String,
    unique: true,
    sparse: true
  },
  ampContent: {
    type: Boolean,
    default: true
  },
  metadata: {
    subject: String,
    templateUsed: String,
    userAgent: String,
    ipAddress: String
  },
  error: {
    message: String,
    code: String,
    timestamp: Date
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
emailLogSchema.index({ recipientEmail: 1, createdAt: -1 });
emailLogSchema.index({ status: 1, createdAt: -1 });
emailLogSchema.index({ messageId: 1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);
