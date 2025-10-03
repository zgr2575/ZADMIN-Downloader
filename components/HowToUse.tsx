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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          How to Use
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Download videos in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md relative"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {step.number}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
