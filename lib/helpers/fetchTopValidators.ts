// utils/fetchTopValidators.ts
import { type Validator } from "@/types/validator";

const DEFAULT_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export async function fetchTopValidators(
  n: number = 10,
  retries: number = DEFAULT_RETRIES
): Promise<Validator[]> {
  try {
    const response = await fetch(`/api/stats/top-validators?n=${n}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.validators;
  } catch (error) {
    if (retries <= 0) {
      console.error('Max retries reached, giving up');
      throw error;
    }

    const delay = BASE_DELAY_MS * Math.pow(2, DEFAULT_RETRIES - retries);
    console.log(`Retry attempt ${DEFAULT_RETRIES - retries + 1}, waiting ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchTopValidators(n, retries - 1);
  }
}