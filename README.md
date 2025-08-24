# ProposalAI 🚀

A modern, AI-powered fantasy companion service featuring multiple AI receptionists and specialized AI escorts, powered by intelligent conversational agents.

## ✨ Features

- **Multiple AI Receptionists**: Choose from 3 unique personalities (Raven, Orion, Nova)
- **AI Escort Companions**: 10+ specialized AI companions with unique personalities
- **Interactive Conversations**: Real-time AI chat with personality-driven responses
- **Credit System**: Pay-per-minute or subscription-based credit system
- **Modern UI/UX**: Cyberpunk-inspired design with neon accents and smooth animations
- **Admin Panel**: Comprehensive management system for AI agents and user monitoring
- **Stripe Integration**: Secure payment processing for subscriptions and credit purchases
- **Authentication System**: Secure user management with Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Animations**: Framer Motion
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone the Repository

```bash
git clone https://github.com/Eapper87/PAT.git
cd proposalai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=your_pro_price_id
NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  credits INTEGER DEFAULT 10,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agents table
CREATE TABLE agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('receptionist', 'worker')),
  voice_id TEXT NOT NULL,
  availability BOOLEAN DEFAULT true,
  persona TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table
CREATE TABLE calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  agent_id TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  cost INTEGER DEFAULT 0,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'active', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  stripe_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('subscription', 'credits')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Agents are publicly readable
CREATE POLICY "Agents are publicly readable" ON agents FOR SELECT USING (true);

-- Users can only see their own calls
CREATE POLICY "Users can view own calls" ON calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create calls" ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Insert default receptionist agent
INSERT INTO agents (name, role, voice_id, persona, availability) 
VALUES ('AI Receptionist', 'receptionist', 'receptionist-001', 'Professional and friendly AI receptionist that helps route users to the right specialists', true);
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Features

### Landing Page (`/`)
- Hero section with animated elements
- Feature highlights
- Call-to-action buttons linking to reception

### Authentication
- **Sign Up** (`/signup`): User registration with Supabase Auth
- **Login** (`/login`): User authentication with redirect handling
- **Dashboard** (`/dashboard`): Protected user dashboard

### User Dashboard
- Credit balance display
- Quick actions grid (Visit Reception, Fantasy History, Buy Credits)
- Usage statistics
- **Call History**: View and manage past conversations

### Reception System (`/reception`)
- **Multiple AI Receptionists**: Choose from 3 unique personalities
- **Raven** 🖤: Mysterious & Seductive (Female)
- **Orion** 💙: Strong & Protective (Male)
- **Nova** 🌈: Quirky & Playful (Gender-fluid)
- Each receptionist has unique conversation styles and responses

### AI Escort Companions
- **10+ Specialized AI Companions** with unique personalities
- **Female Companions**: Serena, Luna, Phoenix, Jade, Misty, Scarlet, Violet
- **Male Companions**: Atlas, Kai
- **Personality Types**: Mysterious, Romantic, Fiery, Sophisticated, Mystical, Confident, Playful, Strong, Protective
- **Escorts Showcase** (`/escorts`): Browse all companions with filtering

### Call Interfaces
- **Receptionist Calls**: `/call/receptionist`, `/call/orion`, `/call/nova`
- **Escort Calls**: `/call/serena`, `/call/luna`, `/call/phoenix`, etc.
- Real-time AI conversation management
- Personality-driven responses and interactions
- Call controls and conversation history

### Call History (`/history`)
- Complete call history and analytics
- Call duration and status tracking
- Agent interaction history
- Performance metrics and insights

### Pricing (`/pricing`)
- Subscription plans
- Credit packages
- FAQ section
- **Authentication-aware**: Maintains user login state
- **Smart redirects**: Returns users to pricing after login

### Admin Panel (`/admin`)
- AI agent management
- User monitoring
- Call analytics
- System statistics

## 🆕 Recent Updates

### Latest Features (v1.4.0)
- ✅ **Multiple Receptionist System**: 3 unique AI receptionists with different personalities
- ✅ **AI Escort Companions**: 10+ specialized AI companions with unique traits
- ✅ **Escorts Showcase Page**: Browse and filter all available companions
- ✅ **Enhanced Reception Experience**: Choose your preferred receptionist personality
- ✅ **Improved User Dashboard**: Streamlined navigation and quick actions
- ✅ **Personality-Driven AI**: Each AI has unique conversation styles and responses

### Previous Updates (v1.3.0)
- ✅ **AI Escort System**: Created 10 diverse AI escort pages (7 female, 3 male)
- ✅ **Main Escorts Showcase**: Added `/escorts` page with gender filtering
- ✅ **Browse All Companions**: Added button to reception page
- ✅ **All pages authentication-aware**: Properly secured and user-specific

### Core Features (v1.1.0)
- ✅ **Call History Page**: Complete user call history with analytics
- ✅ **Enhanced Authentication**: Improved login flow with redirect handling
- ✅ **Fixed Pricing Authentication**: Users no longer logged out when accessing pricing
- ✅ **Improved Stripe Integration**: Better customer management and metadata handling
- ✅ **TypeScript Improvements**: Fixed all build errors and type issues
- ✅ **Better UX**: Seamless navigation between authenticated pages

## 🔧 Configuration

### Stripe Setup

1. Create products and prices in your Stripe dashboard
2. Set up webhook endpoints pointing to `/api/stripe/webhook`
3. Configure webhook events for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Supabase Configuration

1. Enable Email authentication in Supabase Auth
2. Configure email templates
3. Set up Row Level Security policies
4. Configure storage buckets if needed

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to update your production environment variables with:
- Production Supabase credentials
- Production Stripe keys
- Production webhook URLs
- Custom domain (if applicable)

## 🎨 Customization

### Theme Colors

Modify `tailwind.config.js` to customize the cyberpunk theme:

```javascript
colors: {
  neon: {
    pink: '#ff0080',    // Primary accent
    blue: '#00ffff',    // Secondary accent
    green: '#00ff00',   // Success states
    purple: '#8000ff',  // Additional accent
  }
}
```

### Adding New AI Companions

1. Use the existing template system in `app/call/[name]/page.tsx`
2. Customize personality, responses, and conversation style
3. Add to the escorts array in `/escorts` page
4. Update receptionist routing if needed

### Adding New Receptionists

1. Create new receptionist page in `app/call/[name]/page.tsx`
2. Update reception page selection array
3. Ensure unique personality and conversation style
4. Add to navigation and routing

## 📊 Database Schema

### Core Tables

- **users**: User profiles, credits, subscription status
- **agents**: AI agent configurations and availability
- **calls**: Call records and metrics
- **transactions**: Payment and credit history

### Relationships

- Users have many calls and transactions
- Agents are referenced in calls
- Stripe integration tracks customer relationships

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- JWT-based authentication
- Secure API routes
- Input validation and sanitization
- CORS protection
- Authentication-aware pages

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all environment variables are set in `.env.local`
- Run `npm run build` to check for TypeScript errors
- Clear `.next` folder and reinstall dependencies if needed

**Authentication Issues**
- Check Supabase configuration and RLS policies
- Verify environment variables are correct
- Ensure database tables are properly set up

**Stripe Integration**
- Verify webhook endpoints are configured
- Check Stripe keys are correct
- Ensure webhook events are properly set up

**Database Issues**
- Run the database setup SQL in Supabase
- Check RLS policies are enabled
- Verify user triggers are working

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🚧 Roadmap

### Completed ✅
- [x] User authentication system
- [x] Multiple AI receptionist system (3 personalities)
- [x] AI escort companion system (10+ personalities)
- [x] Interactive conversation interfaces
- [x] Call interface and management
- [x] Stripe payment integration
- [x] Call history and analytics
- [x] Pricing page with authentication
- [x] Admin dashboard
- [x] Escorts showcase page
- [x] Personality-driven AI responses

### In Progress 🚧
- [ ] WebRTC integration for real voice calls
- [ ] AI agent training interface
- [ ] Advanced analytics dashboard

### Planned 🎯
- [ ] Expand to 20-30 AI escort companions
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Enterprise features
- [ ] Advanced AI personality customization

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- Styled with Tailwind CSS
- Animated with Framer Motion
- Powered by AI conversational technology
- Multiple AI personalities for diverse user experiences

---

**ProposalAI** - The future of AI companionship is here! 🚀💋

