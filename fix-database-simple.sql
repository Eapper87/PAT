-- =====================================================
-- ProposalAI Database Fix Script (Simplified)
-- =====================================================

-- 1. Check current state
SELECT 'Current Tables' as section;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

SELECT 'Current Users Count' as section;
SELECT COUNT(*) as auth_users FROM auth.users;
SELECT COUNT(*) as public_users FROM public.users;

-- 2. Fix: Drop and recreate the trigger function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert user profile
    INSERT INTO public.users (id, email, credits, subscription_status)
    VALUES (NEW.id, NEW.email, 10, 'inactive');
    
    -- Insert user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Fix: Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Fix: Ensure RLS policies allow the trigger function to work
-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;

-- Create permissive policies for the trigger function
CREATE POLICY "Allow user creation" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow preference creation" ON public.user_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

-- 5. Fix: Create missing user profiles for existing auth users
INSERT INTO public.users (id, email, credits, subscription_status)
SELECT id, email, 10, 'inactive'
FROM auth.users 
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_preferences (user_id)
SELECT id 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- 6. Final verification
SELECT 'Final Counts' as section;
SELECT 'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'public.users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'public.user_preferences' as table_name, COUNT(*) as count FROM public.user_preferences;
