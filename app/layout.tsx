import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ZADMIN Video Downloader - Download Videos in Any Quality',
  description: 'Advanced video downloader supporting YouTube and hundreds of other sites. Download videos in any quality, format, and resolution. Fast, free, and easy to use.',
  keywords: 'video downloader, youtube downloader, download youtube videos, online video downloader, free video downloader, yt-dlp, video download, mp4 downloader, hd video downloader',
  openGraph: {
    title: 'ZADMIN Video Downloader - Download Videos in Any Quality',
    description: 'Download videos from YouTube and hundreds of other sites in any quality and format',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZADMIN Video Downloader',
    description: 'Download videos from YouTube and hundreds of other sites',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ZADMIN Video Downloader',
    description: 'Advanced video downloader supporting YouTube and hundreds of other sites. Download videos in any quality, format, and resolution.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Download videos from YouTube and 1000+ websites',
      'Multiple quality options from 144p to 8K',
      'Support for MP4, WebM, MKV formats',
      'Audio-only downloads',
      'Fast and secure',
    ],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
