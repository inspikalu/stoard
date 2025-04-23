// app/api/stake-concentration/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export async function GET() {
  try {
    // Fetch vote accounts using Helius RPC :cite[2]:cite[6]
    const rpcResponse = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "stake-analysis",
        method: "getVoteAccounts",
        params: [{ commitment: "confirmed" }], // Added commitment parameter
      }),
    });

    if (!rpcResponse.ok) throw new Error("Helius RPC request failed");

    const { result } = await rpcResponse.json();
    const voteAccounts = result.current.concat(result.delinquent);

    // Stake calculation logic remains similar
    const stakes = voteAccounts.map((a: any) => a.activatedStake);
    const totalStake = stakes.reduce((sum: number, s: number) => sum + s, 0);
    const sortedStakes = [...stakes].sort((a, b) => a - b);

    // Lorenz curve calculation
    const lorenzCurvePoints: {
      populationPercentage: number;
      stakePercentage: number;
    }[] = [];
    let cumulative = 0;

    sortedStakes.forEach((stake, index) => {
      cumulative += stake;
      lorenzCurvePoints.push({
        populationPercentage: ((index + 1) / sortedStakes.length) * 100,
        stakePercentage: (cumulative / totalStake) * 100,
      });
    });

    // Optimized Gini coefficient calculation :cite[2]
    let giniSum = 0;
    const n = sortedStakes.length;
    for (let i = 0; i < n; i++) {
      giniSum += (2 * (i + 1) - n - 1) * sortedStakes[i];
    }
    const giniCoefficient = giniSum / (n * totalStake);

    // Fetch historical data using Helius Enhanced API :cite[1]:cite[3]
    let historicalData = null;
    try {
      const historyResponse = await fetch(
        `https://api.helius.xyz/v0/analytics/stake-history?api-key=${process.env.HELIUS_API_KEY}`
      );
      historicalData = historyResponse.ok ? await historyResponse.json() : null;
    } catch (e) {
      console.error("Helius history fetch error:", e);
    }

    return NextResponse.json({
      giniCoefficient,
      lorenzCurve: lorenzCurvePoints,
      currentStats: {
        totalValidators: n,
        totalStake,
        average: totalStake / n,
        median: sortedStakes[Math.floor(n / 2)],
        top10Percent:
          sortedStakes.slice(-Math.floor(n / 10)).reduce((a, b) => a + b, 0) /
          totalStake,
      },
      historicalData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Stake analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
