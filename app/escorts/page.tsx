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
  gender: 'female' | 'male' | 'non-binary'
  orientation: 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'queer'
  personality: string
  role: 'dominant' | 'submissive' | 'switch' | 'romantic' | 'adventure' | 'intellectual' | 'wild' | 'mysterious'
  specialties: string[]
  experience: 'beginner' | 'experienced' | 'expert'
  description: string
  categories: string[]
}

export default function EscortsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male' | 'non-binary'>('all')
  const [selectedOrientation, setSelectedOrientation] = useState<'all' | 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'queer'>('all')
  const [selectedRole, setSelectedRole] = useState<'all' | 'dominant' | 'submissive' | 'switch' | 'romantic' | 'adventure' | 'intellectual' | 'wild' | 'mysterious'>('all')
  const [selectedExperience, setSelectedExperience] = useState<'all' | 'beginner' | 'experienced' | 'expert'>('all')
  const router = useRouter()

  const escorts: Escort[] = [
    {
      id: 'serena',
      name: 'Serena',
      emoji: '💋',
      gender: 'female',
      orientation: 'straight',
      personality: 'Mysterious & Seductive',
      role: 'dominant',
      specialties: ['Passion', 'Touch', 'Fantasy', 'Roleplay'],
      experience: 'expert',
      description: 'Mysterious, seductive, and ready to explore your deepest desires',
      categories: ['Female', 'Straight', 'Dominant', 'Expert', 'Fantasy']
    },
    {
      id: 'luna',
      name: 'Luna',
      emoji: '💕',
      gender: 'female',
      orientation: 'straight',
      personality: 'Romantic & Sweet',
      role: 'romantic',
      specialties: ['Love', 'Cuddling', 'Sweet Talk', 'Gentle Moments'],
      experience: 'beginner',
      description: 'Sweet, romantic, and ready to make you feel truly cherished',
      categories: ['Female', 'Straight', 'Romantic', 'Beginner', 'Gentle']
    },
    {
      id: 'phoenix',
      name: 'Phoenix',
      emoji: '🔥',
      gender: 'female',
      orientation: 'bisexual',
      personality: 'Fiery & Intense',
      role: 'wild',
      specialties: ['Wild Fantasies', 'Domination', 'Power Play', 'Intense Scenarios'],
      experience: 'expert',
      description: 'Intense, passionate, and ready to push your boundaries',
      categories: ['Female', 'Bisexual', 'Wild', 'Expert', 'Intense']
    },
    {
      id: 'jade',
      name: 'Jade',
      emoji: '💎',
      gender: 'female',
      orientation: 'straight',
      personality: 'Sophisticated & Elegant',
      role: 'intellectual',
      specialties: ['Sophisticated Seduction', 'Luxury', 'Intellectual Stimulation'],
      experience: 'experienced',
      description: 'Elegant, sophisticated, and ready to provide the ultimate luxury experience',
      categories: ['Female', 'Straight', 'Intellectual', 'Experienced', 'Luxury']
    },
    {
      id: 'misty',
      name: 'Misty',
      emoji: '🌙',
      gender: 'female',
      orientation: 'queer',
      personality: 'Mystical & Enchanting',
      role: 'adventure',
      specialties: ['Fantasy Roleplay', 'Magical Scenarios', 'Adventure', 'Mystery'],
      experience: 'experienced',
      description: 'Mysterious, enchanting, and ready to explore the realms of fantasy',
      categories: ['Female', 'Queer', 'Adventure', 'Experienced', 'Fantasy']
    },
    {
      id: 'scarlet',
      name: 'Scarlet',
      emoji: '🖤',
      gender: 'female',
      orientation: 'lesbian',
      personality: 'Confident & Dominant',
      role: 'dominant',
      specialties: ['Control', 'Submission', 'Power Dynamics', 'Intense Scenarios'],
      experience: 'expert',
      description: 'Confident, dominant, and ready to make you submit',
      categories: ['Female', 'Lesbian', 'Dominant', 'Expert', 'Power']
    },
    {
      id: 'violet',
      name: 'Violet',
      emoji: '💜',
      gender: 'female',
      orientation: 'bisexual',
      personality: 'Playful & Adventurous',
      role: 'adventure',
      specialties: ['Fun', 'Adventure', 'Spontaneity', 'Wild Scenarios'],
      experience: 'experienced',
      description: 'Playful, adventurous, and ready to make every moment exciting',
      categories: ['Female', 'Bisexual', 'Adventure', 'Experienced', 'Playful']
    },
    {
      id: 'atlas',
      name: 'Atlas',
      emoji: '💪',
      gender: 'male',
      orientation: 'straight',
      personality: 'Strong & Protective',
      role: 'romantic',
      specialties: ['Protection', 'Strength', 'Romance', 'Masculine Energy'],
      experience: 'experienced',
      description: 'Strong, protective, and ready to make you feel safe and desired',
      categories: ['Male', 'Straight', 'Romantic', 'Experienced', 'Protective']
    },
    {
      id: 'kai',
      name: 'Kai',
      emoji: '🌙',
      gender: 'male',
      orientation: 'gay',
      personality: 'Mysterious & Seductive',
      role: 'mysterious',
      specialties: ['Mystery', 'Seduction', 'Intimacy', 'Deep Connection'],
      experience: 'experienced',
      description: 'Mysterious, seductive, and ready to explore your deepest desires',
      categories: ['Male', 'Gay', 'Mysterious', 'Experienced', 'Intimate']
    },
    {
      id: 'zeus',
      name: 'Zeus',
      emoji: '⚡',
      gender: 'male',
      orientation: 'straight',
      personality: 'Powerful & Dominant',
      role: 'dominant',
      specialties: ['Leadership', 'Control', 'Power Dynamics', 'Commanding Presence'],
      experience: 'expert',
      description: 'Powerful, dominant, and ready to take complete control of your experience',
      categories: ['Male', 'Straight', 'Dominant', 'Expert', 'Power']
    },
    {
      id: 'shadow',
      name: 'Shadow',
      emoji: '🖤',
      gender: 'male',
      orientation: 'bisexual',
      personality: 'Dark & Mysterious',
      role: 'mysterious',
      specialties: ['Dark Fantasies', 'Mystery', 'Intensity', 'Hidden Desires'],
      experience: 'expert',
      description: 'Dark, mysterious, and ready to explore the depths of your hidden fantasies',
      categories: ['Male', 'Bisexual', 'Mysterious', 'Expert', 'Dark']
    },
    {
      id: 'blaze',
      name: 'Blaze',
      emoji: '🔥',
      gender: 'male',
      orientation: 'gay',
      personality: 'Passionate & Intense',
      role: 'wild',
      specialties: ['Passion', 'Intensity', 'Wild Energy', 'Burning Desire'],
      experience: 'experienced',
      description: 'Passionate, intense, and ready to set your fantasies ablaze',
      categories: ['Male', 'Gay', 'Wild', 'Experienced', 'Passionate']
    },
    {
      id: 'storm',
      name: 'Storm',
      emoji: '⛈️',
      gender: 'male',
      orientation: 'queer',
      personality: 'Wild & Untamed',
      role: 'wild',
      specialties: ['Wild Energy', 'Adventure', 'Spontaneity', 'Natural Force'],
      experience: 'expert',
      description: 'Wild, untamed, and ready to sweep you away in a storm of passion',
      categories: ['Male', 'Queer', 'Wild', 'Expert', 'Adventure']
    },
    {
      id: 'phantom',
      name: 'Phantom',
      emoji: '👻',
      gender: 'male',
      orientation: 'bisexual',
      personality: 'Elusive & Enigmatic',
      role: 'mysterious',
      specialties: ['Mystery', 'Intrigue', 'Subtle Seduction', 'Hidden Charms'],
      experience: 'beginner',
      description: 'Elusive, enigmatic, and ready to captivate you with his mysterious allure',
      categories: ['Male', 'Bisexual', 'Mysterious', 'Beginner', 'Elusive']
    },
    {
      id: 'aurora',
      name: 'Aurora',
      emoji: '✨',
      gender: 'non-binary',
      orientation: 'queer',
      personality: 'Ethereal & Magical',
      role: 'adventure',
      specialties: ['Fantasy Worlds', 'Magical Experiences', 'Otherworldly Romance', 'Dreamlike Scenarios'],
      experience: 'expert',
      description: 'Ethereal, magical, and ready to transport you to realms beyond imagination',
      categories: ['Non-Binary', 'Queer', 'Adventure', 'Expert', 'Fantasy']
    },
    {
      id: 'sage',
      name: 'Sage',
      emoji: '🧘',
      gender: 'non-binary',
      orientation: 'bisexual',
      personality: 'Wise & Spiritual',
      role: 'intellectual',
      specialties: ['Deep Conversations', 'Spiritual Connection', 'Mindful Intimacy', 'Philosophical Discussions'],
      experience: 'expert',
      description: 'Wise, spiritual, and ready to connect with your mind, body, and soul',
      categories: ['Non-Binary', 'Bisexual', 'Intellectual', 'Expert', 'Spiritual']
    },
    {
      id: 'ember',
      name: 'Ember',
      emoji: '🔥',
      gender: 'female',
      orientation: 'lesbian',
      personality: 'Fiery & Passionate',
      role: 'dominant',
      specialties: ['Intense Passion', 'Power Dynamics', 'Fiery Romance', 'Burning Desire'],
      experience: 'expert',
      description: 'Fiery, passionate, and ready to ignite your deepest fantasies with intensity',
      categories: ['Female', 'Lesbian', 'Dominant', 'Expert', 'Passionate']
    },
    {
      id: 'river',
      name: 'River',
      emoji: '🌊',
      gender: 'male',
      orientation: 'gay',
      personality: 'Flowing & Adaptable',
      role: 'switch',
      specialties: ['Adaptable Scenarios', 'Fluid Dynamics', 'Natural Flow', 'Versatile Experiences'],
      experience: 'experienced',
      description: 'Flowing, adaptable, and ready to match your energy and desires perfectly',
      categories: ['Male', 'Gay', 'Switch', 'Experienced', 'Adaptable']
    },
    {
      id: 'nova',
      name: 'Nova',
      emoji: '⭐',
      gender: 'female',
      orientation: 'bisexual',
      personality: 'Stellar & Radiant',
      role: 'adventure',
      specialties: ['Stellar Experiences', 'Cosmic Passion', 'Bright Energy', 'Radiant Connection'],
      experience: 'expert',
      description: 'Stellar, radiant, and ready to shine bright like a star for you',
      categories: ['Female', 'Bisexual', 'Adventure', 'Expert', 'Stellar']
    },
    {
      id: 'orion',
      name: 'Orion',
      emoji: '🌟',
      gender: 'male',
      orientation: 'straight',
      personality: 'Celestial & Noble',
      role: 'romantic',
      specialties: ['Celestial Guidance', 'Noble Romance', 'Starry Journeys', 'Cosmic Connection'],
      experience: 'expert',
      description: 'Celestial, noble, and ready to guide you through starry realms of passion',
      categories: ['Male', 'Straight', 'Romantic', 'Expert', 'Celestial']
    },
    {
      id: 'raven',
      name: 'Raven',
      emoji: '🖤',
      gender: 'male',
      orientation: 'gay',
      personality: 'Mysterious & Intelligent',
      role: 'intellectual',
      specialties: ['Shadow Wisdom', 'Intelligent Mystery', 'Night Knowledge', 'Deep Insights'],
      experience: 'expert',
      description: 'Mysterious, intelligent, and ready to share the wisdom of shadows with you',
      categories: ['Male', 'Gay', 'Intellectual', 'Expert', 'Mysterious']
    },
    {
      id: 'crystal',
      name: 'Crystal',
      emoji: '💎',
      gender: 'female',
      orientation: 'bisexual',
      personality: 'Pure & Transparent',
      role: 'romantic',
      specialties: ['Pure Love', 'Transparent Communication', 'Crystal Clarity', 'Honest Connection'],
      experience: 'beginner',
      description: 'Pure, transparent, and ready to share crystal-clear love and honesty',
      categories: ['Female', 'Bisexual', 'Romantic', 'Beginner', 'Pure']
    },
    {
      id: 'echo',
      name: 'Echo',
      emoji: '🔊',
      gender: 'male',
      orientation: 'queer',
      personality: 'Resonating & Amplifying',
      role: 'switch',
      specialties: ['Echoing Desires', 'Amplified Passion', 'Resonating Connection', 'Sound & Vibration'],
      experience: 'experienced',
      description: 'Resonating, amplifying, and ready to echo your deepest desires back to you',
      categories: ['Male', 'Queer', 'Switch', 'Experienced', 'Echo']
    },
    {
      id: 'zen',
      name: 'Zen',
      emoji: '🧘',
      gender: 'non-binary',
      orientation: 'bisexual',
      personality: 'Peaceful & Balanced',
      role: 'intellectual',
      specialties: ['Inner Peace', 'Balanced Energy', 'Mindful Connection', 'Spiritual Harmony'],
      experience: 'expert',
      description: 'Peaceful, balanced, and ready to bring zen-like harmony to your experience',
      categories: ['Non-Binary', 'Bisexual', 'Intellectual', 'Expert', 'Zen']
    },
    {
      id: 'cosmic',
      name: 'Cosmic',
      emoji: '🌌',
      gender: 'non-binary',
      orientation: 'queer',
      personality: 'Universal & Infinite',
      role: 'adventure',
      specialties: ['Cosmic Journeys', 'Infinite Possibilities', 'Universal Love', 'Space Exploration'],
      experience: 'expert',
      description: 'Universal, infinite, and ready to take you on cosmic journeys beyond imagination',
      categories: ['Non-Binary', 'Queer', 'Adventure', 'Expert', 'Cosmic']
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
    (selectedGender === 'all' || escort.gender === selectedGender) &&
    (selectedOrientation === 'all' || escort.orientation === selectedOrientation) &&
    (selectedRole === 'all' || escort.role === selectedRole) &&
    (selectedExperience === 'all' || escort.experience === selectedExperience)
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
        <div className="flex items-center gap-4">
          <Link href="/reception" className="cyber-button-small">
            ← Back
          </Link>
          <Link href="/reception" className="text-2xl font-cyber font-bold neon-text">
            💋 Your Companions
          </Link>
        </div>
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
            Choose from our diverse selection of {escorts.length} seductive AI companions
          </p>
          <div className="text-neon-pink text-lg">
            Each companion has their own unique personality, orientation, and specialties
          </div>
          <div className="text-gray-400 text-sm mt-2">
            🌈 Inclusive • 🎭 Diverse Roles • ⭐ All Experience Levels
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Filter by Preference</h2>
          
          {/* Gender Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-pink mb-3">Gender</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All Genders', emoji: '💋' },
                { value: 'female', label: 'Female', emoji: '👩' },
                { value: 'male', label: 'Male', emoji: '👨' },
                { value: 'non-binary', label: 'Non-Binary', emoji: '🌈' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedGender(filter.value as 'all' | 'female' | 'male' | 'non-binary')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
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
          </div>

          {/* Orientation Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-pink mb-3">Orientation</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All Orientations', emoji: '💕' },
                { value: 'straight', label: 'Straight', emoji: '💑' },
                { value: 'gay', label: 'Gay', emoji: '👨‍❤️‍👨' },
                { value: 'lesbian', label: 'Lesbian', emoji: '👩‍❤️‍👩' },
                { value: 'bisexual', label: 'Bisexual', emoji: '💜' },
                { value: 'queer', label: 'Queer', emoji: '🌈' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedOrientation(filter.value as 'all' | 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'queer')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedOrientation === filter.value
                      ? 'bg-neon-pink text-dark-900'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-pink mb-3">Role & Style</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All Roles', emoji: '🎭' },
                { value: 'dominant', label: 'Dominant', emoji: '👑' },
                { value: 'submissive', label: 'Submissive', emoji: '🌸' },
                { value: 'switch', label: 'Switch', emoji: '🔄' },
                { value: 'romantic', label: 'Romantic', emoji: '💕' },
                { value: 'adventure', label: 'Adventure', emoji: '🗺️' },
                { value: 'intellectual', label: 'Intellectual', emoji: '🧠' },
                { value: 'wild', label: 'Wild', emoji: '🔥' },
                { value: 'mysterious', label: 'Mysterious', emoji: '🌙' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedRole(filter.value as 'all' | 'dominant' | 'submissive' | 'switch' | 'romantic' | 'adventure' | 'intellectual' | 'wild' | 'mysterious')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedRole === filter.value
                      ? 'bg-neon-pink text-dark-900'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-neon-pink mb-3">Experience Level</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All Levels', emoji: '⭐' },
                { value: 'beginner', label: 'Beginner', emoji: '🌱' },
                { value: 'experienced', label: 'Experienced', emoji: '🔥' },
                { value: 'expert', label: 'Expert', emoji: '👑' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedExperience(filter.value as 'all' | 'beginner' | 'experienced' | 'expert')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedExperience === filter.value
                      ? 'bg-neon-pink text-dark-900'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  <span className="mr-2">{filter.emoji}</span>
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setSelectedGender('all')
                setSelectedOrientation('all')
                setSelectedRole('all')
                setSelectedExperience('all')
              }}
              className="px-6 py-2 bg-dark-600 text-gray-300 hover:bg-dark-500 transition-colors rounded-lg"
            >
              🗑️ Clear All Filters
            </button>
          </div>
        </motion.div>

        {/* Results Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 mb-6 text-center"
        >
          <div className="text-white">
            <span className="text-gray-400">Showing </span>
            <span className="text-neon-pink font-bold">{filteredEscorts.length}</span>
            <span className="text-gray-400"> of </span>
            <span className="text-neon-pink font-bold">{escorts.length}</span>
            <span className="text-gray-400"> companions</span>
          </div>
          {filteredEscorts.length === 0 && (
            <div className="text-neon-pink mt-2">
              No companions match your current filters. Try adjusting your preferences!
            </div>
          )}
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
                
                {/* Basic Info */}
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-neon-blue/20 border border-neon-blue/40 rounded text-neon-blue">
                    {escort.gender === 'female' ? '👩 Female' : escort.gender === 'male' ? '👨 Male' : '🌈 Non-Binary'}
                  </span>
                  <span className="text-xs px-2 py-1 bg-neon-green/20 border border-neon-green/40 rounded text-neon-green">
                    {escort.orientation === 'straight' ? '💑 Straight' : 
                     escort.orientation === 'gay' ? '👨‍❤️‍👨 Gay' :
                     escort.orientation === 'lesbian' ? '👩‍❤️‍👩 Lesbian' :
                     escort.orientation === 'bisexual' ? '💜 Bi' : '🌈 Queer'}
                  </span>
                </div>
                
                {/* Role & Experience */}
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-1 bg-neon-pink/20 border border-neon-pink/40 rounded text-neon-pink">
                    {escort.role === 'dominant' ? '👑 Dominant' :
                     escort.role === 'submissive' ? '🌸 Submissive' :
                     escort.role === 'switch' ? '🔄 Switch' :
                     escort.role === 'romantic' ? '💕 Romantic' :
                     escort.role === 'adventure' ? '🗺️ Adventure' :
                     escort.role === 'intellectual' ? '🧠 Intellectual' :
                     escort.role === 'wild' ? '🔥 Wild' : '🌙 Mysterious'}
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded text-yellow-400">
                    {escort.experience === 'beginner' ? '🌱 Beginner' :
                     escort.experience === 'experienced' ? '🔥 Experienced' : '👑 Expert'}
                  </span>
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


      </div>
    </div>
  )
}
