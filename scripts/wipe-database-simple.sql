-- =====================================================
-- SIMPLE SUPABASE DATABASE WIPE
-- Quick and safe cleanup for ProposalAI tables
-- =====================================================

-- Drop tables in dependency order
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Verify cleanup
SELECT 'Tables remaining:' as info;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Database is now clean and ready for fresh setup
