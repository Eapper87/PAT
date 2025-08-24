-- Update default credits from 5 to 3 for new users
-- This will affect the DEFAULT value for new user registrations

-- First, let's see what the current default is
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'credits';

-- Update the default value for the credits column
ALTER TABLE users ALTER COLUMN credits SET DEFAULT 3;

-- Update existing users who have 10 credits (free trial users) to 3 credits
-- This will fix the dashboard display issue
UPDATE users SET credits = 3 WHERE credits = 10 AND subscription_status = 'inactive';

-- Also update users with 5 credits to 3 credits (if any exist)
UPDATE users SET credits = 3 WHERE credits = 5 AND subscription_status = 'inactive';

-- Verify the change
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'credits';

-- Show current credit distribution
SELECT credits, COUNT(*) as user_count 
FROM users 
GROUP BY credits 
ORDER BY credits;

-- Show users who were updated
SELECT id, email, credits, subscription_status, created_at 
FROM users 
WHERE credits = 3 AND subscription_status = 'inactive'
ORDER BY created_at DESC;
