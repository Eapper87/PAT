-- =====================================================
-- COMPLETE SUPABASE DATABASE WIPE SCRIPT
-- WARNING: This will completely destroy ALL data and objects!
-- Run this in your Supabase SQL editor to start completely fresh
-- =====================================================

-- Disable Row Level Security and triggers temporarily
SET session_replication_role = replica;

-- =====================================================
-- STEP 1: DROP ALL CUSTOM TABLES
-- =====================================================

-- Drop tables in dependency order (foreign keys first)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- STEP 2: DROP ALL CUSTOM FUNCTIONS
-- =====================================================

-- Drop any custom functions we might have created
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_deletion() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_credits() CASCADE;

-- =====================================================
-- STEP 3: DROP ALL CUSTOM TRIGGERS
-- =====================================================

-- Drop triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- =====================================================
-- STEP 4: DROP ALL CUSTOM TYPES
-- =====================================================

-- Drop custom enum types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS agent_role CASCADE;
DROP TYPE IF EXISTS call_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

-- =====================================================
-- STEP 5: DROP ALL SEQUENCES
-- =====================================================

-- Drop custom sequences
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS agents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS calls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS transactions_id_seq CASCADE;

-- =====================================================
-- STEP 6: DROP ALL VIEWS
-- =====================================================

-- Drop any custom views
DROP VIEW IF EXISTS user_stats CASCADE;
DROP VIEW IF EXISTS call_analytics CASCADE;
DROP VIEW IF EXISTS agent_performance CASCADE;

-- =====================================================
-- STEP 7: DROP ALL MATERIALIZED VIEWS
-- =====================================================

-- Drop any materialized views
DROP MATERIALIZED VIEW IF EXISTS user_activity_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS call_summary CASCADE;

-- =====================================================
-- STEP 8: DROP ALL INDEXES
-- =====================================================

-- (Indexes are automatically dropped when tables are dropped)

-- =====================================================
-- STEP 9: DROP ALL EXTENSIONS (if we added any)
-- =====================================================

-- Only drop extensions we might have added, not core ones
-- DROP EXTENSION IF EXISTS pgcrypto CASCADE; -- Don't drop this, it's core
-- DROP EXTENSION IF EXISTS uuid-ossp CASCADE; -- Don't drop this, it's core

-- =====================================================
-- STEP 10: RESET ROW LEVEL SECURITY
-- =====================================================

SET session_replication_role = DEFAULT;

-- =====================================================
-- STEP 11: VERIFICATION QUERIES
-- =====================================================

-- Check remaining tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check remaining functions
SELECT 
    n.nspname as schema,
    p.proname as function_name
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Check remaining triggers
SELECT 
    trigger_schema,
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Check remaining sequences
SELECT 
    sequence_schema,
    sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- Check remaining types
SELECT 
    typname,
    typtype
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public' 
AND t.typtype = 'e' -- Only enum types
ORDER BY typname;

-- =====================================================
-- STEP 12: CLEANUP COMPLETE
-- =====================================================

-- If you see any remaining objects above, you may need to drop them manually
-- The database should now be completely clean and ready for fresh setup

-- =====================================================
-- NEXT STEPS:
-- 1. Run the database setup script to create fresh tables
-- 2. Set up Row Level Security policies
-- 3. Create necessary functions and triggers
-- 4. Insert initial data (agents, etc.)
-- =====================================================
