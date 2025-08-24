-- =====================================================
-- SUPABASE DATABASE WIPE SCRIPT
-- WARNING: This will completely destroy all data!
-- Run this in your Supabase SQL editor to start fresh
-- =====================================================

-- Disable Row Level Security temporarily
SET session_replication_role = replica;

-- Drop all tables (in dependency order)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_user() CASCADE;

-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop all policies
-- (These will be automatically dropped when tables are dropped)

-- Drop all sequences
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS agents_id_seq CASCADE;
DROP SEQUENCE IF EXISTS calls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS transactions_id_seq CASCADE;

-- Drop all types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS agent_role CASCADE;
DROP TYPE IF EXISTS call_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

-- Reset Row Level Security
SET session_replication_role = DEFAULT;

-- Verify cleanup
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Show remaining functions
SELECT 
    n.nspname as schema,
    p.proname as function_name
FROM pg_proc p
LEFT JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
ORDER BY p.proname;

-- Show remaining sequences
SELECT 
    sequence_schema,
    sequence_name
FROM information_schema.sequences
WHERE sequence_schema = 'public'
ORDER BY sequence_name;

-- =====================================================
-- DATABASE WIPE COMPLETE
-- You can now run the setup script to create fresh tables
-- =====================================================
