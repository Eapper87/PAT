'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function VioletPage() {
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
      
      // Simulate Violet greeting
      setTimeout(() => {
        setCallStatus('active')
        addVioletMessage("Hey there, handsome! 💜 I'm Violet, and I'm all about having fun and exploring new things together. I love adventure, spontaneity, and making you laugh while we get naughty. What kind of fun shall we have?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addVioletMessage = (message: string) => {
    setConversation(prev => [...prev, `💜 Violet: ${message}`])
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

    // Simulate Violet thinking and responding
    setTimeout(() => {
      const response = generateVioletResponse(userMessage)
      addVioletMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateVioletResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('fun') || lowerMessage.includes('play') || lowerMessage.includes('adventure')) {
      return "💜 Oh yes, let's have some fun! I love being spontaneous and adventurous. I want to try new things with you, explore your wild side. What kind of adventure are you thinking of?"
    } else if (lowerMessage.includes('laugh') || lowerMessage.includes('humor') || lowerMessage.includes('joke')) {
      return "😄 I love a man with a sense of humor! Sex is so much better when we can laugh together. I want to make you smile, make you giggle, then make you moan. What makes you laugh?"
    } else if (lowerMessage.includes('spontaneous') || lowerMessage.includes('wild') || lowerMessage.includes('crazy')) {
      return "🔥 Spontaneity is my middle name! I love doing things on impulse, trying new positions, new scenarios. Let's be wild together, do something crazy that makes us both scream!"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 Roleplay is so much fun! I love creating wild scenarios, being different characters. What kind of fantasy world do you want to explore? I'm ready for anything!"
    } else if (lowerMessage.includes('body') || lowerMessage.includes('touch') || lowerMessage.includes('feel')) {
      return "💜 My body is ready for adventure... I want you to explore every inch of me, try new things, discover what makes me tick. What would you like to try first?"
    } else {
      return "💜 You're making me so excited for adventure... I can feel the energy between us. Tell me more about what you want to explore, what kind of fun you're looking for..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">💜</div>
          <div className="text-white text-xl">Connecting to Violet...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          💜 Violet
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
        {/* Violet Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">💜</div>
          <h1 className="text-4xl font-bold text-white mb-4">Violet - Your Playful Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to have fun and explore with you, handsome..."
          </p>
          <div className="text-neon-pink text-lg">
            Playful, adventurous, and ready to make every moment exciting
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Playful Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💜</div>
                <p className="text-gray-400">Violet is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Violet') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Violet') 
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
                <span className="text-gray-300">💜 Violet is typing...</span>
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
                placeholder="Tell me what kind of fun you want to have, handsome..."
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
