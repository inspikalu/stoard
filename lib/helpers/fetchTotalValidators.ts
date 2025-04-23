import axios from "axios";
import { toast } from "sonner";

export const fetchTotalValidators = async () => {
  let maxRetries = 3;
  let baseDelay = 1000;

  let attempt = 0;
  const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff

  while (attempt < maxRetries) {
    try {
      const response = await axios.get("/api/stats/total-validators");
      return response.data;
    } catch (error) {
      attempt++;
      if (attempt < maxRetries) {
        toast.error("Failed to fetch total validators");
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Unexpected error in Fetching Total Validators. Contact Dev");
};
