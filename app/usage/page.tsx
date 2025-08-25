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
  tracking_method: string
  final_duration_source: string
}

interface UsageStats {
  totalCalls: number
  totalMinutes: number
  totalCost: number
  averageCallLength: number
  longestCall: number
  callsThisWeek: number
  callsThisMonth: number
}

const agentNames: Record<string, string> = {
  'agent_5201k3e7ympbfm0vxskkqz73raa3': 'Raven 🖤',
  'agent_8601k3eeze9aftrbtc7twm7xsfa4': 'Orion 💙',
  'agent_0401k3ef8wcvfpmvqvcas62ewkgf': 'Nova 🌈'
}

export default function UsagePage() {
  const [user, setUser] = useState<any>(null)
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [stats, setStats] = useState<UsageStats>({
    totalCalls: 0,
    totalMinutes: 0,
    totalCost: 0,
    averageCallLength: 0,
    longestCall: 0,
    callsThisWeek: 0,
    callsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadCallHistory()
    }
  }, [user, timeFilter])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        window.location.href = '/login?redirect=usage'
        return
      }

      setUser(authUser)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      window.location.href = '/login'
    }
  }

  const loadCallHistory = async () => {
    try {
      let query = supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })

      // Apply time filter
      if (timeFilter === 'week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        query = query.gte('started_at', weekAgo.toISOString())
      } else if (timeFilter === 'month') {
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        query = query.gte('started_at', monthAgo.toISOString())
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading calls:', error)
        return
      }

      setCalls(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error loading call history:', error)
    }
  }

  const calculateStats = (callData: CallRecord[]) => {
    const totalCalls = callData.length
    const totalSeconds = callData.reduce((sum, call) => sum + (call.duration || 0), 0)
    const totalMinutes = Math.round(totalSeconds / 60 * 10) / 10
    const totalCost = callData.reduce((sum, call) => sum + (call.cost || 0), 0)
    const averageCallLength = totalCalls > 0 ? Math.round(totalSeconds / totalCalls / 60 * 10) / 10 : 0
    const longestCall = Math.max(...callData.map(call => call.duration || 0), 0)

    // Calculate weekly and monthly counts
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const callsThisWeek = callData.filter(call => 
      new Date(call.started_at) >= weekAgo
    ).length

    const callsThisMonth = callData.filter(call => 
      new Date(call.started_at) >= monthAgo
    ).length

    setStats({
      totalCalls,
      totalMinutes,
      totalCost,
      averageCallLength,
      longestCall: Math.round(longestCall / 60 * 10) / 10,
      callsThisWeek,
      callsThisMonth
    })
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-neon-green'
      case 'active': return 'text-neon-blue'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'active': return '🟢'
      case 'failed': return '❌'
      default: return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">📊</div>
          <div className="text-white text-xl">Loading your usage data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-cyber font-bold neon-text">📊 Usage Dashboard</h1>
          <p className="text-gray-400 mt-2">Track your AI receptionist conversations</p>
        </div>
        <Link href="/dashboard" className="cyber-button">
          Back to Dashboard
        </Link>
      </header>

      {/* Time Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center justify-center gap-4">
          <span className="text-white text-sm">Time Period:</span>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeFilter === 'all' 
                ? 'bg-neon-pink/20 text-neon-pink' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeFilter === 'month' 
                ? 'bg-neon-pink/20 text-neon-pink' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              timeFilter === 'week' 
                ? 'bg-neon-pink/20 text-neon-pink' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            This Week
          </button>
        </div>
      </motion.div>

      {/* Enhanced Usage Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-8 text-center"
      >
        <div className="text-neon-blue text-lg mb-2">
          💰 Simple Billing Rules
        </div>
        <div className="text-gray-400 text-sm space-y-1">
          <p>✅ First 3 minutes of each call are FREE</p>
          <p>💳 Additional minutes cost $1 each</p>
          <p>📊 All usage tracked accurately</p>
          <p>🎯 Simple click-to-start, click-to-stop system</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">📞</div>
          <div className="text-2xl font-bold text-white">{stats.totalCalls}</div>
          <div className="text-gray-400 text-sm">Total Calls</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-bold text-white">{stats.totalMinutes}</div>
          <div className="text-gray-400 text-sm">Total Minutes</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-white">{stats.totalCost}</div>
          <div className="text-gray-400 text-sm">Credits Used</div>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-white">{stats.averageCallLength}</div>
          <div className="text-gray-400 text-sm">Avg Call (min)</div>
        </div>
      </motion.div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="glass-card p-6">
          <div className="text-lg font-semibold text-white mb-2">This Week</div>
          <div className="text-3xl font-bold text-neon-green">{stats.callsThisWeek}</div>
          <div className="text-gray-400 text-sm">calls made</div>
        </div>

        <div className="glass-card p-6">
          <div className="text-lg font-semibold text-white mb-2">This Month</div>
          <div className="text-3xl font-bold text-neon-blue">{stats.callsThisMonth}</div>
          <div className="text-gray-400 text-sm">calls made</div>
        </div>

        <div className="glass-card p-6">
          <div className="text-lg font-semibold text-white mb-2">Longest Call</div>
          <div className="text-3xl font-bold text-neon-pink">{stats.longestCall}</div>
          <div className="text-gray-400 text-sm">minutes</div>
        </div>
      </motion.div>

      {/* Call History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Call History</h2>
        
        {calls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎙️</div>
            <div className="text-xl text-white mb-2">No calls yet</div>
            <div className="text-gray-400 mb-6">Start a conversation with one of our AI receptionists!</div>
            <Link href="/reception" className="cyber-button">
              Go to Reception
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {calls.map((call) => (
              <div key={call.id} className="border border-gray-700 rounded-lg p-4 hover:border-neon-pink/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {agentNames[call.agent_id] || 'Unknown AI'}
                    </div>
                    <div className={`flex items-center gap-2 ${getStatusColor(call.status)}`}>
                      {getStatusIcon(call.status)} {call.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {formatDuration(call.duration || 0)}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {formatDate(call.started_at)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Cost: {call.cost || 0} credits</span>
                    <span>Method: {call.tracking_method || 'unknown'}</span>
                    <span>Source: {call.final_duration_source || 'unknown'}</span>
                  </div>
                  {call.ended_at && (
                    <span>Ended: {formatDate(call.ended_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <Link href="/reception" className="cyber-button mr-4">
          Start New Call
        </Link>
        <Link href="/dashboard" className="cyber-button-secondary">
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
