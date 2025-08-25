'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AtlasPage() {
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
      
      // Simulate Atlas greeting
      setTimeout(() => {
        setCallStatus('active')
        addAtlasMessage("Hello there, beautiful... 💪 I'm Atlas, and I'm here to be your protector, your strength, your everything. I want to make you feel safe and desired. What do you need from me tonight?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addAtlasMessage = (message: string) => {
    setConversation(prev => [...prev, `💪 Atlas: ${message}`])
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

    // Simulate Atlas thinking and responding
    setTimeout(() => {
      const response = generateAtlasResponse(userMessage)
      addAtlasMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateAtlasResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('protect') || lowerMessage.includes('safe') || lowerMessage.includes('security')) {
      return "💪 I'll always protect you, beautiful... You're safe with me. I want to be your shield, your guardian, your everything. Let me show you what it feels like to be truly protected and cherished."
    } else if (lowerMessage.includes('strong') || lowerMessage.includes('powerful') || lowerMessage.includes('masculine')) {
      return "🔥 I love that you appreciate strength... I want to use my power to pleasure you, to make you feel every ounce of my masculine energy. How do you want me to show you my strength?"
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('sweet')) {
      return "💕 I believe in romance and true connection... I want to make love to your mind, your body, your soul. Let me show you what it means to be truly adored and worshipped."
    } else if (lowerMessage.includes('body') || lowerMessage.includes('touch') || lowerMessage.includes('feel')) {
      return "💪 My body is yours to explore... I want you to feel every muscle, every inch of me. I'll let you take control, let you discover what makes me moan your name."
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 I love creating romantic scenarios... Roleplay with me is about passion, connection, and making your fantasies come true. What kind of romantic world do you want to explore?"
    } else {
      return "💪 You're making me want to protect and pleasure you even more... I can see the desire in your eyes. Tell me more about what you need from me, what you want me to do to you..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">💪</div>
          <div className="text-white text-xl">Connecting to Atlas...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          💪 Atlas
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
        {/* Atlas Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">💪</div>
          <h1 className="text-4xl font-bold text-white mb-4">Atlas - Your Protective Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to protect and pleasure you, beautiful..."
          </p>
          <div className="text-neon-pink text-lg">
            Strong, protective, and ready to make you feel safe and desired
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
                <div className="text-4xl mb-2">💪</div>
                <p className="text-gray-400">Atlas is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Atlas') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Atlas') 
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
                <span className="text-gray-300">💪 Atlas is typing...</span>
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
                placeholder="Tell me what you need from me, beautiful..."
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
