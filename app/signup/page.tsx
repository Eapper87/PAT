'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import AuthForm from '@/components/AuthForm'

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8"
        >
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-cyber font-bold neon-text">
              ProposalAI
            </Link>
            <h2 className="text-2xl font-semibold mt-4 text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Join the future of AI adult entertainment</p>
          </div>

          <AuthForm mode="signup" />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-neon-pink hover:text-neon-blue transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-dark-700/50 rounded-lg">
            <p className="text-sm text-gray-400 text-center">
              🎁 Get <span className="text-neon-green font-semibold">10 free fantasy minutes</span> when you sign up!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

