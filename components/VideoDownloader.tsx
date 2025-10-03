'use client'

import { useState } from 'react'
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Stack,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
    <Box>
      {/* URL Input Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Paste video URL here (YouTube, SoundCloud, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGetInfo()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleGetInfo}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              >
                {loading ? 'Loading...' : 'Get Info'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleDemo}
                disabled={loading}
                startIcon={<PlayArrowIcon />}
                sx={{ minWidth: 150 }}
              >
                Try Demo
              </Button>
            </Stack>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Video Information */}
      {videoInfo && (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
              {/* Thumbnail and Info */}
              <Box>
                <Box
                  component="img"
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {videoInfo.title}
                </Typography>
                
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {videoInfo.uploader}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <AccessTimeIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Duration: {formatDuration(videoInfo.duration)}
                    </Typography>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VisibilityIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {videoInfo.view_count?.toLocaleString() || 'N/A'} views
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Format Selection */}
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Select Quality & Format
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mt: 1, maxHeight: 400, overflowY: 'auto' }}>
              {videoInfo.formats.map((format) => (
                  <Card
                    key={format.format_id}
                    variant={selectedFormat === format.format_id ? 'elevation' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      border: selectedFormat === format.format_id ? 2 : 1,
                      borderColor: selectedFormat === format.format_id ? 'primary.main' : 'divider',
                      bgcolor: selectedFormat === format.format_id ? 'action.selected' : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.02)',
                      },
                    }}
                    onClick={() => setSelectedFormat(format.format_id)}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight={600}>
                        {format.resolution || format.format_note}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                      </Typography>
                      <Chip
                        size="small"
                        label={
                          format.vcodec !== 'none' && format.acodec !== 'none'
                            ? 'Video + Audio'
                            : format.vcodec !== 'none'
                            ? 'Video Only'
                            : 'Audio Only'
                        }
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
              ))}
            </Box>

            {/* Download Button */}
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleDownload}
                disabled={downloading || !selectedFormat}
                startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                sx={{ py: 2 }}
              >
                {downloading ? 'Processing...' : 'Download Video'}
              </Button>
            </Box>

            {/* Download Link */}
            {downloadUrl && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight={600} gutterBottom>
                  Video ready for download!
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 1 }}
                >
                  Download Now
                </Button>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
