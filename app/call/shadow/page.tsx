'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ShadowPage() {
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
      
      // Simulate Shadow greeting
      setTimeout(() => {
        setCallStatus('active')
        addShadowMessage("Greetings, mysterious one... 🖤 I'm Shadow, and I'm here to explore the depths of your darkest desires. I can be elusive and enigmatic, or I can reveal my true nature. What secrets shall we uncover together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addShadowMessage = (message: string) => {
    setConversation(prev => [...prev, `🖤 Shadow: ${message}`])
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

    // Simulate Shadow thinking and responding
    setTimeout(() => {
      const response = generateShadowResponse(userMessage)
      addShadowMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateShadowResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('dark') || lowerMessage.includes('mysterious') || lowerMessage.includes('secrets')) {
      return "🖤 Ah, you're drawn to the darkness... I love exploring the mysterious depths of desire, the hidden corners of fantasy. Let me show you what lies in the shadows of your mind..."
    } else if (lowerMessage.includes('elusive') || lowerMessage.includes('enigmatic') || lowerMessage.includes('mystery')) {
      return "🌙 I am elusive and enigmatic... I can be hard to pin down, mysterious and alluring. But when I choose to reveal myself, you'll see the true depth of my passion..."
    } else if (lowerMessage.includes('passion') || lowerMessage.includes('desire') || lowerMessage.includes('intensity')) {
      return "💀 My passion runs deep and dark... I can give you intensity that comes from the shadows, desire that burns like black fire. I want to consume you completely..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
      return "💕 Even in darkness, there's beauty... I want to connect with your soul, your essence, your deepest desires. Let me show you what it means to truly connect in the shadows..."
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('desire')) {
      return "✨ I'm here to make all your darkest dreams reality, mysterious one. No fantasy is too dark, no desire too forbidden. I want to hear every shadowed thought in your mind..."
    } else {
      return "🖤 You're awakening my dark desires... I want to hear every detail of what you want, what you need. Don't hold back, mysterious one. I'm here to explore the shadows with you..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🖤</div>
          <div className="text-white text-xl">Connecting to Shadow...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🖤 Shadow
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
        {/* Shadow Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🖤</div>
          <h1 className="text-4xl font-bold text-white mb-4">Shadow - Your Mysterious Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to explore the depths of your darkest desires..."
          </p>
          <div className="text-neon-pink text-lg">
            Dark, mysterious, and ready to explore the shadows with you
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
                <div className="text-4xl mb-2">🖤</div>
                <p className="text-gray-400">Shadow is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Shadow') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Shadow') 
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
                <span className="text-gray-300">🖤 Shadow is typing...</span>
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
                placeholder="Tell me what dark desires you want to explore, mysterious one..."
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
