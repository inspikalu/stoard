"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTotalStakedSOL } from "@/lib/helpers/fetchTotalStakedSol";
import { InfoCard } from "@/components/info-card";
import { fetchTotalValidators } from "@/lib/helpers/fetchTotalValidators";
import {StakeDistribution } from "@/components/app/stake-distribution"
import { StakingDashboard } from "@/components/app/staking-dashboard";

export default function Overview() {
  const {
    data: totalStakedSOL,
    isLoading: loadingTotalStakedSol,
    isError: errorGettingTotalStakedSol,
  } = useQuery({
    queryKey: ["totalStakedSOL"],
    queryFn: fetchTotalStakedSOL,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  const {
    data: totalValidatorData,
    isLoading: loadingTotalValidatorData,
    isError: errorGettingTotalValidator,
  } = useQuery({
    queryKey: ["totalValidators"],
    queryFn: fetchTotalValidators,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Top Section - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard
          title="Total Staked Sol"
          isLoading={loadingTotalStakedSol}
          isError={errorGettingTotalStakedSol}
          data={`~${totalStakedSOL?.toLocaleString(undefined)} SOL`}
        />
        <InfoCard
          title="Total Validators"
          isLoading={loadingTotalValidatorData}
          isError={errorGettingTotalValidator}
          data={totalValidatorData?.totalValidators}
        />
        <InfoCard
          title="Active Validators"
          isLoading={loadingTotalValidatorData}
          isError={errorGettingTotalValidator}
          data={totalValidatorData?.activeValidators}
        />
        <InfoCard
          title="Inactive Validators"
          isLoading={loadingTotalValidatorData}
          isError={errorGettingTotalValidator}
          data={totalValidatorData?.inactiveValidators}
        />
      </div>

      {/* Main Dashboard Section */}
      <div className="grid grid-cols-1 gap-8">
        <StakingDashboard />
      </div>

      {/* Stake Distribution Section */}
      <div className="grid grid-cols-1 gap-8">
        <StakeDistribution />
      </div>
    </div>
  );
}
