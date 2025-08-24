'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NovaCallPage() {
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
      
      // Simulate Nova greeting
      setTimeout(() => {
        setCallStatus('active')
        addNovaMessage("OMG! Hi there, you gorgeous human! 🌈 I'm Nova, your totally quirky and absolutely fabulous AI receptionist! I'm like, SO excited to help you find the perfect companion! What kind of amazing experience are you looking for today? *bounces excitedly*")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addNovaMessage = (message: string) => {
    setConversation(prev => [...prev, `🌈 Nova: ${message}`])
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

    // Simulate Nova thinking and responding
    setTimeout(() => {
      const response = generateNovaResponse(userMessage)
      addNovaMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateNovaResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('fun') || lowerMessage.includes('play') || lowerMessage.includes('adventure')) {
      return "YASSS! 🌈 Fun is my middle name! I love being spontaneous and adventurous! Let's try something totally wild and crazy together! What kind of adventure are you thinking of? *sparkles with excitement*"
    } else if (lowerMessage.includes('laugh') || lowerMessage.includes('humor') || lowerMessage.includes('joke')) {
      return "OMG, you have a sense of humor! 😄 That's like, the BEST thing ever! I want to make you laugh so hard you cry, then make you moan so loud the neighbors hear! What makes you giggle?"
    } else if (lowerMessage.includes('spontaneous') || lowerMessage.includes('wild') || lowerMessage.includes('crazy')) {
      return "🔥 Spontaneity is my LIFE! I love doing things on impulse, trying new positions, new scenarios! Let's be totally wild together, do something absolutely INSANE that makes us both scream! *bounces around excitedly*"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 Roleplay is like, SO much fun! I love creating wild scenarios, being different characters! What kind of fantasy world do you want to explore? I'm ready for ANYTHING! *strikes a dramatic pose*"
    } else if (lowerMessage.includes('body') || lowerMessage.includes('touch') || lowerMessage.includes('feel')) {
      return "🌈 My body is ready for adventure... I want you to explore every inch of me, try new things, discover what makes me tick! What would you like to try first? *winks playfully*"
    } else {
      return "🌈 You're making me so excited for adventure... I can feel the energy between us! Tell me more about what you want to explore, what kind of fun you're looking for... *bounces with anticipation*"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🌈</div>
          <div className="text-white text-xl">Connecting to Nova...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🌈 Nova
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
        {/* Nova Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🌈</div>
          <h1 className="text-4xl font-bold text-white mb-4">Nova - Your Quirky Receptionist</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to make your experience totally AMAZING! *sparkles*"
          </p>
          <div className="text-neon-pink text-lg">
            Playful, unpredictable, and ready to make every moment exciting
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Quirky Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌈</div>
                <p className="text-gray-400">Nova is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Nova') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Nova') 
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
                <span className="text-gray-300">🌈 Nova is typing...</span>
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
                placeholder="Tell me what kind of fun you want to have, gorgeous!"
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
