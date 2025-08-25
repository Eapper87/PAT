'use client'

import { useState, useEffect } from 'react'
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

export default function SimpleCallPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
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
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          {config.emoji} {config.name}
        </Link>
        <div className="text-white">
          <div className="text-right">
            <div className="text-sm text-gray-400">Status</div>
            <div className="font-bold text-neon-green">
              🟢 Ready to Chat
            </div>
          </div>
        </div>
      </header>

      {/* ElevenLabs Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Talk to {config.name}
        </h2>
        <div className="text-center">
          <div className={`w-full min-h-[600px] rounded-lg border ${config.color}/40 overflow-hidden`}>
            <elevenlabs-convai agent-id={config.agentId} />
            <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
          </div>
        </div>
      </motion.div>

      {/* Simple Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 mb-8 text-center"
      >
        <div className="text-neon-blue text-lg mb-2">
          🎙️ Natural Conversation
        </div>
        <div className="text-gray-400 text-sm space-y-1">
          <p>✅ Use the widget's built-in controls</p>
          <p>💬 Chat naturally with {config.name}</p>
          <p>🔄 No tracking, no limits, just talk</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Link href="/reception" className="cyber-button">
          Back to Reception
        </Link>
      </motion.div>
    </div>
  )
}
