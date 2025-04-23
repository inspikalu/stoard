import { NextResponse } from 'next/server';
import { getStakingData } from '@/lib/stakingDB';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getStakingData();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}