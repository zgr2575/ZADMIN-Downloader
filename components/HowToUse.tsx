import { Typography, Card, CardContent, Box, Avatar } from '@mui/material'

export default function HowToUse() {
  const steps = [
    {
      number: 1,
      title: 'Paste URL',
      description: 'Copy the video URL from YouTube or any supported website and paste it into the input field.',
    },
    {
      number: 2,
      title: 'Get Info',
      description: 'Click "Get Info" to fetch video details and available download formats.',
    },
    {
      number: 3,
      title: 'Select Format',
      description: 'Choose your preferred quality and format from the available options.',
    },
    {
      number: 4,
      title: 'Download',
      description: 'Click "Download Video" and wait for your file to be processed and uploaded.',
    },
  ]

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
          How to Use
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Download videos in 4 simple steps
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4 }}>
        {steps.map((step) => (
          <Card
            key={step.number}
            elevation={2}
            sx={{
              height: '100%',
              position: 'relative',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <CardContent sx={{ textAlign: 'center', pt: 5 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.main',
                  position: 'absolute',
                  top: -28,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  boxShadow: 4,
                }}
              >
                {step.number}
              </Avatar>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
