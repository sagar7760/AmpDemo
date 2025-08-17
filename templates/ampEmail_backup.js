const generateAmpEmailTemplate = ({ applicantName, jobTitle, companyName, serverUrl }) => {
  const ampContent = `<!doctype html>
<html ⚡4email data-css-strict>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <script async custom-element="amp-selector" src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  
  <style amp-custom>
    /* New styling based on the provided template */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #1a1a1a;
      color: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .email-card {
      background: #2d2d2d;
      border-radius: 12px;
      padding: 30px;
      border: 1px solid #444;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #60a5fa;
      font-size: 28px;
      margin: 0 0 10px 0;
    }
    .header p {
      color: #9ca3af;
      margin: 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      color: #e5e7eb;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .form-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #555;
      border-radius: 6px;
      background: #3a3a3a;
      color: #ffffff;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-input:focus {
      border-color: #60a5fa;
      outline: none;
    }
    .radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 8px;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #3a3a3a;
      border: 1px solid #555;
      border-radius: 6px;
      cursor: pointer;
    }
    .radio-option[selected] {
      border-color: #60a5fa;
      background-color: #3b3b3b;
    }
    .radio-option input {
      margin: 0;
    }
    .textarea {
      min-height: 100px;
      resize: vertical;
    }
    .submit-btn {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
    }
    .success-msg, .error-msg {
      padding: 15px;
      border-radius: 6px;
      margin-top: 20px;
      text-align: center;
    }
    .success-msg {
      background: #065f46;
      border: 1px solid #059669;
      color: #d1fae5;
    }
    .error-msg {
      background: #7f1d1d;
      border: 1px solid #dc2626;
      color: #fecaca;
    }
    .hint {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="header">
      <h1>Resume Refreshment</h1>
      <p>Hi ${applicantName}, refresh your career journey with ${companyName}</p>
    </div>

    <!-- Interactive AMP Form -->
    <form method="POST" action-xhr="https://your-server.com/api/amp/submit" custom-validation-reporting="as-you-go">
      <div class="form-group">
        <label class="form-label">Are you currently employed by the same company you applied to? *</label>
        <amp-selector name="same_company" class="radio-group" layout="container">
          <div class="radio-option" option="yes">
            <label>Yes, same company</label>
          </div>
          <div class="radio-option" option="no">
            <label>No, different company</label>
          </div>
        </amp-selector>
      </div>

      <div class="form-group">
        <label class="form-label">Select your key technical skills:</label>
        <amp-selector name="skills" class="radio-group" layout="container" multiple>
          <div class="radio-option" option="React">
            <label>React</label>
          </div>
          <div class="radio-option" option="Node.js">
            <label>Node.js</label>
          </div>
          <div class="radio-option" option="MongoDB">
            <label>MongoDB</label>
          </div>
          <div class="radio-option" option="Big Data">
            <label>Big Data</label>
          </div>
          <div class="radio-option" option="Docker">
            <label>Docker</label>
          </div>
          <div class="radio-option" option="Kubernetes">
            <label>Kubernetes</label>
          </div>
          <div class="radio-option" option="Python">
            <label>Python</label>
          </div>
          <div class="radio-option" option="Data Engineering">
            <label>Data Engineering</label>
          </div>
        </amp-selector>
      </div>

      <div class="form-group">
        <label class="form-label" for="role">What is your current role/position? *</label>
        <input class="form-input" type="text" id="role" name="role" placeholder="e.g., Senior Software Engineer" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="experience">Years of relevant experience? *</label>
        <input class="form-input" type="number" id="experience" name="experience" min="0" max="50" placeholder="e.g., 5" required>
        <div class="hint">Enter whole numbers only (e.g., 5 for 5 years)</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="description">Any additional relevant information or recent achievements?</label>
        <textarea class="form-input textarea" id="description" name="description" placeholder="Share any recent achievements, certifications, or relevant information..." maxlength="2000"></textarea>
        <div class="hint">Optional - Max 2000 characters</div>
      </div>

      <button type="submit" class="submit-btn">✨ Submit Refreshment</button>

      <!-- Success message template -->
      <div submit-success>
        <template type="amp-mustache">
          <div class="success-msg">
            <strong>🎉 Success!</strong><br>
            Thanks {{role}}! Your refreshment details were received.<br>
            Experience: {{experience}} years
          </div>
        </template>
      </div>

      <!-- Error message template -->
      <div submit-error>
        <template type="amp-mustache">
          <div class="error-msg">
            <strong>❌ Error</strong><br>
            Something went wrong: {{message}}<br>
            Please try again or contact support.
          </div>
        </template>
      </div>
    </form>
  </div>
</body>
</html>
`;

  // Enhanced fallback HTML for non-AMP email clients
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume Update Request - ${companyName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      color: #2c3e50;
      margin-bottom: 20px;
    }
    .benefits {
      background: #e8f4f8;
      border-left: 4px solid #3498db;
      padding: 20px;
      margin: 20px 0;
      border-radius: 6px;
    }
    .benefits ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .benefits li {
      margin: 8px 0;
    }
    .cta-section {
      text-align: center;
      margin: 30px 0;
      padding: 25px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px dashed #3498db;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
      transition: transform 0.2s;
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      text-decoration: none;
      color: white;
    }
    .alternative-text {
      font-size: 14px;
      color: #666;
      margin-top: 15px;
    }
    .security-note {
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #28a745;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer {
      background: #34495e;
      color: white;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #3498db;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      body { padding: 10px; }
      .content { padding: 20px; }
      .cta-btn { padding: 12px 24px; font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Resume Update Request</h1>
      <p>Static HTML Email - Click below to complete your application</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${applicantName},
      </div>
      
      <p>We're excited about your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>! To move forward with your application, we need you to update your resume information.</p>
      
      <div class="benefits">
        <strong>📋 What you'll do:</strong>
        <ul>
          <li>✅ Update your personal information</li>
          <li>✅ Add your work experience</li>
          <li>✅ Include your education details</li>
          <li>✅ List your key skills</li>
          <li>✅ Submit everything securely</li>
        </ul>
      </div>

      <div class="cta-section">
        <h3 style="margin-bottom: 15px; color: #2c3e50;">📝 Ready to Update Your Resume?</h3>
        <a href="${serverUrl}/api/form/resume-form?email=${encodeURIComponent(applicantName.toLowerCase().replace(' ', '.') + '@example.com')}&name=${encodeURIComponent(applicantName)}&job=${encodeURIComponent(jobTitle)}&company=${encodeURIComponent(companyName)}" class="cta-btn">
          🚀 Update My Resume Now
        </a>
        <div class="alternative-text">
          <strong>Estimated time:</strong> 5-10 minutes<br>
          <strong>Device:</strong> Works on desktop, tablet, and mobile
        </div>
      </div>

      <div class="security-note">
        <strong>🔒 Security & Privacy:</strong> Your information is transmitted securely and stored safely. We only use this data for your job application and will never share it with third parties.
      </div>
      
      <p><strong>Need help?</strong> Simply reply to this email or contact our HR team directly. We're here to assist you throughout the application process!</p>
      
      <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;">
      
      <p style="color: #666; font-size: 14px;">
        <strong>Alternative option:</strong> If you have trouble with the online form, you can also email your resume directly to this address, and we'll manually update your information.
      </p>
    </div>

    <div class="footer">
      <p>© 2024 ${companyName} | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a></p>
      <p>This email was sent regarding your application for the ${jobTitle} position</p>
    </div>
  </div>
</body>
</html>`;

  return {
    amp: ampContent,
    html: htmlContent
  };
};

module.exports = { generateAmpEmailTemplate };
