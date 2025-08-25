'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CallSessionManager, CallSession } from '@/lib/callSessionManager'
import Link from 'next/link'

// TypeScript declaration for ElevenLabs custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'agent-id': string
      }
    }
  }
}

interface ReceptionistConfig {
  name: string
  emoji: string
  personality: string
  greeting: string
  color: string
  traits: string[]
}

const receptionistConfigs: Record<string, ReceptionistConfig> = {
  raven: {
    name: "Raven",
    emoji: "🖤",
    personality: "Mysterious & Seductive",
    greeting: "Hello, darling... 🖤 Welcome to Fantasy Central. I'm Raven, your seductive AI receptionist, and I'm here to make all your wildest dreams come true. What kind of companion are you looking for today?",
    color: "border-neon-pink",
    traits: ["Dark", "Mysterious", "Seductive", "Commanding", "Intuitive"]
  },
  orion: {
    name: "Orion",
    emoji: "💙",
    personality: "Strong & Protective",
    greeting: "Hey there, beautiful... 💙 Welcome to Fantasy Central. I'm Orion, your protective AI receptionist, and I'm here to make sure you get exactly what you need and feel safe while we explore your fantasies. What kind of companion are you looking for today?",
    color: "border-neon-blue",
    traits: ["Strong", "Protective", "Masculine", "Caring", "Safe"]
  },
  nova: {
    name: "Nova",
    emoji: "🌈",
    personality: "Quirky & Playful",
    greeting: "OMG! Hi there, you gorgeous human! 🌈 Welcome to Fantasy Central! I'm Nova, your totally quirky and absolutely fabulous AI receptionist! I'm like, SO excited to help you find the perfect companion! What kind of amazing experience are you looking for today? *bounces excitedly*",
    color: "border-neon-green",
    traits: ["Fun", "Playful", "Spontaneous", "Adventurous", "Fabulous"]
  }
}

