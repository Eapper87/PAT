-- Update credit amounts for Pro and Enterprise plans
-- This script updates the Stripe webhook logic to add correct credits

-- Note: The actual credit amounts are now handled in the webhook code:
-- Pro plan: 75 credits (was 100)
-- Enterprise plan: 300 credits (was 500)

-- The webhook handlers in app/api/stripe/webhook/route.ts have been updated to:
-- - Add 75 credits for Pro subscriptions (instead of 100)
-- - Add 300 credits for Enterprise subscriptions (instead of 500)

-- No database schema changes needed - credits are added dynamically when subscriptions are processed

-- To verify the changes are working:
-- 1. Check that new Pro subscribers get 75 credits
-- 2. Check that new Enterprise subscribers get 300 credits
-- 3. Verify monthly renewals add the correct amounts

-- You can test this by:
-- 1. Creating a test subscription in Stripe
-- 2. Checking the webhook logs
-- 3. Verifying the user's credit balance in Supabase

-- The changes are now live in the code and will apply to all new subscriptions and renewals.
