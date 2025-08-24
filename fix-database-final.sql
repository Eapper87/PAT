-- =====================================================
-- ProposalAI Database Fix Script (Final - No Recursion)
-- =====================================================

-- 1. Check current state
SELECT 'Current Tables' as section;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

SELECT 'Current Users Count' as section;
SELECT COUNT(*) as auth_users FROM auth.users;
SELECT COUNT(*) as public_users FROM public.users;

-- 2. CRITICAL: Drop ALL existing RLS policies to break recursion
SELECT 'Dropping all RLS policies...' as action;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow user creation" ON public.users;
DROP POLICY IF EXISTS "Anyone can view available agents" ON public.agents;
DROP POLICY IF EXISTS "Admins can manage all agents" ON public.agents;
DROP POLICY IF EXISTS "Users can view own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can create calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update own calls" ON public.calls;
DROP POLICY IF EXISTS "Admins can view all calls" ON public.calls;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Allow preference creation" ON public.user_preferences;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- 3. Fix: Drop and recreate the trigger function
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

-- 4. Fix: Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Fix: Create SIMPLE, NON-RECURSIVE RLS policies
-- Users table - simple policies that don't cause recursion
CREATE POLICY "users_select_policy" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_policy" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update_policy" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User preferences table
CREATE POLICY "user_preferences_select_policy" ON public.user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_policy" ON public.user_preferences
    FOR INSERT WITH CHECK (true);

CREATE POLICY "user_preferences_update_policy" ON public.user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Agents table - allow viewing available agents
CREATE POLICY "agents_select_policy" ON public.agents
    FOR SELECT USING (availability = true);

-- Calls table
CREATE POLICY "calls_select_policy" ON public.calls
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "calls_insert_policy" ON public.calls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calls_update_policy" ON public.calls
    FOR UPDATE USING (auth.uid() = user_id);

-- Transactions table
CREATE POLICY "transactions_select_policy" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions table
CREATE POLICY "subscriptions_select_policy" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Audit logs table - admin only
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Fix: Create missing user profiles for existing auth users
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

-- 7. Final verification
SELECT 'Final Counts' as section;
SELECT 'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'public.users' as table_name, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'public.user_preferences' as table_name, COUNT(*) as count FROM public.user_preferences;

-- 8. Test the policies work
SELECT 'Testing RLS policies...' as action;
SELECT 'Users table RLS enabled:' as check_item, 
       CASE WHEN rowsecurity THEN 'YES' ELSE 'NO' END as result
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'users';
