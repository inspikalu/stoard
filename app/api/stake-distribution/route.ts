// app/api/stake-distribution/route.ts
import { NextResponse } from 'next/server';

// Fallback data in case API is unavailable
const FALLBACK_DATA = {
  buckets: [
    { stakeRange: '0 - 10K SOL', validatorCount: 1250, totalStake: 4500000, percentage: 12 },
    { stakeRange: '10K - 100K SOL', validatorCount: 850, totalStake: 32000000, percentage: 28 },
    { stakeRange: '100K - 1M SOL', validatorCount: 420, totalStake: 185000000, percentage: 35 },
    { stakeRange: '1M - 10M SOL', validatorCount: 180, totalStake: 750000000, percentage: 20 },
    { stakeRange: '10M+ SOL', validatorCount: 25, totalStake: 450000000, percentage: 5 }
  ],
  updated: new Date().toISOString(),
  source: 'fallback'
};

export async function GET() {
  try {
    // Using a more reliable endpoint with proper SSL configuration
    const apiUrl = 'https://api.solanacompass.com/validators/stake-distribution';
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Uncomment if you have an API key
        // 'Authorization': `Bearer ${process.env.SOLANA_COMPASS_API_KEY}`
      },
      // Force modern TLS
    //   agent: null // This bypasses Node's default agent which sometimes causes issues
    });

    if (!response.ok) {
      console.warn(`API responded with status ${response.status}, using fallback data`);
      return NextResponse.json(FALLBACK_DATA);
    }

    const data = await response.json();

    // Normalize the data for charting
    const normalizedData = normalizeStakeDistributionData(data);

    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Error fetching stake distribution:', error);
    console.warn('Using fallback data due to error');
    return NextResponse.json(FALLBACK_DATA);
  }
}

function normalizeStakeDistributionData(rawData: any) {
  // If the API returns direct buckets with different property names
  if (rawData.stakeDistribution && Array.isArray(rawData.stakeDistribution)) {
    return {
      buckets: rawData.stakeDistribution.map((bucket: any) => ({
        stakeRange: `${bucket.min} - ${bucket.max} SOL`,
        validatorCount: bucket.count,
        totalStake: bucket.total_stake,
        percentage: bucket.percentage
      })),
      updated: rawData.updated || new Date().toISOString(),
      source: 'api'
    };
  }

  // If the data is already in the correct format
  if (rawData.buckets && Array.isArray(rawData.buckets)) {
    return {
      ...rawData,
      source: 'api'
    };
  }

  // Fallback if structure is unrecognized
  return {
    ...FALLBACK_DATA,
    source: 'api-fallback',
    note: 'API returned unrecognized structure'
  };
}