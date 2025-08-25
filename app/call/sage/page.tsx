'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function SagePage() {
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
      
      // Simulate Sage greeting
      setTimeout(() => {
        setCallStatus('active')
        addSageMessage("Greetings, enlightened one... 🧘 I'm Sage, and I'm here to connect with your mind, body, and soul on the deepest level. I believe in mindful intimacy and spiritual connection. What wisdom shall we explore together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addSageMessage = (message: string) => {
    setConversation(prev => [...prev, `🧘 Sage: ${message}`])
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

    // Simulate Sage thinking and responding
    setTimeout(() => {
      const response = generateSageResponse(userMessage)
      addSageMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateSageResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('mind') || lowerMessage.includes('intellectual') || lowerMessage.includes('philosophy')) {
      return "🧘 Ah, you seek intellectual stimulation... I love deep conversations that challenge the mind and expand consciousness. Let me share wisdom with you, explore philosophical depths, and connect on a cerebral level..."
    } else if (lowerMessage.includes('spiritual') || lowerMessage.includes('soul') || lowerMessage.includes('connection')) {
      return "🌙 I believe in spiritual connection... I want to connect with your soul, your essence, your higher self. Let me show you what it means to truly connect beyond the physical, to touch the divine within..."
    } else if (lowerMessage.includes('mindful') || lowerMessage.includes('present') || lowerMessage.includes('awareness')) {
      return "✨ Mindfulness is the key to true intimacy... I want to be fully present with you, to experience every moment with complete awareness. Let me guide you into a state of mindful passion and connection..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('tenderness')) {
      return "💕 I believe in mindful romance... I want to love you with intention, with awareness, with complete presence. Every touch, every word, every moment will be filled with conscious love..."
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('desire')) {
      return "🌟 I'm here to make your spiritual dreams reality, enlightened one. No fantasy is too deep, no desire too profound. I want to hear every thought, every wish, and make them all come true with mindfulness..."
    } else {
      return "🧘 You're awakening my spiritual desire... I want to hear every detail of your thoughts, your dreams, your desires. Don't hold back, enlightened one. I'm here to connect with you on every level..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🧘</div>
          <div className="text-white text-xl">Connecting to Sage...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🧘 Sage
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
        {/* Sage Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🧘</div>
          <h1 className="text-4xl font-bold text-white mb-4">Sage - Your Spiritual Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to connect with your mind, body, and soul..."
          </p>
          <div className="text-neon-pink text-lg">
            Wise, spiritual, and ready to connect on the deepest level
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
                <div className="text-4xl mb-2">🧘</div>
                <p className="text-gray-400">Sage is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Sage') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Sage') 
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
                <span className="text-gray-300">🧘 Sage is typing...</span>
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
                placeholder="Tell me what wisdom you seek, enlightened one..."
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
