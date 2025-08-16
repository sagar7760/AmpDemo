const { createTransporter } = require('../config/email');
const { generateAmpEmailTemplate } = require('../templates/ampEmail');
const EmailLog = require('../models/EmailLog');

class EmailService {
  constructor() {
    this.transporter = createTransporter();
    this.ampSupportedDomains = [
      'gmail.com', 
      'googlemail.com',
      'yahoo.com',
      'yahoo.co.uk',
      'yahoo.ca',
      'yahoo.co.jp',
      'mail.ru'
    ];
  }

  /**
   * Check if recipient's email domain supports AMP
   */
  isAmpSupported(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    const isSupported = this.ampSupportedDomains.includes(domain);
    console.log(`🔍 AMP Detection: ${email} → domain: ${domain} → supported: ${isSupported}`);
    return isSupported;
  }

  /**
   * Send email with automatic AMP/static fallback
   */
  async sendResumeUpdateEmail({
    to,
    subject = 'Update Your Resume',
    applicantName = 'Applicant',
    jobTitle = 'Position',
    companyName = 'Company',
    serverUrl,
    userAgent = '',
    ipAddress = ''
  }) {
    // Create email log entry
    const emailLog = new EmailLog({
      recipientEmail: to,
      emailType: 'resume_update_request',
      status: 'pending',
      metadata: {
        subject,
        templateUsed: this.isAmpSupported(to) ? 'amp_resume_update' : 'static_resume_update',
        userAgent,
        ipAddress
      },
      ampContent: this.isAmpSupported(to)
    });

    try {
      // Generate email content
      const emailContent = generateAmpEmailTemplate({
        applicantName,
        jobTitle,
        companyName,
        serverUrl
      });

      // Prepare mail options
      const mailOptions = {
        from: {
          name: `${companyName} - Resume Update`,
          address: process.env.SMTP_USER
        },
        to: to,
        subject: subject,
        html: emailContent.html, // Always include HTML fallback
        headers: {
          'X-Email-Type': 'Resume-Update-Request',
          'X-Company': companyName,
          'X-Position': jobTitle,
          'X-AMP-Supported': this.isAmpSupported(to).toString()
        }
      };

      // Add AMP content only if supported
      if (this.isAmpSupported(to)) {
        mailOptions.amp = emailContent.amp;
        console.log(`📧 Sending AMP email to ${to} (AMP supported domain)`);
        console.log(`📋 AMP content length: ${emailContent.amp.length} characters`);
        console.log(`📋 HTML content length: ${emailContent.html.length} characters`);
      } else {
        console.log(`📧 Sending static email to ${to} (non-AMP domain)`);
        console.log(`📋 HTML content length: ${emailContent.html.length} characters`);
      }

      // Debug: Log mail options (without showing full content)
      console.log(`📮 Mail options:`, {
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html,
        hasAmp: !!mailOptions.amp,
        headers: mailOptions.headers
      });

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      // Update email log with success
      emailLog.status = 'sent';
      emailLog.messageId = info.messageId;
      emailLog.sentAt = new Date();
      await emailLog.save();

      return {
        success: true,
        messageId: info.messageId,
        recipient: to,
        ampSupported: this.isAmpSupported(to),
        sentAt: emailLog.sentAt,
        emailType: emailLog.metadata.templateUsed
      };

    } catch (error) {
      console.error('❌ Email sending failed:', error);

      // Update email log with error
      emailLog.status = 'failed';
      emailLog.error = {
        message: error.message,
        code: error.code || 'UNKNOWN',
        timestamp: new Date()
      };
      await emailLog.save();

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Send bulk emails with automatic fallback
   */
  async sendBulkResumeEmails(recipients) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendResumeUpdateEmail(recipient);
        results.push({ ...result, email: recipient.to });
      } catch (error) {
        results.push({
          success: false,
          email: recipient.to,
          error: error.message
        });
      }
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Get email statistics
   */
  async getEmailStats(dateRange = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const stats = await EmailLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalSent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } },
          totalFailed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          ampEmails: { $sum: { $cond: ['$ampContent', 1, 0] } },
          staticEmails: { $sum: { $cond: ['$ampContent', 0, 1] } }
        }
      }
    ]);

    return stats[0] || {
      totalSent: 0,
      totalFailed: 0,
      ampEmails: 0,
      staticEmails: 0
    };
  }

  /**
   * Test email connectivity
   */
  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = EmailService;
