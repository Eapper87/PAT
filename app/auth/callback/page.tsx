'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
          setStatus('error')
          return
        }

        if (data.session?.user) {
          // Check if user profile exists, if not create one
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.session.user.id)
            .single()

          if (profileError && profileError.code === 'PGRST116') {
            // Profile doesn't exist, create one manually
            console.log('Creating user profile manually...')
            
            try {
              const { error: insertError } = await supabase
                .from('users')
                .insert([
                  {
                    id: data.session.user.id,
                    email: data.session.user.email,
                    credits: 5,
                    subscription_status: 'inactive'
                  }
                ])

              if (insertError) {
                console.error('Profile creation error:', insertError)
                // Try to create user preferences anyway
                await supabase
                  .from('user_preferences')
                  .insert([{ user_id: data.session.user.id }])
              } else {
                // Create user preferences
                await supabase
                  .from('user_preferences')
                  .insert([{ user_id: data.session.user.id }])
              }
            } catch (error) {
              console.error('Error creating user profile:', error)
            }
          }

          setStatus('success')
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push('/dashboard?welcome=true')
          }, 1500)
        } else {
          setError('No session found')
          setStatus('error')
        }
      } catch (error: any) {
        console.error('Unexpected error:', error)
        setError(error.message)
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-neon-pink text-4xl mb-4">🔄</div>
          <div className="text-2xl font-bold text-white mb-2">Completing Authentication</div>
          <div className="text-gray-400">Please wait while we set up your account...</div>
          <div className="mt-4">
            <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-red-400 text-4xl mb-4">❌</div>
          <div className="text-2xl font-bold text-white mb-2">Authentication Failed</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={() => router.push('/login')}
            className="cyber-button"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-neon-green text-4xl mb-4">✅</div>
        <div className="text-2xl font-bold text-white mb-2">Welcome to ProposalAI!</div>
        <div className="text-gray-400">Your account has been created successfully.</div>
        <div className="text-gray-400 mt-2">Redirecting to dashboard...</div>
      </motion.div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-pink text-4xl mb-4">🔄</div>
          <div className="text-2xl font-bold text-white mb-2">Loading...</div>
          <div className="mt-4">
            <div className="w-8 h-8 border-2 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
