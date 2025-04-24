// app/api/stats/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://solanacompass.com/stats', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch Solana stats')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}