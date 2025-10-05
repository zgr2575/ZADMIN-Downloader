# API Documentation

## Overview

ZADMIN Downloader provides a REST API for video downloading functionality. All endpoints accept and return JSON.

## Endpoints

### 1. Get Video Information

Fetch video metadata and available formats.

**Endpoint**: `POST /api/info`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response** (Success - 200):
```json
{
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 212,
  "uploader": "Channel Name",
  "view_count": 1234567,
  "formats": [
    {
      "format_id": "137+140",
      "ext": "mp4",
      "resolution": "1920x1080",
      "filesize": 52428800,
      "format_note": "1080p",
      "vcodec": "avc1.640028",
      "acodec": "mp4a.40.2",
      "fps": 30
    }
  ]
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Error message"
}
```

**Example**:
```javascript
const response = await fetch('/api/info', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  })
});

const data = await response.json();
```

---

### 2. Download Video

Download video in selected format and upload to Gofile.

**Endpoint**: `POST /api/download`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format": "137+140"
}
```

**Response** (Success - 200):
```json
{
  "downloadUrl": "https://gofile.io/d/XXXXXX",
  "fileName": "video_title.mp4"
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Error message"
}
```

**Example**:
```javascript
const response = await fetch('/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    format: '137+140'
  })
});

const data = await response.json();
console.log('Download URL:', data.downloadUrl);
```

---

### 3. Demo Data

Get mock video data for testing/demo purposes.

**Endpoint**: `GET /api/demo`

**Response** (Success - 200):
```json
{
  "title": "Rick Astley - Never Gonna Give You Up (Official Video)",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "duration": 212,
  "uploader": "Rick Astley",
  "view_count": 1456789012,
  "formats": [...]
}
```

**Example**:
```javascript
const response = await fetch('/api/demo');
const demoData = await response.json();
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid URL or missing parameters |
| 500  | Internal Server Error - Download or processing failed |

## Rate Limiting

Currently, there are no rate limits, but it's recommended to:
- Limit requests to 1 per second per user
- Cache video info when possible
- Implement client-side throttling

## Best Practices

1. **Always validate URLs** before sending to the API
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** during API calls
4. **Cache responses** when appropriate
5. **Implement retry logic** for failed requests

## Supported Websites

The API supports all websites that yt-dlp supports, including:
- YouTube
- Vimeo
- TikTok
- Facebook
- Instagram
- Twitter/X
- Reddit
- And 1000+ more

[Full list of supported sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)

## Format Selection

Format IDs combine video and audio streams:
- `137+140` = 1080p video + medium audio
- `136+140` = 720p video + medium audio
- `140` = audio only

## Limitations

### Vercel Deployment
- 10s timeout on free tier (60s on Pro)
- File size limits for downloads
- Serverless function constraints

### Gofile
- Files stored temporarily (24-48 hours)
- Download speed may vary
- No authentication required

## Integration Examples

### React/Next.js
```typescript
import { useState } from 'react';

function VideoDownloader() {
  const [videoInfo, setVideoInfo] = useState(null);
  
  const getInfo = async (url: string) => {
    const response = await fetch('/api/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setVideoInfo(data);
  };
  
  return (
    // Your component JSX
  );
}
```

### cURL
```bash
# Get video info
curl -X POST http://localhost:3000/api/info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download video
curl -X POST http://localhost:3000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","format":"137+140"}'
```

### Python
```python
import requests

# Get video info
response = requests.post('http://localhost:3000/api/info', 
    json={'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'})
video_info = response.json()

# Download video
response = requests.post('http://localhost:3000/api/download',
    json={
        'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'format': '137+140'
    })
download_data = response.json()
print(f"Download URL: {download_data['downloadUrl']}")
```

## Future Enhancements

Planned API improvements:
- Batch download support
- Playlist endpoints
- Download progress tracking
- User authentication
- Download history
- Format recommendations based on quality/size preferences
