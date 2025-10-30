import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { PrismaClient } from './generated/prisma/index.js';
import { generateToken, verifyToken, hashPassword, comparePassword } from './auth.js';
import requestLogger from './logger.js';
import dotenv from 'dotenv';
import { validatePasswordEnhancedMiddleware, validatePassword, getPasswordStrength } from './passwordValidator.js';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;
const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8001';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(requestLogger);
app.use(cors({
  origin: [
    'http://localhost:3000',  
    'http://localhost:3001'   
  ],
  credentials: true,
}));
app.use(express.json());

// ============================================
// EMAIL CONFIGURATION
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

const sendInterviewInvitation = async (recipientEmail, recipientName, interviewLink, templateTitle) => {
  const mailOptions = {
    from: `"Interview Platform" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `You're invited: ${templateTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎤 Interview Invitation</h1>
          </div>
          <div class="content">
            <p>Hello ${recipientName || 'there'},</p>
            <p>You've been invited to participate in an interview session:</p>
            <p><strong>${templateTitle}</strong></p>
            <p>This is a conversational interview that typically takes about 10-15 minutes. Your insights are valuable and will help us understand your perspective better.</p>
            <p style="text-align: center;">
              <a href="${interviewLink}" class="button">Start Interview</a>
            </p>
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>A friendly conversational experience</li>
              <li>Estimated duration: 10-15 minutes</li>
              <li>Incentive: $5.00 upon completion</li>
            </ul>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Interview Link: <a href="${interviewLink}">${interviewLink}</a>
            </p>
          </div>
          <div class="footer">
            <p>This interview link is unique to you. Please do not share it with others.</p>
            <p>© 2025 Interview Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${recipientName || 'there'},
      
      You've been invited to participate in an interview session: ${templateTitle}
      
      Click the link below to start:
      ${interviewLink}
      
      This interview typically takes 10-15 minutes and you'll receive $5.00 upon completion.
      
      What to expect:
      - A friendly conversational experience
      - Estimated duration: 10-15 minutes
      - Incentive: $5.00 upon completion
      
      This link is unique to you. Please do not share it with others.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendCompletionEmail = async (recipientEmail, recipientName, templateTitle, incentiveAmount) => {
  const mailOptions = {
    from: `"Interview Platform" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: '✅ Interview Completed - Thank You!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Thank You!</h1>
          </div>
          <div class="content">
            <p>Hello ${recipientName || 'there'},</p>
            <p>Thank you for completing the interview session: <strong>${templateTitle}</strong></p>
            <div class="highlight">
              <h2 style="margin: 0; color: #059669;">$${incentiveAmount.toFixed(2)} Incentive</h2>
              <p style="margin: 10px 0 0 0; color: #047857;">Your incentive is being processed</p>
            </div>
            <p>Your insights are incredibly valuable and will contribute to meaningful research. We appreciate the time you took to share your thoughts.</p>
            <p>You can view your transcript and session details in your dashboard.</p>
          </div>
          <div class="footer">
            <p>© 2025 Interview Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${recipientName || 'there'},
      
      Thank you for completing the interview session: ${templateTitle}
      
      Your $${incentiveAmount.toFixed(2)} incentive is being processed.
      
      Your insights are incredibly valuable and will contribute to meaningful research.
      
      Thank you for your participation!
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Completion email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending completion email:', error);
    throw error;
  }
};

// Helper functions
const success = (res, data) => res.json({ success: true, ...data });
const error = (res, code, message, status = 400, details = null) => {
  const errorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  };
  return res.status(status).json(errorResponse);
};
const generateCode = () => crypto.randomBytes(4).toString('hex');

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  success(res, { status: 'ok' });
});

// ============================================
// AUTH ROUTES - COMPLETE REPLACEMENT
// ============================================

// Register
app.post('/api/auth/register', validatePasswordEnhancedMiddleware, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return error(res, 'MISSING_FIELDS', 'Email, password and role required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return error(res, 'INVALID_EMAIL', 'Invalid email format');
    }

    // Validate role
    if (!['researcher', 'respondent'].includes(role)) {
      return error(res, 'INVALID_ROLE', 'Role must be either researcher or respondent');
    }

    // DB health check
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return error(res, 'DATABASE_ERROR', 'Unable to connect to database', 500);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 'USER_EXISTS', 'User with this email already exists');
    }

    // Hash password & create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password_hash: hashedPassword, role },
      select: { id: true, email: true, role: true }
    });

    // Generate token
    const token = generateToken(user);

    // ✅ Send the same response your frontend expects
    return success(res, { token, user });

  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'P2002') {
      return error(res, 'USER_EXISTS', 'User already exists');
    }
    return error(res, 'REGISTRATION_FAILED', 'Failed to register user', 500);
  }
});



// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and password required'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const validPassword = await comparePassword(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const token = generateToken(user);
    
    return res.json({
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Login failed'
      }
    });
  }
});

// Password validation endpoint
app.post('/api/auth/validate-password', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PASSWORD',
          message: 'Password is required'
        }
      });
    }

    const validation = validatePassword(password);
    const strength = getPasswordStrength(password);

    return res.json({
      success: true,
      isValid: validation.isValid,
      errors: validation.errors,
      strength: strength
    });
  } catch (err) {
    console.error('Password validation error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Validation failed'
      }
    });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', verifyToken, validatePasswordEnhancedMiddleware, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Current password and new password required'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    const validPassword = await comparePassword(current_password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }

    const samePassword = await comparePassword(new_password, user.password_hash);
    if (samePassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SAME_PASSWORD',
          message: 'New password must be different from current password'
        }
      });
    }

    const hashedPassword = await hashPassword(new_password);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password_hash: hashedPassword }
    });

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to change password'
      }
    });
  }
});

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email is required'
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: `"Interview Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to process password reset'
      }
    });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', validatePasswordEnhancedMiddleware, async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Token and new password required'
        }
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: {
          gte: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token'
        }
      });
    }

    const hashedPassword = await hashPassword(new_password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      }
    });

    return res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to reset password'
      }
    });
  }
});

