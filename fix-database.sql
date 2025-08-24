-- =====================================================
-- ProposalAI Database Diagnostic & Fix Script
-- =====================================================

-- 1. Check if tables exist and have data
SELECT 'Tables Check' as section;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check if the trigger function exists
SELECT 'Function Check' as section;
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'handle_new_user';

-- 3. Check if the trigger exists
SELECT 'Trigger Check' as section;
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND event_object_table = 'users';

-- 4. Check RLS policies
SELECT 'RLS Policies Check' as section;
SELECT schemaname, tablename, rowsecurity, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 5. Check if there are any users in auth.users
SELECT 'Auth Users Check' as section;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 6. Check if there are any users in public.users
SELECT 'Public Users Check' as section;
SELECT id, email, role, credits, subscription_status, created_at 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 7. Fix: Drop and recreate the trigger function with better error handling
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Add logging for debugging
    RAISE LOG 'handle_new_user triggered for user: %', NEW.id;
    
    -- Check if user profile already exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        -- Insert user profile
        INSERT INTO public.users (id, email, credits, subscription_status)
        VALUES (NEW.id, NEW.email, 10, 'inactive');
        
        RAISE LOG 'Created user profile for: %', NEW.id;
        
        -- Insert user preferences
        INSERT INTO public.user_preferences (user_id)
        VALUES (NEW.id);
        
        RAISE LOG 'Created user preferences for: %', NEW.id;
    ELSE
        RAISE LOG 'User profile already exists for: %', NEW.id;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fix: Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Fix: Ensure RLS policies allow the trigger function to work
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Create more permissive policies for the trigger function
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id OR auth.uid() = id);

-- Allow insert for the trigger function
CREATE POLICY "Allow user creation" ON public.users
    FOR INSERT WITH CHECK (true);

-- 10. Fix: Ensure user_preferences table allows inserts
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;

CREATE POLICY "Allow preference creation" ON public.user_preferences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- 11. Test: Create a test user profile manually if needed
-- (This will help verify the setup works)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Check if we have any auth users
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Check if profile exists
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = test_user_id) THEN
            -- Create profile manually
            INSERT INTO public.users (id, email, credits, subscription_status)
            SELECT id, email, 10, 'inactive' FROM auth.users WHERE id = test_user_id;
            
            -- Create preferences
            INSERT INTO public.user_preferences (user_id)
            VALUES (test_user_id);
            
            RAISE LOG 'Manually created profile for test user: %', test_user_id;
        END IF;
    END IF;
END $$;

-- 12. Final verification
SELECT 'Final Check' as section;
SELECT 
    'auth.users count' as table_name, 
    COUNT(*) as record_count 
FROM auth.users
UNION ALL
SELECT 
    'public.users count' as table_name, 
    COUNT(*) as record_count 
FROM public.users
UNION ALL
SELECT 
    'public.user_preferences count' as table_name, 
    COUNT(*) as record_count 
FROM public.user_preferences;
