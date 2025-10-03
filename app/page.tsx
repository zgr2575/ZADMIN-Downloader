'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material'
import VideoDownloader from '@/components/VideoDownloader'
import Features from '@/components/Features'
import HowToUse from '@/components/HowToUse'
import FAQ from '@/components/FAQ'
import DownloadIcon from '@mui/icons-material/Download'

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
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar>
            <DownloadIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              ZADMIN Video Downloader
            </Typography>
            <Button color="inherit" href="#features">Features</Button>
            <Button color="inherit" href="#how-to">How To</Button>
            <Button color="inherit" href="#faq">FAQ</Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Download Videos in Any Quality
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              Professional video downloader supporting YouTube and 1000+ platforms. 
              Choose your quality, format, and download instantly.
            </Typography>
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
        <Box sx={{ bgcolor: 'background.default', borderTop: 1, borderColor: 'divider', py: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              Powered by{' '}
              <Typography component="a" href="https://github.com/distubejs/ytdl-core" target="_blank" rel="noopener" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                ytdl-core
              </Typography>
              {' & '}
              <Typography component="a" href="https://github.com/play-dl/play-dl" target="_blank" rel="noopener" sx={{ color: 'secondary.main', textDecoration: 'none' }}>
                play-dl
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              © 2024 ZADMIN Downloader. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