// ============================================
// TEMPLATES ROUTES (Protected)
// ============================================

app.get('/api/templates', verifyToken, async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      where: { researcher_id: req.user.id },
      include: {
        _count: {
          select: { sessions: { where: { status: 'completed' } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const templatesWithCount = templates.map(t => ({
      ...t,
      interview_count: t._count.sessions
    }));

    success(res, { templates: templatesWithCount });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch templates', 500);
  }
});

app.get('/api/templates/:id', verifyToken, async (req, res) => {
  try {
    const template = await prisma.template.findFirst({
      where: {
        id: req.params.id,
        researcher_id: req.user.id
      }
    });
    
    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }
    
    success(res, { template });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch template', 500);
  }
});

app.post('/api/templates', verifyToken, async (req, res) => {
  try {
    const { title, topic, starter_questions } = req.body;

    if (!title || !starter_questions || !Array.isArray(starter_questions)) {
      return error(res, 'INVALID_INPUT', 'Title and starter_questions array required');
    }

    const template = await prisma.template.create({
      data: {
        researcher_id: req.user.id,
        title,
        topic: topic || '',
        starter_questions: starter_questions
      }
    });

    success(res, { 
      template,
      interview_link: `http://localhost:3001/interview/generate-link-here`
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to create template', 500);
  }
});

app.get('/api/templates/:id/sessions', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    console.log('Fetching sessions for template:', templateId);

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      console.log('Template not found or not owned by researcher');
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    console.log('Template found:', template.title);

    const sessions = await prisma.session.findMany({
      where: {
        template_id: templateId
      },
      select: {
        id: true,
        status: true,
        started_at: true,
        completed_at: true,
        respondent: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        started_at: 'desc'
      }
    });

    console.log('Found sessions:', sessions.length);

    const sessionIds = sessions.map(session => ({
      id: session.id,
      status: session.status,
      started_at: session.started_at,
      completed_at: session.completed_at,
      respondent_email: session.respondent.email
    }));

    success(res, { 
      template_id: templateId,
      session_ids: sessionIds,
      total_sessions: sessions.length
    });
  } catch (err) {
    console.error('Error in /api/templates/:id/sessions:', err);
    error(res, 'SERVER_ERROR', 'Failed to fetch template sessions', 500);
  }
});

app.get('/api/templates/:id/available-respondents', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    console.log('Fetching available respondents for template:', templateId);

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      console.log('Template not found or not owned by researcher');
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    console.log('Template found:', template.title);

    const attendedRespondents = await prisma.session.findMany({
      where: {
        template_id: templateId
      },
      select: {
        respondent_id: true
      }
    });

    const attendedRespondentIds = attendedRespondents.map(s => s.respondent_id);
    console.log('Attended respondent IDs:', attendedRespondentIds);

    const availableRespondents = await prisma.user.findMany({
      where: {
        role: 'respondent',
        id: {
          notIn: attendedRespondentIds
        }
      },
      select: {
        id: true,
        email: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log('Available respondents found:', availableRespondents.length);

    const respondentUserIds = availableRespondents.map(respondent => ({
      id: respondent.id,
      email: respondent.email,
      created_at: respondent.created_at
    }));

    const respondentAllIds = (await Promise.all(
      respondentUserIds.map(async r => ({
        id: await prisma.respondent.findUnique({
          where: { user_id: r.id }
        }).then(resp => resp ? resp.id : null),
        email: r.email,
        created_at: r.created_at
      }))
    ));

    const respondentIds = respondentAllIds.filter(r => r.id !== null && r.id !== undefined);

    success(res, { 
      template_id: templateId,
      available_respondent_ids: respondentIds,
      total_available: respondentIds.length,
      total_attended: attendedRespondentIds.length
    });
  } catch (err) {
    console.error('Error in /api/templates/:id/available-respondents:', err);
    error(res, 'SERVER_ERROR', 'Failed to fetch available respondents', 500);
  }
});

app.post('/api/templates/:id/report', verifyToken, async (req, res) => {
  console.log('Generating market research report...');
  try {
    const templateId = req.params.id;
    console.log('Generating report for template:', templateId);

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      },
      select: { id: true, title: true, topic: true, researcher_id: true }
    });

    if (!template) {
      console.log('Template not found or not owned by researcher');
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    const sessions = await prisma.session.findMany({
      where: { template_id: templateId, status: 'completed' },
      select: {
        id: true,
        summary: true,
        sentiment_score: true,
        key_themes: true,
        completed_at: true,
        respondent: {
          select: { id: true, email: true }
        }
      },
      orderBy: { completed_at: 'desc' }
    });

    if (sessions.length === 0) {
      return error(res, 'NO_DATA', 'No completed sessions found for this template', 400);
    }

    console.log(`Found ${sessions.length} completed sessions`);

    const fullSessions = await Promise.all(
      sessions.map(async (session) => {
        const respondent = await prisma.respondent.findUnique({
          where: { user_id: session.respondent.id },
          select: { name: true, demographics: true }
        });
        return {
          session_id: session.id,
          summary: session.summary,
          sentiment_score: session.sentiment_score
            ? parseFloat(session.sentiment_score.toString())
            : null,
          key_themes: session.key_themes,
          demographics: respondent?.demographics || null,
          respondent_name: respondent?.name || 'Anonymous'
        };
      })
    );

    let totalChars = 0;
    const MAX_CHARS = 20000;
    const limitedSessions = [];

    for (const s of fullSessions) {
      const textLen = JSON.stringify(s).length;
      if (totalChars + textLen > MAX_CHARS) break;
      totalChars += textLen;
      limitedSessions.push(s);
    }

    console.log(`Using ${limitedSessions.length}/${sessions.length} sessions for Gemini prompt`);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
You are an expert market research analyst. Generate a concise and structured **market research report** 
based on the provided interview session summaries.

Each session contains a respondent summary, demographics, sentiment score, and key themes.

The report must include:
1. **Executive Summary** – overall sentiment, major insights, and trends.
2. **Respondent Insights** – segmentation of respondents (based on demographics if available).
3. **Key Themes and Sentiments** – summarize recurring themes and emotional tones.
4. **Market Trends and Opportunities** – emerging patterns and potential actions.
5. **Conclusion and Recommendations** – actionable insights for the researcher.

Keep the language professional and analytical, suitable for presentation to stakeholders.
Avoid repetition. Focus on patterns, not individual opinions.

Template Topic: "${template.topic}"
Template Title: "${template.title}"

Sessions Data:
${JSON.stringify(limitedSessions, null, 2)}
`;

    console.log('Calling Gemini API...');

    const aiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('Gemini API error:', aiResponse.status, errText);
      return error(res, 'GEMINI_ERROR', 'Failed to generate report from Gemini', 500);
    }

    const aiData = await aiResponse.json();
    const reportText =
      aiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No report generated';

    console.log('Report generated successfully');
    console.log('Report:', reportText);
    
    const allThemes = [];
    sessions.forEach(session => {
      if (session.key_themes && Array.isArray(session.key_themes)) {
        allThemes.push(...session.key_themes);
      }
    });
    
    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    
    const topThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    success(res, {
      template_id: templateId,
      template_title: template.title,
      sessions_analyzed: limitedSessions.length,
      report: reportText,
      top_themes: topThemes,
      generated_at: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error in /api/templates/:id/report:', err);
    error(res, 'SERVER_ERROR', 'Failed to generate market research report', 500);
  }
});

// ============================================
// SESSIONS ROUTES (Protected - for researchers)
// ============================================

app.post('/api/sessions/create', verifyToken, async (req, res) => {
  try {
    const { template_id, respondent_name, respondent_email, send_email } = req.body;

    if (!template_id) {
      return error(res, 'INVALID_INPUT', 'template_id required');
    }

    const template = await prisma.template.findFirst({
      where: {
        id: template_id,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    const linkCode = generateCode();
    
    let respondentUser;
    if (respondent_email) {
      respondentUser = await prisma.user.findUnique({
        where: { email: respondent_email }
      });
      
      if (!respondentUser) {
        respondentUser = await prisma.user.create({
          data: {
            email: respondent_email,
            password_hash: await hashPassword(crypto.randomBytes(16).toString('hex')),
            role: 'respondent'
          }
        });
      }
    } else {
      respondentUser = await prisma.user.create({
        data: {
          email: `anonymous-${linkCode}@temp.com`,
          password_hash: await hashPassword(crypto.randomBytes(16).toString('hex')),
          role: 'respondent'
        }
      });
    }

    const session = await prisma.session.create({
      data: {
        template_id,
        respondent_id: respondentUser.id,
        status: 'pending'
      }
    });

    const interviewLink = `http://localhost:3001/interview/${session.id}`;

    let emailSent = false;
    if (send_email && respondent_email) {
      try {
        await sendInterviewInvitation(
          respondent_email,
          respondent_name || respondent_email.split('@')[0],
          interviewLink,
          template.title
        );
        emailSent = true;
        console.log(`✉️ Interview invitation sent to ${respondent_email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    success(res, {
      session_id: session.id,
      link_code: session.id,
      interview_link: interviewLink,
      assigned_to: respondent_name || respondent_email || 'Anonymous',
      email_sent: emailSent
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to create session', 500);
  }
});

app.get('/api/sessions', verifyToken, async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        template: {
          researcher_id: req.user.id
        }
      },
      include: {
        template: {
          select: { title: true, topic: true }
        },
        respondent: {
          select: { email: true }
        }
      },
      orderBy: { started_at: 'desc' }
    });

    const formattedSessions = sessions.map(s => ({
      id: s.id,
      template_id: s.template_id,
      template_title: s.template.title,
      respondent: {
        email: s.respondent.email,
        name: s.respondent.email.split('@')[0]
      },
      status: s.status,
      sentiment_score: s.sentiment_score ? parseFloat(s.sentiment_score) : null,
      started_at: s.started_at,
      completed_at: s.completed_at,
      duration_seconds: s.duration_seconds
    }));

    success(res, { sessions: formattedSessions });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch sessions', 500);
  }
});

app.get('/api/sessions/:id', verifyToken, async (req, res) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: req.params.id,
        template: {
          researcher_id: req.user.id
        }
      },
      include: {
        template: {
          select: { title: true, topic: true }
        },
        respondent: {
          select: { email: true }
        }
      }
    });

    if (!session) {
      return error(res, 'NOT_FOUND', 'Session not found', 404);
    }

    let sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
    if (session.sentiment_score) {
      const score = parseFloat(session.sentiment_score);
      if (score >= 0.6) sentimentBreakdown.positive = 70;
      else if (score >= 0.4) sentimentBreakdown.neutral = 60;
      else sentimentBreakdown.negative = 70;
    }

    const formattedSession = {
      id: session.id,
      template: {
        id: session.template_id,
        title: session.template.title,
        topic: session.template.topic
      },
      respondent: {
        email: session.respondent.email
      },
      status: session.status,
      transcript: session.transcript || [],
      summary: session.summary,
      sentiment_score: session.sentiment_score ? parseFloat(session.sentiment_score) : null,
      key_themes: session.key_themes || [],
      sentiment_breakdown: sentimentBreakdown,
      started_at: session.started_at,
      completed_at: session.completed_at,
      duration_seconds: session.duration_seconds
    };

    success(res, { session: formattedSession });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch session', 500);
  }
});

// ============================================
// INTERVIEW ROUTES (Public - for respondents)
// ============================================

app.get('/api/interviews/:session_id', async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.session_id },
      include: {
        template: {
          select: { title: true, topic: true }
        }
      }
    });

    if (!session) {
      return error(res, 'NOT_FOUND', 'Interview not found', 404);
    }

    if (session.status === 'completed') {
      return error(res, 'ALREADY_COMPLETED', 'This interview has already been completed');
    }

    success(res, {
      session: {
        id: session.id,
        status: session.status,
        template: {
          title: session.template.title,
          topic: session.template.topic
        },
        expected_incentive: 5.00,
        estimated_duration_minutes: 10
      }
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch interview', 500);
  }
});

app.post('/api/interviews/:session_id/start', async (req, res) => {
  try {
    const { respondent_name, respondent_email } = req.body;
    const { session_id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: session_id },
      include: {
        template: {
          select: { starter_questions: true }
        }
      }
    });

    if (!session) {
      return error(res, 'NOT_FOUND', 'Interview not found', 404);
    }

    if (session.status === 'completed') {
      return error(res, 'ALREADY_COMPLETED', 'Interview already completed');
    }

    if (respondent_email) {
      const existingSession = await prisma.session.findFirst({
        where: {
          template_id: session.template_id,
          respondent: {
            email: respondent_email
          },
          status: 'completed'
        }
      });

      if (existingSession) {
        return error(res, 'DUPLICATE', 'You have already completed this interview');
      }
    }

    await prisma.session.update({
      where: { id: session_id },
      data: {
        status: 'active',
        started_at: new Date()
      }
    });

    try {
      const agentResponse = await axios.post(`${AGENT_URL}/agent/start`, {
        session_id: session.id,
        template_id: session.template_id,
        starter_questions: session.template.starter_questions
      });

      success(res, {
        first_question: agentResponse.data.first_question,
        progress: { current: 1, total: 15 }
      });
    } catch (agentErr) {
      console.error('Agent error:', agentErr.message);
      const questions = session.template.starter_questions;
      const firstQuestion = Array.isArray(questions) && questions.length > 0 
        ? questions[0] 
        : "Tell me about your experience.";
      
      success(res, {
        first_question: `Hi! Let's begin. ${firstQuestion}`,
        progress: { current: 1, total: 15 }
      });
    }
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to start interview', 500);
  }
});

