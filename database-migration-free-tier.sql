-- Database Migration for Free Tier System
-- Run this script in your Supabase SQL editor

-- Add billing_note field to the calls table
ALTER TABLE calls 
ADD COLUMN IF NOT EXISTS billing_note TEXT;

-- Update the status enum to include 'limited' status
-- First, let's check if we need to add the new status
DO $$ 
BEGIN
    -- Check if 'limited' status already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'limited' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'calls_status_enum')
    ) THEN
        -- Add 'limited' status to the enum
        ALTER TYPE calls_status_enum ADD VALUE 'limited';
    END IF;
END $$;

-- Add comment to document the new field
COMMENT ON COLUMN calls.billing_note IS 'Billing information and notes for the call';

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'calls' 
AND column_name = 'billing_note'
ORDER BY ordinal_position;

-- Show current status enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'calls_status_enum')
ORDER BY enumsortorder;
