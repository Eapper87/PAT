# 🚀 ProposalAI Supabase Setup Guide

## 📋 Overview
This guide will walk you through setting up Supabase for your ProposalAI application, including database setup, authentication, and environment configuration.

## 🎯 What We're Setting Up
- **Database Schema**: Tables for users, agents, calls, transactions, and more
- **Authentication**: Supabase Auth with email/password
- **Row Level Security**: RLS policies for data protection
- **Real-time Features**: For live call updates
- **Storage**: For agent images and user content

---

## 🔧 Step 1: Create Supabase Project

### 1.1 Go to Supabase Dashboard
- Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Sign in with your GitHub account
- Click **"New Project"**

### 1.2 Project Configuration
- **Organization**: Select your organization
- **Name**: `proposalai` (or your preferred name)
- **Database Password**: Generate a strong password (save this!)
- **Region**: Choose closest to your users
- **Pricing Plan**: Start with Free tier

### 1.3 Wait for Setup
- Database setup takes 2-5 minutes
- You'll receive an email when ready

---

## 🗄️ Step 2: Database Setup

### 2.1 Access SQL Editor
- In your Supabase dashboard, go to **SQL Editor**
- Click **"New Query"**

### 2.2 Run the Setup Script
- Copy the entire contents of `supabase-setup.sql`
- Paste into the SQL Editor
- Click **"Run"** to execute

### 2.3 Verify Setup
Run these verification queries:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
SELECT policy_name, table_name FROM pg_policies WHERE schemaname = 'public';

-- Check sample agents
SELECT name, role, persona FROM public.agents;
```

---

## 🔐 Step 3: Authentication Setup

### 3.1 Configure Auth Settings
- Go to **Authentication** → **Settings**
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add your production URLs when ready

### 3.2 Email Templates (Optional)
- **Authentication** → **Email Templates**
- Customize welcome emails and password reset emails
- Add your branding and adult entertainment appropriate language

### 3.3 Social Providers (Optional)
- **Authentication** → **Providers**
- Enable Google, GitHub, or other providers if desired
- Configure OAuth credentials

---

## 🛡️ Step 4: Row Level Security (RLS)

### 4.1 Verify RLS is Enabled
The setup script automatically enables RLS on all tables. Verify with:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4.2 Test RLS Policies
Create a test user and verify policies work:

```sql
-- This should only show the user's own data
SELECT * FROM public.users WHERE id = auth.uid();
```

---

## 🔑 Step 5: Environment Variables

### 5.1 Get Your Keys
- **Settings** → **API**
- Copy these values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5.2 Update Your .env.local
Create `.env.local` in your project root:

```env
# Copy the values from Step 5.1
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe Configuration (you'll add these later)
STRIPE_SECRET_KEY=your-stripe-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

---

## 🎭 Step 6: Customize AI Agents

### 6.1 Update Agent Profiles
Modify the sample agents in the database:

```sql
-- Update existing agents
UPDATE public.agents 
SET persona = 'Your custom persona description here'
WHERE name = 'Luna';

-- Add more agents
INSERT INTO public.agents (name, role, persona, description, tags, hourly_rate) VALUES
(
    'Your Agent Name',
    'performer',
    'Custom persona description',
    'Detailed description',
    ARRAY['tag1', 'tag2', 'tag3'],
    29.99
);
```

### 6.2 Agent Images
- Go to **Storage** → **Buckets**
- Create a bucket called `agent-images`
- Upload agent profile images
- Update agent records with image URLs

---

## 📊 Step 7: Real-time Features

### 7.1 Enable Real-time
- **Database** → **Replication**
- Enable real-time for these tables:
  - `public.calls`
  - `public.users`
  - `public.agents`

### 7.2 Test Real-time
In your Next.js app, you can now subscribe to changes:

```typescript
// Subscribe to call updates
const subscription = supabase
  .channel('calls')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'calls' },
    (payload) => {
      console.log('Call updated:', payload)
    }
  )
  .subscribe()
```

---

## 🚨 Step 8: Security & Compliance

### 8.1 Audit Logging
The setup includes audit logging. Monitor user actions:

```sql
-- View recent user actions
SELECT * FROM public.audit_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### 8.2 Data Retention
Consider implementing data retention policies:

```sql
-- Example: Delete old audit logs after 1 year
DELETE FROM public.audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 🧪 Step 9: Testing

### 9.1 Test User Registration
1. Start your Next.js app: `npm run dev`
2. Go to `/signup`
3. Create a test account
4. Verify user profile is created in database

### 9.2 Test Authentication
1. Sign out and sign back in
2. Verify JWT tokens work
3. Check RLS policies block unauthorized access

### 9.3 Test Admin Access
1. Manually set a user as admin in database:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```
2. Verify admin can see all data

---

## 🚀 Step 10: Production Deployment

### 10.1 Update Environment Variables
- Change `NEXT_PUBLIC_BASE_URL` to your production URL
- Update Supabase redirect URLs
- Set production Stripe keys

### 10.2 Database Backups
- **Settings** → **Database**
- Enable automatic backups
- Set backup schedule (daily recommended)

### 10.3 Monitoring
- **Settings** → **Usage**
- Monitor database usage and performance
- Set up alerts for high usage

---

## 🔍 Troubleshooting

### Common Issues

#### 1. RLS Policies Not Working
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

#### 2. Authentication Errors
- Verify environment variables are correct
- Check Supabase project is active
- Verify redirect URLs match exactly

#### 3. Database Connection Issues
- Check if Supabase is in maintenance mode
- Verify your IP isn't blocked
- Check database password is correct

#### 4. Real-time Not Working
- Ensure real-time is enabled for tables
- Check if you're using the correct channel name
- Verify client is properly subscribed

---

## 📚 Additional Resources

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

### Next.js Integration
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Server Components](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-components)

### Security Best Practices
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security#best-practices)
- [API Security](https://supabase.com/docs/guides/api/security)

---

## ✅ Setup Complete!

Your Supabase backend is now ready for ProposalAI! 

**Next Steps:**
1. Test the setup with your Next.js app
2. Configure Stripe integration
3. Set up ElevenLabs for AI voices
4. Deploy to production

**Need Help?**
- Check the troubleshooting section above
- Review Supabase documentation
- Check your application logs for errors

---

*Happy coding! 🎉*
