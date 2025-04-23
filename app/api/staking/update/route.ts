import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import { addStakingRecord } from "@/lib/stakingDB";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export async function GET() {
  try {
    const connection = new Connection(HELIUS_RPC_URL);
    const supply = await connection.getSupply();
    const epochInfo = await connection.getEpochInfo();

    const staked = supply.value.total - supply.value.circulating;

    addStakingRecord({
      total_staked: staked,
      epoch: epochInfo.epoch,
      circulating_supply: supply.value.circulating,
      non_circulating_supply: supply.value.nonCirculating,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
