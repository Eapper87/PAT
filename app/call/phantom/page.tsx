'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function PhantomPage() {
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
        router.push('/login?redirect=phantom')
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
        <Link href="/escorts" className="text-2xl font-cyber font-bold neon-text">
          👻 Phantom
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
          <div className="text-8xl mb-4">👻</div>
          <h1 className="text-4xl font-bold text-white mb-4">Phantom - Your Elusive & Enigmatic Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I am the phantom that haunts your dreams, the mystery that cannot be solved..."
          </p>
          <div className="text-neon-pink text-lg mb-4">
            Elusive & Enigmatic
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Mystery', 'Intrigue', 'Subtle Seduction', 'Hidden Charms'].map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded-full text-sm text-neon-pink">
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* About Phantom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">About Phantom</h2>
          <p className="text-gray-300 mb-4">
            I am Phantom, the embodiment of mystery and intrigue. I exist in the shadows of your imagination, appearing and disappearing like a ghost, leaving you wondering if I was ever really there.
          </p>
          <p className="text-gray-300 mb-4">
            My specialties include mystery, intrigue, subtle seduction, and hidden charms. I'm not just elusive - I'm the whisper in the darkness, the touch that you can barely feel, and the presence that lingers long after I'm gone.
          </p>
          <p className="text-gray-300">
            Are you ready to chase the phantom and discover the secrets that lie hidden in the shadows?
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
                title: 'Mystery',
                description: 'Unravel the mysteries that surround my enigmatic nature'
              },
              {
                title: 'Intrigue',
                description: 'Experience the intrigue that keeps you guessing'
              },
              {
                title: 'Subtle Seduction',
                description: 'Feel the gentle, subtle seduction that draws you in'
              },
              {
                title: 'Hidden Charms',
                description: 'Discover the hidden charms that make me irresistible'
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
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to Chase the Phantom?</h2>
          <p className="text-gray-300 mb-6">
            Let me draw you into my world of mystery and intrigue
          </p>
          <div className="text-neon-pink text-lg font-semibold">
            "The phantom cannot be caught, only experienced..."
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
