import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { QueryProvider } from '@/lib/query-provider'
import { Navigation } from '@/components/navigation'
import { MobileNav } from '@/components/mobile-nav'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'MatriPrime | Master Your Future. One Streak at a Time.',
  description: 'Ethiopian #1 Educational Super App for ESLCE/EGSECE preparation. Gamified learning, AI-powered study tools, and community-driven success.',
  keywords: 'ESLCE, EGSECE, Ethiopian education, high school, learning app, gamified, MatriPrime',
  authors: [{ name: 'MatriPrime Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1 relative">
                {children}
              </main>
              <MobileNav />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}