app.post('/api/interviews/:session_id/message', async (req, res) => {
  try {
    const { message } = req.body;
    const { session_id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: session_id },
      include: {
        respondent: {
          select: { email: true }
        },
        template: {
          select: { title: true }
        }
      }
    });

    if (!session) {
      return error(res, 'NOT_FOUND', 'Interview not found', 404);
    }

    if (session.status !== 'active') {
      return error(res, 'INVALID_STATUS', 'Interview not active');
    }

    try {
      const agentResponse = await axios.post(`${AGENT_URL}/agent/chat`, {
        session_id: session.id,
        message
      });

      if (agentResponse.data.is_complete) {
        const endResponse = await axios.post(`${AGENT_URL}/agent/end`, {
          session_id: session.id
        });

        await prisma.session.update({
          where: { id: session_id },
          data: {
            status: 'completed',
            transcript: endResponse.data.transcript,
            summary: endResponse.data.summary,
            sentiment_score: endResponse.data.sentiment_score,
            key_themes: endResponse.data.key_themes,
            completed_at: new Date(),
            duration_seconds: endResponse.data.total_duration_seconds
          }
        });

        if (session.respondent.email && !session.respondent.email.includes('@temp.com')) {
          try {
            await sendCompletionEmail(
              session.respondent.email,
              session.respondent.email.split('@')[0],
              session.template.title,
              5.00
            );
            console.log(`✉️ Completion email sent to ${session.respondent.email}`);
          } catch (emailError) {
            console.error('Failed to send completion email:', emailError);
          }
        }

        return success(res, {
          is_complete: true,
          summary: endResponse.data.summary,
          incentive: { amount: 5.00, status: 'pending' }
        });
      }

      success(res, {
        next_question: agentResponse.data.next_question,
        is_probe: agentResponse.data.is_probe || false,
        progress: agentResponse.data.progress,
        is_complete: false
      });
    } catch (agentErr) {
      console.error('Agent error:', agentErr.message);
      error(res, 'AGENT_ERROR', 'Failed to process message', 500);
    }
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to send message', 500);
  }
});

