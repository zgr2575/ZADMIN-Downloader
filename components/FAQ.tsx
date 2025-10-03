'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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
      answer: 'Downloads are temporarily stored on Gofile servers and are available for a limited time. We don&apos;t permanently store your downloads or track what you download.',
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
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Got questions? We&apos;ve got answers.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
