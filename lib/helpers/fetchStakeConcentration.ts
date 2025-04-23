// src/lib/api/stake-concentration.ts
import axios from "axios";
import { toast } from "sonner";

// Define TypeScript interfaces for the response data
interface LorenzCurvePoint {
  populationPercentage: number;
  stakePercentage: number;
}

interface CurrentStakeDistribution {
  totalValidators: number;
  totalStake: number;
  averageStake: number;
  medianStake: number;
}

interface StakeConcentrationResponse {
  giniCoefficient: number;
  lorenzCurve: LorenzCurvePoint[];
  currentStakeDistribution: CurrentStakeDistribution;
  historicalData: any | null;
  timestamp: string;
  error?: string;
}

export const fetchStakeConcentration =
  async (): Promise<StakeConcentrationResponse> => {
    let maxRetries = 3;
    let baseDelay = 1000;

    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios.get<StakeConcentrationResponse>(
          "/api/stats/stake-concentration"
        );

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        return response.data;
      } catch (error) {
        attempt++;

        if (attempt >= maxRetries) {
          toast.error(
            "Failed to fetch stake concentration data after multiple attempts"
          );
          throw new Error(
            "Failed to fetch stake concentration data. Please try again later."
          );
        }

        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));

        if (axios.isAxiosError(error)) {
          toast.error(
            `Attempt ${attempt}: ${
              error.response?.data?.error || error.message
            }`
          );
        } else {
          toast.error(
            `Attempt ${attempt}: Failed to fetch stake concentration data`
          );
        }
      }
    }

    throw new Error(
      "Unexpected error in fetching stake concentration data. Contact Dev"
    );
  };
