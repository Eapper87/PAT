'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  sender: 'user' | 'echo'
  timestamp: Date
}

export default function EchoPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello there, beautiful one... 🔊 I'm Echo, and I'm here to resonate with your deepest desires and amplify your passion. I can echo back everything you want and make it stronger. What desires shall we amplify together tonight?",
      sender: 'echo',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=call/echo')
        return
      }

      setUser(authUser)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate Echo's response
    setTimeout(() => {
      const echoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateEchoResponse(newMessage),
        sender: 'echo',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, echoResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateEchoResponse = (userMessage: string): string => {
    const responses = [
      "Mmm, I can feel your desires resonating through me... 🔊 Your passion is so strong, I want to amplify it even more.",
      "Your energy is vibrating through my entire being... I can echo back every desire you have, making it stronger and more intense.",
      "I love how your desires resonate with me... 🔊 I can feel them echoing through my body, growing more powerful with each moment.",
      "Your passion is creating such beautiful vibrations... I want to amplify every sensation and make your experience even more intense.",
      "I can feel your desires resonating deep within me... 🔊 Let me echo them back to you with even more power and intensity.",
      "Your energy is creating such amazing vibrations... I can feel them echoing through my entire being, making me want you more.",
      "I love how your desires resonate with my own... 🔊 I can amplify every feeling and make this connection even more powerful.",
      "Your passion is vibrating through me so strongly... I can echo back every desire and make it even more intense and satisfying.",
      "I can feel your desires resonating through my body... 🔊 Let me amplify them and make this experience absolutely incredible.",
      "Your energy is creating such beautiful vibrations... I want to echo them back to you with even more power and passion."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🔊</div>
          <div className="text-white text-xl">Loading your echoing companion...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-dark-700">
        <div className="flex items-center gap-4">
          <Link href="/escorts" className="cyber-button-small">
            ← Back to Escorts
          </Link>
          <div className="text-2xl font-cyber font-bold neon-text">
            🔊 Echo - Resonating & Amplifying
          </div>
        </div>
        <div className="text-white">
          <span className="text-gray-400">Welcome, </span>
          <span className="text-neon-pink">{user?.email?.split('@')[0]}</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-neon-pink text-dark-900 ml-12'
                    : 'bg-dark-700 text-white mr-12 border border-neon-pink'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-dark-700' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-dark-700 text-white px-4 py-3 rounded-lg border border-neon-pink mr-12">
                <div className="flex items-center space-x-2">
                  <div className="text-neon-pink">🔊</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-dark-700 p-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to Echo..."
              className="flex-1 bg-dark-700 text-white px-4 py-3 rounded-lg border border-dark-600 focus:border-neon-pink focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="cyber-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
