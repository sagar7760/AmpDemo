# AMP Email Backend for Hirefy

A Node.js backend service for sending and receiving AMP (Accelerated Mobile Pages) interactive emails, specifically designed for resume update functionality in hiring platforms.

## 🚀 Features

- **Smart Email Detection**: Automatically detects AMP support and sends appropriate email type
- **AMP Email Support**: Send interactive emails that work directly in Gmail
- **Static Email Fallback**: Beautiful HTML emails with web form links for non-AMP clients
- **Web Form Interface**: Complete responsive web form for resume submission
- **Resume Form Handling**: Process resume submissions through AMP forms and web forms
- **MongoDB Integration**: Store email logs and resume submissions
- **Email Delivery**: SMTP-based email sending with Nodemailer
- **Bulk Email Support**: Send multiple emails with automatic fallback detection
- **Rate Limiting**: Built-in protection against spam and abuse
- **Error Handling**: Comprehensive error handling and logging
- **Email Statistics**: Track delivery rates, AMP vs static usage
- **Render Optimized**: Configured for easy deployment on Render.com

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- Gmail account with App Password (for SMTP)
- Render account (for hosting)

## 🛠️ Installation

1. **Clone and setup**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual values:
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

## � Smart Email Detection & Fallback

The system automatically detects email client capabilities and sends the appropriate email type:

### AMP-Supported Domains
- **Gmail** (@gmail.com, @googlemail.com)
- **Yahoo Mail** (@yahoo.com, @yahoo.co.uk, @yahoo.ca, @yahoo.co.jp)
- **Mail.ru** (@mail.ru)

⚠️ **Important**: Outlook, Hotmail, and Live.com do **NOT** support AMP emails

### How It Works

1. **Email Analysis**: System checks recipient's email domain
2. **Smart Routing**:
   - **AMP-supported** → Sends interactive AMP email with form embedded
   - **Non-AMP** → Sends beautiful static HTML with web form link
3. **Unified Experience**: Both email types lead to the same data collection
4. **Automatic Logging**: Tracks which email type was sent for analytics

### Email Content Differences

**AMP Email (Gmail, Yahoo, Outlook)**:
- ✅ Interactive form directly in email
- ✅ No page redirection needed
- ✅ Instant submission
- ✅ Real-time validation

**Static Email (All other providers)**:
- ✅ Beautiful HTML design
- ✅ Clear call-to-action button
- ✅ Secure web form link
- ✅ Same data collection fields
- ✅ Mobile-responsive design

### Benefits

- **Universal Compatibility**: Works with any email provider
- **Optimal Experience**: Users get the best experience their client supports
- **Consistent Data**: Same resume information collected regardless of method
- **Analytics**: Track adoption rates of AMP vs static emails

## �🔧 Configuration

### Gmail Setup for AMP Emails

1. **Enable 2FA** on your Google account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **AMP Email Requirements**:
   - Gmail requires sender whitelisting for AMP emails to render interactively
   - Without whitelisting, Gmail will show the HTML fallback version
   - For development/testing: Use Gmail's AMP for Email developer mode
   - For production: Apply for sender approval through Google

⚠️ **Note**: Even if you send AMP content to Gmail, it may show as static HTML if:
- Sender is not whitelisted in Gmail's AMP program
- AMP content doesn't validate properly  
- Recipient hasn't enabled AMP emails in settings

### MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in your `.env` file

## 🚀 Deployment on Render

### Environment Variables

Set these in your Render dashboard:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Build Command
```bash
npm install
```

### Start Command
```bash
npm start
```

## 📡 API Endpoints

### Email Routes (`/api/email`)

#### Send Smart Email (AMP/Static Auto-Detection)
```http
POST /api/email/send
Content-Type: application/json

{
  "to": "applicant@example.com",
  "applicantName": "John Doe",
  "jobTitle": "Software Developer",
  "companyName": "TechCorp",
  "subject": "Update Your Resume - TechCorp"
}
```

#### Send Bulk Emails
```http
POST /api/email/send-bulk
Content-Type: application/json

{
  "recipients": [
    {
      "to": "applicant1@gmail.com",
      "applicantName": "John Doe",
      "jobTitle": "Developer",
      "companyName": "TechCorp"
    },
    {
      "to": "applicant2@yahoo.com", 
      "applicantName": "Jane Smith",
      "jobTitle": "Designer",
      "companyName": "TechCorp"
    }
  ]
}
```

#### Get Email Statistics
```http
GET /api/email/stats?days=30
```

#### Test Email Connection
```http
GET /api/email/test-connection
```

#### Get Email Logs
```http
GET /api/email/logs?page=1&limit=10&status=sent
```

### AMP Routes (`/api/amp`)

#### Submit Resume (AMP Form Handler)
```http
POST /api/amp/submit
Content-Type: application/json

{
  "email": "john@example.com",
  "personalInfo": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

#### Get Submissions
```http
GET /api/amp/submissions?page=1&limit=10
```

### Web Form Routes (`/api/form`)

#### Resume Web Form (For Non-AMP Clients)
```http
GET /api/form/resume-form?email=john@example.com&name=John%20Doe&job=Developer&company=TechCorp
```

#### Submit Web Form
```http
POST /api/form/resume-form
Content-Type: application/x-www-form-urlencoded

[Form data with same structure as AMP submission]
```

## 🧪 Testing

### Local Development
```bash
npm run dev
```

### Send Test Email (Smart Detection)
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@gmail.com",
    "applicantName": "Test User",
    "jobTitle": "Developer",
    "companyName": "TestCorp"
  }'
```

### Test Web Form
Visit: `http://localhost:3000/api/form/resume-form?email=test@example.com&name=Test%20User&job=Developer&company=TestCorp`

### Health Check
```bash
curl http://localhost:3000/health
```

### Email Statistics
```bash
curl http://localhost:3000/api/email/stats
```

### Test Email Connection
```bash
curl http://localhost:3000/api/email/test-connection
```

## 📁 Project Structure

```
├── config/
│   ├── database.js       # MongoDB connection
│   └── email.js          # Email transporter setup
├── middleware/
│   └── errorHandler.js   # Global error handling
├── models/
│   ├── EmailLog.js       # Email logging schema
│   └── ResumeSubmission.js # Resume data schema
├── routes/
│   ├── email.js          # Email sending routes (AMP/static auto-detection)
│   ├── amp.js            # AMP form handling routes
│   └── form.js           # Web form routes for non-AMP clients
├── services/
│   └── EmailService.js   # Smart email service with auto-detection
├── templates/
│   └── ampEmail.js       # AMP + static email template generator
├── server.js             # Main application file
├── package.json
└── README.md
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: Prevents abuse
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Joi schema validation
- **Error Sanitization**: Prevents information leakage

## 📊 Monitoring

### Health Check
- **Endpoint**: `GET /health`
- **Response**: Server status and timestamp

### Logging
- **Email Logs**: Track all sent emails with status
- **Submission Logs**: Monitor resume submissions
- **Error Logs**: Comprehensive error tracking

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check SMTP credentials
   - Verify App Password is correct
   - Ensure Gmail 2FA is enabled

2. **MongoDB connection failed**:
   - Verify connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure network access

3. **AMP email not interactive**:
   - Verify sender is whitelisted in Gmail
   - Check AMP HTML validation
   - Ensure proper content headers

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and stack traces.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
- Create GitHub issue
- Check troubleshooting section
- Review error logs

---

**Built for modern email interactivity with AMP technology** 🚀
