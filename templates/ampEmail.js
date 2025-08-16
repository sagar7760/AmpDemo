const generateAmpEmailTemplate = ({ applicantName, jobTitle, companyName, serverUrl }) => {
  const ampContent = `<!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <script async custom-element="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <style amp-custom>
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
    .form-section {
      margin: 25px 0;
    }
    .form-section h3 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: #555;
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e8ed;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #3498db;
    }
    .form-row {
      display: flex;
      gap: 15px;
    }
    .form-row .form-group {
      flex: 1;
    }
    .experience-entry,
    .education-entry {
      background: #f8f9fa;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }
    .submit-btn {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      padding: 15px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: transform 0.2s;
    }
    .submit-btn:hover {
      transform: translateY(-2px);
    }
    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #28a745;
      margin-top: 20px;
    }
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #dc3545;
      margin-top: 20px;
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
      .form-row {
        flex-direction: column;
      }
      body {
        padding: 10px;
      }
      .content {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🚀 Resume Update Request</h1>
      <p>📱 AMP Interactive Email - Complete forms directly in your inbox!</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        Hi ${applicantName},
      </div>
      
      <p>We're excited about your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>! To proceed with your application, we'd like you to update your resume information using the interactive form below.</p>
      
      <p><strong>Why update directly in email?</strong></p>
      <ul>
        <li>✅ No need to visit external websites</li>
        <li>✅ Secure and instant submission</li>
        <li>✅ Your information stays private</li>
        <li>✅ One-click update process</li>
      </ul>

      <form method="post" action-xhr="${serverUrl}/api/amp/submit">
        
        <!-- Personal Information -->
        <div class="form-section">
          <h3>📋 Personal Information</h3>
          
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="personalInfo.email" value="${applicantName.toLowerCase().replace(' ', '.')}@example.com" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input type="text" id="fullName" name="personalInfo.fullName" value="${applicantName}" required>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input type="tel" id="phone" name="personalInfo.phone" placeholder="+1 (555) 123-4567">
            </div>
          </div>
          
          <div class="form-group">
            <label for="location">Location</label>
            <input type="text" id="location" name="personalInfo.location" placeholder="City, State/Country">
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="linkedin">LinkedIn Profile</label>
              <input type="url" id="linkedin" name="personalInfo.linkedinUrl" placeholder="https://linkedin.com/in/yourprofile">
            </div>
            <div class="form-group">
              <label for="portfolio">Portfolio Website</label>
              <input type="url" id="portfolio" name="personalInfo.portfolioUrl" placeholder="https://yourportfolio.com">
            </div>
          </div>
        </div>

        <!-- Professional Summary -->
        <div class="form-section">
          <h3>💼 Professional Summary</h3>
          <div class="form-group">
            <label for="summary">Professional Summary</label>
            <textarea id="summary" name="professionalSummary" rows="4" placeholder="Brief overview of your professional background, key skills, and career objectives..."></textarea>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="form-section">
          <h3>🏢 Work Experience</h3>
          
          <div class="experience-entry">
            <h4>Most Recent Position</h4>
            <div class="form-row">
              <div class="form-group">
                <label for="company1">Company *</label>
                <input type="text" id="company1" name="experience[0].company" required>
              </div>
              <div class="form-group">
                <label for="position1">Position *</label>
                <input type="text" id="position1" name="experience[0].position" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="startDate1">Start Date *</label>
                <input type="month" id="startDate1" name="experience[0].startDate" required>
              </div>
              <div class="form-group">
                <label for="endDate1">End Date (leave empty if current)</label>
                <input type="month" id="endDate1" name="experience[0].endDate">
              </div>
            </div>
            
            <div class="form-group">
              <label for="description1">Job Description</label>
              <textarea id="description1" name="experience[0].description" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="form-section">
          <h3>🎓 Education</h3>
          
          <div class="education-entry">
            <div class="form-row">
              <div class="form-group">
                <label for="institution">Institution *</label>
                <input type="text" id="institution" name="education[0].institution" required>
              </div>
              <div class="form-group">
                <label for="degree">Degree *</label>
                <input type="text" id="degree" name="education[0].degree" required>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="fieldOfStudy">Field of Study</label>
                <input type="text" id="fieldOfStudy" name="education[0].fieldOfStudy">
              </div>
              <div class="form-group">
                <label for="graduationYear">Graduation Year</label>
                <input type="number" id="graduationYear" name="education[0].graduationYear" min="1990" max="2030">
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="form-section">
          <h3>🛠️ Skills</h3>
          
          <div class="form-group">
            <label for="technicalSkills">Technical Skills</label>
            <input type="text" id="technicalSkills" name="skills[0].items" placeholder="JavaScript, Python, React, Node.js, etc.">
          </div>
          
          <div class="form-group">
            <label for="softSkills">Soft Skills</label>
            <input type="text" id="softSkills" name="skills[1].items" placeholder="Leadership, Communication, Problem Solving, etc.">
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">
          🚀 Update My Resume
        </button>

        <!-- Success/Error Messages -->
        <div submit-success>
          <template type="amp-mustache">
            <div class="success-message">
              <strong>✅ Success!</strong> Your resume has been updated successfully. We'll review your information and get back to you soon!
            </div>
          </template>
        </div>

        <div submit-error>
          <template type="amp-mustache">
            <div class="error-message">
              <strong>❌ Error:</strong> There was a problem updating your resume. Please try again or contact us directly.
            </div>
          </template>
        </div>
      </form>
      
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        <strong>Questions?</strong> Reply to this email or contact our HR team directly. We're here to help!
      </p>
    </div>

    <div class="footer">
      <p>© 2024 ${companyName} | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a></p>
      <p>This is an interactive email powered by AMP technology</p>
    </div>
  </div>
</body>
</html>`;

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
      <h1>🚀 Resume Update Request</h1>
      <p>📄 Static HTML Email - Click below to complete your application</p>
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
