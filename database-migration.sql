-- Database Migration for Phase 1: Server-Side Call Session Management
-- Run this script in your Supabase SQL editor

-- Add new fields to the calls table
ALTER TABLE calls 
ADD COLUMN IF NOT EXISTS session_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_heartbeat TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS server_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS webhook_received BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS elevenlabs_processing_time INTEGER,
ADD COLUMN IF NOT EXISTS credits_reserved INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_calls_user_status ON calls(user_id, status);
CREATE INDEX IF NOT EXISTS idx_calls_session_started ON calls(session_started_at);
CREATE INDEX IF NOT EXISTS idx_calls_processing_status ON calls(processing_status);

-- Update existing calls to have default values
UPDATE calls 
SET 
  session_started_at = created_at,
  last_heartbeat = created_at,
  processing_status = 'pending',
  webhook_received = FALSE,
  credits_reserved = 0
WHERE session_started_at IS NULL;

-- Create a function to increment user credits (used in the end call API)
CREATE OR REPLACE FUNCTION increment(row_id UUID, x INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (SELECT credits + x FROM users WHERE id = row_id);
END;
$$;

-- Add comments to document the new fields
COMMENT ON COLUMN calls.session_started_at IS 'Server-side timestamp when call session was initiated';
COMMENT ON COLUMN calls.last_heartbeat IS 'Last heartbeat timestamp from client';
COMMENT ON COLUMN calls.server_duration IS 'Duration calculated on server side in seconds';
COMMENT ON COLUMN calls.processing_status IS 'Status of ElevenLabs processing: pending, processing, completed, failed';
COMMENT ON COLUMN calls.webhook_received IS 'Whether ElevenLabs webhook was received';
COMMENT ON COLUMN calls.elevenlabs_processing_time IS 'Actual processing time from ElevenLabs in seconds';
COMMENT ON COLUMN calls.credits_reserved IS 'Number of credits reserved for this call';

-- Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'calls' 
ORDER BY ordinal_position;
