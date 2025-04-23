// app/api/stake-concentration/route.ts
import { NextResponse } from 'next/server';
export const runtime = 'edge';
export async function GET() {
  try {
    // Fetch real-time data from Solana RPC
    const rpcResponse = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getVoteAccounts',
      }),
    });

    if (!rpcResponse.ok) {
      throw new Error('Failed to fetch data from Solana RPC');
    }

    const rpcData = await rpcResponse.json();
    const voteAccounts = rpcData.result.current.concat(rpcData.result.delinquent);

    // Extract stake amounts
    const stakes = voteAccounts.map((account: any) => account.activatedStake);
    const totalStake = stakes.reduce((sum: number, stake: number) => sum + stake, 0);

    // Sort stakes in ascending order for Lorenz curve calculation
    const sortedStakes = [...stakes].sort((a, b) => a - b);

    // Calculate cumulative percentages for Lorenz curve
    const lorenzCurvePoints = [];
    let cumulativeStake = 0;

    for (let i = 0; i < sortedStakes.length; i++) {
      cumulativeStake += sortedStakes[i];
      lorenzCurvePoints.push({
        populationPercentage: ((i + 1) / sortedStakes.length) * 100,
        stakePercentage: (cumulativeStake / totalStake) * 100,
      });
    }

    // Calculate Gini coefficient
    let giniNumerator = 0;
    for (let i = 0; i < sortedStakes.length; i++) {
      for (let j = 0; j < sortedStakes.length; j++) {
        giniNumerator += Math.abs(sortedStakes[i] - sortedStakes[j]);
      }
    }

    const giniDenominator = 2 * sortedStakes.length * totalStake;
    const giniCoefficient = giniNumerator / giniDenominator;

    // Try to fetch historical data from Helius API if API key is available
    let historicalData = null;
    if (process.env.HELIUS_API_KEY) {
      try {
        const heliusResponse = await fetch(
          `https://api.helius.xyz/v0/stake-history?api-key=${process.env.HELIUS_API_KEY}`
        );
        
        if (heliusResponse.ok) {
          historicalData = await heliusResponse.json();
        }
      } catch (error) {
        console.error('Error fetching Helius data:', error);
      }
    }

    return NextResponse.json({
      giniCoefficient,
      lorenzCurve: lorenzCurvePoints,
      currentStakeDistribution: {
        totalValidators: sortedStakes.length,
        totalStake: totalStake,
        averageStake: totalStake / sortedStakes.length,
        medianStake: sortedStakes[Math.floor(sortedStakes.length / 2)],
      },
      historicalData: historicalData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in stake concentration analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze stake concentration' },
      { status: 500 }
    );
  }
}