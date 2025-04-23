// app/api/stats/total-validators/route.ts

import { NextResponse } from 'next/server'

const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`

export async function GET() {
  try {
    const res = await fetch(HELIUS_RPC_URL, {
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

    const json = await res.json()

    const current = json?.result?.current || []
    const delinquent = json?.result?.delinquent || []

    const totalValidators = current.length + delinquent.length
    const activeValidators = current.length
    const inactiveValidators = delinquent.length

    return NextResponse.json({
      totalValidators,
      activeValidators,
      inactiveValidators,
    })
  } catch (error) {
    console.error('Error fetching validator count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch validator count' },
      { status: 500 }
    )
  }
}
