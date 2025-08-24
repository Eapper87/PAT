import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProposalAI - AI-Powered Adult Entertainment Hotline',
  description: 'Experience the future of adult entertainment with AI-powered companions. Connect instantly with seductive AI performers and intimate conversations.',
  keywords: 'AI, adult entertainment, hotline, companions, performers, artificial intelligence, voice agents',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon-precomposed.png' },
    ],
    other: [
      { url: '/android-icon-36x36.png', sizes: '36x36', type: 'image/png' },
      { url: '/android-icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/android-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/android-icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/ms-icon-70x70.png', sizes: '70x70', type: 'image/png' },
      { url: '/ms-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/ms-icon-150x150.png', sizes: '150x150', type: 'image/png' },
      { url: '/ms-icon-310x310.png', sizes: '310x310', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'msapplication-config': '/browserconfig.xml',
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="16cfb3e5-add2-42c2-ba4c-682a0c896876";
              (function(){
                var d=document;
                var s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen gradient-bg flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-dark-900/50 border-t border-neon-pink/20 py-6 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-400 text-sm">
                  © 2024 ProposalAI. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <Link href="/privacy" className="text-gray-400 hover:text-neon-pink transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-neon-pink transition-colors">
                    Terms & Conditions
                  </Link>
                  <a 
                    href="mailto:support@proposalai.space" 
                    className="text-gray-400 hover:text-neon-pink transition-colors"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

