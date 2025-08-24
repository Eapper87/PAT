'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-2xl font-cyber font-bold neon-text">
          ProposalAI
        </Link>
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email, username)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Usage data and conversation history</li>
                <li>Communication preferences and settings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve our AI companion services</li>
                <li>Process transactions and manage your account</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Data Retention</h2>
              <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your account and associated data at any time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Third-Party Services</h2>
              <p>We use trusted third-party services including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Supabase for authentication and database management</li>
                <li>Stripe for secure payment processing</li>
                <li>ElevenLabs for AI voice integration</li>
              </ul>
              <p className="mt-3">These services have their own privacy policies and security measures.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our data practices, please contact us at:</p>
              <div className="mt-3 p-4 bg-dark-700 rounded-lg">
                <p className="text-neon-pink">Email: privacy@proposalai.space</p>
                <p className="text-gray-400 text-sm mt-2">We will respond to your inquiry within 48 hours.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.</p>
              <p className="mt-3 text-sm text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
