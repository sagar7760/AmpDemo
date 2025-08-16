# AMP Email Backend Project Instructions

This is a Node.js backend for handling AMP (Accelerated Mobile Pages) interactive emails for a hiring platform called Hirefy. The system allows job applicants to update their resumes directly from their email inbox without page redirection.

## Project Architecture

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer with SMTP (Gmail)
- **Hosting**: Optimized for Render.com deployment
- **Security**: Helmet, CORS, rate limiting, input validation

## Key Features

1. **Interactive AMP Emails**: Send AMP-enabled emails that allow form submission directly in Gmail
2. **Resume Processing**: Handle resume data submissions through AMP forms
3. **Email Logging**: Track all sent emails with delivery status
4. **Data Storage**: Store resume submissions in MongoDB
5. **API Endpoints**: RESTful APIs for email management and data retrieval

## Technology Stack

- Express.js for web framework
- Mongoose for MongoDB object modeling
- Nodemailer for email sending
- Joi for input validation
- Helmet for security headers
- Morgan for HTTP request logging
- Compression for response compression

## Development Guidelines

- Follow RESTful API conventions
- Use proper error handling and validation
- Implement comprehensive logging
- Ensure security best practices
- Design for scalability and Render deployment
