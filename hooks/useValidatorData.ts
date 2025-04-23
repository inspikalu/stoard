"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchStakeWeight } from "@/lib/helpers/fetchStakeWeight";
import { ValidatorStakeData, ApiError } from "@/types/validator";

async function fetchValidatorData(): Promise<ValidatorStakeData> {
  return fetchStakeWeight<ValidatorStakeData>("/api/staking/stake-weight", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

export function useValidatorData() {
  return useQuery<ValidatorStakeData, ApiError>({
    queryKey: ["validatorStakes"],
    queryFn: fetchValidatorData,
    retry: 2, // Additional retries at the query level
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}