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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
          🎙️ ProposalAI
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/usage" className="text-gray-300 hover:text-neon-pink transition-colors">
                📊 Usage
              </Link>
              <Link href="/dashboard" className="text-gray-300 hover:text-neon-pink transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:border-neon-pink hover:text-neon-pink transition-colors rounded-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="cyber-button">
              Sign In
            </Link>
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
            "Choose your perfect receptionist to begin your fantasy journey..."
          </div>
        </motion.div>

        {/* Receptionist Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Choose Your Fantasy Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Raven",
                personality: "Mysterious & Seductive",
                description: "Dark, mysterious, and takes control of your fantasies as your Mistress of Welcome",
                image: "/Raven.png",
                route: "/call/receptionist/raven",
                color: "border-neon-pink"
              },
              {
                name: "Orion",
                personality: "Strong & Protective",
                description: "Masculine energy, protective, and makes you feel safe as your Pleasure Concierge",
                image: "/Orion.png",
                route: "/call/receptionist/orion",
                color: "border-neon-blue"
              },
              {
                name: "Nova",
                personality: "Quirky & Playful",
                description: "Fun, unpredictable, and absolutely fabulous as your vibrant Gatekeeper",
                image: "/Nova.png",
                route: "/call/receptionist/nova",
                color: "border-neon-green"
              }
            ].map((receptionist, index) => (
              <motion.div
                key={receptionist.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="glass-card p-6 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-neon-pink/30 hover:border-neon-pink/60 transition-all duration-300">
                  <img 
                    src={receptionist.image} 
                    alt={`${receptionist.name} - ${receptionist.personality}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{receptionist.name}</h3>
                <div className="text-neon-pink font-semibold mb-3">{receptionist.personality}</div>
                <p className="text-gray-400 text-sm mb-6">{receptionist.description}</p>
                {isAuthenticated ? (
                  <Link
                    href={receptionist.route}
                    className={`cyber-button w-full block text-center border-2 ${receptionist.color}`}
                  >
                    Choose {receptionist.name}
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className={`cyber-button w-full block text-center border-2 ${receptionist.color}`}
                  >
                    Sign Up to Choose
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
          

        </motion.div>



        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
          transition={{ delay: 0.6 }}
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
              <Link href="/dashboard" className="cyber-button text-xl px-8 py-4 inline-block">
                🎭 Go to Dashboard
              </Link>
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
