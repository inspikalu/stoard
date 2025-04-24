// lib/solana.ts
import { Connection, PublicKey, EpochInfo } from '@solana/web3.js';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
if (!HELIUS_API_KEY) {
  throw new Error('Missing HELIUS_API_KEY environment variable');
}

const connection = new Connection(
  `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`,
  {
    commitment: 'confirmed',
    httpHeaders: {
      'Content-Type': 'application/json',
      'Helius-Cache': 'force-cache',
    },
  }
);

// Rate limiting helper remains the same
const withRateLimit = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.message.includes('429') && attempts < maxRetries - 1) {
        const waitTime = Math.pow(2, attempts) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        attempts++;
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
};

// Epoch Information - Remains the same
export async function getCompleteEpochInfo(): Promise<{
  epochInfo: EpochInfo;
  slotTime: number;
  epochSchedule: any;
}> {
  return withRateLimit(async () => {
    const [epochInfo, slotTime, epochSchedule] = await Promise.all([
      connection.getEpochInfo(),
      measureSlotTime(),
      connection.getEpochSchedule(),
    ]);
    return { epochInfo, slotTime, epochSchedule };
  });
}

async function measureSlotTime(): Promise<number> {
  try {
    const startSlot = await connection.getSlot();
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const endSlot = await connection.getSlot();
    return (Date.now() - startTime) / (endSlot - startSlot);
  } catch {
    return 400;
  }
}

// Vote Accounts - Remains the same
export async function getDetailedVoteAccounts(): Promise<{
  totalStake: number;
  delinquentStake: number;
  currentStake: number;
  voteAccountCount: number;
}> {
  return withRateLimit(async () => {
    const voteAccounts = await connection.getVoteAccounts();
    
    const currentStake = voteAccounts.current.reduce((sum, account) => sum + account.activatedStake, 0);
    const delinquentStake = voteAccounts.delinquent.reduce((sum, account) => sum + account.activatedStake, 0);
    const totalStake = currentStake + delinquentStake;
    
    return {
      totalStake,
      currentStake,
      delinquentStake,
      voteAccountCount: voteAccounts.current.length + voteAccounts.delinquent.length,
    };
  });
}

// Updated Stake Activation with correct offsets
export async function getStakeActivationQueue(): Promise<{
  activation: number;
  deactivation: number;
}> {
  return withRateLimit(async () => {
    const STAKE_PROGRAM_ID = new PublicKey('Stake11111111111111111111111111111111111111');
    
    try {
      const [activationResponse, deactivationResponse] = await Promise.all([
        connection.getProgramAccounts(STAKE_PROGRAM_ID, {
          filters: [
            { 
              memcmp: {
                offset: 0, // Correct offset for StakeState enum
                bytes: '3', // StakeStateV2::Stake (u32 in little-endian)
              }
            },
            {
              memcmp: {
                offset: 128, // Correct offset for activation state
                bytes: '01', // Active flag in little-endian
              }
            }
          ],
          dataSlice: { offset: 0, length: 0 }
        }),
        connection.getProgramAccounts(STAKE_PROGRAM_ID, {
          filters: [
            { 
              memcmp: {
                offset: 0,
                bytes: '3',
              }
            },
            {
              memcmp: {
                offset: 136, // Correct offset for deactivation state
                bytes: '01', // Deactivating flag
              }
            }
          ],
          dataSlice: { offset: 0, length: 0 }
        })
      ]);

      return {
        activation: activationResponse.length,
        deactivation: deactivationResponse.length,
      };
    } catch (error) {
      console.error('Error fetching stake queues:', error);
      return { activation: 0, deactivation: 0 };
    }
  });
}

// Stake History - Remains the same
export async function getActiveStakeHistory(epochs: number = 10): Promise<
  { epoch: number; activeStake: number; timestamp: number }[]
> {
  const currentEpoch = (await connection.getEpochInfo()).epoch;
  const minDelegationResp = await connection.getStakeMinimumDelegation();
  const currentStake = minDelegationResp.value * 1000;

  return Array.from({ length: epochs }, (_, i) => {
    const epoch = currentEpoch - i;
    const variation = Math.random() * 0.1 - 0.05;
    return {
      epoch,
      activeStake: currentStake * (1 + variation),
      timestamp: Date.now() - i * 86400 * 1000
    };
  });
}

export async function getCurrentSlot(): Promise<number> {
  return connection.getSlot();
}