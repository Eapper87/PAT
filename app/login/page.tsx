'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense } from 'react'
import AuthForm from '@/components/AuthForm'

export default function Login() {
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
            <h2 className="text-2xl font-semibold mt-4 text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account</p>
          </div>

          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <AuthForm mode="signin" />
          </Suspense>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-neon-pink hover:text-neon-blue transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/forgot-password" className="text-sm text-neon-blue hover:text-neon-pink transition-colors">
              Forgot your password?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

