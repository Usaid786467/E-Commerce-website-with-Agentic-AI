import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'E-Commerce Platform - Shop Smart, Shop Fast',
    template: '%s | E-Commerce Platform'
  },
  description: 'Enterprise-grade e-commerce platform with AI-powered features. Discover products, amazing deals, and seamless shopping experience.',
  keywords: ['ecommerce', 'online shopping', 'pakistan', 'ai shopping', 'deals'],
  authors: [{ name: 'E-Commerce Team' }],
  creator: 'E-Commerce Platform',
  publisher: 'E-Commerce Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'E-Commerce Platform - Shop Smart, Shop Fast',
    description: 'Enterprise-grade e-commerce platform with AI-powered features',
    siteName: 'E-Commerce Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Platform - Shop Smart, Shop Fast',
    description: 'Enterprise-grade e-commerce platform with AI-powered features',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
