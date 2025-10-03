'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

interface VideoInfo {
  title: string
  thumbnail: string
  duration: number
  formats: Format[]
  uploader: string
  view_count: number
}

interface Format {
  format_id: string
  ext: string
  resolution: string
  filesize: number | null
  format_note: string
  vcodec: string
  acodec: string
  fps: number | null
}

export default function VideoDownloader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [selectedFormat, setSelectedFormat] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setVideoInfo(null)
    setDownloadUrl('')

    try {
      const response = await axios.post('/api/info', { url })
      setVideoInfo(response.data)
      if (response.data.formats && response.data.formats.length > 0) {
        setSelectedFormat(response.data.formats[0].format_id)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch video information')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = async () => {
    setLoading(true)
    setError('')
    setVideoInfo(null)
    setDownloadUrl('')
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    try {
      const response = await axios.get('/api/demo')
      setVideoInfo(response.data)
      if (response.data.formats && response.data.formats.length > 0) {
        setSelectedFormat(response.data.formats[0].format_id)
      }
    } catch (err: any) {
      setError('Failed to load demo data')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!selectedFormat) {
      setError('Please select a format')
      return
    }

    setDownloading(true)
    setError('')
    setDownloadUrl('')

    try {
      const response = await axios.post('/api/download', {
        url,
        format: selectedFormat,
      })
      setDownloadUrl(response.data.downloadUrl)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download video')
    } finally {
      setDownloading(false)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* URL Input Card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here (YouTube, SoundCloud, etc.)"
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleGetInfo()}
            />
          </div>
          <button
            onClick={handleGetInfo}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Get Info'
            )}
          </button>
        </div>

        {/* Demo Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleDemo}
            disabled={loading}
            className="text-sm text-purple-300 hover:text-purple-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try Demo (No download required)
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 backdrop-blur-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Video Information */}
      {videoInfo && (
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/20">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-80 shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  width={320}
                  height={180}
                  className="w-full h-auto"
                  unoptimized
                />
                <div className="absolute bottom-2 right-2 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                  {formatDuration(videoInfo.duration)}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                {videoInfo.title}
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{videoInfo.uploader}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{videoInfo.view_count?.toLocaleString() || 'N/A'} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Select Quality & Format
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
              {videoInfo.formats.map((format) => (
                <button
                  key={format.format_id}
                  onClick={() => setSelectedFormat(format.format_id)}
                  className={`p-4 rounded-xl text-left transition-all transform hover:scale-105 ${
                    selectedFormat === format.format_id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-transparent shadow-lg shadow-purple-500/50'
                      : 'bg-white/10 border-2 border-white/20 hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-bold text-white text-lg">
                    {format.resolution || format.format_note}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {format.vcodec !== 'none' && format.acodec !== 'none' && 'Video + Audio'}
                    {format.vcodec !== 'none' && format.acodec === 'none' && 'Video Only'}
                    {format.vcodec === 'none' && format.acodec !== 'none' && 'Audio Only'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-8">
            <button
              onClick={handleDownload}
              disabled={downloading || !selectedFormat}
              className="w-full px-8 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg shadow-green-500/50"
            >
              {downloading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </span>
              )}
            </button>
          </div>

          {/* Download Link */}
          {downloadUrl && (
            <div className="mt-4 p-6 bg-green-500/20 border border-green-500/50 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 font-semibold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Video ready for download!
                  </p>
                  <p className="text-sm text-gray-300">Click the button to download your video</p>
                </div>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-500/50"
                >
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  )
}
