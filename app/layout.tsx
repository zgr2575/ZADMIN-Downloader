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
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
