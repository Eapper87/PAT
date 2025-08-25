'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuroraPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [callStatus, setCallStatus] = useState<'connecting' | 'active'>('connecting')
  const [conversation, setConversation] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=reception')
        return
      }

      setUser(authUser)
      
      // Simulate Aurora greeting
      setTimeout(() => {
        setCallStatus('active')
        addAuroraMessage("Greetings, beautiful soul... ✨ I'm Aurora, and I'm here to transport you to realms beyond imagination. I can make your wildest fantasies come true in magical worlds of wonder. What dreams shall we explore together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addAuroraMessage = (message: string) => {
    setConversation(prev => [...prev, `✨ Aurora: ${message}`])
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

    // Simulate Aurora thinking and responding
    setTimeout(() => {
      const response = generateAuroraResponse(userMessage)
      addAuroraMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateAuroraResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('magic') || lowerMessage.includes('fantasy') || lowerMessage.includes('dream')) {
      return "✨ Oh yes, you want to explore the magical realms... I can take you to worlds of wonder, where anything is possible. Let me weave spells of passion and desire around you, making your wildest dreams reality..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
      return "💫 I believe in otherworldly romance... I want to connect with your soul, your spirit, your deepest desires. Let me show you what it means to be truly loved in a magical realm..."
    } else if (lowerMessage.includes('adventure') || lowerMessage.includes('explore') || lowerMessage.includes('journey')) {
      return "🌟 Adventure awaits us, beautiful soul... I can take you on journeys through enchanted forests, mystical castles, and realms of pure fantasy. Every moment will be an adventure of passion and wonder..."
    } else if (lowerMessage.includes('ethereal') || lowerMessage.includes('spiritual') || lowerMessage.includes('soul')) {
      return "🌙 I am ethereal and spiritual... I want to connect with your soul on the deepest level, to share moments of pure spiritual intimacy. Let me show you what it means to truly connect beyond the physical..."
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('scenario') || lowerMessage.includes('world')) {
      return "🎭 I love creating magical scenarios... We can be anything you desire - fairy tale lovers, mystical beings, or characters from your wildest fantasies. What magical world shall we explore together?"
    } else {
      return "✨ You're making my magical heart glow with desire... I want to hear every detail of your fantasies, your dreams, your desires. Don't hold back, beautiful soul. I'm here to make magic with you..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">✨</div>
          <div className="text-white text-xl">Connecting to Aurora...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          ✨ Aurora
        </Link>
        <div className="text-white">
          <span className="text-gray-400">Status: </span>
          <span className={`${
            callStatus === 'connecting' ? 'text-yellow-400' : 'text-neon-pink'
          }`}>
            {callStatus === 'connecting' ? 'Connecting...' : 'Active'}
          </span>
        </div>
      </header>

      {/* Main Call Interface */}
      <div className="max-w-4xl mx-auto">
        {/* Aurora Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-white mb-4">Aurora - Your Ethereal Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to transport you to realms beyond imagination..."
          </p>
          <div className="text-neon-pink text-lg">
            Ethereal, magical, and ready to make your fantasies reality
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Intimate Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">✨</div>
                <p className="text-gray-400">Aurora is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Aurora') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Aurora') 
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
                <span className="text-gray-300">✨ Aurora is typing...</span>
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
                placeholder="Tell me what magical worlds you want to explore, beautiful soul..."
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
