'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface CallRecord {
  id: string
  agent_id: string
  status: string
  duration: number
  cost: number
  started_at: string
  ended_at: string
}

interface UsageSummary {
  totalCalls: number
  totalMinutes: number
  totalCost: number
  recentCalls: CallRecord[]
}

const agentNames: Record<string, string> = {
  'agent_5201k3e7ympbfm0vxskkqz73raa3': 'Raven 🖤',
  'agent_8601k3eeze9aftrbtc7twm7xsfa4': 'Orion 💙',
  'agent_0401k3ef8wcvfpmvqvcas62ewkgf': 'Nova 🌈'
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [usageSummary, setUsageSummary] = useState<UsageSummary>({
    totalCalls: 0,
    totalMinutes: 0,
    totalCost: 0,
    recentCalls: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadUsageSummary()
    }
  }, [user])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        window.location.href = '/login'
        return
      }

      // Check if user profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!profile && !profileError) {
        // Create new user profile
        await supabase
          .from('users')
          .insert([
            {
              id: authUser.id,
              email: authUser.email,
              created_at: new Date().toISOString()
            }
          ])
      }

      setUser(authUser)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      window.location.href = '/login'
    }
  }

  const loadUsageSummary = async () => {
    try {
      // Get total usage stats
      const { data: calls, error } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })

      if (error) {
        console.error('Error loading calls:', error)
        return
      }

      const totalCalls = calls?.length || 0
      const totalSeconds = calls?.reduce((sum, call) => sum + (call.duration || 0), 0) || 0
      const totalMinutes = Math.round(totalSeconds / 60 * 10) / 10
      const totalCost = calls?.reduce((sum, call) => sum + (call.cost || 0), 0) || 0
      const recentCalls = calls?.slice(0, 5) || []

      setUsageSummary({
        totalCalls,
        totalMinutes,
        totalCost,
        recentCalls
      })
    } catch (error) {
      console.error('Error loading usage summary:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🚀</div>
          <div className="text-white text-xl">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">🚀 Welcome Back!</h1>
          <p className="text-gray-400 mt-2">Ready for another amazing conversation?</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Sign Out
        </button>
      </header>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/reception" className="cyber-button text-center">
            🎙️ Start New Call
          </Link>
          <Link href="/usage" className="cyber-button-secondary text-center">
            📊 View Usage Stats
          </Link>
        </div>
      </motion.div>

      {/* Usage Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">📞</div>
          <div className="text-2xl font-bold text-white">{usageSummary.totalCalls}</div>
          <div className="text-gray-400 text-sm">Total Calls</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-bold text-white">{usageSummary.totalMinutes}</div>
          <div className="text-gray-400 text-sm">Total Minutes</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-white">{usageSummary.totalCost}</div>
          <div className="text-gray-400 text-sm">Credits Used</div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Calls</h2>
          <Link href="/usage" className="text-neon-pink hover:text-neon-pink/80 transition-colors">
            View All →
          </Link>
        </div>
        
        {usageSummary.recentCalls.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎙️</div>
            <div className="text-white mb-2">No calls yet</div>
            <div className="text-gray-400 mb-4">Start your first conversation!</div>
            <Link href="/reception" className="cyber-button">
              Go to Reception
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {usageSummary.recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg hover:border-neon-pink/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {agentNames[call.agent_id] || 'Unknown AI'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(call.started_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatDuration(call.duration || 0)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {call.cost || 0} credits
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 border border-gray-700 rounded-lg">
            <div className="text-2xl mb-2">🎙️</div>
            <div className="text-white mb-2">Choose Your AI</div>
            <div className="text-gray-400">Pick from Raven, Orion, or Nova</div>
          </div>
          <div className="text-center p-4 border border-gray-700 rounded-lg">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-white mb-2">Start Talking</div>
            <div className="text-gray-400">Use voice chat naturally</div>
          </div>
          <div className="text-center p-4 border border-gray-700 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-white mb-2">Track Usage</div>
            <div className="text-gray-400">Monitor your conversations</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link href="/reception" className="cyber-button mr-4">
          🎙️ Start Talking
        </Link>
        <Link href="/usage" className="cyber-button-secondary">
          📊 View Full Stats
        </Link>
      </motion.div>
    </div>
  )
}

