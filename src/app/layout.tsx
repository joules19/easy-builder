import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'EasyBuilder - Simple Vendor Catalogs',
    template: '%s | EasyBuilder'
  },
  description: 'Create your online product catalog with QR code sharing. Perfect for local businesses and vendors.',
  keywords: ['vendor catalog', 'QR code', 'business listing', 'product showcase'],
  authors: [{ name: 'EasyBuilder Team' }],
  creator: 'EasyBuilder',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'EasyBuilder - Simple Vendor Catalogs',
    description: 'Create your online product catalog with QR code sharing. Perfect for local businesses and vendors.',
    siteName: 'EasyBuilder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasyBuilder - Simple Vendor Catalogs',
    description: 'Create your online product catalog with QR code sharing. Perfect for local businesses and vendors.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}