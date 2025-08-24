'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ReceptionistCallPage() {
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
      
      // Simulate Raven greeting
      setTimeout(() => {
        setCallStatus('active')
        addReceptionistMessage("Hello, darling... 🖤 Welcome to Fantasy Central. I'm Raven, your seductive AI receptionist, and I'm here to make all your wildest dreams come true. What kind of companion are you looking for today?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addReceptionistMessage = (message: string) => {
    setConversation(prev => [...prev, `🖤 Raven: ${message}`])
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
      const response = generateReceptionistResponse(userMessage)
      addReceptionistMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateReceptionistResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('passion') || lowerMessage.includes('hot') || lowerMessage.includes('sexy')) {
      return "Mmm, I love a passionate one... 🔥 You want it hot and steamy, don't you? I can feel your desire from here. Tell me more about what makes you burn inside..."
    } else if (lowerMessage.includes('romantic') || lowerMessage.includes('sweet') || lowerMessage.includes('love')) {
      return "A romantic soul... 💕 How beautiful. You want someone who will whisper sweet nothings and make you feel truly cherished. Tell me about your romantic fantasies..."
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "Ooh, you want to play... 🎭 I love that! Roleplay can be so exciting. What kind of fantasy world would you like to explore? I'm all ears, darling..."
    } else if (lowerMessage.includes('talk') || lowerMessage.includes('conversation') || lowerMessage.includes('chat')) {
      return "Sometimes the best connection is through words... 💭 I love deep conversations too. Tell me more about what's on your mind, what you're looking for..."
    } else {
      return "Mmm, tell me more about what you're looking for, darling... 💋 I want to understand your desires better. What kind of experience are you craving?"
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🖤</div>
          <div className="text-white text-xl">Connecting to Raven...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🖤 Raven
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
          <div className="text-8xl mb-4">🖤</div>
          <h1 className="text-4xl font-bold text-white mb-4">Raven - Your Seductive Mistress of Welcome</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to make all your fantasies come true, darling..."
          </p>
          <div className="text-neon-pink text-lg">
            Let me know what you're looking for, and I'll connect you with the perfect companion
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🖤</div>
                <p className="text-gray-400">Raven is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Receptionist') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Raven') 
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
                <span className="text-gray-300">🖤 Raven is typing...</span>
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
                placeholder="Tell me what you're looking for, darling..."
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
          transition={{ delay: 0.6 }}
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
