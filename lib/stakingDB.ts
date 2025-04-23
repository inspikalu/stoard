import { Redis } from "@upstash/redis";

/**
 * Redis client instance configured with environment variables
 * Uses Upstash Redis for data persistence
 */
const redis = new Redis({
  url: process.env.stoard_KV_URL,
  token: process.env.stoard_KV_REST_API_TOKEN,
});

/**
 * Key used to store staking data in Redis
 */
const STAKING_KEY = 'staking_data';

/**
 * Type definition for a staking record
 * @property {string} timestamp - ISO string of when the record was created
 * @property {number} total_staked - Total amount of SOL staked
 * @property {number} epoch - Current Solana epoch number
 * @property {number} [circulating_supply] - Optional circulating supply of SOL
 * @property {number} [non_circulating_supply] - Optional non-circulating supply of SOL
 */
type StakingRecord = {
  timestamp: string;
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
};

/**
 * Retrieves all staking data from Redis
 * @returns {Promise<StakingRecord[]>} Array of staking records
 * @throws {Error} If Redis connection fails
 */
export async function getStakingData(): Promise<StakingRecord[]> {
  const data = await redis.get(STAKING_KEY) as string;
  return data ? JSON.parse(data) : [];
}

/**
 * Adds a new staking record to the database
 * @param {Object} record - The staking record to add
 * @param {number} record.total_staked - Total amount of SOL staked
 * @param {number} record.epoch - Current Solana epoch number
 * @param {number} [record.circulating_supply] - Optional circulating supply of SOL
 * @param {number} [record.non_circulating_supply] - Optional non-circulating supply of SOL
 * @returns {Promise<StakingRecord[]>} Updated array of staking records
 * @throws {Error} If Redis connection fails or data is invalid
 */
export async function addStakingRecord(record: {
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
}): Promise<StakingRecord[]> {
  const data = await getStakingData();
  const newData = [...data, {
    timestamp: new Date().toISOString(),
    ...record
  }];
  await redis.set(STAKING_KEY, JSON.stringify(newData));
  return newData;
}