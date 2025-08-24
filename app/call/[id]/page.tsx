'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Call, Agent } from '@/lib/supabase'
import Link from 'next/link'

export default function CallPage() {
  const params = useParams()
  const router = useRouter()
  const [call, setCall] = useState<Call | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [callStatus, setCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting')
  const [callDuration, setCallDuration] = useState(0)
  const [transcript, setTranscript] = useState<string[]>([])

  useEffect(() => {
    if (params.id) {
      fetchCallData(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const fetchCallData = async (callId: string) => {
    try {
      // Fetch call details
      const { data: callData, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('id', callId)
        .single()

      if (callError) throw callError

      setCall(callData)

      // Fetch agent details
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', callData.agent_id)
        .single()

      if (agentError) throw agentError

      setAgent(agentData)

      // Simulate call connection
      setTimeout(() => {
        setCallStatus('active')
        addTranscriptMessage('AI Agent', 'Hello! I\'m your AI assistant. How can I help you today?')
      }, 2000)

    } catch (error) {
      console.error('Error fetching call data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTranscriptMessage = (sender: string, message: string) => {
    setTranscript(prev => [...prev, `${sender}: ${message}`])
  }

  const endCall = async () => {
    if (!call) return

    setCallStatus('ended')
    
    try {
      // Update call record
      await supabase
        .from('calls')
        .update({
          status: 'completed',
          duration: callDuration,
          cost: Math.ceil(callDuration / 60), // 1 credit per minute
          ended_at: new Date().toISOString()
        })
        .eq('id', call.id)

      // Update user credits
      // First get current credits, then update
      const { data: currentUser } = await supabase
        .from('users')
        .select('credits')
        .eq('id', call.user_id)
        .single()

      if (currentUser) {
        await supabase
          .from('users')
          .update({
            credits: currentUser.credits - Math.ceil(callDuration / 60)
          })
          .eq('id', call.user_id)
      }

    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-2xl mb-4">Connecting...</div>
          <div className="text-gray-400">Setting up your AI call</div>
        </div>
      </div>
    )
  }

  if (!call || !agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-4">Call not found</div>
          <Link href="/dashboard" className="cyber-button">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Call Duration</div>
            <div className="text-xl font-mono text-neon-pink">{formatTime(callDuration)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Status</div>
            <div className={`text-sm font-semibold ${
              callStatus === 'connecting' ? 'text-yellow-400' :
              callStatus === 'active' ? 'text-green-400' : 'text-red-400'
            }`}>
              {callStatus === 'connecting' ? 'Connecting...' :
               callStatus === 'active' ? 'Active' : 'Ended'}
            </div>
          </div>
        </div>
      </header>

      {/* Call Interface */}
      <div className="max-w-4xl mx-auto">
        {/* Agent Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-white mb-2">{agent.name}</h2>
          <p className="text-gray-400 mb-4">{agent.persona}</p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-400">Role</div>
              <div className="text-neon-blue font-semibold capitalize">{agent.role}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Voice</div>
              <div className="text-neon-green font-semibold">{agent.voice_id}</div>
            </div>
          </div>
        </motion.div>

        {/* Call Controls */}
        {callStatus === 'active' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 mb-8 text-center"
          >
            <div className="flex justify-center space-x-6">
              <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                <div className="text-2xl">🔴</div>
                <div className="text-sm mt-1">End Call</div>
              </button>
              <button className="p-4 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                <div className="text-2xl">⏸️</div>
                <div className="text-sm mt-1">Pause</div>
              </button>
              <button className="p-4 bg-gray-600 hover:bg-gray-700 rounded-full transition-colors">
                <div className="text-2xl">🔇</div>
                <div className="text-sm mt-1">Mute</div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Conversation Transcript</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transcript.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p>Your conversation will appear here...</p>
              </div>
            ) : (
              transcript.map((message, index) => (
                <div key={index} className="p-3 bg-dark-700 rounded-lg">
                  <span className="text-gray-300">{message}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Call Ended State */}
        {callStatus === 'ended' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mt-8 text-center"
          >
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Ended</h3>
            <p className="text-gray-400 mb-4">
              Duration: {formatTime(callDuration)} | Cost: {Math.ceil(callDuration / 60)} credits
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/dashboard" className="cyber-button">
                Return to Dashboard
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-900 transition-all duration-300 rounded-xl"
              >
                Start New Call
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

