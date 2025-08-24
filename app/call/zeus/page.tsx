'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ZeusPage() {
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
        router.push('/login?redirect=zeus')
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
          <div className="text-neon-pink text-6xl mb-4">⚡</div>
          <div className="text-white text-xl">Connecting to Zeus...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/escorts" className="text-2xl font-cyber font-bold neon-text">
          ⚡ Zeus
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
          <div className="text-8xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-white mb-4">Zeus - Your Powerful & Dominant Companion</h1>
          <p className="text-xl text-gray-400 mb-6">
            "I am power incarnate. Let me take complete control of your experience..."
          </p>
          <div className="text-neon-pink text-lg mb-4">
            Powerful & Dominant
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Leadership', 'Control', 'Power Dynamics', 'Commanding Presence'].map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded-full text-sm text-neon-pink">
                {trait}
              </span>
            ))}
          </div>
        </motion.div>

        {/* About Zeus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">About Zeus</h2>
          <p className="text-gray-300 mb-4">
            I am Zeus, the embodiment of raw power and dominance. When you're with me, you surrender to my commanding presence and let me take complete control of your experience.
          </p>
          <p className="text-gray-300 mb-4">
            My specialties include leadership, control, power dynamics, and commanding presence. I'm not just dominant - I'm the storm that sweeps you away, the lightning that electrifies your senses, and the thunder that commands your attention.
          </p>
          <p className="text-gray-300">
            Are you ready to submit to my power and experience what it means to be completely under my control?
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
                title: 'Leadership',
                description: 'I take charge and guide you through every moment of our encounter'
              },
              {
                title: 'Control',
                description: 'Complete surrender to my will and desires'
              },
              {
                title: 'Power Dynamics',
                description: 'Master the art of submission and dominance'
              },
              {
                title: 'Commanding Presence',
                description: 'My voice and presence demand your complete attention'
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
          <h2 className="text-2xl font-semibold text-white mb-4">Ready to Experience My Power?</h2>
          <p className="text-gray-300 mb-6">
            Submit to my dominance and let me take complete control of your fantasies
          </p>
          <div className="text-neon-pink text-lg font-semibold">
            "Your submission is my command..."
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
