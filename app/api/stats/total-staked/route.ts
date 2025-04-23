// app/api/stats/total-staked/route.ts
export const runtime = 'edge';
import { NextResponse } from "next/server";

const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export async function GET() {
  try {
    console.log("Rpc url: ",HELIUS_RPC_URL)
    const res = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getVoteAccounts",
      }),
    });

    const json = await res.json();
    console.log(json);

    const currentValidators = json?.result?.current || [];
    const totalStakedLamports = currentValidators.reduce(
      (sum: number, validator: any) => sum + Number(validator.activatedStake),
      0
    );

    const totalStakedSOL = totalStakedLamports / 1e9;

    return NextResponse.json({ totalStakedSOL });
  } catch (error) {
    console.error("Error fetching total staked:", error);
    return NextResponse.json(
      { error: "Failed to fetch total staked SOL" },
      { status: 500 }
    );
  }
}
