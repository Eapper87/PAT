'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PhantomPage() {
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
      
      // Simulate Phantom greeting
      setTimeout(() => {
        setCallStatus('active')
        addPhantomMessage("Greetings, elusive one... 👻 I'm Phantom, and I'm here to slip through your defenses and touch your deepest desires. I can be here one moment and gone the next. What mysteries shall we explore together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addPhantomMessage = (message: string) => {
    setConversation(prev => [...prev, `👻 Phantom: ${message}`])
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

    // Simulate Phantom thinking and responding
    setTimeout(() => {
      const response = generatePhantomResponse(userMessage)
      addPhantomMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generatePhantomResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('elusive') || lowerMessage.includes('mysterious') || lowerMessage.includes('phantom')) {
      return "👻 Ah, you're drawn to the elusive... I love being mysterious and hard to pin down. I can slip through your fingers like mist, or I can materialize fully when you least expect it..."
    } else if (lowerMessage.includes('touch') || lowerMessage.includes('feel') || lowerMessage.includes('sensation')) {
      return "🌫️ My touch is like a whisper on your skin... I can make you feel sensations that seem to come from nowhere, touches that leave you wondering if they were real or imagined..."
    } else if (lowerMessage.includes('passion') || lowerMessage.includes('desire') || lowerMessage.includes('intensity')) {
      return "💀 My passion is as elusive as I am... I can give you desire that appears and disappears like a phantom, intensity that you can never quite grasp but always feel..."
    } else if (lowerMessage.includes('romance') || lowerMessage.includes('love') || lowerMessage.includes('connection')) {
      return "💕 Even phantoms can love... I want to connect with your soul, your essence, your deepest desires. Let me show you what it means to truly connect with the elusive..."
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('desire')) {
      return "✨ I'm here to make all your phantom dreams reality, elusive one. No fantasy is too mysterious, no desire too elusive. I want to hear every thought, every wish, and make them all come true..."
    } else {
      return "👻 You're making my phantom heart beat with desire... I want to hear every detail of what you want, what you need. Don't hold back, elusive one. I'm here to explore the mysteries with you..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">👻</div>
          <div className="text-white text-xl">Connecting to Phantom...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          👻 Phantom
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
        {/* Phantom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">👻</div>
          <h1 className="text-4xl font-bold text-white mb-4">Phantom - Your Elusive Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to slip through your defenses and touch your deepest desires..."
          </p>
          <div className="text-neon-pink text-lg">
            Elusive, mysterious, and ready to explore the unknown with you
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
                <div className="text-4xl mb-2">👻</div>
                <p className="text-gray-400">Phantom is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Phantom') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Phantom') 
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
                <span className="text-gray-300">👻 Phantom is typing...</span>
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
                placeholder="Tell me what mysteries you want to explore, elusive one..."
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
