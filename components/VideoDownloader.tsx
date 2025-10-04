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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
import SpeedIcon from '@mui/icons-material/Speed'
import TimerIcon from '@mui/icons-material/Timer'
import WarningIcon from '@mui/icons-material/Warning'

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

interface DownloadProgress {
  stage: string
  progress: number
  speed?: string
  eta?: string
  elapsed?: string
  downloaded?: string
  total?: string
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
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    stage: '',
    progress: 0,
  })
  const [preferredFormat, setPreferredFormat] = useState<string>('mp4')
  const [preferredQuality, setPreferredQuality] = useState<string>('best')
  const [isVercelEnv, setIsVercelEnv] = useState(false)

  // Check if we're on Vercel on mount
  useState(() => {
    const checkVercel = async () => {
      try {
        const response = await axios.get('/api/environment')
        setIsVercelEnv(response.data.isVercel || false)
      } catch {
        // Ignore errors, default to false
      }
    }
    checkVercel()
  })

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
    if (!selectedFormat && !preferredFormat) {
      setError('Please select a format or set your preferences')
      return
    }

    setDownloading(true)
    setError('')
    setDownloadUrl('')
    setExpiresAt('')
    setDownloadStage('Preparing download...')
    setDownloadProgress({
      stage: 'Initializing',
      progress: 0,
    })

    try {
      const startTime = Date.now()
      let progressInterval: NodeJS.Timeout
      
      // Simulate progress updates
      progressInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        const elapsedStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
        
        setDownloadProgress((prev) => {
          const newProgress = Math.min(prev.progress + Math.random() * 5, 95)
          return {
            ...prev,
            progress: newProgress,
            elapsed: elapsedStr,
            speed: `${(Math.random() * 5 + 1).toFixed(2)} MB/s`,
            eta: newProgress > 50 ? `${Math.floor((100 - newProgress) / 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 'Calculating...',
          }
        })
      }, 500)
      
      setDownloadStage('Downloading video from source...')
      setDownloadProgress(prev => ({ ...prev, stage: 'Downloading' }))
      
      const response = await axios.post('/api/download', {
        url,
        format: selectedFormat || undefined,
        preferredFormat: !selectedFormat ? preferredFormat : undefined,
        preferredQuality: !selectedFormat ? preferredQuality : undefined,
      })
      
      clearInterval(progressInterval)
      
      setDownloadStage('Complete! Your download is ready...')
      setDownloadProgress({
        stage: 'Complete',
        progress: 100,
        elapsed: '0:00',
      })
      setDownloadUrl(response.data.downloadUrl)
      setExpiresAt(response.data.expiresAt)
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
      {/* Vercel Warning */}
      {isVercelEnv && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" fontWeight={600}>
            Limited Functionality on Vercel
          </Typography>
          <Typography variant="caption">
            Running on Vercel serverless environment. Only YouTube videos are supported. 
            For full platform support (TikTok, Instagram, etc.), deploy to a VPS or dedicated server.
          </Typography>
        </Alert>
      )}

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

            {/* Preferred Format Selection */}
            <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
              Choose Your Preferences
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Preferred Format</InputLabel>
                <Select
                  value={preferredFormat}
                  label="Preferred Format"
                  onChange={(e) => setPreferredFormat(e.target.value)}
                >
                  <MenuItem value="mp4">MP4 (Video)</MenuItem>
                  <MenuItem value="webm">WebM (Video)</MenuItem>
                  <MenuItem value="mkv">MKV (Video)</MenuItem>
                  <MenuItem value="m4a">M4A (Audio)</MenuItem>
                  <MenuItem value="mp3">MP3 (Audio)</MenuItem>
                  <MenuItem value="opus">Opus (Audio)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Quality Preference</InputLabel>
                <Select
                  value={preferredQuality}
                  label="Quality Preference"
                  onChange={(e) => setPreferredQuality(e.target.value)}
                >
                  <MenuItem value="best">Best Quality (Largest)</MenuItem>
                  <MenuItem value="2160">4K (2160p)</MenuItem>
                  <MenuItem value="1440">2K (1440p)</MenuItem>
                  <MenuItem value="1080">Full HD (1080p)</MenuItem>
                  <MenuItem value="720">HD (720p)</MenuItem>
                  <MenuItem value="480">SD (480p)</MenuItem>
                  <MenuItem value="360">Low (360p)</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Format Selection */}
            <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
              Or Choose Specific Format
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
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <CircularProgress size={50} thickness={4} />
                      <Box>
                        <Typography variant="h6" fontWeight={600} color="primary">
                          {downloadStage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {downloadProgress.stage} - {Math.round(downloadProgress.progress)}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Progress: {Math.round(downloadProgress.progress)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {downloadProgress.downloaded || '0 MB'} / {downloadProgress.total || '??? MB'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={downloadProgress.progress} 
                        sx={{ height: 8, borderRadius: 4 }} 
                      />
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <SpeedIcon fontSize="small" color="secondary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Speed
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {downloadProgress.speed || '0 MB/s'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TimerIcon fontSize="small" color="primary" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Elapsed
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {downloadProgress.elapsed || '0:00'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1, flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon fontSize="small" color="success" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ETA
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {downloadProgress.eta || 'Calculating...'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
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
                disabled={downloading || (!selectedFormat && !preferredFormat)}
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
                {downloading ? 'Processing Your Download...' : selectedFormat ? 'Download Selected Format' : 'Download with Preferences'}
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
