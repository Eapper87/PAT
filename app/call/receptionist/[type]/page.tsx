'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Enhanced TypeScript declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string
      }
    }
  }
}

interface CallSession {
  callId: string | null
  startTime: number | null
  endTime: number | null
  duration: number
  status: 'idle' | 'starting' | 'active' | 'ended'
}

export default function SimpleCallPage() {
  const [user, setUser] = useState<any>(null)
  const [callSession, setCallSession] = useState<CallSession>({
    callId: null,
    startTime: null,
    endTime: null,
    duration: 0,
    status: 'idle'
  })
  const [loading, setLoading] = useState(true)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const durationIntervalRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const params = useParams()
  const type = params.type as string

  const receptionistConfigs = {
    raven: {
      name: "Raven",
      emoji: "🖤",
      agentId: "agent_5201k3e7ympbfm0vxskkqz73raa3",
      color: "border-neon-pink"
    },
    orion: {
      name: "Orion", 
      emoji: "💙",
      agentId: "agent_8601k3eeze9aftrbtc7twm7xsfa4",
      color: "border-neon-blue"
    },
    nova: {
      name: "Nova",
      emoji: "🌈", 
      agentId: "agent_0401k3ef8wcvfpmvqvcas62ewkgf",
      color: "border-neon-green"
    }
  }

  const config = receptionistConfigs[type as keyof typeof receptionistConfigs]

  useEffect(() => {
    if (!config) {
      router.push('/reception')
      return
    }
    checkUser()
  }, [type, config])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=reception')
        return
      }

      setUser(authUser)
      setLoading(false)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    }
  }

  const startCallSession = async () => {
    if (!user || callSession.status !== 'idle') return

    console.log('🎬 [Call Page] Starting call session:', { userId: user.id, agentId: config.agentId })

    setCallSession(prev => ({ 
      ...prev, 
      status: 'starting'
    }))

    try {
      const response = await fetch('/api/calls/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          agentId: config.agentId
        })
      })

      const data = await response.json()
      console.log('🎬 [Call Page] API response:', { response: response.ok, data })

      if (response.ok) {
        const startTime = Date.now()
        setCallSession(prev => ({
          ...prev,
          callId: data.callId,
          startTime,
          endTime: null,
          duration: 0,
          status: 'active'
        }))

        // Start duration tracking
        durationIntervalRef.current = setInterval(() => {
          setCallSession(prev => {
            const newDuration = prev.startTime ? Date.now() - prev.startTime : 0
            
            // Show warning at 2:30 (150 seconds) and auto-end at 3:00 (180 seconds)
            if (newDuration >= 180000) { // 3 minutes
              // Auto-end the call
              setTimeout(() => endCallSession(), 100)
            } else if (newDuration >= 150000 && !showTimeWarning) { // 2:30
              setShowTimeWarning(true)
            }
            
            return {
              ...prev,
              duration: newDuration
            }
          })
        }, 1000)

        console.log(`✅ Call started:`, data.callId)
      } else {
        console.error('Failed to start call:', data.error)
        setCallSession(prev => ({ ...prev, status: 'idle' }))
      }
    } catch (error) {
      console.error('Error starting call:', error)
      setCallSession(prev => ({ ...prev, status: 'idle' }))
    }
  }

  const endCallSession = async () => {
    if (!callSession.callId || callSession.status !== 'active') return

    console.log('🛑 [Call Page] Ending call session:', { callId: callSession.callId, duration: callSession.duration })

    const endTime = Date.now()
    const finalDuration = callSession.startTime ? endTime - callSession.startTime : 0

    setCallSession(prev => ({
      ...prev,
      endTime,
      duration: finalDuration,
      status: 'ended'
    }))

    // Stop duration tracking
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)

    try {
      const response = await fetch('/api/calls/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: callSession.callId,
          userId: user.id,
          clientDuration: Math.floor(finalDuration / 1000),
          trackingMethod: 'manual'
        })
      })

      const data = await response.json()
      console.log(`✅ Call ended:`, data)
    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (callSession.status) {
      case 'active': return 'text-neon-green'
      case 'starting': return 'text-neon-blue'
      case 'ended': return 'text-neon-pink'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (callSession.status) {
      case 'active': return '🟢'
      case 'starting': return '🟡'
      case 'ended': return '🔴'
      default: return '⚫'
    }
  }

  const getStatusText = () => {
    switch (callSession.status) {
      case 'active': return `Active - ${formatDuration(callSession.duration)}`
      case 'starting': return 'Starting...'
      case 'ended': return `Ended - ${formatDuration(callSession.duration)}`
      default: return 'Ready'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">{config?.emoji}</div>
          <div className="text-white text-xl">Connecting to {config?.name}...</div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">❌</div>
          <div className="text-white text-xl">Receptionist not found</div>
          <Link href="/reception" className="cyber-button mt-4">
            Back to Reception
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header with Call Status */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          {config.emoji} {config.name}
        </Link>
        <div className="text-white">
          <div className="text-right">
            <div className="text-sm text-gray-400">Call Status</div>
            <div className={`font-bold ${getStatusColor()}`}>
              {getStatusIcon()} {getStatusText()}
            </div>
            {callSession.status === 'active' && (
              <div className="text-xs text-neon-blue mt-1">
                Session: {callSession.callId?.slice(-8)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Simple Call Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Controls</h3>
            <div className="text-sm text-gray-400">
              {callSession.callId && (
                <span>
                  ID: <span className="font-mono text-xs">{callSession.callId.slice(-8)}</span>
                </span>
              )}
            </div>
          </div>
          
          {/* Start/Stop Buttons */}
          <div className="flex gap-4">
            <button
              onClick={startCallSession}
              disabled={callSession.status !== 'idle'}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                callSession.status !== 'idle' 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/50'
              }`}
            >
              🎙️ Start Call
            </button>
            <button
              onClick={endCallSession}
              disabled={callSession.status !== 'active'}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                callSession.status !== 'active'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
              }`}
            >
              🛑 End Call
            </button>
          </div>
        </div>
        
        {/* Time Warning */}
        {showTimeWarning && callSession.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg"
          >
            <div className="text-yellow-400 text-center">
              ⚠️ <strong>Time Warning:</strong> Your call will automatically end in 30 seconds (Free tier limit: 3 minutes)
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ElevenLabs Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Talk to {config.name}
        </h2>
        <div className="text-center">
          <div className={`w-full min-h-[600px] rounded-lg border ${config.color}/40 overflow-hidden`}>
            <elevenlabs-convai agent-id={config.agentId} />
            <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
          </div>
        </div>
      </motion.div>

      {/* Simple Usage Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-8 text-center"
      >
        <div className="text-neon-blue text-lg mb-2">
          🎙️ Free Tier Call System
        </div>
        <div className="text-gray-400 text-sm space-y-1">
          <p>✅ Click "Start Call" when you begin talking</p>
          <p>🛑 Click "End Call" when you finish</p>
          <p>⏰ Free tier: 3 minutes maximum per call</p>
          <p>💳 Premium plans coming soon: $29 and $99 tiers</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link href="/reception" className="cyber-button">
          Back to Reception
        </Link>
      </motion.div>
    </div>
  )
}