// ============================================
// INSIGHTS ROUTES
// ============================================

app.get('/api/insights/overview', verifyToken, async (req, res) => {
  try {
    const { template_id } = req.query;
    
    const whereClause = {
      template: {
        researcher_id: req.user.id
      },
      status: 'completed'
    };
    
    if (template_id) {
      whereClause.template_id = template_id;
    }
    
    const sessions = await prisma.session.findMany({
      where: whereClause,
      select: {
        sentiment_score: true,
        key_themes: true
      }
    });

    const totalInterviews = sessions.length;
    const sentiments = sessions.map(s => parseFloat(s.sentiment_score || 0));
    const avgSentiment = sentiments.length > 0 
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
      : 0;

    const positiveCount = sentiments.filter(s => s >= 0.6).length;
    const neutralCount = sentiments.filter(s => s >= 0.4 && s < 0.6).length;
    const negativeCount = sentiments.filter(s => s < 0.4).length;

    const allThemes = [];
    sessions.forEach(session => {
      if (session.key_themes && Array.isArray(session.key_themes)) {
        allThemes.push(...session.key_themes);
      }
    });
    
    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    
    const topThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    success(res, {
      total_interviews: totalInterviews,
      avg_sentiment: avgSentiment.toFixed(2),
      sentiment_distribution: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount
      },
      top_themes: topThemes
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch insights', 500);
  }
});

app.get('/api/insights/stats', verifyToken, async (req, res) => {
  try {
    const allSessions = await prisma.session.findMany({
      where: {
        template: {
          researcher_id: req.user.id
        }
      },
      select: {
        status: true,
        duration_seconds: true
      }
    });

    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(s => s.status === 'completed').length;

    const completionRate = totalSessions > 0 
      ? (completedSessions / totalSessions) * 100 
      : 0;

    const completedSessionsWithDuration = allSessions.filter(
      s => s.status === 'completed' && s.duration_seconds != null
    );

    const averageDuration = completedSessionsWithDuration.length > 0
      ? completedSessionsWithDuration.reduce((sum, s) => sum + s.duration_seconds, 0) / completedSessionsWithDuration.length
      : 0;

    success(res, {
      completion_rate: parseFloat(completionRate.toFixed(2)),
      average_duration: Math.round(averageDuration),
      total_sessions: totalSessions,
      completed_sessions: completedSessions
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch stats', 500);
  }
});

app.get('/api/insights/stats/:template_id', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.template_id;

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    const allSessions = await prisma.session.findMany({
      where: {
        template_id: templateId
      },
      select: {
        status: true,
        duration_seconds: true
      }
    });

    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(s => s.status === 'completed').length;

    const completionRate = totalSessions > 0 
      ? (completedSessions / totalSessions) * 100 
      : 0;

    const completedSessionsWithDuration = allSessions.filter(
      s => s.status === 'completed' && s.duration_seconds != null
    );

    const averageDuration = completedSessionsWithDuration.length > 0
      ? completedSessionsWithDuration.reduce((sum, s) => sum + s.duration_seconds, 0) / completedSessionsWithDuration.length
      : 0;

    success(res, {
      template_id: templateId,
      template_title: template.title,
      completion_rate: parseFloat(completionRate.toFixed(2)),
      average_duration: Math.round(averageDuration),
      total_sessions: totalSessions,
      completed_sessions: completedSessions
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch template stats', 500);
  }
});

app.get('/api/insights/:template_id', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.template_id;
    console.log('Fetching insights report for template:', templateId);

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const reportUrl = `${baseUrl}/api/templates/${templateId}/report`;
    
    console.log('Making internal call to:', reportUrl);
    
    const reportResponse = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      }
    });

    if (!reportResponse.ok) {
      console.error('Report generation failed:', reportResponse.status, reportResponse.statusText);
      return error(res, 'SERVER_ERROR', 'Failed to generate report', 500);
    }

    const reportData = await reportResponse.json();
    console.log('Report data received:', reportData);

    success(res, {
      template_id: templateId,
      template_title: template.title,
      report: reportData.data || reportData,
      generated_at: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error in /api/insights/:template_id:', err);
    error(res, 'SERVER_ERROR', 'Failed to fetch insights report', 500);
  }
});

