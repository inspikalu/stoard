import axios from "axios";
import { toast } from "sonner";

export type Validator = {
  votePubkey: string;
  nodePubkey: string;
  commission: number;
  activatedStake: number;
  lastVote: number;
  epochCredits: number[][]
  country: string; // This will now store country name instead of IP
  performance: {
    blocksProduced: number;
    leaderSlots: number;
    percentage: number;
  };
  uptime?: number;
};

type GeoApiResponse = {
  status: string;
  code: number;
  data: {
    ip: string;
    country: {
      code: string;
      name: string;
    };
  };
  execution_time: string;
};

export const fetchValidators = async () => {
  let maxRetries = 3;
  let baseDelay = 1000;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // First fetch the validators data
      const response = await axios.get("/api/stats/validators");
      const validatorsRaw = response.data as Validator[];

      // Process each validator to get country name
      const validatorsWithCountry = await Promise.all(
        validatorsRaw.map(async (validator) => {
          try {
            // Skip if country is already a name (not IP)
            if (!validator.country || !validator.country.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              return validator;
            }

            const geoResponse = await axios.get<GeoApiResponse>(
              `/api/geo-api?ip-addr=${validator.country}`
            );

            if (geoResponse.data.status === "success") {
              return {
                ...validator,
                country: geoResponse.data.data.country.name,
              };
            }
            return validator;
          } catch (error) {
            console.error(`Failed to fetch country for IP ${validator.country}`, error);
            return validator; // Return original if geo API fails
          }
        })
      );

      return validatorsWithCountry;
    } catch (error) {
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        toast.error("Failed to fetch validators data");
        throw error;
      }
    }
  }

  throw new Error("Error in fetchValidators");
};