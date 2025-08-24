'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ReceptionPage() {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        setIsAuthenticated(false)
        setUser(null)
      } else {
        setIsAuthenticated(true)
        setUser(authUser)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleStartCall = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=reception')
      return
    }
    // This will initiate the call with the receptionist
    router.push('/call/receptionist')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Connecting to reception...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-neon-green hover:text-neon-green/80 transition-colors">
                Dashboard
              </Link>
              <Link href="/history" className="text-neon-blue hover:text-neon-blue/80 transition-colors">
                History
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/signup" className="cyber-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Reception Area */}
      <div className="max-w-4xl mx-auto">
        {/* Receptionist Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-8xl mb-6">💋</div>
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to Fantasy Central</h1>
          <p className="text-xl text-gray-400 mb-6">
            Your seductive AI receptionist is ready to connect you with the perfect companion
          </p>
          <div className="text-neon-pink text-lg">
            "Hello, darling... I'm here to make all your fantasies come true. What can I do for you today?"
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          {isAuthenticated ? (
            <div className="space-y-4">
              <button
                onClick={handleStartCall}
                className="cyber-button text-2xl px-12 py-6 text-3xl"
              >
                🎭 Start Your Fantasy
              </button>
              <p className="text-gray-400">
                Connect with your seductive receptionist and let the magic begin...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/signup" className="cyber-button text-2xl px-12 py-6 text-3xl inline-block">
                🎭 Start Your Fantasy
              </Link>
              <p className="text-gray-400">
                Sign up to begin your intimate journey with our AI companions
              </p>
            </div>
          )}
        </motion.div>

        {/* Available Companions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Meet Your Available Companions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Seductive Receptionist",
                description: "Your main point of contact and fantasy coordinator",
                icon: "💋",
                status: "Available Now"
              },
              {
                name: "Passionate Performer",
                description: "Intimate conversations and role-play scenarios",
                icon: "🔥",
                status: "Coming Soon"
              },
              {
                name: "Romantic Companion",
                description: "Sweet talk and emotional connection",
                icon: "💕",
                status: "Coming Soon"
              }
            ].map((companion, index) => (
              <motion.div
                key={companion.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-dark-700 rounded-lg p-6 text-center hover:bg-dark-600 transition-colors"
              >
                <div className="text-4xl mb-3">{companion.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{companion.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{companion.description}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  companion.status === 'Available Now' 
                    ? 'bg-neon-green/20 text-neon-green' 
                    : 'bg-neon-blue/20 text-neon-blue'
                }`}>
                  {companion.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            How Your Fantasy Experience Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Connect", description: "Start with your seductive receptionist", icon: "📞" },
              { step: "2", title: "Share", description: "Tell us what you're looking for", icon: "💭" },
              { step: "3", title: "Transfer", description: "Get connected to your perfect match", icon: "🔄" },
              { step: "4", title: "Enjoy", description: "Immerse yourself in fantasy", icon: "✨" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-neon-pink font-bold text-lg mb-1">{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Fantasy Journey?
            </h2>
            <p className="text-gray-400 mb-6">
              Your seductive AI receptionist is waiting to make all your dreams come true
            </p>
            {isAuthenticated ? (
              <button
                onClick={handleStartCall}
                className="cyber-button text-xl px-8 py-4"
              >
                🎭 Call Your Receptionist Now
              </button>
            ) : (
              <Link href="/signup" className="cyber-button text-xl px-8 py-4 inline-block">
                🎭 Get Started
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