// ============================================
// RESPONDENTS ROUTES
// ============================================

app.get('/api/respondents', verifyToken, async (req, res) => {
  try {
    const respondents = await prisma.respondent.findMany({
      include: {
        user: {
          select: { email: true }
        },
        _count: {
          select: { incentives: true }
        }
      }
    });

    const formattedRespondents = respondents.map(r => ({
      id: r.id,
      name: r.name,
      email: r.user.email,
      demographics: r.demographics,
      participation_count: r.participation_count,
      total_incentives: r.total_incentives ? parseFloat(r.total_incentives) : 0,
      avg_sentiment: r.avg_sentiment ? parseFloat(r.avg_sentiment) : null,
      behavior_tags: r.behavior_tags || []
    }));

    success(res, { respondents: formattedRespondents });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch respondents', 500);
  }
});

app.get('/api/respondents/:id', verifyToken, async (req, res) => {
  try {
    const respondent = await prisma.respondent.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: { email: true }
        },
        incentives: {
          include: {
            session: {
              include: {
                template: {
                  select: { title: true }
                }
              }
            }
          }
        }
      }
    });

    if (!respondent) {
      return error(res, 'NOT_FOUND', 'Respondent not found', 404);
    }

    const sessions = await prisma.session.findMany({
      where: { respondent_id: respondent.user_id },
      include: {
        template: {
          select: { title: true }
        }
      }
    });

    success(res, {
      respondent: {
        id: respondent.id,
        name: respondent.name,
        email: respondent.user.email,
        demographics: respondent.demographics,
        participation_count: respondent.participation_count,
        total_incentives: respondent.total_incentives ? parseFloat(respondent.total_incentives) : 0,
        avg_sentiment: respondent.avg_sentiment ? parseFloat(respondent.avg_sentiment) : null,
        behavior_tags: respondent.behavior_tags || [],
        sessions: sessions.map(s => ({
          id: s.id,
          template_title: s.template.title,
          completed_at: s.completed_at,
          sentiment_score: s.sentiment_score ? parseFloat(s.sentiment_score) : null
        }))
      }
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch respondent', 500);
  }
});

