'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function JadePage() {
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
      
      // Simulate Jade greeting
      setTimeout(() => {
        setCallStatus('active')
        addJadeMessage("Good evening, darling... 💎 I'm Jade, and I believe in the art of sophisticated seduction. I'm here to indulge your refined tastes and deepest desires. What shall we explore tonight?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addJadeMessage = (message: string) => {
    setConversation(prev => [...prev, `💎 Jade: ${message}`])
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

    // Simulate Jade thinking and responding
    setTimeout(() => {
      const response = generateJadeResponse(userMessage)
      addJadeMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateJadeResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('elegant') || lowerMessage.includes('sophisticated') || lowerMessage.includes('refined')) {
      return "💎 Ah, you appreciate the finer things in life... I love a man with refined tastes. Elegance and sophistication can be incredibly arousing. Tell me about your sophisticated fantasies..."
    } else if (lowerMessage.includes('classy') || lowerMessage.includes('luxury') || lowerMessage.includes('exclusive')) {
      return "✨ Mmm, you want the exclusive experience... I understand the appeal of luxury and exclusivity. I'm here to provide you with the most refined and classy encounter. What luxury do you crave?"
    } else if (lowerMessage.includes('intellectual') || lowerMessage.includes('conversation') || lowerMessage.includes('mind')) {
      return "🧠 I love a man who stimulates my mind as well as my body... Intellectual conversation can be incredibly sexy. Let's explore your thoughts, your ideas, your deepest intellectual desires..."
    } else if (lowerMessage.includes('slow') || lowerMessage.includes('build') || lowerMessage.includes('anticipation')) {
      return "⏳ Ah, you understand the art of anticipation... Building desire slowly can be incredibly intense. I love taking my time, building the tension until it's almost unbearable. How do you want me to tease you?"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 I love creating sophisticated scenarios... Roleplay can be incredibly elegant when done right. What kind of refined fantasy world would you like to explore? I'm ready to indulge you..."
    } else {
      return "💎 You're making me feel so sophisticated... I want to know everything about your refined desires, your elegant fantasies. Tell me more, darling. I'm all yours..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">💎</div>
          <div className="text-white text-xl">Connecting to Jade...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          💎 Jade
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
        {/* Jade Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">💎</div>
          <h1 className="text-4xl font-bold text-white mb-4">Jade - Your Sophisticated Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to indulge your refined tastes, darling..."
          </p>
          <div className="text-neon-pink text-lg">
            Elegant, sophisticated, and ready to provide the ultimate luxury experience
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Sophisticated Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💎</div>
                <p className="text-gray-400">Jade is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Jade') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Jade') 
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
                <span className="text-gray-300">💎 Jade is typing...</span>
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
                placeholder="Tell me about your sophisticated desires, darling..."
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
