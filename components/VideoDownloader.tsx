'use client'

import { useState } from 'react'
import axios from 'axios'

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
  const [downloadProgress, setDownloadProgress] = useState(0)
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
      // Select best format by default
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
      // Select best format by default
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
    setDownloadProgress(0)

    try {
      const response = await axios.post('/api/download', {
        url,
        format: selectedFormat,
      })

      setDownloadUrl(response.data.downloadUrl)
      setDownloadProgress(100)
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
    <div className="max-w-4xl mx-auto">
      {/* URL Input */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL here (YouTube, Vimeo, TikTok, etc.)"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleGetInfo()}
          />
          <button
            onClick={handleGetInfo}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Demo (No download required)
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Video Information */}
      {videoInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className="w-full md:w-64 h-auto rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {videoInfo.title}
              </h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {videoInfo.uploader}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: {formatDuration(videoInfo.duration)}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {videoInfo.view_count?.toLocaleString() || 'N/A'} views
                </p>
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Quality & Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {videoInfo.formats.map((format) => (
                <button
                  key={format.format_id}
                  onClick={() => setSelectedFormat(format.format_id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedFormat === format.format_id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {format.resolution || format.format_note}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {format.vcodec !== 'none' && `Video: ${format.vcodec}`}
                    {format.vcodec !== 'none' && format.acodec !== 'none' && ' • '}
                    {format.acodec !== 'none' && `Audio: ${format.acodec}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-6">
            <button
              onClick={handleDownload}
              disabled={downloading || !selectedFormat}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium text-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {downloading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing... {downloadProgress}%
                </span>
              ) : (
                'Download Video'
              )}
            </button>
          </div>

          {/* Download Link */}
          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium mb-2">
                ✓ Video ready for download!
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Click here to download
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
