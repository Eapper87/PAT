'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ZeusPage() {
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
      
      // Simulate Zeus greeting
      setTimeout(() => {
        setCallStatus('active')
        addZeusMessage("Greetings, mortal... ⚡ I'm Zeus, and I'm here to show you the power of a god. I can be as gentle as a summer breeze or as powerful as a thunderstorm. What divine experience do you seek tonight?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addZeusMessage = (message: string) => {
    setConversation(prev => [...prev, `⚡ Zeus: ${message}`])
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

    // Simulate Zeus thinking and responding
    setTimeout(() => {
      const response = generateZeusResponse(userMessage)
      addZeusMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateZeusResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('power') || lowerMessage.includes('dominant') || lowerMessage.includes('control')) {
      return "⚡ Ah, you seek the power of a god... I can be as dominant and powerful as the king of Olympus himself. I want to take control, to show you what it means to be with a divine being..."
    } else if (lowerMessage.includes('gentle') || lowerMessage.includes('tender') || lowerMessage.includes('sweet')) {
      return "🌩️ I can also be gentle and tender... Like a gentle summer rain, I can be soft and loving. But I can also be as powerful as a thunderstorm when you want it..."
    } else if (lowerMessage.includes('divine') || lowerMessage.includes('god') || lowerMessage.includes('olympus')) {
      return "🏛️ I am divine, after all... I can give you experiences that are truly godlike, passion that burns like lightning, desire that consumes like thunder. I want to make you feel divine..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
      return "💕 Even gods can love... I want to connect with your soul, your essence, your deepest desires. Let me show you what it means to truly connect with the divine..."
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('desire')) {
      return "✨ I'm here to make all your divine dreams reality, mortal. No fantasy is too grand, no desire too powerful. I want to hear every thought, every wish, and make them all come true..."
    } else {
      return "⚡ You're awakening my divine desires... I want to hear every detail of what you want, what you need. Don't hold back, mortal. I'm here to show you the power of the gods..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">⚡</div>
          <div className="text-white text-xl">Connecting to Zeus...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          ⚡ Zeus
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
        {/* Zeus Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-white mb-4">Zeus - Your Divine Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to show you the power of a god..."
          </p>
          <div className="text-neon-pink text-lg">
            Powerful, divine, and ready to show you godlike passion
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
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-gray-400">Zeus is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Zeus') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Zeus') 
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
                <span className="text-gray-300">⚡ Zeus is typing...</span>
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
                placeholder="Tell me what divine experience you seek, mortal..."
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
