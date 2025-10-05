import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ZADMIN Video Downloader'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L12 16M12 16L8 12M12 16L16 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 20L18 20"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            background: 'white',
            backgroundClip: 'text',
            color: 'white',
            marginBottom: 20,
          }}
        >
          ZADMIN Downloader
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Download videos from YouTube and 1000+ websites in any quality
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