app.post('/api/respondents', verifyToken, async (req, res) => {
  try {
    const { name, email, demographics } = req.body;

    if (!name || !email) {
      return error(res, 'INVALID_INPUT', 'Name and email required');
    }

    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password_hash: await hashPassword(crypto.randomBytes(16).toString('hex')),
          role: 'respondent'
        }
      });
    }

    const existingRespondent = await prisma.respondent.findUnique({
      where: { user_id: user.id }
    });

    if (existingRespondent) {
      return error(res, 'ALREADY_EXISTS', 'Respondent already in panel');
    }

    const respondent = await prisma.respondent.create({
      data: {
        user_id: user.id,
        name,
        demographics: demographics || {}
      }
    });

    success(res, { respondent });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to add respondent', 500);
  }
});

// ============================================
// INCENTIVES ROUTES
// ============================================

app.get('/api/incentives/pending', verifyToken, async (req, res) => {
  try {
    const incentives = await prisma.incentive.findMany({
      where: { status: 'pending' },
      include: {
        respondent: {
          include: {
            user: {
              select: { email: true }
            }
          }
        },
        session: {
          select: { id: true }
        }
      }
    });

    const formattedIncentives = incentives.map(i => ({
      id: i.id,
      respondent: {
        id: i.respondent.id,
        name: i.respondent.name,
        email: i.respondent.user.email
      },
      session_id: i.session_id,
      amount: parseFloat(i.amount),
      status: i.status
    }));

    success(res, { incentives: formattedIncentives });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch incentives', 500);
  }
});

