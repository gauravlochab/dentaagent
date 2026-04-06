import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DentaAgent — Dental Insurance Verification Copilot',
  description: 'AI-powered dental insurance verification and booking agent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ height: '100vh', overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
