'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-neon-pink/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-cyber font-bold neon-text"
        >
          ProposalAI
        </motion.div>
        <div className="flex space-x-6">
          <Link href="/pricing" className="text-gray-300 hover:text-neon-pink transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-neon-pink transition-colors">
            Login
          </Link>
          <Link href="/signup" className="cyber-button">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-cyber font-black neon-text mb-6">
            ProposalAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Experience the future of adult entertainment with{' '}
            <span className="text-neon-blue font-semibold">AI-powered companions</span>.
            <br />
            Connect instantly with seductive AI performers and intimate conversations.
          </p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup"
              className="cyber-button text-lg px-8 py-4"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Start Your Fantasy
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-900 transition-all duration-300 rounded-xl"
            >
              Watch Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full px-6"
        >
          {[
            {
              icon: '🎯',
              title: 'Seductive Receptionist',
              description: 'AI-powered mistress that understands your desires and guides you to the perfect companion.'
            },
            {
              icon: '🤖',
              title: 'Intimate Companions',
              description: 'Connect with AI performers trained in seduction and adult entertainment.'
            },
            {
              icon: '⚡',
              title: 'Instant Intimacy',
              description: 'No waiting, no queues. Get connected to your AI companion in seconds.'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className="glass-card p-6 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-neon-pink">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Floating Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-10 w-2 h-2 bg-neon-pink rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-10 w-1 h-1 bg-neon-blue rounded-full"
      />
    </div>
  )
}

