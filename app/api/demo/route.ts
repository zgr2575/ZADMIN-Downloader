import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock video data for demo purposes
const mockVideoData = {
  title: "Rick Astley - Never Gonna Give You Up (Official Video)",
  thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  duration: 212,
  uploader: "Rick Astley",
  view_count: 1456789012,
  formats: [
    {
      format_id: "137+140",
      ext: "mp4",
      resolution: "1920x1080",
      filesize: 52428800,
      format_note: "1080p",
      vcodec: "avc1.640028",
      acodec: "mp4a.40.2",
      fps: 30,
    },
    {
      format_id: "136+140",
      ext: "mp4",
      resolution: "1280x720",
      filesize: 31457280,
      format_note: "720p",
      vcodec: "avc1.4d401f",
      acodec: "mp4a.40.2",
      fps: 30,
    },
    {
      format_id: "135+140",
      ext: "mp4",
      resolution: "854x480",
      filesize: 15728640,
      format_note: "480p",
      vcodec: "avc1.4d401e",
      acodec: "mp4a.40.2",
      fps: 30,
    },
    {
      format_id: "134+140",
      ext: "mp4",
      resolution: "640x360",
      filesize: 10485760,
      format_note: "360p",
      vcodec: "avc1.4d401e",
      acodec: "mp4a.40.2",
      fps: 30,
    },
    {
      format_id: "140",
      ext: "m4a",
      resolution: "audio only",
      filesize: 3407872,
      format_note: "medium",
      vcodec: "none",
      acodec: "mp4a.40.2",
      fps: null,
    },
  ],
}

export async function GET(request: NextRequest) {
  return NextResponse.json(mockVideoData)
}
