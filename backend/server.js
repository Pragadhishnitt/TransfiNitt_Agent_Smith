import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { PrismaClient } from './generated/prisma/index.js';
import { generateToken, verifyToken, hashPassword, comparePassword } from './auth.js';
import requestLogger from './logger.js';
import dotenv from 'dotenv';

dotenv.config();



const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;
const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8001';

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
  secure: false, // true for 465, false for other ports (587 uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  tls: {
    // Don't fail on invalid certs (useful for development)
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email service ready');
  }
});

// Send interview invitation email
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

// Send completion confirmation email
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
const error = (res, code, message, status = 400) => res.status(status).json({ success: false, error: { code, message }});
const generateCode = () => crypto.randomBytes(4).toString('hex');

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  success(res, { status: 'ok' });
});

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
      return error(res, 'MISSING_FIELDS', 'Email, password and role required');
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    });

    const token = generateToken(user);
    success(res, { token, user });
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'EMAIL_EXISTS', 'Email already registered');
    }
    console.error(err);
    error(res, 'SERVER_ERROR', 'Registration failed', 500);
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });
    console.log(user);
    
    if (!user) {
      return error(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const validPassword = await comparePassword(password, user.password_hash);

    if (!validPassword) {
      return error(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const token = generateToken(user);
    success(res, { 
      token, 
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Login failed', 500);
  }
});

// ============================================
// TEMPLATES ROUTES (Protected)
// ============================================

// Get all templates
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

// Get single template
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

// Create template
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

// Get all session IDs for a specific template
app.get('/api/templates/:id/sessions', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    console.log('Fetching sessions for template:', templateId);

    // Verify template belongs to researcher
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

    // Get all sessions for this template
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

// Get all respondent IDs who haven't attended any session under this template
app.get('/api/templates/:id/available-respondents', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.id;
    console.log('Fetching available respondents for template:', templateId);

    // Verify template belongs to researcher
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

    // Get all respondent IDs who have already attended sessions for this template
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

    // Get all respondents who haven't attended any session for this template
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

import fetch from 'node-fetch';

app.post('/api/templates/:id/report', verifyToken, async (req, res) => {
  console.log('Generating market research report...');
  try {
    const templateId = req.params.id;
    console.log('Generating report for template:', templateId);

    // === Verify template belongs to researcher ===
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

    // === Get all completed sessions ===
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

    // === Prepare session payload ===
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

    // === Limit payload for Gemini (approximate token limit control) ===
    let totalChars = 0;
    const MAX_CHARS = 20000; // ~3k tokens (safe buffer)
    const limitedSessions = [];

    for (const s of fullSessions) {
      const textLen = JSON.stringify(s).length;
      if (totalChars + textLen > MAX_CHARS) break;
      totalChars += textLen;
      limitedSessions.push(s);
    }

    console.log(`Using ${limitedSessions.length}/${sessions.length} sessions for Gemini prompt`);

    // === Gemini API Call ===
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
    
    // === Extract and aggregate themes from sessions ===
    const allThemes = [];
    sessions.forEach(session => {
      if (session.key_themes && Array.isArray(session.key_themes)) {
        allThemes.push(...session.key_themes);
      }
    });
    
    // Count theme occurrences
    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const topThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 themes
    
    // === Return report ===
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

// Create new interview session (generate link) - WITH EMAIL SUPPORT
app.post('/api/sessions/create', verifyToken, async (req, res) => {
  try {
    const { template_id, respondent_name, respondent_email, send_email } = req.body;

    if (!template_id) {
      return error(res, 'INVALID_INPUT', 'template_id required');
    }

    // Verify template belongs to researcher
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
    
    // Create a temporary user for the respondent (or use existing)
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
      // Create anonymous user
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

    // Send email if requested and email is provided
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
        console.log(`✉️  Interview invitation sent to ${respondent_email}`);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the entire request if email fails
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

// Get all sessions (interviews) for researcher
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
        name: s.respondent.email.split('@')[0] // Simple name extraction
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

// Get single session details
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

    // Calculate sentiment breakdown if exists
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

// Get interview details (when respondent opens link)
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

// Start interview
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

    // Check for duplicate by email if provided
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

    // Update session
    await prisma.session.update({
      where: { id: session_id },
      data: {
        status: 'active',
        started_at: new Date()
      }
    });

    // Call agent service to start interview
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
      // Fallback if agent service is down
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

// Send message (interview loop) - WITH COMPLETION EMAIL
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

    // Call agent service
    try {
      const agentResponse = await axios.post(`${AGENT_URL}/agent/chat`, {
        session_id: session.id,
        message
      });

      // Check if interview is complete
      if (agentResponse.data.is_complete) {
        // Get final summary from agent
        const endResponse = await axios.post(`${AGENT_URL}/agent/end`, {
          session_id: session.id
        });

        // Save to database
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

        // Send completion email if valid email
        if (session.respondent.email && !session.respondent.email.includes('@temp.com')) {
          try {
            await sendCompletionEmail(
              session.respondent.email,
              session.respondent.email.split('@')[0],
              session.template.title,
              5.00
            );
            console.log(`✉️  Completion email sent to ${session.respondent.email}`);
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

      // Return next question
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
    
    // Build where clause based on whether template_id is provided
    const whereClause = {
      template: {
        researcher_id: req.user.id
      },
      status: 'completed'
    };
    
    // If template_id is provided, filter by that template
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

    // Extract and aggregate themes from sessions
    const allThemes = [];
    sessions.forEach(session => {
      if (session.key_themes && Array.isArray(session.key_themes)) {
        allThemes.push(...session.key_themes);
      }
    });
    
    // Count theme occurrences
    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });
    
    // Convert to array and sort by count
    const topThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 themes

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

// Get completion rate and average duration stats (all templates)
app.get('/api/insights/stats', verifyToken, async (req, res) => {
  try {
    // Get all sessions for the researcher
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

    // Calculate completion rate
    const completionRate = totalSessions > 0 
      ? (completedSessions / totalSessions) * 100 
      : 0;

    // Calculate average duration from completed sessions
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

// Get completion rate and average duration stats for a specific template
app.get('/api/insights/stats/:template_id', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.template_id;

    // Verify template belongs to researcher
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    // Get all sessions for this specific template
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

    // Calculate completion rate
    const completionRate = totalSessions > 0 
      ? (completedSessions / totalSessions) * 100 
      : 0;

    // Calculate average duration from completed sessions
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

// Get marketing research report for a specific template
app.get('/api/insights/:template_id', verifyToken, async (req, res) => {
  try {
    const templateId = req.params.template_id;
    console.log('Fetching insights report for template:', templateId);

    // Verify template belongs to researcher
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        researcher_id: req.user.id
      }
    });

    if (!template) {
      return error(res, 'NOT_FOUND', 'Template not found', 404);
    }

    // Make internal call to the templates/:id/report endpoint
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const reportUrl = `${baseUrl}/api/templates/${templateId}/report`;
    
    console.log('Making internal call to:', reportUrl);
    
    const reportResponse = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization // Pass through the auth token
      }
    });

    if (!reportResponse.ok) {
      console.error('Report generation failed:', reportResponse.status, reportResponse.statusText);
      return error(res, 'SERVER_ERROR', 'Failed to generate report', 500);
    }

    const reportData = await reportResponse.json();
    console.log('Report data received:', reportData);

    // Return the report data in the same format
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

// Get all respondents
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

// Get single respondent
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

// Add respondent to panel
app.post('/api/respondents', verifyToken, async (req, res) => {
  try {
    const { name, email, demographics } = req.body;

    if (!name || !email) {
      return error(res, 'INVALID_INPUT', 'Name and email required');
    }

    // Create or get user
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

    // Check if respondent already exists
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

// Get pending incentives
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

// Pay incentive
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

    // Get sessions to analyze
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

    // Extract all themes
    const allThemes = [];
    sessions.forEach(s => {
      if (s.key_themes && Array.isArray(s.key_themes)) {
        allThemes.push(...s.key_themes);
      }
    });

    // Count theme frequency
    const themeCounts = {};
    allThemes.forEach(theme => {
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });

    // Get top 5 themes
    const topThemes = Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([theme]) => theme);

    // Generate survey questions based on themes
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
// GET TRANSCRIPT (After completion)
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
