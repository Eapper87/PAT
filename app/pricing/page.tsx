'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error || !authUser) {
        setIsAuthenticated(false)
        setUser(null)
      } else {
        setIsAuthenticated(true)
        setUser(authUser)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setIsAuthenticated(false)
    }
  }

  const plans = [
    {
      name: 'Starter',
      price: 0,
              credits: 3,
              features: ['3 free fantasy calls', 'Seductive AI companions', 'Email support'],
      popular: false,
      priceId: null
    },
    {
      name: 'Pro',
      price: 29,
      credits: 75,
      features: ['75 fantasy calls/month', 'Exclusive AI lovers', 'Priority seduction', 'Intimate call tracking'],
      popular: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
    },
    {
      name: 'Enterprise',
      price: 99,
      credits: 300,
      features: ['300 fantasy calls/month', 'Custom AI fantasies', '24/7 seduction', 'Advanced pleasure analytics', 'VIP access'],
      popular: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID
    }
  ]

  const creditPackages = [
    { credits: 50, price: 19, savings: 0 },
    { credits: 100, price: 29, savings: 10 },
    { credits: 250, price: 59, savings: 20 },
    { credits: 500, price: 99, savings: 30 }
  ]

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) return
    
    if (!isAuthenticated) {
      router.push('/login?redirect=pricing')
      return
    }
    
    setLoading('subscription')
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL received:', data.error)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleBuyCredits = async (credits: number, price: number) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=pricing')
      return
    }
    
    setLoading(`credits-${credits}`)
    try {
      const response = await fetch('/api/stripe/create-credit-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          userId: user?.id
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL received:', data.error)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="flex justify-between items-center mb-8">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="text-3xl font-cyber font-bold neon-text">
            ProposalAI
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-neon-green hover:text-neon-green/80 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="cyber-button">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mt-8 mb-4">Choose Your Fantasy Plan</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Start with our free tier or unlock unlimited seductive AI conversations with our premium plans
        </p>
        
        {isAuthenticated && (
          <div className="mt-4 p-3 bg-neon-green/20 border border-neon-green/40 rounded-lg">
            <p className="text-neon-green text-sm">
              Welcome back, {user?.email}! You're logged in and ready to subscribe.
            </p>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-neon-blue/20 border border-neon-blue/40 rounded-lg">
            <p className="text-neon-blue text-sm">
              Please <Link href="/login?redirect=pricing" className="underline hover:text-neon-blue/80">sign in</Link> to purchase credits or subscribe to plans.
            </p>
          </div>
        )}
      </header>

      {/* Subscription Plans */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">Seductive Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-8 relative ${plan.popular ? 'border-2 border-neon-pink' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-neon-pink text-dark-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-neon-pink mb-2">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg text-gray-400">/month</span>}
                </div>
                <p className="text-gray-400">{plan.credits} credits included</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <span className="text-neon-green mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Link href="/signup" className="cyber-button w-full block text-center">
                  Get Started Free
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.priceId!)}
                  disabled={loading === 'subscription'}
                  className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === 'subscription' ? 'Processing...' : 'Subscribe Now'}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Packages */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">Pay-Per-Minute Seduction Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {creditPackages.map((pkg, index) => (
            <motion.div
              key={pkg.credits}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center hover:scale-105 transition-transform"
            >
                        <div className="text-3xl font-bold text-neon-blue mb-2">{pkg.credits}</div>
          <div className="text-gray-400 mb-2">Minutes</div>
              <div className="text-2xl font-bold text-white mb-2">${pkg.price}</div>
              {pkg.savings > 0 && (
                <div className="text-neon-green text-sm mb-4">Save {pkg.savings}%</div>
              )}
              <button
                onClick={() => handleBuyCredits(pkg.credits, pkg.price)}
                disabled={loading === `credits-${pkg.credits}`}
                className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === `credits-${pkg.credits}` ? 'Processing...' : 'Buy Now'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-8">Seductive FAQ</h2>
        <div className="space-y-6">
                      {[
            {
              question: 'How do fantasy calls work?',
              answer: 'Each credit allows you to make one seductive AI conversation. Sessions are billed per minute, with 1 credit = 1 minute of fantasy time with your chosen companion.'
            },
            {
              question: 'Can I cancel my subscription?',
              answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.'
            },
            {
              question: 'What happens if I run out of credits?',
              answer: 'You can purchase additional seduction packages or upgrade to a subscription plan to continue your intimate conversations.'
            },
            {
              question: 'Are there any hidden fees?',
              answer: 'No hidden fees. You only pay for the credits or subscription you choose. All prices include taxes where applicable.'
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
              <p className="text-gray-400">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16"
      >
        <div className="glass-card p-8 max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Seduction?</h2>
        <p className="text-gray-400 mb-6">
          Join thousands of users already experiencing the future of AI fantasy companionship
        </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="cyber-button">
              Start Your Seduction
            </Link>
            <Link href="/demo" className="px-6 py-3 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-dark-900 transition-all duration-300 rounded-xl">
              Watch Demo
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

