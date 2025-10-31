-- ===========================
-- PRISMA MIGRATION: 001_init
-- ===========================

-- CreateTable: User
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Template
CREATE TABLE "Template" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "researcher_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT,
    "starter_questions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Session
CREATE TABLE "Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_id" UUID NOT NULL,
    "respondent_id" UUID NOT NULL,
    "status" TEXT NOT NULL,
    "transcript" JSONB,
    "summary" TEXT,
    "sentiment_score" DECIMAL(3,2),
    "key_themes" JSONB,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "duration_seconds" INTEGER,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Respondent
CREATE TABLE "Respondent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "demographics" JSONB,
    "participation_count" INTEGER NOT NULL DEFAULT 0,
    "total_incentives" DECIMAL(65,30) DEFAULT 0,
    "avg_sentiment" DECIMAL(3,2),
    "behavior_tags" JSONB,
    CONSTRAINT "Respondent_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Incentive
CREATE TABLE "Incentive" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "respondent_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "paid_at" TIMESTAMP(3),
    CONSTRAINT "Incentive_pkey" PRIMARY KEY ("id")
);

-- ===========================
-- OAUTH PROVIDERS TABLE
-- ===========================
CREATE TABLE auth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT auth_providers_unique UNIQUE (provider, provider_id)
);

CREATE INDEX auth_providers_user_id_idx ON auth_providers(user_id);
CREATE INDEX auth_providers_provider_idx ON auth_providers(provider);

-- CreateIndexes
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Respondent_user_id_key" ON "Respondent"("user_id");

CREATE INDEX "users_email_idx" ON "User"("email");
CREATE INDEX "users_reset_token_idx" ON "User"("reset_token");
CREATE INDEX "templates_researcher_id_idx" ON "Template"("researcher_id");
CREATE INDEX "sessions_template_id_idx" ON "Session"("template_id");
CREATE INDEX "sessions_respondent_id_idx" ON "Session"("respondent_id");
CREATE INDEX "sessions_status_idx" ON "Session"("status");
CREATE INDEX "sessions_completed_at_idx" ON "Session"("completed_at");
CREATE INDEX "respondents_user_id_idx" ON "Respondent"("user_id");
CREATE INDEX "incentives_respondent_id_idx" ON "Incentive"("respondent_id");
CREATE INDEX "incentives_session_id_idx" ON "Incentive"("session_id");
CREATE INDEX "incentives_status_idx" ON "Incentive"("status");

-- AddForeignKeys
ALTER TABLE "Template"
  ADD CONSTRAINT "Template_researcher_id_fkey"
  FOREIGN KEY ("researcher_id") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_template_id_fkey"
  FOREIGN KEY ("template_id") REFERENCES "Template"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_respondent_id_fkey"
  FOREIGN KEY ("respondent_id") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Respondent"
  ADD CONSTRAINT "Respondent_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Incentive"
  ADD CONSTRAINT "Incentive_respondent_id_fkey"
  FOREIGN KEY ("respondent_id") REFERENCES "Respondent"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Incentive"
  ADD CONSTRAINT "Incentive_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "Session"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
