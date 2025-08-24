-- =====================================================
-- NUCLEAR OPTION: WIPE EVERYTHING IN SUPABASE
-- WARNING: This will DESTROY EVERYTHING in your database!
-- Use this only when you want to start completely from scratch
-- =====================================================

-- Disable all triggers and RLS temporarily
SET session_replication_role = replica;

-- =====================================================
-- STEP 1: DROP ALL CUSTOM SCHEMAS (except public and auth)
-- =====================================================

-- Drop any custom schemas we might have created
DROP SCHEMA IF EXISTS custom_schema CASCADE;
DROP SCHEMA IF EXISTS analytics CASCADE;
DROP SCHEMA IF EXISTS reports CASCADE;

-- =====================================================
-- STEP 2: DROP ALL TABLES IN PUBLIC SCHEMA
-- =====================================================

-- First, let's see what tables actually exist
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Drop all tables in public schema dynamically
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(table_record.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', table_record.tablename;
    END LOOP;
END $$;

-- Also try to drop specific tables we know about (with IF EXISTS)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.calls CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.call_logs CASCADE;
DROP TABLE IF EXISTS public.agent_schedules CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.credit_packages CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.agent_ratings CASCADE;
DROP TABLE IF EXISTS public.call_analytics CASCADE;

-- =====================================================
-- STEP 3: DROP ALL FUNCTIONS
-- =====================================================

-- Drop all custom functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_deletion() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_credits() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS public.update_call_status() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_call_cost() CASCADE;
DROP FUNCTION IF EXISTS public.process_payment() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_stats() CASCADE;
DROP FUNCTION IF EXISTS public.get_agent_availability() CASCADE;

-- =====================================================
-- STEP 4: DROP ALL TRIGGERS
-- =====================================================

-- Drop all triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Drop all triggers on public tables
DROP TRIGGER IF EXISTS on_user_created ON public.users;
DROP TRIGGER IF EXISTS on_user_updated ON public.users;
DROP TRIGGER IF EXISTS on_call_created ON public.calls;
DROP TRIGGER IF EXISTS on_call_updated ON public.calls;

-- =====================================================
-- STEP 5: DROP ALL POLICIES
-- =====================================================

-- Drop all RLS policies (these should be auto-dropped with tables, but just in case)
-- Note: We can't easily list all policies, so we'll drop them by table

-- =====================================================
-- STEP 6: DROP ALL VIEWS
-- =====================================================

-- Drop all custom views
DROP VIEW IF EXISTS public.user_stats CASCADE;
DROP VIEW IF EXISTS public.call_analytics CASCADE;
DROP VIEW IF EXISTS public.agent_performance CASCADE;
DROP VIEW IF EXISTS public.revenue_summary CASCADE;
DROP VIEW IF EXISTS public.user_activity CASCADE;
DROP VIEW IF EXISTS public.agent_availability CASCADE;
DROP VIEW IF EXISTS public.call_summary CASCADE;
DROP VIEW IF EXISTS public.payment_summary CASCADE;

-- =====================================================
-- STEP 7: DROP ALL MATERIALIZED VIEWS
-- =====================================================

-- Drop all materialized views
DROP MATERIALIZED VIEW IF EXISTS public.user_activity_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.call_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.agent_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.revenue_analytics CASCADE;

-- =====================================================
-- STEP 8: DROP ALL SEQUENCES
-- =====================================================

-- Drop all custom sequences
DROP SEQUENCE IF EXISTS public.users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.agents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.calls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.transactions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.user_profiles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.agent_schedules_id_seq CASCADE;

-- =====================================================
-- STEP 9: DROP ALL TYPES
-- =====================================================

-- Drop all custom enum types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.agent_role CASCADE;
DROP TYPE IF EXISTS public.call_status CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;
DROP TYPE IF EXISTS public.transaction_type CASCADE;
DROP TYPE IF EXISTS public.transaction_status CASCADE;
DROP TYPE IF EXISTS public.agent_availability_status CASCADE;
DROP TYPE IF EXISTS public.payment_method_type CASCADE;
DROP TYPE IF EXISTS public.user_preference_type CASCADE;

-- =====================================================
-- STEP 10: DROP ALL INDEXES
-- =====================================================

-- (Indexes are automatically dropped when tables are dropped)

-- =====================================================
-- STEP 11: DROP ALL EXTENSIONS (only custom ones)
-- =====================================================

-- Only drop extensions we might have added, NOT core Supabase extensions
-- DROP EXTENSION IF EXISTS custom_extension CASCADE;

-- =====================================================
-- STEP 12: CLEAN UP AUTH SCHEMA (if needed)
-- =====================================================

-- Note: We generally don't want to touch the auth schema as it's managed by Supabase
-- But if you want to clear all user accounts, you can do this:
-- DELETE FROM auth.users WHERE id != '00000000-0000-0000-0000-000000000000';

-- =====================================================
-- STEP 13: RESET SESSION SETTINGS
-- =====================================================

SET session_replication_role = DEFAULT;

-- =====================================================
-- STEP 14: VERIFICATION - CHECK WHAT'S LEFT
-- =====================================================

-- Check remaining tables
SELECT '=== REMAINING TABLES ===' as info;
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check remaining functions
SELECT '=== REMAINING FUNCTIONS ===' as info;
SELECT 
    n.nspname as schema,
    p.proname as function_name
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Check remaining triggers
SELECT '=== REMAINING TRIGGERS ===' as info;
SELECT 
    trigger_schema,
    trigger_name,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Check remaining sequences
SELECT '=== REMAINING SEQUENCES ===' as info;
SELECT 
    sequence_schema,
    sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- Check remaining types
SELECT '=== REMAINING TYPES ===' as info;
SELECT 
    typname,
    typtype
FROM pg_type t
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'public' 
AND t.typtype = 'e' -- Only enum types
ORDER BY typname;

-- Check remaining views
SELECT '=== REMAINING VIEWS ===' as info;
SELECT 
    table_schema,
    table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- STEP 15: NUCLEAR WIPE COMPLETE
-- =====================================================

-- If you see any remaining objects above, you may need to drop them manually
-- The database should now be completely clean and ready for fresh setup

-- =====================================================
-- NEXT STEPS:
-- 1. Your database is now completely wiped
-- 2. Run the database setup script to create fresh tables
-- 3. Set up Row Level Security policies
-- 4. Create necessary functions and triggers
-- 5. Insert initial data (agents, etc.)
-- =====================================================
