// lib/helpers/fetchStakeConcforGiniCoeff.ts
import { StakeConcentrationData, ApiError } from '@/types/stake-concentration';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await wait(delay);
      }
    }
  }
  
  throw lastError;
}

export const fetchStakeConcforGiniCoeff = async (): Promise<StakeConcentrationData> => {
  return fetchWithRetry<StakeConcentrationData>(
    '/api/stats/stake-concentration',
    { method: 'GET' }
  );
};