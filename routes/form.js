const express = require('express');
const router = express.Router();
const Joi = require('joi');
const ResumeSubmission = require('../models/ResumeSubmission');

// Validation schema for web form
const webFormSchema = Joi.object({
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
  ).default([]),
  // Additional fields for tracking
  token: Joi.string().allow(''), // For security/tracking
  source: Joi.string().valid('web_form').default('web_form')
});

// Serve the resume update form
router.get('/resume-form', (req, res) => {
  const { email, name, job, company, token } = req.query;
  
  const formData = {
    applicantEmail: email || '',
    applicantName: name || '',
    jobTitle: job || '',
        companyName: company || 'KLE',
    token: token || '',
    serverUrl: `${req.protocol}://${req.get('host')}`
  };

  const htmlForm = generateResumeForm(formData);
  
  res.send(htmlForm);
});

// Handle web form submission
router.post('/resume-form', async (req, res) => {
  try {
    console.log('📝 Received web form submission:', req.body);

    // Validate the submission
    const { error, value } = webFormSchema.validate(req.body);
    if (error) {
      return res.status(400).send(generateErrorPage(error.details[0].message));
    }

    // Add submission metadata
    const submissionData = {
      ...value,
      submissionMetadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        submissionSource: 'web_form',
        referrer: req.get('Referer')
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

    // Return success page
    res.send(generateSuccessPage({
      fullName: submission.personalInfo.fullName,
      email: submission.email,
      submissionId: submission._id
    }));

  } catch (error) {
    console.error('Error processing web form submission:', error);
    res.status(500).send(generateErrorPage('Failed to process your submission. Please try again.'));
  }
});

// Generate the HTML form
function generateResumeForm({ applicantEmail, applicantName, jobTitle, companyName, token, serverUrl }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update Your Resume - ${companyName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .greeting { font-size: 18px; color: #2c3e50; margin-bottom: 20px; }
        .form-section { margin: 25px 0; }
        .form-section h3 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .form-group { margin-bottom: 15px; }
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
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        .form-row { display: flex; gap: 15px; }
        .form-row .form-group { flex: 1; }
        .experience-entry, .education-entry {
            background: #f8f9fa;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        .add-btn {
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .remove-btn {
            background: #dc3545;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            float: right;
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
        .submit-btn:hover { transform: translateY(-2px); }
        .required { color: #e74c3c; }
        .info-box {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        @media (max-width: 768px) {
            .form-row { flex-direction: column; }
            body { padding: 10px; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Resume Update Form</h1>
            <p>Update your information for ${companyName}</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hi ${applicantName || 'there'},</div>
            
            <div class="info-box">
                <strong>📋 Instructions:</strong> Please fill out the form below to update your resume information for the <strong>${jobTitle || 'position'}</strong> at <strong>${companyName}</strong>. All fields marked with <span class="required">*</span> are required.
            </div>

            <form method="POST" action="${serverUrl}/api/form/resume-form" id="resumeForm">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="source" value="web_form">
                
                <!-- Personal Information -->
                <div class="form-section">
                    <h3>📋 Personal Information</h3>
                    
                    <div class="form-group">
                        <label for="email">Email Address <span class="required">*</span></label>
                        <input type="email" id="email" name="email" value="${applicantEmail}" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="fullName">Full Name <span class="required">*</span></label>
                            <input type="text" id="fullName" name="personalInfo[fullName]" value="${applicantName}" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="personalInfo[phone]" placeholder="+1 (555) 123-4567">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" name="personalInfo[location]" placeholder="City, State/Country">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="linkedin">LinkedIn Profile</label>
                            <input type="url" id="linkedin" name="personalInfo[linkedinUrl]" placeholder="https://linkedin.com/in/yourprofile">
                        </div>
                        <div class="form-group">
                            <label for="portfolio">Portfolio Website</label>
                            <input type="url" id="portfolio" name="personalInfo[portfolioUrl]" placeholder="https://yourportfolio.com">
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
                    <div id="experienceContainer">
                        <div class="experience-entry">
                            <h4>Position 1</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Company <span class="required">*</span></label>
                                    <input type="text" name="experience[0][company]" required>
                                </div>
                                <div class="form-group">
                                    <label>Position <span class="required">*</span></label>
                                    <input type="text" name="experience[0][position]" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Start Date <span class="required">*</span></label>
                                    <input type="month" name="experience[0][startDate]" required>
                                </div>
                                <div class="form-group">
                                    <label>End Date (leave empty if current)</label>
                                    <input type="month" name="experience[0][endDate]">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Job Description</label>
                                <textarea name="experience[0][description]" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="add-btn" onclick="addExperience()">+ Add Another Position</button>
                </div>

                <!-- Education -->
                <div class="form-section">
                    <h3>🎓 Education</h3>
                    <div id="educationContainer">
                        <div class="education-entry">
                            <h4>Education 1</h4>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Institution <span class="required">*</span></label>
                                    <input type="text" name="education[0][institution]" required>
                                </div>
                                <div class="form-group">
                                    <label>Degree <span class="required">*</span></label>
                                    <input type="text" name="education[0][degree]" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Field of Study</label>
                                    <input type="text" name="education[0][fieldOfStudy]">
                                </div>
                                <div class="form-group">
                                    <label>Graduation Year</label>
                                    <input type="number" name="education[0][graduationYear]" min="1990" max="2030">
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="add-btn" onclick="addEducation()">+ Add Another Education</button>
                </div>

                <!-- Skills -->
                <div class="form-section">
                    <h3>🛠️ Skills</h3>
                    <div class="form-group">
                        <label for="technicalSkills">Technical Skills</label>
                        <input type="text" id="technicalSkills" name="skills[0][items]" placeholder="JavaScript, Python, React, Node.js, etc. (comma separated)">
                        <input type="hidden" name="skills[0][category]" value="Technical">
                    </div>
                    <div class="form-group">
                        <label for="softSkills">Soft Skills</label>
                        <input type="text" id="softSkills" name="skills[1][items]" placeholder="Leadership, Communication, Problem Solving, etc. (comma separated)">
                        <input type="hidden" name="skills[1][category]" value="Soft Skills">
                    </div>
                </div>

                <button type="submit" class="submit-btn">🚀 Submit Resume Update</button>
            </form>
        </div>
    </div>

    <script>
        let experienceCount = 1;
        let educationCount = 1;

        function addExperience() {
            const container = document.getElementById('experienceContainer');
            const newEntry = document.createElement('div');
            newEntry.className = 'experience-entry';
            newEntry.innerHTML = \`
                <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
                <h4>Position \${experienceCount + 1}</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Company <span class="required">*</span></label>
                        <input type="text" name="experience[\${experienceCount}][company]" required>
                    </div>
                    <div class="form-group">
                        <label>Position <span class="required">*</span></label>
                        <input type="text" name="experience[\${experienceCount}][position]" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date <span class="required">*</span></label>
                        <input type="month" name="experience[\${experienceCount}][startDate]" required>
                    </div>
                    <div class="form-group">
                        <label>End Date (leave empty if current)</label>
                        <input type="month" name="experience[\${experienceCount}][endDate]">
                    </div>
                </div>
                <div class="form-group">
                    <label>Job Description</label>
                    <textarea name="experience[\${experienceCount}][description]" rows="3" placeholder="Key responsibilities and achievements..."></textarea>
                </div>
            \`;
            container.appendChild(newEntry);
            experienceCount++;
        }

        function addEducation() {
            const container = document.getElementById('educationContainer');
            const newEntry = document.createElement('div');
            newEntry.className = 'education-entry';
            newEntry.innerHTML = \`
                <button type="button" class="remove-btn" onclick="removeEntry(this)">Remove</button>
                <h4>Education \${educationCount + 1}</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label>Institution <span class="required">*</span></label>
                        <input type="text" name="education[\${educationCount}][institution]" required>
                    </div>
                    <div class="form-group">
                        <label>Degree <span class="required">*</span></label>
                        <input type="text" name="education[\${educationCount}][degree]" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Field of Study</label>
                        <input type="text" name="education[\${educationCount}][fieldOfStudy]">
                    </div>
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="number" name="education[\${educationCount}][graduationYear]" min="1990" max="2030">
                    </div>
                </div>
            \`;
            container.appendChild(newEntry);
            educationCount++;
        }

        function removeEntry(btn) {
            btn.parentElement.remove();
        }

        // Handle form submission
        document.getElementById('resumeForm').addEventListener('submit', function(e) {
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = '⏳ Submitting...';
            submitBtn.disabled = true;
        });
    </script>
</body>
</html>`;
}

// Generate success page
function generateSuccessPage({ fullName, email, submissionId }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Submitted Successfully</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        .success-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #28a745; margin-bottom: 10px; }
        .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1>Resume Submitted Successfully!</h1>
        <p>Thank you, <strong>${fullName}</strong>! Your resume has been updated and submitted.</p>
        
        <div class="details">
            <strong>Submission Details:</strong><br>
            Email: ${email}<br>
            Submission ID: ${submissionId}<br>
            Submitted: ${new Date().toLocaleString()}
        </div>
        
        <p>We'll review your information and get back to you soon. You can close this window now.</p>
    </div>
</body>
</html>`;
}

// Generate error page
function generateErrorPage(errorMessage) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Error</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        .error-icon { font-size: 64px; margin-bottom: 20px; }
        h1 { color: #dc3545; margin-bottom: 10px; }
        .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">❌</div>
        <h1>Submission Failed</h1>
        <p><strong>Error:</strong> ${errorMessage}</p>
        <p>Please try again or contact support if the problem persists.</p>
        <a href="javascript:history.back()" class="btn">← Go Back</a>
    </div>
</body>
</html>`;
}

module.exports = router;
