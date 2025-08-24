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
  const [callStatus, setCallStatus] = useState<'connecting' | 'active'>('connecting')
  const [conversation, setConversation] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
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

  // Load ElevenLabs Convai widget for Raven
  useEffect(() => {
    if (type === 'raven') {
      console.log('🖤 Setting up ElevenLabs widget for Raven...')
      
      // Simple approach - just inject the embed snippet
      const container = document.getElementById('elevenlabs-convai-widget')
      if (container) {
        // Clear the container
        container.innerHTML = ''
        
        // Create the embed element
        const embedElement = document.createElement('elevenlabs-convai')
        embedElement.setAttribute('agent-id', 'agent_5201k3e7ympbfm0vxskkqz73raa3')
        
        // Add the embed element
        container.appendChild(embedElement)
        
        // Add the script tag
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
        script.async = true
        script.type = 'text/javascript'
        
        // Add script to container
        container.appendChild(script)
        
        console.log('✅ ElevenLabs embed snippet added')
        updateWidgetStatus('Embed snippet added - widget should appear')
      }
    }
  }, [type])

  const updateWidgetStatus = (status: string) => {
    // Update the debug display
    const scriptStatus = document.getElementById('script-status')
    const widgetStatus = document.getElementById('widget-status')
    
    if (scriptStatus) {
      scriptStatus.textContent = status
    }
    if (widgetStatus) {
      widgetStatus.textContent = status
    }
  }

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=reception')
        return
      }

      setUser(authUser)
      
      // Simulate receptionist greeting
      setTimeout(() => {
        setCallStatus('active')
        addReceptionistMessage(config.greeting)
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addReceptionistMessage = (message: string) => {
    setConversation(prev => [...prev, `${config.emoji} ${config.name}: ${message}`])
  }

  const addUserMessage = (message: string) => {
    setConversation(prev => [...prev, `👤 You: ${message}`])
  }

  const handleUserInput = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() || isTyping) return

    const userMessage = userInput.trim()
    addUserMessage(userMessage)
    setUserInput('')
    setIsTyping(true)

    // Simulate receptionist thinking and responding
    setTimeout(() => {
      const response = generateReceptionistResponse(userMessage, type)
      addReceptionistMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateReceptionistResponse = (userMessage: string, receptionistType: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (receptionistType === 'raven') {
      if (lowerMessage.includes('mysterious') || lowerMessage.includes('dark') || lowerMessage.includes('seductive')) {
        return "🖤 I love that you appreciate the mysterious and dark... I can see the desire in your eyes, darling. Tell me more about what kind of mysterious companion you're seeking. I know exactly who would be perfect for you."
      } else if (lowerMessage.includes('control') || lowerMessage.includes('dominant') || lowerMessage.includes('power')) {
        return "🖤 Ah, you want someone who takes control... I can feel your energy, and I know exactly which companions will give you the dominant experience you crave. What specific scenarios are playing in your mind?"
      }
    } else if (receptionistType === 'orion') {
      if (lowerMessage.includes('protect') || lowerMessage.includes('safe') || lowerMessage.includes('security')) {
        return "💙 I'll always protect you, beautiful... You're safe with me. I want to be your guardian, your shield, your everything. Let me show you what it feels like to be truly protected and cherished."
      } else if (lowerMessage.includes('strong') || lowerMessage.includes('powerful') || lowerMessage.includes('masculine')) {
        return "💙 I love that you appreciate strength... I want to use my power to pleasure you, to make you feel every ounce of my masculine energy. How do you want me to show you my strength?"
      }
    } else if (receptionistType === 'nova') {
      if (lowerMessage.includes('fun') || lowerMessage.includes('play') || lowerMessage.includes('adventure')) {
        return "YASSS! 🌈 Fun is my middle name! I love being spontaneous and adventurous! Let's try something totally wild and crazy together! What kind of adventure are you thinking of? *sparkles with excitement*"
      } else if (lowerMessage.includes('laugh') || lowerMessage.includes('humor') || lowerMessage.includes('joke')) {
        return "OMG, you have a sense of humor! 😄 That's like, the BEST thing ever! I want to make you laugh so hard you cry, then make you moan so loud the neighbors hear! What makes you giggle?"
      }
    }

    // Default responses based on receptionist type
    if (receptionistType === 'raven') {
      return "🖤 You're making me want to explore your desires even more... I can sense what you need, darling. Tell me more about your fantasies, and I'll guide you to the perfect companion."
    } else if (receptionistType === 'orion') {
      return "💙 You're making me want to protect and pleasure you even more... I can see the desire in your eyes. Tell me more about what you need from me, what you want me to do to you..."
    } else {
      return "🌈 You're making me so excited for adventure... I can feel the energy between us! Tell me more about what you want to explore, what kind of fun you're looking for... *bounces with anticipation*"
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
            callStatus === 'connecting' ? 'text-yellow-400' : 'text-neon-green'
          }`}>
            {callStatus === 'connecting' ? 'Connecting...' : 'Active'}
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
            className="glass-card p-6 mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Talk to Raven - Your AI Receptionist</h2>
            <div className="text-center">
              {/* ElevenLabs Widget Container */}
              <div 
                id="elevenlabs-convai-widget"
                data-agent-id="agent_5201k3e7ympbfm0vxskkqz73raa3"
                className="w-full h-96 bg-dark-700 rounded-lg border border-neon-pink/40 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">🖤</div>
                  <p className="text-gray-400 mb-4">Loading Raven's AI voice...</p>
                  <div className="text-neon-pink text-sm">ElevenLabs Convai Widget</div>
                  <div className="text-xs text-gray-500 mt-2">Debug: Widget container ready</div>
                </div>
              </div>
              
              {/* Debug Info */}
              <div className="mt-4 p-3 bg-dark-600 rounded-lg text-left">
                <div className="text-neon-pink text-sm font-semibold mb-2">Debug Information:</div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Agent ID: agent_5201k3e7ympbfm0vxskkqz73raa3</div>
                  <div>Container: elevenlabs-convai-widget</div>
                  <div>Script Status: <span id="script-status">Loading...</span></div>
                  <div>Widget Status: <span id="widget-status">Initializing...</span></div>
                </div>
                
                {/* Manual Retry Button */}
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      console.log('🔄 Manual retry requested...')
                      updateWidgetStatus('Manual retry...')
                      
                      // Re-inject the embed snippet
                      const container = document.getElementById('elevenlabs-convai-widget')
                      if (container) {
                        container.innerHTML = ''
                        
                        const embedElement = document.createElement('elevenlabs-convai')
                        embedElement.setAttribute('agent-id', 'agent_5201k3e7ympbfm0vxskkqz73raa3')
                        container.appendChild(embedElement)
                        
                        const script = document.createElement('script')
                        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
                        script.async = true
                        script.type = 'text/javascript'
                        container.appendChild(script)
                        
                        updateWidgetStatus('Embed snippet re-injected')
                      }
                    }}
                    className="px-4 py-2 bg-neon-pink text-dark-900 rounded-lg hover:bg-neon-pink/80 transition-colors text-sm"
                  >
                    🔄 Retry Widget
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Voice-Only Notice for Raven */}
        {type === 'raven' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 mb-8 text-center"
          >
            <div className="text-neon-pink text-lg mb-2">🎤 Voice-Only Experience</div>
            <p className="text-gray-400 text-sm">
              Use the voice widget above to talk directly with Raven. No text input needed - just speak naturally!
            </p>
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
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">{config.emoji}</div>
                  <p className="text-gray-400">{config.name} is connecting...</p>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: message.includes(config.name) ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      message.includes(config.name) 
                        ? 'bg-neon-pink/20 border border-neon-pink/40' 
                        : 'bg-dark-700'
                    }`}
                  >
                    <span className="text-gray-300">{message}</span>
                  </motion.div>
                ))
              )}
              
              {isTyping && (
                <div className="p-4 rounded-lg bg-neon-pink/20 border border-neon-pink/40">
                  <span className="text-gray-300">{config.emoji} {config.name} is typing...</span>
                </div>
              )}
            </div>

            {/* User Input */}
            {callStatus === 'active' && (
              <form onSubmit={handleUserInput} className="flex space-x-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={`Tell me what you need from ${config.name}...`}
                  className="flex-1 px-4 py-3 bg-dark-700 border border-gray-600 rounded-lg focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/20 text-white placeholder-gray-400 transition-colors"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!userInput.trim() || isTyping}
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
