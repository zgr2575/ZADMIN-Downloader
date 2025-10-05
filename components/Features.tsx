import { Container, Typography, Card, CardContent, Box, Stack } from '@mui/material'
import SpeedIcon from '@mui/icons-material/Speed'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import HighQualityIcon from '@mui/icons-material/HighQuality'
import LanguageIcon from '@mui/icons-material/Language'
import LockIcon from '@mui/icons-material/Lock'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'

export default function Features() {
  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Lightning Fast',
      description: 'Optimized download speeds with ytdl-core backend. Get your videos quickly and efficiently.',
    },
    {
      icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />,
      title: 'Multiple Formats',
      description: 'Download in MP4, WebM, MKV, and more. Choose audio-only or video with audio.',
    },
    {
      icon: <HighQualityIcon sx={{ fontSize: 40 }} />,
      title: 'Any Quality',
      description: 'From 144p to 8K. Select the exact quality you need, including 4K and HDR content.',
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      title: '1000+ Websites',
      description: 'Support for YouTube, Vimeo, TikTok, Facebook, Instagram, Twitter, and many more.',
    },
    {
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      title: 'Secure & Private',
      description: 'Your downloads are processed securely. We don\'t store or track your downloads.',
    },
    {
      icon: <MoneyOffIcon sx={{ fontSize: 40 }} />,
      title: 'Free Forever',
      description: 'No hidden fees, no subscriptions. Download unlimited videos completely free.',
    },
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
          Powerful Features
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Everything you need in a video downloader
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
        {features.map((feature, index) => (
          <Card
            key={index}
            elevation={2}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  )
}
