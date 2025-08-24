import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  credits: number
  subscription_status: 'active' | 'inactive' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  name: string
  role: 'receptionist' | 'worker'
  voice_id: string
  availability: boolean
  persona: string
  created_at: string
}

export interface Call {
  id: string
  user_id: string
  agent_id: string
  duration: number
  cost: number
  status: 'initiated' | 'active' | 'completed' | 'failed'
  created_at: string
  ended_at?: string
}

export interface Transaction {
  id: string
  user_id: string
  stripe_id: string
  amount: number
  type: 'subscription' | 'credits'
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

