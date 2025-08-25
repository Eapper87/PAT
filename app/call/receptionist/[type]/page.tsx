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
  status: 'idle' | 'starting' | 'active' | 'ended' | 'webhook_pending'
  trackingMethod: 'manual' | 'auto' | 'webhook'
}

export default function EnhancedCallPage() {
  const [user, setUser] = useState<any>(null)
  const [callSession, setCallSession] = useState<CallSession>({
    callId: null,
    startTime: null,
    endTime: null,
    duration: 0,
    status: 'idle',
    trackingMethod: 'auto'
  })
  const [loading, setLoading] = useState(true)
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>()
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

  useEffect(() => {
    if (!user) return

    // Listen for ElevenLabs widget events
    const handleConversationStart = (event: any) => {
      console.log('🎙️ ElevenLabs conversation started:', event)
      if (callSession.status === 'idle') {
        startCallSession('auto')
      }
    }

    const handleConversationEnd = (event: any) => {
      console.log('🔚 ElevenLabs conversation ended:', event)
      if (callSession.status === 'active') {
        endCallSession('auto')
      }
    }

    // Try multiple potential event names (check ElevenLabs docs for exact names)
    const possibleStartEvents = [
      'elevenlabs-conversation-start',
      'elevenlabs-convai-start', 
      'convai-start',
      'conversation-started'
    ]
    
    const possibleEndEvents = [
      'elevenlabs-conversation-end',
      'elevenlabs-convai-end',
      'convai-end', 
      'conversation-ended'
    ]

    // Add event listeners for all possible event names
    possibleStartEvents.forEach(eventName => {
      document.addEventListener(eventName, handleConversationStart)
    })

    possibleEndEvents.forEach(eventName => {
      document.addEventListener(eventName, handleConversationEnd)
    })

    // Also listen for postMessage events from iframe
    const handleMessage = (event: MessageEvent) => {
      const data = event.data
      if (data && typeof data === 'object') {
        if (data.type === 'conversation-start' || data.event === 'start') {
          handleConversationStart(data)
        } else if (data.type === 'conversation-end' || data.event === 'end') {
          handleConversationEnd(data)
        }
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      // Cleanup listeners
      possibleStartEvents.forEach(eventName => {
        document.removeEventListener(eventName, handleConversationStart)
      })
      possibleEndEvents.forEach(eventName => {
        document.removeEventListener(eventName, handleConversationEnd)
      })
      window.removeEventListener('message', handleMessage)

      // Cleanup intervals
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
    }
  }, [user, callSession.status])

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

  const startCallSession = async (method: 'manual' | 'auto' = 'manual') => {
    if (!user || (callSession.status !== 'idle' && method === 'auto')) return

    setCallSession(prev => ({ 
      ...prev, 
      status: 'starting',
      trackingMethod: method
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
          setCallSession(prev => ({
            ...prev,
            duration: prev.startTime ? Date.now() - prev.startTime : 0
          }))
        }, 1000)

        // Start heartbeat
        startHeartbeat(data.callId)

        console.log(`✅ Call started via ${method} method:`, data.callId)
      } else {
        console.error('Failed to start call:', data.error)
        setCallSession(prev => ({ ...prev, status: 'idle' }))
      }
    } catch (error) {
      console.error('Error starting call:', error)
      setCallSession(prev => ({ ...prev, status: 'idle' }))
    }
  }

  const endCallSession = async (method: 'manual' | 'auto' = 'manual') => {
    if (!callSession.callId || callSession.status !== 'active') return

    const endTime = Date.now()
    const finalDuration = callSession.startTime ? endTime - callSession.startTime : 0

    setCallSession(prev => ({
      ...prev,
      endTime,
      duration: finalDuration,
      status: method === 'auto' ? 'webhook_pending' : 'ended'
    }))

    // Stop intervals
    if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)

    try {
      const response = await fetch('/api/calls/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callId: callSession.callId,
          userId: user.id,
          clientDuration: Math.floor(finalDuration / 1000),
          trackingMethod: method
        })
      })

      const data = await response.json()
      console.log(`✅ Call ended via ${method} method:`, data)

      if (method === 'auto') {
        // Wait for webhook to finalize the session
        setTimeout(() => {
          setCallSession(prev => ({ ...prev, status: 'ended' }))
        }, 5000) // Give webhook 5 seconds to arrive
      }
    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  const startHeartbeat = (callId: string) => {
    heartbeatIntervalRef.current = setInterval(async () => {
      if (!user) return

      try {
        const response = await fetch('/api/calls/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callId, userId: user.id })
        })

        const data = await response.json()
        
        if (!response.ok && data.callEnded) {
          endCallSession('auto')
          alert('Call ended: ' + data.error)
        }
      } catch (error) {
        console.error('Heartbeat error:', error)
      }
    }, 30000)
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
      case 'webhook_pending': return 'text-neon-purple'
      case 'ended': return 'text-neon-pink'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = () => {
    switch (callSession.status) {
      case 'active': return '🟢'
      case 'starting': return '🟡'
      case 'webhook_pending': return '🟣'
      case 'ended': return '🔴'
      default: return '⚫'
    }
  }

  const getStatusText = () => {
    switch (callSession.status) {
      case 'active': return `Active (${callSession.trackingMethod}) - ${formatDuration(callSession.duration)}`
      case 'starting': return 'Starting...'
      case 'webhook_pending': return 'Processing...'
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
      {/* Header with Enhanced Call Status */}
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
            {callSession.trackingMethod === 'auto' && callSession.status === 'active' && (
              <div className="text-xs text-neon-green">Auto-tracking enabled</div>
            )}
            {callSession.status === 'active' && (
              <div className="text-xs text-neon-blue mt-1">
                Session: {callSession.callId?.slice(-8)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Status Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Session Status</h3>
            <div className="text-sm text-gray-400">
              Tracking: <span className="text-neon-blue capitalize">{callSession.trackingMethod}</span>
              {callSession.callId && (
                <span className="ml-4">
                  ID: <span className="font-mono text-xs">{callSession.callId.slice(-8)}</span>
                </span>
              )}
            </div>
          </div>
          
          {/* Manual Override Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => startCallSession('manual')}
              disabled={callSession.status !== 'idle'}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                callSession.status !== 'idle' 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
              }`}
            >
              Manual Start
            </button>
            <button
              onClick={() => endCallSession('manual')}
              disabled={callSession.status !== 'active'}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                callSession.status !== 'active'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              Manual End
            </button>
          </div>
        </div>
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

      {/* Enhanced Usage Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 mb-8 text-center"
      >
        <div className="text-neon-blue text-lg mb-2">
          🎙️ Auto-Tracking Enabled
        </div>
        <div className="text-gray-400 text-sm space-y-1">
          <p>✅ Conversation automatically starts/stops tracking</p>
          <p>🔄 Real-time sync with ElevenLabs</p>
          <p>💰 Accurate billing based on actual usage</p>
          <p>🛡️ Manual controls available as backup</p>
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
