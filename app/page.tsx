'use client'

import { useState } from 'react'
import VideoDownloader from '@/components/VideoDownloader'
import Features from '@/components/Features'
import HowToUse from '@/components/HowToUse'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  ZADMIN
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Video Downloader</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
              <a href="#how-to" className="text-gray-300 hover:text-white transition-colors font-medium">How It Works</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors font-medium">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm text-purple-300 font-medium">Free • Fast • Secure</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Download Videos in
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Any Quality
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Professional video downloader supporting <span className="text-purple-400 font-semibold">YouTube</span> and{' '}
            <span className="text-blue-400 font-semibold">1000+ platforms</span>.
            Choose your quality, format, and download instantly.
          </p>
        </div>

        {/* Main Downloader Component */}
        <VideoDownloader />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 bg-gradient-to-b from-transparent to-black/20">
        <Features />
      </section>

      {/* How to Use Section */}
      <section id="how-to" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <HowToUse />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FAQ />
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-white/5 backdrop-blur-xl mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">ZADMIN</span>
            </div>
            
            <p className="text-gray-400 mb-4">
              Powered by{' '}
              <a href="https://github.com/distubejs/ytdl-core" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition">
                ytdl-core
              </a>
              {' '}&{' '}
              <a href="https://github.com/play-dl/play-dl" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition">
                play-dl
              </a>
            </p>
            
            <p className="text-sm text-gray-500">© 2024 ZADMIN Downloader. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}
