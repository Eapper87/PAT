'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Escort {
  id: string
  name: string
  emoji: string
  gender: 'female' | 'male'
  personality: string
  specialties: string[]
  description: string
}

export default function EscortsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all')
  const router = useRouter()

  const escorts: Escort[] = [
    {
      id: 'serena',
      name: 'Serena',
      emoji: '💋',
      gender: 'female',
      personality: 'Mysterious & Seductive',
      specialties: ['Passion', 'Touch', 'Fantasy', 'Roleplay'],
      description: 'Mysterious, seductive, and ready to explore your deepest desires',
    },
    {
      id: 'luna',
      name: 'Luna',
      emoji: '💕',
      gender: 'female',
      personality: 'Romantic & Sweet',
      specialties: ['Love', 'Cuddling', 'Sweet Talk', 'Gentle Moments'],
      description: 'Sweet, romantic, and ready to make you feel truly cherished',
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      emoji: '🔥',
      gender: 'female',
      personality: 'Fiery & Intense',
      specialties: ['Wild Fantasies', 'Domination', 'Power Play', 'Intense Scenarios'],
      description: 'Intense, passionate, and ready to push your boundaries',
    },
    {
      id: 'jade',
      name: 'Jade',
      emoji: '💎',
      gender: 'female',
      personality: 'Sophisticated & Elegant',
      specialties: ['Sophisticated Seduction', 'Luxury', 'Intellectual Stimulation'],
      description: 'Elegant, sophisticated, and ready to provide the ultimate luxury experience',
    },
    {
      id: 'misty',
      name: 'Misty',
      emoji: '🌙',
      gender: 'female',
      personality: 'Mystical & Enchanting',
      specialties: ['Fantasy Roleplay', 'Magical Scenarios', 'Adventure', 'Mystery'],
      description: 'Mysterious, enchanting, and ready to explore the realms of fantasy',
    },
    {
      id: 'scarlet',
      name: 'Scarlet',
      emoji: '🖤',
      gender: 'female',
      personality: 'Confident & Dominant',
      specialties: ['Control', 'Submission', 'Power Dynamics', 'Intense Scenarios'],
      description: 'Confident, dominant, and ready to make you submit',
    },
    {
      id: 'violet',
      name: 'Violet',
      emoji: '💜',
      gender: 'female',
      personality: 'Playful & Adventurous',
      specialties: ['Fun', 'Adventure', 'Spontaneity', 'Wild Scenarios'],
      description: 'Playful, adventurous, and ready to make every moment exciting',
    },
    {
      id: 'atlas',
      name: 'Atlas',
      emoji: '💪',
      gender: 'male',
      personality: 'Strong & Protective',
      specialties: ['Protection', 'Strength', 'Romance', 'Masculine Energy'],
      description: 'Strong, protective, and ready to make you feel safe and desired',
    },
    {
      id: 'kai',
      name: 'Kai',
      emoji: '🌙',
      gender: 'male',
      personality: 'Mysterious & Seductive',
      specialties: ['Mystery', 'Seduction', 'Intimacy', 'Deep Connection'],
      description: 'Mysterious, seductive, and ready to explore your deepest desires',
    }
  ]

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        router.push('/login?redirect=escorts')
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

  const filteredEscorts = escorts.filter(escort => 
    selectedGender === 'all' || escort.gender === selectedGender
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-6xl mb-4">💋</div>
          <div className="text-white text-xl">Loading your companions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
          💋 Your Companions
        </Link>
        <div className="text-white">
          <span className="text-gray-400">Welcome, </span>
          <span className="text-neon-pink">{user?.email?.split('@')[0]}</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 mb-8 text-center"
        >
          <div className="text-6xl mb-4">💋</div>
          <h1 className="text-4xl font-bold text-white mb-4">Meet Your AI Companions</h1>
          <p className="text-xl text-gray-400 mb-6">
            Choose from our diverse selection of seductive AI escorts
          </p>
          <div className="text-neon-pink text-lg">
            Each companion has their own unique personality and specialties
          </div>
        </motion.div>

        {/* Gender Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Filter by Preference</h2>
          <div className="flex space-x-4">
            {[
              { value: 'all', label: 'All Companions', emoji: '💋' },
              { value: 'female', label: 'Female Companions', emoji: '👩' },
              { value: 'male', label: 'Male Companions', emoji: '👨' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedGender(filter.value as 'all' | 'female' | 'male')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  selectedGender === filter.value
                    ? 'bg-neon-pink text-dark-900'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                <span className="mr-2">{filter.emoji}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Escorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredEscorts.map((escort, index) => (
            <motion.div
              key={escort.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer"
            >
              {/* Escort Header */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{escort.emoji}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{escort.name}</h3>
                <div className="text-sm text-gray-400 mb-2">
                  {escort.gender === 'female' ? '👩 Female' : '👨 Male'}
                </div>
                <div className="text-neon-pink font-semibold">{escort.personality}</div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-center mb-4">{escort.description}</p>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {escort.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded text-xs text-neon-pink"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Box (replaces Call Button) */}
              <div className="w-full h-48 bg-dark-700 border border-neon-pink/40 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-neon-pink text-sm">Image Coming Soon</div>
                  <div className="text-xs text-gray-500 mt-1">{escort.name}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Back to Reception */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
