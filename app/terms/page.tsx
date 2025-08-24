'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Terms & Conditions</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Acceptance of Terms</h2>
              <p>By accessing and using ProposalAI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Service Description</h2>
              <p>ProposalAI provides AI-powered adult entertainment services through conversational AI companions. Our service includes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>AI receptionist services for fantasy guidance</li>
                <li>AI companion conversations and roleplay</li>
                <li>Voice integration through ElevenLabs</li>
                <li>Credit-based usage system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">User Eligibility</h2>
              <p>You must be at least 18 years old to use our services. By using our service, you represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into this agreement</li>
                <li>You will use the service in compliance with all applicable laws</li>
                <li>You will not use the service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Account Registration</h2>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Payment Terms</h2>
              <p>Our services operate on a credit-based system:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Credits are purchased through Stripe payment processing</li>
                <li>1 credit equals 1 minute of conversation time</li>
                <li>Subscription plans provide monthly credit allocations</li>
                <li>All payments are non-refundable unless required by law</li>
                <li>Prices are subject to change with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Acceptable Use Policy</h2>
              <p>You agree not to use our service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Engage in illegal activities or violate any laws</li>
                <li>Harass, abuse, or harm other users or our staff</li>
                <li>Attempt to reverse engineer or hack our systems</li>
                <li>Share explicit content with minors</li>
                <li>Use automated systems to access our services</li>
                <li>Violate intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Content and Conversations</h2>
              <p>While we provide AI companions for adult entertainment:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>All conversations are AI-generated and fictional</li>
                <li>Users are responsible for their own behavior and content</li>
                <li>We reserve the right to monitor and moderate conversations</li>
                <li>Explicit content must comply with our community guidelines</li>
                <li>We do not guarantee the accuracy of AI responses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Privacy and Data</h2>
              <p>Your privacy is important to us. Please review our Privacy Policy for details on how we collect, use, and protect your information. By using our service, you consent to our data practices as described in our Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Intellectual Property</h2>
              <p>All content, features, and functionality of our service are owned by ProposalAI and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, ProposalAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of our service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Termination</h2>
              <p>We may terminate or suspend your account and access to our services at any time, with or without cause, with or without notice. You may terminate your account at any time by contacting us or using the account deletion feature in your dashboard.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ProposalAI operates, without regard to its conflict of law provisions.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last Updated" date. Your continued use of the service after such changes constitutes acceptance of the new terms.</p>
              <p className="mt-3 text-sm text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neon-pink mb-4">Contact Information</h2>
              <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
              <div className="mt-3 p-4 bg-dark-700 rounded-lg">
                <p className="text-neon-pink">Email: legal@proposalai.space</p>
                <p className="text-gray-400 text-sm mt-2">We will respond to your inquiry within 48 hours.</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
