import { NextResponse } from "next/server";
import { ValidatorStakeData } from "@/types/validator";

const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

export interface ApiError {
  error: string;
}

export async function GET(): Promise<
  NextResponse<ValidatorStakeData | ApiError>
> {
  try {
    const response = await fetch(HELIUS_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getVoteAccounts",
        params: [{ commitment: "confirmed" }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.statusText}`);
    }

    const { result } = await response.json();
    const stakes: number[] = result.current.map(
      (v: { activatedStake: number }) => v.activatedStake / 1e9
    );

    // Type-safe bucket processing
    const buckets = [0, 10_000, 100_000, 1_000_000, Infinity] as const;
    const labels = ["0-10K", "10K-100K", "100K-1M", "1M+"] as const;
    const counts: number[] = new Array(buckets.length - 1).fill(0);

    stakes.forEach((stake) => {
      for (let i = 0; i < buckets.length - 1; i++) {
        if (stake >= buckets[i] && stake < buckets[i + 1]) {
          counts[i]++;
          break;
        }
      }
    });

    return NextResponse.json({ labels: [...labels], counts } satisfies ValidatorStakeData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
