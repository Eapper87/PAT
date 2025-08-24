-- =====================================================
-- ULTIMATE NUCLEAR OPTION: WIPE EVERYTHING INCLUDING AUTH USERS
-- WARNING: This will DESTROY EVERYTHING including all user accounts!
-- Use this only when you want to start completely from scratch
-- =====================================================

-- Disable all triggers and RLS temporarily
SET session_replication_role = replica;

-- =====================================================
-- STEP 1: CLEAR ALL AUTH USERS (NUCLEAR OPTION)
-- =====================================================

-- WARNING: This will delete ALL user accounts!
-- Only uncomment if you want to clear everything including users
-- DELETE FROM auth.users WHERE id != '00000000-0000-0000-0000-000000000000';

-- Clear user sessions
DELETE FROM auth.sessions;

-- Clear user identities
DELETE FROM auth.identities;

-- Clear user refresh tokens
DELETE FROM auth.refresh_tokens;

-- Clear user factors
DELETE FROM auth.mfa_factors;

-- Clear user challenges
DELETE FROM auth.mfa_challenges;

-- Clear user audit logs
DELETE FROM auth.audit_log_entries;

-- =====================================================
-- STEP 2: DROP ALL CUSTOM SCHEMAS
-- =====================================================

-- Drop any custom schemas we might have created
DROP SCHEMA IF EXISTS custom_schema CASCADE;
DROP SCHEMA IF EXISTS analytics CASCADE;
DROP SCHEMA IF EXISTS reports CASCADE;
DROP SCHEMA IF EXISTS staging CASCADE;
DROP SCHEMA IF EXISTS temp CASCADE;

-- =====================================================
-- STEP 3: DROP ALL TABLES IN PUBLIC SCHEMA
-- =====================================================

-- Drop all tables (this will cascade to drop everything dependent)
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
DROP TABLE IF EXISTS public.user_activity CASCADE;
DROP TABLE IF EXISTS public.agent_performance CASCADE;
DROP TABLE IF EXISTS public.revenue_summary CASCADE;
DROP TABLE IF EXISTS public.payment_logs CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.user_notifications CASCADE;
DROP TABLE IF EXISTS public.agent_availability CASCADE;
DROP TABLE IF EXISTS public.call_queues CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.agent_specialties CASCADE;
DROP TABLE IF EXISTS public.call_ratings CASCADE;
DROP TABLE IF EXISTS public.user_blocklist CASCADE;
DROP TABLE IF EXISTS public.agent_blocklist CASCADE;

-- =====================================================
-- STEP 4: DROP ALL FUNCTIONS
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
DROP FUNCTION IF EXISTS public.validate_user_access() CASCADE;
DROP FUNCTION IF EXISTS public.update_agent_status() CASCADE;
DROP FUNCTION IF EXISTS public.process_credit_purchase() CASCADE;
DROP FUNCTION IF EXISTS public.handle_subscription_change() CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_agent_rating() CASCADE;
DROP FUNCTION IF EXISTS public.process_call_rating() CASCADE;
DROP FUNCTION IF EXISTS public.handle_payment_webhook() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_preferences() CASCADE;
DROP FUNCTION IF EXISTS public.get_call_history() CASCADE;

-- =====================================================
-- STEP 5: DROP ALL TRIGGERS
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
DROP TRIGGER IF EXISTS on_agent_created ON public.agents;
DROP TRIGGER IF EXISTS on_transaction_created ON public.transactions;
DROP TRIGGER IF EXISTS on_user_profile_updated ON public.user_profiles;
DROP TRIGGER IF EXISTS on_agent_availability_changed ON public.agent_availability;

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
DROP VIEW IF EXISTS public.user_dashboard CASCADE;
DROP VIEW IF EXISTS public.agent_dashboard CASCADE;
DROP VIEW IF EXISTS public.admin_overview CASCADE;
DROP VIEW IF EXISTS public.financial_summary CASCADE;
DROP VIEW IF EXISTS public.user_engagement CASCADE;
DROP VIEW IF EXISTS public.agent_metrics CASCADE;

-- =====================================================
-- STEP 7: DROP ALL MATERIALIZED VIEWS
-- =====================================================

-- Drop all materialized views
DROP MATERIALIZED VIEW IF EXISTS public.user_activity_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.call_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.agent_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.revenue_analytics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.user_retention_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.agent_efficiency_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.call_quality_metrics CASCADE;
DROP MATERIALIZED VIEW IF EXISTS public.financial_performance CASCADE;

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
DROP SEQUENCE IF EXISTS public.call_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.user_activity_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.agent_ratings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS public.payment_logs_id_seq CASCADE;

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
DROP TYPE IF EXISTS public.call_rating_type CASCADE;
DROP TYPE IF EXISTS public.agent_specialty_type CASCADE;
DROP TYPE IF EXISTS public.notification_type CASCADE;
DROP TYPE IF EXISTS public.user_status_type CASCADE;
DROP TYPE IF EXISTS public.agent_status_type CASCADE;
DROP TYPE IF EXISTS public.call_priority_type CASCADE;
DROP TYPE IF EXISTS public.payment_status_type CASCADE;

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
-- STEP 12: RESET SESSION SETTINGS
-- =====================================================

SET session_replication_role = DEFAULT;

-- =====================================================
-- STEP 13: VERIFICATION - CHECK WHAT'S LEFT
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

-- Check auth users (if you enabled the DELETE above)
SELECT '=== AUTH USERS REMAINING ===' as info;
SELECT COUNT(*) as user_count FROM auth.users;

-- =====================================================
-- STEP 14: ULTIMATE NUCLEAR WIPE COMPLETE
-- =====================================================

-- Your database should now be completely clean and ready for fresh setup
-- If you see any remaining objects above, you may need to drop them manually

-- =====================================================
-- NEXT STEPS:
-- 1. Your database is now completely wiped (including users if you enabled auth cleanup)
-- 2. Run the database setup script to create fresh tables
-- 3. Set up Row Level Security policies
-- 4. Create necessary functions and triggers
-- 5. Insert initial data (agents, etc.)
-- 6. Create your first admin user
-- =====================================================
