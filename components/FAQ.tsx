import { Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function FAQ() {
  const faqs = [
    {
      question: 'What websites are supported?',
      answer: 'We support over 1000 websites including YouTube, Vimeo, TikTok, Facebook, Instagram, Twitter, Dailymotion, and many more. Basically, if yt-dlp supports it, we do too!',
    },
    {
      question: 'What video qualities are available?',
      answer: 'You can download videos in any available quality from 144p up to 8K, including 4K, 1080p, 720p, and more. The available qualities depend on what the source website offers.',
    },
    {
      question: 'Can I download audio only?',
      answer: 'Yes! You can select audio-only formats in various qualities including high-quality audio formats like M4A and OPUS.',
    },
    {
      question: 'Is there a download limit?',
      answer: 'No, there are no limits. You can download as many videos as you want, completely free.',
    },
    {
      question: 'Do you store my downloads?',
      answer: 'Downloads are temporarily stored on Gofile servers and are available for a limited time. We don\'t permanently store your downloads or track what you download.',
    },
    {
      question: 'How long are downloads available?',
      answer: 'Downloads are typically available for 24-48 hours through the Gofile link before they expire.',
    },
    {
      question: 'Can I download playlists?',
      answer: 'Currently, the app is optimized for single video downloads. Playlist support may be added in future updates.',
    },
    {
      question: 'Is it legal to download videos?',
      answer: 'The legality depends on the content and your jurisdiction. Only download videos you have the right to download, such as your own content or content with appropriate licenses.',
    },
  ]

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight={700}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Got questions? We&apos;ve got answers.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {faqs.map((faq, index) => (
          <Accordion key={index} elevation={2} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  )
}
