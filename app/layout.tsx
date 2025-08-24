import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProposalAI - AI-Powered Adult Entertainment Hotline',
  description: 'Experience the future of adult entertainment with AI-powered companions. Connect instantly with seductive AI performers and intimate conversations.',
  keywords: 'AI, adult entertainment, hotline, companions, performers, artificial intelligence, voice agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-website-id="68a784dbb17bcd7524d86fd4"
          data-domain="proposalai.space"
          src="https://datafa.st/js/script.js">
        </script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen gradient-bg">
          {children}
        </div>
      </body>
    </html>
  )
}

