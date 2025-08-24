'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { User } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initiatingCall, setInitiatingCall] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      // Fetch user profile
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Creating missing user profile...')
          try {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: authUser.id,
                  email: authUser.email,
                  credits: 10,
                  subscription_status: 'inactive'
                }
              ])

            if (insertError) {
              console.error('Failed to create user profile:', insertError)
              return
            } else {
              // Fetch the newly created profile
              const { data: newProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single()
              
              if (newProfile) {
                setUser(newProfile)
              } else {
                return
              }
            }
          } catch (createError) {
            console.error('Error creating user profile:', createError)
            return
          }
        } else {
          return
        }
      } else {
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const initiateCall = async () => {
    if (!user || user.credits <= 0) return
    
    setInitiatingCall(true)
    
    try {
      // Create a new call record
      const { data: call, error } = await supabase
        .from('calls')
        .insert([
          {
            user_id: user.id,
            agent_id: 'receptionist-001', // Default receptionist
            duration: 0,
            cost: 0,
            status: 'initiated'
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Redirect to call interface
      router.push(`/call/${call.id}`)
    } catch (error) {
      console.error('Error initiating call:', error)
    } finally {
      setInitiatingCall(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-pink text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border border-gray-600 text-gray-300 hover:border-neon-pink hover:text-neon-pink transition-colors rounded-lg"
        >
          Sign Out
        </button>
      </header>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.email?.split('@')[0]}! 🔥
        </h1>
        <p className="text-gray-400">
          Ready to connect with your AI companion? You have {user.credits} credits remaining.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
          onClick={user.credits > 0 ? initiateCall : undefined}
        >
          <div className="text-4xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold mb-2 text-neon-pink">Start Fantasy</h3>
          <p className="text-gray-400 mb-4">
            {user.credits > 0 
              ? 'Connect with your AI companion' 
              : 'No credits remaining'
            }
          </p>
          <button
            disabled={user.credits <= 0 || initiatingCall}
            className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initiatingCall ? 'Connecting...' : 'Start Fantasy'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2 text-neon-blue">Buy Credits</h3>
          <p className="text-gray-400 mb-4">Purchase more call credits</p>
          <Link href="/pricing" className="cyber-button w-full block text-center">
            View Plans
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2 text-neon-green">Fantasy History</h3>
          <p className="text-gray-400 mb-4">View your past intimate conversations</p>
          <Link href="/history" className="cyber-button w-full block text-center">
            View History
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-2xl font-bold text-neon-pink">{user.credits}</div>
          <div className="text-gray-400 text-sm">Credits Remaining</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-2xl font-bold text-neon-blue">
            {user.subscription_status === 'active' ? 'Active' : 'Inactive'}
          </div>
          <div className="text-gray-400 text-sm">Subscription</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-2xl font-bold text-neon-green">0</div>
          <div className="text-gray-400 text-sm">Fantasies Today</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-2xl font-bold text-neon-purple">0</div>
          <div className="text-gray-400 text-sm">Total Minutes</div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
        <div className="text-gray-400 text-center py-8">
          <div className="text-4xl mb-2">🔥</div>
          <p>No fantasies yet. Start your first intimate conversation!</p>
        </div>
      </motion.div>
    </div>
  )
}

