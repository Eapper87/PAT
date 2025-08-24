'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Call, Agent } from '@/lib/supabase'
import Link from 'next/link'

export default function HistoryPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkUserAndFetchHistory()
  }, [])

  const checkUserAndFetchHistory = async () => {
    try {
      // Check if user is authenticated
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        router.push('/login')
        return
      }

      setUser(authUser)

      // Fetch user's call history
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      if (callsError) {
        console.error('Error fetching calls:', callsError)
      } else {
        setCalls(callsData || [])
      }

      // Fetch agents for display
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')

      if (agentsError) {
        console.error('Error fetching agents:', agentsError)
      } else {
        setAgents(agentsData || [])
      }

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? agent.name : 'Unknown Agent'
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading your fantasy history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <div className="text-white">
          <span className="text-gray-400">Call History</span>
        </div>
      </header>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">Your Fantasy History</h1>
        <p className="text-xl text-gray-400">
          Relive your intimate AI conversations and track your fantasy journey
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-neon-pink">{calls.length}</div>
          <div className="text-gray-400 text-sm">Total Calls</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-neon-blue">
            {calls.reduce((total, call) => total + (call.duration || 0), 0)}
          </div>
          <div className="text-gray-400 text-sm">Total Minutes</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-neon-green">
            {calls.filter(call => call.status === 'completed').length}
          </div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-3xl font-bold text-neon-purple">
            {calls.filter(call => call.status === 'active').length}
          </div>
          <div className="text-gray-400 text-sm">Active</div>
        </div>
      </motion.div>

      {/* Call History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Recent Conversations</h2>
        
        {calls.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📞</div>
            <p className="text-gray-400 text-xl mb-4">No calls yet</p>
            <p className="text-gray-500 mb-6">Start your first fantasy conversation to see it here</p>
            <Link href="/dashboard" className="cyber-button">
              Start Your First Call
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {calls.map((call, index) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-neon-pink text-lg">💬</span>
                      <h3 className="text-lg font-semibold text-white">
                        {getAgentName(call.agent_id)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        call.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        call.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {call.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {formatDate(call.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="text-center">
                      <div className="text-neon-blue font-semibold">
                        {call.duration ? formatDuration(call.duration) : '0:00'}
                      </div>
                      <div className="text-gray-400 text-xs">Duration</div>
                    </div>
                    
                    <Link 
                      href={`/call/${call.id}`}
                      className="px-4 py-2 bg-neon-green text-dark-900 rounded-lg hover:bg-neon-green/80 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Back to Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-8"
      >
        <Link href="/dashboard" className="cyber-button">
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
