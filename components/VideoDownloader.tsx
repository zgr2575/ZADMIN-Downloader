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
  LinearProgress,
  Skeleton,
  Paper,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InfoIcon from '@mui/icons-material/Info'

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
  const [downloadStage, setDownloadStage] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setVideoInfo(null)
    setDownloadUrl('')
    setExpiresAt('')

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

  const handleDownload = async () => {
    if (!selectedFormat) {
      setError('Please select a format')
      return
    }

    setDownloading(true)
    setError('')
    setDownloadUrl('')
    setExpiresAt('')
    setDownloadStage('Preparing download...')

    try {
      // Simulate download stages for better UX
      setTimeout(() => setDownloadStage('Downloading video...'), 1000)
      setTimeout(() => setDownloadStage('Preparing your private download link...'), 3000)
      
      const response = await axios.post('/api/download', {
        url,
        format: selectedFormat,
      })
      
      setDownloadStage('Complete! Your download is ready...')
      setDownloadUrl(response.data.downloadUrl)
      setExpiresAt(response.data.expiresAt)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download video')
    } finally {
      setDownloading(false)
      setDownloadStage('')
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
      <Card 
        elevation={4} 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(245, 0, 87, 0.1) 100%)',
          border: '1px solid rgba(156, 39, 176, 0.3)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Download Your Video
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paste your video URL below and we&apos;ll fetch all available formats
            </Typography>
          </Box>

          <Stack spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Paste video URL here (YouTube, SoundCloud, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleGetInfo()}
              disabled={loading}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.1rem',
                  bgcolor: 'background.paper',
                }
              }}
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleGetInfo}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ 
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7b1fa2 30%, #c51162 90%)',
                }
              }}
            >
              {loading ? 'Fetching Video Info...' : 'Get Video Information'}
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} icon={<InfoIcon />}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card elevation={3} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: '300px' } }}>
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="80%" height={40} />
                <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="text" width="50%" height={30} />
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 2 }} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Video Information */}
      {videoInfo && !loading && (
        <Card elevation={4} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Video Preview Section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 3,
                background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, rgba(245, 0, 87, 0.05) 100%)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                {/* Thumbnail */}
                <Box sx={{ width: { xs: '100%', md: '350px' } }}>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingTop: '56.25%', // 16:9 aspect ratio
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3,
                    }}
                  >
                    <Box
                      component="img"
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Video Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom fontWeight={700} sx={{ 
                    color: 'primary.main',
                    lineHeight: 1.3,
                  }}>
                    {videoInfo.title}
                  </Typography>
                  
                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Channel
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {videoInfo.uploader}
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTimeIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Duration
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatDuration(videoInfo.duration)}
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VisibilityIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Views
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {videoInfo.view_count?.toLocaleString() || 'N/A'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Paper>

            {/* Format Selection */}
            <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
              Choose Your Format
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select from the available quality options below. Higher quality means larger file size.
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, maxHeight: 500, overflowY: 'auto', pr: 1 }}>
              {videoInfo.formats.map((format) => {
                const isSelected = selectedFormat === format.format_id
                const formatType = format.vcodec !== 'none' && format.acodec !== 'none'
                  ? 'Video + Audio'
                  : format.vcodec !== 'none'
                  ? 'Video Only'
                  : 'Audio Only'
                
                return (
                  <Card
                    key={format.format_id}
                    elevation={isSelected ? 6 : 1}
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: isSelected ? 'primary.main' : 'transparent',
                      bgcolor: isSelected ? 'rgba(156, 39, 176, 0.1)' : 'background.paper',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => setSelectedFormat(format.format_id)}
                  >
                    {isSelected && (
                      <CheckCircleIcon 
                        sx={{ 
                          position: 'absolute', 
                          top: -8, 
                          right: -8, 
                          color: 'primary.main',
                          bgcolor: 'background.paper',
                          borderRadius: '50%',
                          fontSize: 28,
                        }} 
                      />
                    )}
                    <CardContent>
                      <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
                        {format.resolution || format.format_note}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {format.ext.toUpperCase()} • {formatFileSize(format.filesize)}
                      </Typography>
                      <Chip
                        size="small"
                        label={formatType}
                        color={formatType === 'Video + Audio' ? 'primary' : 'secondary'}
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                )
              })}
            </Box>

            {/* Download Button */}
            <Box sx={{ mt: 4 }}>
              {downloading && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    mb: 3,
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(245, 0, 87, 0.1) 100%)',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: 2,
                  }}
                >
                  <Stack spacing={2} alignItems="center">
                    <CircularProgress size={50} thickness={4} />
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {downloadStage}
                    </Typography>
                    <LinearProgress sx={{ width: '100%', height: 6, borderRadius: 3 }} />
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Please wait while we prepare your download. This may take a minute depending on video size.
                    </Typography>
                  </Stack>
                </Paper>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleDownload}
                disabled={downloading || !selectedFormat}
                startIcon={downloading ? <CloudUploadIcon /> : <DownloadIcon />}
                sx={{ 
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  background: downloading 
                    ? 'linear-gradient(45deg, #666 30%, #888 90%)'
                    : 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
                  '&:hover': {
                    background: downloading
                      ? 'linear-gradient(45deg, #666 30%, #888 90%)'
                      : 'linear-gradient(45deg, #7b1fa2 30%, #c51162 90%)',
                  }
                }}
              >
                {downloading ? 'Processing Your Download...' : 'Start Download'}
              </Button>
            </Box>

            {/* Download Success */}
            {downloadUrl && (
              <Paper 
                elevation={0}
                sx={{ 
                  mt: 3,
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%)',
                  border: '2px solid rgba(76, 175, 80, 0.5)',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={700} gutterBottom color="success.main">
                  Your Video is Ready! 🎉
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Your private download link has been generated successfully.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  This link will remain active for 24 hours and can be accessed anytime during this period.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  href={downloadUrl}
                  startIcon={<DownloadIcon />}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                  }}
                >
                  Download Now
                </Button>
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={600}>
                    Your Private Download Link:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1,
                      p: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      wordBreak: 'break-all',
                    }}
                  >
                    {downloadUrl}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    💡 Save this link to download again within 24 hours • Expires: {new Date(expiresAt).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
