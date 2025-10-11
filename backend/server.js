require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { PrismaClient } = require('./generated/prisma');
const { generateToken, verifyToken, hashPassword, comparePassword } = require('./auth');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;
const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8001';

// Middleware
const requestLogger = require('./logger');
app.use(requestLogger);
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,  
}
));
app.use(express.json());

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
      interview_link: `http://localhost:5174/interview/generate-link-here`
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to create template', 500);
  }
});

// ============================================
// SESSIONS ROUTES (Protected - for researchers)
// ============================================

// Create new interview session (generate link)
app.post('/api/sessions/create', verifyToken, async (req, res) => {
  try {
    const { template_id, respondent_name, respondent_email } = req.body;

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

    success(res, {
      session_id: session.id,
      link_code: session.id, // Using session ID as link code for simplicity
      interview_link: `http://localhost:5174/interview/${session.id}`,
      assigned_to: respondent_name || respondent_email || 'Anonymous'
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

// Send message (interview loop)
app.post('/api/interviews/:session_id/message', async (req, res) => {
  try {
    const { message } = req.body;
    const { session_id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id: session_id }
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
    const sessions = await prisma.session.findMany({
      where: {
        template: {
          researcher_id: req.user.id
        },
        status: 'completed'
      },
      select: {
        sentiment_score: true
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

    success(res, {
      total_interviews: totalInterviews,
      avg_sentiment: avgSentiment.toFixed(2),
      sentiment_distribution: {
        positive: positiveCount,
        neutral: neutralCount,
        negative: negativeCount
      }
    });
  } catch (err) {
    console.error(err);
    error(res, 'SERVER_ERROR', 'Failed to fetch insights', 500);
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