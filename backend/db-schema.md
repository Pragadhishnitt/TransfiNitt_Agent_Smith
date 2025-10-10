SCHEMA:

users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20), -- 'researcher' or 'respondent'
  created_at TIMESTAMP DEFAULT NOW()
)

templates (
  id UUID PRIMARY KEY,
  researcher_id UUID REFERENCES users(id),
  title VARCHAR(255),
  topic TEXT,
  starter_questions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
)

sessions (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES templates(id),
  respondent_id UUID REFERENCES users(id),
  status VARCHAR(20), -- 'active', 'completed', 'abandoned'
  transcript JSONB,
  summary TEXT,
  sentiment_score DECIMAL(3,2), -- 0.00 to 1.00
  key_themes JSONB,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_seconds INTEGER
)

respondents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  demographics JSONB,
  participation_count INTEGER DEFAULT 0,
  total_incentives DECIMAL(10,2) DEFAULT 0,
  avg_sentiment DECIMAL(3,2),
  behavior_tags JSONB
)

incentives (
  id UUID PRIMARY KEY,
  respondent_id UUID REFERENCES respondents(id),
  session_id UUID REFERENCES sessions(id),
  amount DECIMAL(10,2),
  status VARCHAR(20), -- 'pending', 'paid', 'cancelled'
  paid_at TIMESTAMP
)