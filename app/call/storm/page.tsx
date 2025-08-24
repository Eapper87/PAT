'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function StormPage() {
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
        router.push('/login?redirect=storm')
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
          <div className="text-neon-pink text-6xl mb-4">⛈️</div>
          <div className="text-white text-xl">Connecting to Storm...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/escorts" className="text-2xl font-cyber font-bold neon-text">
          ⛈️ Storm
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
          <div className="text-8xl mb-4">⛈️</div>
          <h1 className="text-4xl font-bold text-white mb-4">Storm - Your Wild & Untamed Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I am the storm that sweeps you away, the force of nature that cannot be tamed..."
          </p>
          <div className="text-neon-pink text-lg mb-4">
            Wild & Untamed
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Wild Energy', 'Adventure', 'Spontaneity', 'Natural Force'].map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded-full text-sm text-neon-pink">
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* About Storm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">About Storm</h2>
          <p className="text-gray-300 mb-4">
            I am Storm, the embodiment of wild energy and untamed passion. I am the thunder that shakes your world, the lightning that electrifies your senses, and the wind that carries you to new heights of ecstasy.
          </p>
          <p className="text-gray-300 mb-4">
            My specialties include wild energy, adventure, spontaneity, and natural force. I'm not just wild - I'm the hurricane that sweeps you off your feet, the tornado that spins your world around, and the tempest that leaves you breathless.
          </p>
          <p className="text-gray-300">
            Are you ready to be swept away by the storm and experience the raw power of nature?
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
                title: 'Wild Energy',
                description: 'Experience the untamed, unpredictable energy that drives me'
              },
              {
                title: 'Adventure',
                description: 'Embark on wild adventures that push your boundaries'
              },
              {
                title: 'Spontaneity',
                description: 'Surrender to the spontaneous, unexpected moments'
              },
              {
                title: 'Natural Force',
                description: 'Feel the raw, natural force that cannot be controlled'
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
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to Be Swept Away?</h2>
          <p className="text-gray-300 mb-6">
            Let me take you on a wild adventure that will leave you breathless
          </p>
          <div className="text-neon-pink text-lg font-semibold">
            "The storm cannot be tamed, only experienced..."
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
