import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Malik Stone | Chat with Me',
  description: 'Have a conversation with Malik Stone - Your AI companion',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Background orbs */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        
        {/* Noise texture overlay */}
        <div className="noise-overlay" />
        
        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}

