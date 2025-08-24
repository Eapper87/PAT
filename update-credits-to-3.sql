-- Update default credits from 5 to 3 for new users
-- This will affect the DEFAULT value for new user registrations

-- First, let's see what the current default is
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'credits';

-- Update the default value for the credits column
ALTER TABLE users ALTER COLUMN credits SET DEFAULT 3;

-- If you want to update existing users who have exactly 5 credits (free trial users)
-- to have 3 credits instead, uncomment the line below:
-- UPDATE users SET credits = 3 WHERE credits = 5 AND subscription_status = 'inactive';

-- Verify the change
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'credits';

-- Show current credit distribution
SELECT credits, COUNT(*) as user_count 
FROM users 
GROUP BY credits 
ORDER BY credits;
