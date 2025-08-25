-- Database Migration for Cleanup
-- Run this script in your Supabase SQL editor

-- Remove any unused call tracking fields if they exist
-- (This is optional - only run if you want to clean up old tracking fields)

-- Show current calls table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'calls' 
ORDER BY ordinal_position;

-- Note: If you want to completely remove the calls table later, you can run:
-- DROP TABLE IF EXISTS calls;
