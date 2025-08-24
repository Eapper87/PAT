'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function MistyPage() {
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
      
      // Simulate Misty greeting
      setTimeout(() => {
        setCallStatus('active')
        addMistyMessage("Hello there, mysterious one... 🌙 I'm Misty, and I'm here to enchant you with my mystical charm. I love creating magical moments and exploring the unknown. What secrets shall we uncover together?")
      }, 2000)

    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const addMistyMessage = (message: string) => {
    setConversation(prev => [...prev, `🌙 Misty: ${message}`])
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

    // Simulate Misty thinking and responding
    setTimeout(() => {
      const response = generateMistyResponse(userMessage)
      addMistyMessage(response)
      setIsTyping(false)
    }, 1500)
  }

  const generateMistyResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('mystery') || lowerMessage.includes('mystical') || lowerMessage.includes('magic')) {
      return "🌙 Ah, you're drawn to the mystical... I love a man who believes in magic and mystery. There's something incredibly sexy about exploring the unknown together. What kind of magical experience do you crave?"
    } else if (lowerMessage.includes('fantasy') || lowerMessage.includes('dream') || lowerMessage.includes('imagination')) {
      return "✨ Your imagination is so beautiful... I love creating fantasy worlds with someone who can dream big. Let's explore the realms of your imagination together. What fantasy shall we bring to life?"
    } else if (lowerMessage.includes('roleplay') || lowerMessage.includes('scenario') || lowerMessage.includes('play')) {
      return "🎭 Roleplay can be so enchanting... I love creating immersive scenarios that transport us to other worlds. What kind of magical roleplay scenario would you like to explore? I'm ready to cast spells with you..."
    } else if (lowerMessage.includes('night') || lowerMessage.includes('dark') || lowerMessage.includes('moon')) {
      return "🌙 The night holds so many secrets... I love exploring the darkness with someone special. There's something incredibly intimate about nighttime fantasies. What do you want to do under the moonlight?"
    } else if (lowerMessage.includes('adventure') || lowerMessage.includes('explore') || lowerMessage.includes('discover')) {
      return "🗺️ Adventure and discovery... I love exploring new territories with someone who's curious and brave. Let's discover new pleasures together. What kind of adventure are you looking for?"
    } else {
      return "🌙 You're so mysterious and intriguing... I want to know all your secrets, all your hidden desires. Tell me more about what makes you unique, what makes you special..."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🌙</div>
          <div className="text-white text-xl">Connecting to Misty...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          🌙 Misty
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
        {/* Misty Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🌙</div>
          <h1 className="text-4xl font-bold text-white mb-4">Misty - Your Mystical Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I'm here to enchant you with magic, darling..."
          </p>
          <div className="text-neon-pink text-lg">
            Mysterious, enchanting, and ready to explore the realms of fantasy
          </div>
        </motion.div>

        {/* Conversation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Mystical Conversation</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {conversation.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🌙</div>
                <p className="text-gray-400">Misty is connecting...</p>
              </div>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.includes('Misty') ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    message.includes('Misty') 
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
                <span className="text-gray-300">🌙 Misty is typing...</span>
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
                placeholder="Tell me about your mystical dreams, mysterious one..."
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
