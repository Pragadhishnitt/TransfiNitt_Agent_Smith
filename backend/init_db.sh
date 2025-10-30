#!/bin/bash
# File: backend/init-db.sh
# This script runs automatically when the backend container starts

set -e

echo "🔄 Starting database initialization..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; do
  echo "   PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Prisma migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, trying db push..."
  npx prisma db push --skip-generate || {
    echo "⚠️  DB push failed, trying manual schema sync..."
    npx prisma db execute --stdin <<'EOF'
-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add reset_token column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_token') THEN
    ALTER TABLE users ADD COLUMN reset_token TEXT UNIQUE;
  END IF;

  -- Add reset_token_expiry column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='reset_token_expiry') THEN
    ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP(3);
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "users_email_idx" ON users(email);
CREATE INDEX IF NOT EXISTS "users_reset_token_idx" ON users(reset_token);
CREATE INDEX IF NOT EXISTS "templates_researcher_id_idx" ON templates(researcher_id);
CREATE INDEX IF NOT EXISTS "sessions_template_id_idx" ON sessions(template_id);
CREATE INDEX IF NOT EXISTS "sessions_respondent_id_idx" ON sessions(respondent_id);
CREATE INDEX IF NOT EXISTS "sessions_status_idx" ON sessions(status);
CREATE INDEX IF NOT EXISTS "sessions_completed_at_idx" ON sessions(completed_at);
CREATE INDEX IF NOT EXISTS "respondents_user_id_idx" ON respondents(user_id);
CREATE INDEX IF NOT EXISTS "incentives_respondent_id_idx" ON incentives(respondent_id);
CREATE INDEX IF NOT EXISTS "incentives_session_id_idx" ON incentives(session_id);
CREATE INDEX IF NOT EXISTS "incentives_status_idx" ON incentives(status);
EOF
  }
}

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "✅ Database initialization complete!"
echo "🚀 Starting application..."

# Start the Node.js application
exec "$@"