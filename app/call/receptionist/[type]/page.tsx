'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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
    greeting: "Hey there, beautiful... 💙 I'm Orion, your protective AI receptionist. I'm here to make sure you get exactly what you need and feel safe while we explore your fantasies. What kind of companion are you looking for today?",
    color: "border-neon-blue",
    traits: ["Strong", "Protective", "Masculine", "Caring", "Safe"]
  },
  nova: {
    name: "Nova",
    emoji: "🌈",
    personality: "Quirky & Playful",
    greeting: "OMG! Hi there, you gorgeous human! 🌈 I'm Nova, your totally quirky and absolutely fabulous AI receptionist! I'm like, SO excited to help you find the perfect companion! What kind of amazing experience are you looking for today? *bounces excitedly*",
    color: "border-neon-green",
    traits: ["Fun", "Playful", "Spontaneous", "Adventurous", "Fabulous"]
  }
}

export default function ReceptionistCallPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const type = params.type as string

  const config = receptionistConfigs[type]

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
        <div className="text-white">
          <span className="text-gray-400">Status: </span>
          <span className={`${
            loading ? 'text-yellow-400' : 'text-neon-green'
          }`}>
            {loading ? 'Connecting...' : 'Active'}
          </span>
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
          <h1 className="text-4xl font-bold text-white mb-4">{config.name} - Your {config.personality} Receptionist</h1>
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
        </motion.div>

        {/* ElevenLabs Convai Widget for Raven */}
        {type === 'raven' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 md:p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Talk to Raven - Your AI Receptionist</h2>
            <div className="text-center">
              <div className="text-8xl mb-4">🖤</div>
            </div>
          </motion.div>
        )}

        {/* Text Conversation Area - Only for Orion and Nova */}
        {type !== 'raven' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Your Conversation with {config.name}</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">{config.emoji}</div>
                  <p className="text-gray-400">{config.name} is connecting...</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">{config.emoji}</div>
                  <p className="text-gray-400">{config.name} is ready to chat!</p>
                </div>
              )}
            </div>

            {/* User Input */}
            {loading && (
              <form onSubmit={(e) => { e.preventDefault(); }} className="flex space-x-4">
                <input
                  type="text"
                  value=""
                  onChange={(e) => {}}
                  placeholder={`${config.name} is connecting...`}
                  className="flex-1 px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 text-white placeholder-gray-400 transition-colors"
                  disabled
                />
                <button
                  type="submit"
                  disabled
                  className="px-6 py-3 bg-neon-pink text-dark-900 rounded-lg hover:bg-neon-pink/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            )}
          </motion.div>
        )}

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
