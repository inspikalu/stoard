import { NextResponse } from "next/server";
import { addStakingRecord } from "@/lib/stakingDB";
import { Connection } from "@solana/web3.js";

export async function GET(req: Request) {
  // Verify secret (for security)
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = new Connection("https://api.mainnet-beta.solana.com");
    const supply = await connection.getSupply();
    const epochInfo = await connection.getEpochInfo();

    const staked = supply.value.total - supply.value.circulating;

    addStakingRecord({
      total_staked: staked,
      epoch: epochInfo.epoch,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
