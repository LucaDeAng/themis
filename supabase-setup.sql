-- Supabase Setup Script for Themis
-- Run this in the Supabase SQL Editor to set up your database

-- ============================================================================
-- STEP 1: Enable Required Extensions
-- ============================================================================

-- Enable pgvector for semantic search (embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extensions are enabled
SELECT 
    extname as "Extension Name",
    extversion as "Version"
FROM pg_extension 
WHERE extname IN ('vector', 'uuid-ossp');

-- ============================================================================
-- STEP 2: Create Performance Indexes (After running Prisma migrations)
-- ============================================================================
-- Note: Run this AFTER you've run `prisma migrate deploy`
-- These indexes will improve query performance

-- Uncomment and run after migrations are complete:

/*
-- Index for workspace lookups
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_project_id ON initiatives(project_id);
CREATE INDEX IF NOT EXISTS idx_criteria_project_id ON criteria(project_id);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_reviewer_id ON scores(reviewer_id);

-- Index for activity logs (for audit trail)
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_project_timestamp ON activity_logs(project_id, timestamp DESC);

-- Index for scoring queries
CREATE INDEX IF NOT EXISTS idx_scores_initiative_criterion ON scores(initiative_id, criterion_id);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_workspace_status ON projects(workspace_id, status);
*/

-- ============================================================================
-- STEP 3: Verify Connection Pooling Configuration
-- ============================================================================

-- Check current connection settings
SELECT 
    name,
    setting,
    unit,
    short_desc
FROM pg_settings 
WHERE name IN (
    'max_connections',
    'shared_buffers',
    'effective_cache_size'
);

-- Show current connection count
SELECT 
    count(*) as current_connections,
    max_connections::int as max_connections,
    round(100.0 * count(*) / max_connections::int, 2) as connection_usage_percent
FROM pg_stat_activity, pg_settings
WHERE pg_settings.name = 'max_connections';

-- ============================================================================
-- STEP 4: Connection Pooling Information
-- ============================================================================

-- For serverless deployments (Vercel, AWS Lambda), you MUST use connection pooling!
-- 
-- Supabase provides two connection URLs:
--
-- 1. Direct Connection (port 5432) - for traditional servers:
--    postgresql://postgres.[project]:[password]@db.xxxxx.supabase.co:5432/postgres
--
-- 2. Pooled Connection (port 6543) - for serverless:
--    postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
--
-- How to get your pooled connection string:
-- 1. Go to Supabase Dashboard → Settings → Database
-- 2. Scroll to "Connection string" section
-- 3. Select "Connection pooling" tab
-- 4. Choose "Session mode" (recommended) or "Transaction mode"
-- 5. Copy the connection string

-- ============================================================================
-- STEP 5: Security Settings (Optional but Recommended)
-- ============================================================================

-- Uncomment to enable Row Level Security (RLS) on tables
-- Note: This requires additional policy configuration

/*
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see their own workspace memberships
CREATE POLICY "Users can view own workspace memberships"
    ON workspace_members
    FOR SELECT
    USING (auth.uid()::text = user_id);
*/

-- ============================================================================
-- STEP 6: Monitoring Queries (Run periodically to check health)
-- ============================================================================

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for long-running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 seconds'
    AND state != 'idle'
ORDER BY duration DESC;

-- Check for table bloat (run occasionally)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    n_live_tup as live_tuples,
    n_dead_tup as dead_tuples,
    round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as bloat_percent
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_dead_tup DESC;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✅ Supabase setup script completed!' as message;
SELECT 'Next steps:' as next_steps;
SELECT '1. Run Prisma migrations: npx prisma migrate deploy' as step_1;
SELECT '2. Uncomment and run performance indexes (Step 2 above)' as step_2;
SELECT '3. Get your pooled connection string for serverless deployments' as step_3;
SELECT '4. Set SUPABASE_DATABASE_URL in your deployment environment' as step_4;
