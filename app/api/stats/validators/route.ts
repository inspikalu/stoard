// File: /pages/api/validators.js

import { NextResponse } from "next/server";
export const runtime = 'edge';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`;

async function fetchFromHelius(method: string, params: any[] = []) {
  const response = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  const json = await response.json();
  return json.result;
}

export async function GET() {
  try {
    const [voteAccounts, clusterNodes, blockProduction] = await Promise.all([
      fetchFromHelius("getVoteAccounts", [{ commitment: "finalized" }]),
      fetchFromHelius("getClusterNodes"),
      fetchFromHelius("getBlockProduction"),
    ]);

    const allValidators = [...voteAccounts.current, ...voteAccounts.delinquent];

    const nodesByIdentity = Object.fromEntries(
      clusterNodes.map((node: any) => [node.pubkey, node])
    );

    const blockPerformance = blockProduction.byIdentity || {};

    const enrichedValidators = allValidators.map((validator) => {
      const nodeInfo = nodesByIdentity[validator.nodePubkey];
      const country = nodeInfo ? nodeInfo.gossip.split(":")[0] : null;
      const perf = blockPerformance[validator.nodePubkey] || {
        leaderSlots: 0,
        blocksProduced: 0,
      };

      return {
        votePubkey: validator.votePubkey,
        nodePubkey: validator.nodePubkey,
        commission: validator.commission,
        activatedStake: validator.activatedStake,
        epochCredits: validator.epochCredits,
        lastVote: validator.lastVote,
        country,
        performance: {
          blocksProduced: perf.blocksProduced,
          leaderSlots: perf.leaderSlots,
          percentage:
            perf.leaderSlots > 0
              ? (perf.blocksProduced / perf.leaderSlots) * 100
              : 0,
        },
      };
    });

    return NextResponse.json(enrichedValidators);
  } catch (error) {
    console.error("Error fetching validators:", error);
    return NextResponse.json(
      { error: "Failed to fetch validators" },
      { status: 500 }
    );
  }
}
