'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, AppBar, Toolbar, Typography, Button, Chip, Stack, Paper } from '@mui/material'
import VideoDownloader from '@/components/VideoDownloader'
import Features from '@/components/Features'
import HowToUse from '@/components/HowToUse'
import FAQ from '@/components/FAQ'
import DownloadIcon from '@mui/icons-material/Download'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
})

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar 
          position="sticky" 
          elevation={0} 
          sx={{ 
            bgcolor: 'rgba(26, 26, 26, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderBottom: 1, 
            borderColor: 'rgba(156, 39, 176, 0.3)' 
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <DownloadIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1 }}>
                  ZADMIN Downloader
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fast, Secure & Free
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" href="#features">Features</Button>
              <Button color="inherit" href="#how-to">How To</Button>
              <Button color="inherit" href="#faq">FAQ</Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
              <Chip 
                icon={<SecurityIcon />} 
                label="100% Secure" 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                icon={<SpeedIcon />} 
                label="Super Fast" 
                color="secondary" 
                variant="outlined"
              />
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="No Registration" 
                color="success" 
                variant="outlined"
              />
            </Stack>

            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 900,
                background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Download Videos in<br />Any Quality
            </Typography>
            
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto',
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Professional video downloader supporting <strong>YouTube</strong> and <strong>1000+ platforms</strong>. 
              Choose your quality, format, and download instantly with no watermarks.
            </Typography>

            {/* Trust Indicators */}
            <Paper 
              elevation={0}
              sx={{ 
                display: 'inline-block',
                px: 4,
                py: 2,
                background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(245, 0, 87, 0.1) 100%)',
                border: '1px solid rgba(156, 39, 176, 0.3)',
                borderRadius: 2,
              }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3} 
                divider={<Box sx={{ width: 1, height: 40, bgcolor: 'divider' }} />}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    1000+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported Sites
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="secondary">
                    Free
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Always Free
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    8K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Quality
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Main Downloader Component */}
          <VideoDownloader />
        </Container>

        {/* Features Section */}
        <Box id="features" sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Features />
        </Box>

        {/* How to Use Section */}
        <Container id="how-to" maxWidth="lg" sx={{ py: 8 }}>
          <HowToUse />
        </Container>

        {/* FAQ Section */}
        <Box id="faq" sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <FAQ />
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', py: 6 }}>
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  ZADMIN Video Downloader
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fast, reliable, and secure video downloading for everyone
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Chip 
                  icon={<SecurityIcon />} 
                  label="SSL Encrypted" 
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  icon={<VerifiedUserIcon />} 
                  label="No Ads or Malware" 
                  size="small"
                  variant="outlined"
                />
                <Chip 
                  icon={<SpeedIcon />} 
                  label="Lightning Fast" 
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Typography variant="body2" color="text.secondary" align="center">
                Powered by{' '}
                <Typography component="a" href="https://github.com/yt-dlp/yt-dlp" target="_blank" rel="noopener" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                  yt-dlp
                </Typography>
                {' & '}
                <Typography component="a" href="https://gofile.io" target="_blank" rel="noopener" sx={{ color: 'secondary.main', textDecoration: 'none', fontWeight: 600 }}>
                  Gofile
                </Typography>
              </Typography>
              
              <Typography variant="caption" color="text.secondary" align="center">
                © 2024 ZADMIN Downloader. All rights reserved. • Privacy-focused • No tracking
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
