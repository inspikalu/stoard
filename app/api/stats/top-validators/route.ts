// app/api/stats/top-validators/route.ts
import { NextResponse } from "next/server";
import { type Validator } from "@/types/validator";

export const dynamic = "force-dynamic"; // Ensure this is a dynamic route



export async function GET(request: Request) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.SOLANA_BEACH_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Solana Beach API key not configured" },
        { status: 500 }
      );
    }

    // Get N parameter from query string (default to 10)
    const { searchParams } = new URL(request.url);
    const n = parseInt(searchParams.get("n") || "10");

    // Fetch validator data from Solana Beach API
    const response = await fetch("https://api.solanabeach.io/v1/validators", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Solana Beach API responded with ${response.status}`);
    }

    const data = await response.json();

    // Process and sort validators by stake (descending)
    const validators: Validator[] = data
      .map((v: any) => ({
        pubkey: v.nodePubkey,
        name: v.name || "Anonymous",
        image: v.image || "",
        website: v.website || "",
        stake: v.stake || 0,
        commission: v.commission || 0,
        performance: v.performance || 0,
        superminority: v.superminority || false,
      }))
      .sort((a: Validator, b: Validator) => b.stake - a.stake);

    // Get top N validators
    const topValidators = validators.slice(0, n);

    return NextResponse.json({
      validators: topValidators,
      totalValidators: validators.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching validator data:", error);
    return NextResponse.json(
      { error: "Failed to fetch validator data" },
      { status: 500 }
    );
  }
}