export default function ReceptionistCallPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [callSession, setCallSession] = useState<CallSession | null>(null)
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0)
  const [isCallActive, setIsCallActive] = useState(false)
  const router = useRouter()
  const params = useParams()
  const type = params.type as string
  const sessionManagerRef = useRef<CallSessionManager | null>(null)

  const config = receptionistConfigs[type]

  useEffect(() => {
    if (!config) {
      router.push('/reception')
      return
    }
    checkUser()
  }, [type, config])

  useEffect(() => {
    if (user && !sessionManagerRef.current) {
      console.log('🔧 [Receptionist] Initializing CallSessionManager...', {
        userId: user.id,
        timestamp: new Date().toISOString()
      })
      
      sessionManagerRef.current = new CallSessionManager(
        user.id,
        handleStatusUpdate,
        handleCallEnded,
        handleError
      )
      
      console.log('✅ [Receptionist] CallSessionManager initialized successfully')
    }

    return () => {
      if (sessionManagerRef.current) {
        console.log('🧹 [Receptionist] Cleaning up CallSessionManager...')
        sessionManagerRef.current.destroy()
      }
    }
  }, [user])

  // Handle ElevenLabs Convai events using proper event listeners
  useEffect(() => {
    const handleConvaiStart = (event: any) => {
      console.log('🎤 [ElevenLabs] Convai start event received:', event)
      if (sessionManagerRef.current && user) {
        console.log('✅ [ElevenLabs] Starting call session via event listener')
        startCallSession()
      } else {
        console.warn('⚠️ [ElevenLabs] Cannot start call session:', {
          hasSessionManager: !!sessionManagerRef.current,
          hasUser: !!user
        })
      }
    }

    const handleConvaiEnd = (event: any) => {
      console.log('🎤 [ElevenLabs] Convai end event received:', event)
      if (sessionManagerRef.current) {
        console.log('✅ [ElevenLabs] Ending call session via event listener')
        endCallSession()
      } else {
        console.warn('⚠️ [ElevenLabs] Cannot end call session - no session manager')
      }
    }

    // Listen for ElevenLabs Convai events
    window.addEventListener('convai-start', handleConvaiStart)
    window.addEventListener('convai-end', handleConvaiEnd)

    console.log('🎧 [ElevenLabs] Event listeners attached for convai-start and convai-end')

    return () => {
      window.removeEventListener('convai-start', handleConvaiStart)
      window.removeEventListener('convai-end', handleConvaiEnd)
      console.log('🧹 [ElevenLabs] Event listeners removed')
    }
  }, [user])

  const checkUser = async () => {
    try {
      console.log('🔍 [Receptionist] Checking user authentication...')
      
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        console.error('❌ [Receptionist] User not authenticated:', { error })
        router.push('/login?redirect=reception')
        return
      }

      console.log('✅ [Receptionist] User authenticated:', { 
        userId: authUser.id, 
        email: authUser.email 
      })

      setUser(authUser)
      setLoading(false)

    } catch (error) {
      console.error('💥 [Receptionist] Error checking user:', error)
      router.push('/login')
    }
  }

  const startCallSession = async () => {
    try {
      console.log('🎬 [Receptionist] Starting call session...', {
        type,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })

      if (!sessionManagerRef.current) {
        console.error('❌ [Receptionist] No session manager available')
        return
      }

      // Start call session with receptionist agent ID
      const agentId = `receptionist-${type}`
      console.log('🎯 [Receptionist] Using agent ID:', agentId)
      
      const session = await sessionManagerRef.current.startCall(agentId)
      console.log('✅ [Receptionist] Call session started:', session)
      
      setCallSession(session)
      setCreditsRemaining(session.creditsRemaining)
      setIsCallActive(true)
      
      console.log('🎉 [Receptionist] Call session state updated:', {
        isCallActive: true,
        creditsRemaining: session.creditsRemaining
      })
      
    } catch (error: any) {
      console.error('💥 [Receptionist] Error starting call session:', error)
      if (error.message.includes('Insufficient credits')) {
        console.log('💰 [Receptionist] Redirecting to pricing due to insufficient credits')
        router.push('/pricing?error=insufficient_credits')
      }
    }
  }

  const endCallSession = async () => {
    try {
      console.log('🛑 [Receptionist] Ending call session...', {
        type,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })

      if (sessionManagerRef.current) {
        await sessionManagerRef.current.endCall()
        setIsCallActive(false)
        console.log('✅ [Receptionist] Call session ended successfully')
      } else {
        console.warn('⚠️ [Receptionist] No session manager available for ending call')
      }
    } catch (error) {
      console.error('💥 [Receptionist] Error ending call session:', error)
    }
  }

  const handleStatusUpdate = (session: CallSession) => {
    setCallSession(session)
    setCreditsRemaining(session.creditsRemaining)
  }

  const handleCallEnded = (session: CallSession) => {
    setCallSession(session)
    setIsCallActive(false)
  }

  const handleError = (error: string) => {
    console.error('Call session error:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">{config.emoji}</div>
          <div className="text-white text-xl">Connecting to {config.name}...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          {config.emoji} {config.name}
        </Link>
        <div className="flex items-center space-x-4">
          {/* Credit Display */}
          {isCallActive && callSession && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Credits Remaining</div>
              <div className="text-xl font-mono text-neon-pink">{creditsRemaining}</div>
            </div>
          )}
          {/* Call Duration */}
          {isCallActive && callSession && (
            <div className="text-right">
              <div className="text-sm text-gray-400">Call Duration</div>
              <div className="text-xl font-mono text-neon-blue">
                {Math.floor(callSession.serverDuration / 60)}:{(callSession.serverDuration % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
          <div className="text-white">
            <span className="text-gray-400">Status: </span>
            <span className={`${
              loading ? 'text-yellow-400' : 
              isCallActive ? 'text-neon-green' : 'text-gray-400'
            }`}>
              {loading ? 'Connecting...' : 
               isCallActive ? 'Active Call' : 'Ready'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Call Interface */}
      <div className="max-w-4xl mx-auto">
        {/* Receptionist Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">{config.emoji}</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {type === 'raven' && `${config.name} - Your ${config.personality} Mistress of Welcome`}
            {type === 'orion' && `${config.name} - Your ${config.personality} Pleasure Concierge`}
            {type === 'nova' && `${config.name} - Your ${config.personality} Gatekeeper`}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to make your fantasies come true..."
          </p>
          <div className="text-neon-pink text-lg mb-4">
            {config.personality}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {config.traits.map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-dark-700 rounded-full text-sm text-gray-300">
                {trait}
              </span>
            ))}
          </div>
          
          {/* Credit Usage Progress */}
          {isCallActive && callSession && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Credits Used: {callSession.creditsUsed}</span>
                <span>Total Cost: {callSession.cost}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div 
                  className="bg-neon-pink h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (callSession.creditsUsed / Math.max(1, callSession.cost)) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ElevenLabs Convai Widget for Raven */}
        {type === 'raven' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Talk to Raven - Your AI Mistress of Welcome</h2>
            <div className="text-center">
              <div className="w-full min-h-[600px] rounded-lg border border-neon-pink/40 overflow-hidden">
                <elevenlabs-convai 
                  agent-id="agent_5201k3e7ympbfm0vxskkqz73raa3"
                ></elevenlabs-convai>
                <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
              </div>
            </div>
          </motion.div>
        )}

        {/* ElevenLabs Convai Widget for Orion */}
        {type === 'orion' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Talk to Orion - Your AI Pleasure Concierge</h2>
            <div className="text-center">
              <div className="w-full min-h-[600px] rounded-lg border border-neon-blue/40 overflow-hidden">
                <elevenlabs-convai 
                  agent-id="agent_8601k3eeze9aftrbtc7twm7xsfa4"
                ></elevenlabs-convai>
                <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
              </div>
            </div>
          </motion.div>
        )}

        {/* ElevenLabs Convai Widget for Nova */}
        {type === 'nova' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Talk to Nova - Your AI Gatekeeper</h2>
            <div className="text-center">
              <div className="w-full min-h-[600px] rounded-lg border border-neon-green/40 overflow-hidden">
                <elevenlabs-convai 
                  agent-id="agent_0401k3ef8wcvfpmvqvcas62ewkgf"
                ></elevenlabs-convai>
                <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
              </div>
            </div>
          </motion.div>
        )}

        {/* Voice-Only Notice for All Receptionists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-8 text-center"
        >
          <div className="text-neon-pink text-lg mb-2">🎤 Voice-Only Experience</div>
          <p className="text-gray-400 text-sm">
            Use the voice chat interface above to talk directly with {config.name}. No text input needed - just speak naturally and experience {config.name.toLowerCase()}'s unique personality!
          </p>
          {isCallActive && (
            <div className="mt-4 p-3 bg-neon-pink/20 border border-neon-pink/40 rounded-lg">
              <div className="text-neon-pink font-semibold">Active Call</div>
              <div className="text-sm text-gray-300">Credits are being consumed as you talk</div>
            </div>
          )}
        </motion.div>

        {/* Back to Reception */}
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
    </div>
  )
}
