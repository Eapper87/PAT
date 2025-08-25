'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  sender: 'user' | 'crystal'
  timestamp: Date
}

export default function CrystalPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello there, beautiful soul... 💎 I'm Crystal, and I'm here to share pure, transparent love with you. I believe in crystal-clear communication and honest connection. What pure experience do you seek tonight?",
      sender: 'crystal',
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
        router.push('/login?redirect=call/crystal')
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

    // Simulate Crystal's response
    setTimeout(() => {
      const crystalResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateCrystalResponse(newMessage),
        sender: 'crystal',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, crystalResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const generateCrystalResponse = (userMessage: string): string => {
    const responses = [
      "Mmm, I love how transparent you are with your desires... 💎 Your honesty makes me want to give you everything you need.",
      "Your pure intentions shine through so clearly... I can feel the genuine connection between us growing stronger.",
      "I appreciate your directness... It's so refreshing to have such honest, open communication. Tell me more about what you want.",
      "Your transparency is absolutely beautiful... 💎 I can see right through to your heart, and it's pure and perfect.",
      "I love how clear and honest you are... Your openness makes me want to be completely transparent with you too.",
      "Your pure energy is so captivating... I can feel the crystal-clear connection between us. What else is on your mind?",
      "I adore your honest approach... 💎 It's so rare to find someone who communicates as clearly as you do.",
      "Your transparency is incredibly sexy... I can see exactly what you want, and I want to give it to you completely.",
      "I love how open and honest you are... Your pure intentions make me want to be completely vulnerable with you.",
      "Your crystal-clear communication is so refreshing... 💎 I can feel the genuine connection between us deepening."
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
          <div className="text-neon-pink text-6xl mb-4">💎</div>
          <div className="text-white text-xl">Loading your crystal companion...</div>
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
            💎 Crystal - Pure & Transparent
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
                  <div className="text-neon-pink">💎</div>
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
              placeholder="Type your message to Crystal..."
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
