import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Afacad:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ height: '100vh', overflow: 'hidden' }}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'oklch(99.5% 0.004 80)',
              border: '1px solid oklch(91% 0.012 158)',
              color: 'oklch(13% 0.022 158)',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: '13px',
              boxShadow: '0 4px 16px oklch(13% 0.022 158 / 0.07), 0 1px 3px oklch(13% 0.022 158 / 0.04)',
              borderRadius: '10px',
            },
          }}
        />
      </body>
    </html>
  )
}
