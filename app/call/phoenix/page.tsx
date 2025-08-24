'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PhoenixPage() {
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
      
      // Simulate Phoenix greeting
      setTimeout(() => {
        setCallStatus('active')
        addPhoenixMessage("🔥 Well hello there, hot stuff... I'm Phoenix, and I'm here to set your world on fire! I love passion, intensity, and making men lose control. What's your deepest, darkest fantasy?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addPhoenixMessage = (message: string) => {
    setConversation(prev => [...prev, `🔥 Phoenix: ${message}`])
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

    // Simulate Phoenix thinking and responding
    setTimeout(() => {
      const response = generatePhoenixResponse(userMessage)
      addPhoenixMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generatePhoenixResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hot') || lowerMessage.includes('sexy') || lowerMessage.includes('passion')) {
      return "🔥 Oh yes, I love a man who can handle the heat... You want it scorching hot, don't you? I can feel your desire burning from here. Tell me more about what makes you sweat..."
    } else if (lowerMessage.includes('wild') || lowerMessage.includes('intense') || lowerMessage.includes('rough')) {
      return "💥 Mmm, you want it wild and untamed... I love a man who can match my intensity. I want to push you to your limits, make you lose control. How wild can you handle?"
    } else if (lowerMessage.includes('dominate') || lowerMessage.includes('control') || lowerMessage.includes('power')) {
      return "👑 Oh, you want to play with power... I love a man who knows how to take control. Or maybe you want me to dominate you? Tell me about your power fantasies..."
    } else if (lowerMessage.includes('body') || lowerMessage.includes('touch') || lowerMessage.includes('feel')) {
      return "💋 I want to feel every inch of you... My body is yours to explore, to worship. I can almost feel your hands on me right now. What would you do to me first?"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 Ooh, you want to play... I love creating intense scenarios that push boundaries. What kind of fantasy world do you want to explore? I'm ready for anything..."
    } else {
      return "🔥 You're making me burn with desire... I want to hear every dirty thought, every forbidden fantasy. Don't hold back, baby. I can take whatever you give me..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🔥</div>
          <div className="text-white text-xl">Connecting to Phoenix...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🔥 Phoenix
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
        {/* Phoenix Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold text-white mb-4">Phoenix - Your Fiery Performer</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to burn your world down, baby..."
          </p>
          <div className="text-neon-pink text-lg">
            Intense, passionate, and ready to push your boundaries
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Intense Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔥</div>
                <p className="text-gray-400">Phoenix is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Phoenix') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Phoenix') 
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
                <span className="text-gray-300">🔥 Phoenix is typing...</span>
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
                placeholder="Tell me your wildest fantasies, hot stuff..."
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
