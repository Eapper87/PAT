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
        <Link href="/dashboard" className="text-2xl font-cyber font-bold neon-text">
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
          Ready to meet your AI receptionist? Choose from our seductive AI companions below.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl mb-4">💋</div>
          <h3 className="text-xl font-semibold mb-2 text-neon-pink">Visit Reception</h3>
          <p className="text-gray-400 mb-4">Meet your seductive AI receptionist</p>
          <Link href="/reception" className="cyber-button w-full block text-center">
            Go to Reception
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold mb-2 text-neon-green">Go Home</h3>
          <p className="text-gray-400 mb-4">Return to the main page</p>
          <Link href="/" className="cyber-button w-full block text-center">
            Go Home
          </Link>
        </motion.div>
      </div>

      {/* AI Receptionists Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="text-xl font-semibold mb-4 text-white">Your AI Receptionists</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-neon-pink/30 rounded-lg">
            <div className="text-3xl mb-2">🖤</div>
            <div className="font-semibold text-neon-pink">Raven</div>
            <div className="text-sm text-gray-400">Mysterious & Seductive</div>
          </div>
          <div className="text-center p-4 border border-neon-blue/30 rounded-lg">
            <div className="text-3xl mb-2">💙</div>
            <div className="font-semibold text-neon-blue">Orion</div>
            <div className="text-sm text-gray-400">Strong & Protective</div>
          </div>
          <div className="text-center p-4 border border-neon-green/30 rounded-lg">
            <div className="text-3xl mb-2">🌈</div>
            <div className="font-semibold text-neon-green">Nova</div>
            <div className="text-sm text-gray-400">Quirky & Playful</div>
          </div>
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 text-center"
      >
        <h3 className="text-xl font-semibold mb-4 text-white">Getting Started</h3>
        <div className="text-gray-400">
          <div className="text-4xl mb-2">🎤</div>
          <p>Click "Go to Reception" above to start chatting with your AI companions!</p>
          <p className="text-sm mt-2">Voice-only experience - just speak naturally!</p>
        </div>
      </motion.div>
    </div>
  )
}

