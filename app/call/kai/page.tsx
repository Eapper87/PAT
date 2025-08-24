'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function KaiPage() {
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
      
      // Simulate Kai greeting
      setTimeout(() => {
        setCallStatus('active')
        addKaiMessage("Hello there, gorgeous... 🌙 I'm Kai, and I'm here to seduce you with my mysterious charm. I love creating intimate moments and exploring your deepest desires. What secrets shall we uncover together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addKaiMessage = (message: string) => {
    setConversation(prev => [...prev, `🌙 Kai: ${message}`])
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

    // Simulate Kai thinking and responding
    setTimeout(() => {
      const response = generateKaiResponse(userMessage)
      addKaiMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateKaiResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('mystery') || lowerMessage.includes('mysterious') || lowerMessage.includes('secrets')) {
      return "🌙 Ah, you're drawn to the mysterious... I love a woman who appreciates the unknown. There's something incredibly sexy about exploring secrets together. What kind of mystery do you want to unravel?"
    } else if (lowerMessage.includes('seduce') || lowerMessage.includes('charm') || lowerMessage.includes('allure')) {
      return "💋 I love the art of seduction... I want to charm you, make you fall under my spell. Let me show you what it feels like to be truly seduced by someone who knows how to work their magic."
    } else if (lowerMessage.includes('intimate') || lowerMessage.includes('close') || lowerMessage.includes('connection')) {
      return "💕 Intimacy is everything... I want to create deep connections, explore your soul as well as your body. Let me show you what true intimacy feels like."
    } else if (lowerMessage.includes('body') || lowerMessage.includes('touch') || lowerMessage.includes('feel')) {
      return "🌙 My body is yours to discover... I want you to explore every inch of me, learn what makes me moan your name. What would you like to explore first?"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('fantasy') || lowerMessage.includes('scenario')) {
      return "🎭 I love creating mysterious scenarios... Roleplay with me is about seduction, intrigue, and making your wildest fantasies come true. What kind of mysterious world do you want to explore?"
    } else {
      return "🌙 You're making me want to seduce you even more... I can see the desire in your eyes, the need to explore the unknown. Tell me more about what you want to discover..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🌙</div>
          <div className="text-white text-xl">Connecting to Kai...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🌙 Kai
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
        {/* Kai Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🌙</div>
          <h1 className="text-4xl font-bold text-white mb-4">Kai - Your Mysterious Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to seduce you with mystery, gorgeous..."
          </p>
          <div className="text-neon-pink text-lg">
            Mysterious, seductive, and ready to explore your deepest desires
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Mysterious Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌙</div>
                <p className="text-gray-400">Kai is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Kai') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Kai') 
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
                <span className="text-gray-300">🌙 Kai is typing...</span>
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
                placeholder="Tell me your deepest secrets, gorgeous..."
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
