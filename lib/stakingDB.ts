import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const STAKING_KEY = 'staking_data';

type StakingRecord = {
  timestamp: string;
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
};

// Read all staking data
export async function getStakingData(): Promise<StakingRecord[]> {
  try {
    const data = await redis.get(STAKING_KEY);
    return data ? JSON.parse(data as string) : [];
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return [];
  }
}

// Add new staking record
export async function addStakingRecord(record: {
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
}): Promise<StakingRecord[]> {
  try {
    const data = await getStakingData();
    const newData = [...data, {
      timestamp: new Date().toISOString(),
      ...record
    }];
    await redis.set(STAKING_KEY, JSON.stringify(newData));
    return newData;
  } catch (error) {
    console.error('Error adding staking record:', error);
    throw error;
  }
}