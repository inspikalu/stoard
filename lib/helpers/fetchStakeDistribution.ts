import axios from "axios";
import { toast } from "sonner";

export interface StakeDistributionItem {
  identity: string;
  stake: number;
  percent: number;
}

export interface StakeDistributionData {
  totalStaked: number;
  distribution: StakeDistributionItem[];
}

export type StakeDistributionResponse = StakeDistributionData;

export const fetchStakeDistribution =
  async (): Promise<StakeDistributionResponse> => {
    let maxRetries = 3;
    let baseDelay = 1000;

    let attempt = 0;
    const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff

    while (attempt < maxRetries) {
      try {
        const response = await axios.get("/api/stats/stake-distribution");
        return response.data;
      } catch (error) {
        attempt++;

        if (attempt >= maxRetries) {
          toast.error(
            "Failed to fetch stake distribution after multiple attempts"
          );
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error(
      "Unexpected error in Fetching Stake Distribution. Contact Dev"
    );
  };
