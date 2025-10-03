'use client'

import { useState } from 'react'
import VideoDownloader from '@/components/VideoDownloader'
import Features from '@/components/Features'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ZADMIN Downloader
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Features</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Download Videos in{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Any Quality
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Support for YouTube and 1000+ websites. Choose your preferred quality, format, and resolution.
            Fast, reliable, and completely free.
          </p>
        </div>

        {/* Main Downloader Component */}
        <VideoDownloader />
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white/50 dark:bg-gray-800/50 py-16">
        <Features />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FAQ />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Powered by{' '}
              <a href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                yt-dlp
              </a>
              {' '}&amp;{' '}
              <a href="https://gofile.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                Gofile
              </a>
            </p>
            <p className="text-sm">© 2024 ZADMIN Downloader. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