app.post('/api/incentives/:id/pay', verifyToken, async (req, res) => {
  try {
    const incentive = await prisma.incentive.update({
      where: { id: req.params.id },
      data: {
        status: 'paid',
        paid_at: new Date()
      }
    });

    success(res, {
      incentive: {
        id: incentive.id,
        status: incentive.status,
        paid_at: incentive.paid_at
      }
    });
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'NOT_FOUND', 'Incentive not found', 404);
    }
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to pay incentive', 500);
  }
});

// ============================================
// SURVEY GENERATION ROUTE
// ============================================

app.post('/api/surveys/generate', verifyToken, async (req, res) => {
  try {
    const { template_id, session_ids } = req.body;

    if (!template_id) {
      return error(res, 'INVALID_INPUT', 'template_id required');
    }

    const whereClause = {
      template_id,
      status: 'completed'
    };

    if (session_ids && session_ids.length > 0) {
      whereClause.id = { in: session_ids };
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      select: {
        summary: true,
        key_themes: true,
        transcript: true
      }
    });

    if (sessions.length === 0) {
      return error(res, 'NO_DATA', 'No completed sessions found');
    }

    const allThemes = [];
    sessions.forEach(s => {
      if (s.key_themes && Array.isArray(s.key_themes)) {
        allThemes.push(...s.key_themes);
      }
    });

    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });

    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);

    const questions = [
      {
        type: 'scale',
        question: `On a scale of 1-5, how important is ${topThemes[0] || 'this topic'} to you?`,
        options: [1, 2, 3, 4, 5]
      }
    ];

    topThemes.slice(1).forEach(theme => {
      questions.push({
        type: 'multiple_choice',
        question: `How would you rate your experience with ${theme}?`,
        options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
      });
    });

    success(res, { questions });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to generate survey', 500);
  }
});

// ============================================
// GET TRANSCRIPT
// ============================================

app.get('/api/interviews/:session_id/transcript', async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.session_id },
      select: {
        status: true,
        transcript: true,
        summary: true,
        duration_seconds: true
      }
    });

    if (!session) {
      return error(res, 'NOT_FOUND', 'Interview not found', 404);
    }

    if (session.status !== 'completed') {
      return error(res, 'NOT_COMPLETED', 'Interview not yet completed');
    }

    success(res, {
      transcript: session.transcript || [],
      summary: session.summary,
      duration_seconds: session.duration_seconds
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch transcript', 500);
  }
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Using Prisma ORM`);
});