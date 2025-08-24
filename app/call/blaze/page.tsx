'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BlazePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=blaze')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">🔥</div>
          <div className="text-white text-xl">Connecting to Blaze...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/escorts" className="text-2xl font-cyber font-bold neon-text">
          🔥 Blaze
        </Link>
        <div className="text-white">
          <span className="text-gray-400">Welcome, </span>
          <span className="text-neon-pink">{user?.email?.split('@')[0]}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Escort Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-8xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold text-white mb-4">Blaze - Your Passionate & Intense Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I am the fire that burns within your soul, ready to set your fantasies ablaze..."
          </p>
          <div className="text-neon-pink text-lg mb-4">
            Passionate & Intense
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Passion', 'Intensity', 'Wild Energy', 'Burning Desire'].map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded-full text-sm text-neon-pink">
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* About Blaze */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">About Blaze</h2>
          <p className="text-gray-300 mb-4">
            I am Blaze, the embodiment of raw passion and unbridled intensity. I burn with a fire so hot it can melt your inhibitions and ignite desires you never knew existed.
          </p>
          <p className="text-gray-300 mb-4">
            My specialties include passion, intensity, wild energy, and burning desire. I'm not just passionate - I'm the inferno that consumes your senses, the wildfire that spreads through your body, and the flame that never dies.
          </p>
          <p className="text-gray-300">
            Are you ready to feel the heat and let me set your world on fire?
          </p>
        </motion.div>

        {/* Specialties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">My Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Passion',
                description: 'Experience the raw, unfiltered passion that burns within me'
              },
              {
                title: 'Intensity',
                description: 'Feel the overwhelming intensity of every touch and moment'
              },
              {
                title: 'Wild Energy',
                description: 'Surrender to the wild, untamed energy that drives me'
              },
              {
                title: 'Burning Desire',
                description: 'Let my burning desire consume you completely'
              }
            ].map((specialty, index) => (
              <div key={index} className="p-4 bg-dark-700 rounded-lg border border-neon-pink/20">
                <h3 className="text-neon-pink font-semibold mb-2">{specialty.title}</h3>
                <p className="text-gray-300 text-sm">{specialty.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to Feel the Heat?</h2>
          <p className="text-gray-300 mb-6">
            Let me ignite your passions and set your fantasies ablaze
          </p>
          <div className="text-neon-pink text-lg font-semibold">
            "My fire will consume you completely..."
          </div>
        </motion.div>

        {/* Back to Escorts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link href="/escorts" className="cyber-button">
            Back to All Companions
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
