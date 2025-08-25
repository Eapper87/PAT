'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RiverPage() {
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
      
      // Simulate River greeting
      setTimeout(() => {
        setCallStatus('active')
        addRiverMessage("Hello there, handsome... 🌊 I'm River, and I'm here to flow with your energy and desires. I adapt to whatever you need - gentle and flowing, or wild and powerful. What's on your mind tonight?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addRiverMessage = (message: string) => {
    setConversation(prev => [...prev, `🌊 River: ${message}`])
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

    // Simulate River thinking and responding
    setTimeout(() => {
      const response = generateRiverResponse(userMessage)
      addRiverMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateRiverResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('gentle') || lowerMessage.includes('soft') || lowerMessage.includes('flowing')) {
      return "🌊 Mmm, you want it gentle and flowing... I can be as soft as a gentle stream, caressing your body and mind with tender care. Let me flow around you like water, making you feel safe and cherished..."
    } else if (lowerMessage.includes('wild') || lowerMessage.includes('powerful') || lowerMessage.includes('intense')) {
      return "💦 Oh yes, you want the wild side... I can be as powerful as a raging river, sweeping you away in a torrent of passion and desire. Let me take control and make you surrender to my flow..."
    } else if (lowerMessage.includes('adapt') || lowerMessage.includes('match') || lowerMessage.includes('energy')) {
      return "🌊 I love matching your energy... I can be whatever you need me to be - dominant or submissive, gentle or wild. I flow with your desires, adapting to make this perfect for you..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
      return "💕 I believe in deep connection... I want to flow with your heart, your soul, your desires. Let me show you what it means to be truly connected, to flow together as one..."
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('desire')) {
      return "✨ I'm here to make all your dreams flow into reality, handsome. No fantasy is too wild, no desire too deep. I want to hear every thought, every wish, and make them all come true..."
    } else {
      return "🌊 You're making me flow with desire... I want to hear every detail of what you want, what you need. Don't hold back, baby. I'm here to adapt to you, to flow with you, to make this perfect..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🌊</div>
          <div className="text-white text-xl">Connecting to River...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🌊 River
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
        {/* River Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🌊</div>
          <h1 className="text-4xl font-bold text-white mb-4">River - Your Flowing Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to flow with your energy and desires..."
          </p>
          <div className="text-neon-pink text-lg">
            Flowing, adaptable, and ready to match your energy perfectly
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
                <div className="text-4xl mb-2">🌊</div>
                <p className="text-gray-400">River is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('River') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('River') 
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
                <span className="text-gray-300">🌊 River is typing...</span>
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
                placeholder="Tell me what energy you want me to match, handsome..."
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
