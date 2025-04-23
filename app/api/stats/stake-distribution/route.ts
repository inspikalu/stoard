// app/api/stats/stake-distribution/route.ts

import { NextResponse } from 'next/server'
export const runtime = 'edge';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`

// --- Types from Solana RPC response ---

type VoteAccount = {
  votePubkey: string
  nodePubkey: string
  activatedStake: number | string // sometimes comes as string
}

type GetVoteAccountsResponse = {
  jsonrpc: string
  result: {
    current: VoteAccount[]
    delinquent: VoteAccount[]
  }
  id: number
}

type StakeDistributionEntry = {
  identity: string
  stake: number
  percent: number
}

type StakeDistributionResponse = {
  totalStaked: number
  distribution: StakeDistributionEntry[]
}

export async function GET() {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getVoteAccounts',
      }),
    })

    if (!response.ok) {
      throw new Error(`Helius RPC error: ${response.statusText}`)
    }

    const data: GetVoteAccountsResponse = await response.json()
    const validators = data.result.current ?? []

    const totalStaked = validators.reduce((sum, validator) => {
      return sum + Number(validator.activatedStake)
    }, 0)

    const distribution: StakeDistributionEntry[] = validators.map((validator) => {
      const stake = Number(validator.activatedStake)
      return {
        identity: validator.nodePubkey || validator.votePubkey,
        stake,
        percent: totalStaked > 0 ? (stake / totalStaked) * 100 : 0,
      }
    })

    distribution.sort((a, b) => b.stake - a.stake)

    const result: StakeDistributionResponse = {
      totalStaked,
      distribution,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Stake Distribution Error]', error)
    return NextResponse.json(
      { error: 'Failed to fetch stake distribution data' },
      { status: 500 }
    )
  }
}
