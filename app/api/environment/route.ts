import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_URL)
  
  return NextResponse.json({
    isVercel,
    environment: isVercel ? 'vercel' : 'self-hosted',
    limitations: isVercel ? ['YouTube only', 'May encounter bot detection', 'Limited format selection'] : [],
  })
}
