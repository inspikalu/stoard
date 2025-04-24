"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTotalStakedSOL } from "@/lib/helpers/fetchTotalStakedSol";
import { fetchTotalValidators } from "@/lib/helpers/fetchTotalValidators";
import { fetchSolanaPrice } from "@/lib/helpers/fetchSolanaPrice"; // You'll need to create this
import { StakeDistribution } from "@/components/app/stake-distribution";
import { Skeleton } from "@/components/ui/skeleton";
import { StakeChart } from "@/components/app/stake-chart";

export default function Overview() {
  const {
    data: totalStakedSOL,
    isLoading: loadingTotalStakedSol,
    isError: errorGettingTotalStakedSol,
  } = useQuery({
    queryKey: ["totalStakedSOL"],
    queryFn: fetchTotalStakedSOL,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: totalValidatorData,
    isLoading: loadingTotalValidatorData,
    isError: errorGettingTotalValidator,
  } = useQuery({
    queryKey: ["totalValidators"],
    queryFn: fetchTotalValidators,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: solPrice,
    isLoading: loadingSolPrice,
    isError: errorGettingSolPrice,
  } = useQuery({
    queryKey: ["solanaPrice"],
    queryFn: fetchSolanaPrice,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Top Section - Key Metrics */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 w-full">
        {/* Left Side - SOL Price */}
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
          {loadingSolPrice ? (
            <Skeleton className="h-6 w-24" />
          ) : errorGettingSolPrice ? (
            <span className="text-red-500 text-sm">Price unavailable</span>
          ) : (
            <>
              <img src="/solana-logo.svg" alt="Solana" className="h-5 w-5" />
              <span className="font-medium text-sm">
                SOL: ${solPrice?.price?.toFixed(2)}
              </span>
              <PriceChangeIndicator change={solPrice?.change24h} />
            </>
          )}
        </div>

        {/* Right Side - Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
          <MetricItem
            label="Total Staked"
            value={
              loadingTotalStakedSol ? (
                <Skeleton className="h-6 w-24" />
              ) : errorGettingTotalStakedSol ? (
                <span className="text-red-500">Error</span>
              ) : (
                `~${totalStakedSOL?.toLocaleString()} SOL`
              )
            }
          />
          <MetricItem
            label="Validators"
            value={
              loadingTotalValidatorData ? (
                <Skeleton className="h-6 w-16" />
              ) : errorGettingTotalValidator ? (
                <span className="text-red-500">Error</span>
              ) : (
                totalValidatorData?.totalValidators
              )
            }
          />
          <MetricItem
            label="Active"
            value={
              loadingTotalValidatorData ? (
                <Skeleton className="h-6 w-16" />
              ) : errorGettingTotalValidator ? (
                <span className="text-red-500">Error</span>
              ) : (
                totalValidatorData?.activeValidators
              )
            }
          />
          <MetricItem
            label="Inactive"
            value={
              loadingTotalValidatorData ? (
                <Skeleton className="h-6 w-16" />
              ) : errorGettingTotalValidator ? (
                <span className="text-red-500">Error</span>
              ) : (
                totalValidatorData?.inactiveValidators
              )
            }
          />
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="grid grid-cols-1 gap-8">
        <StakeChart />
      </div>

      {/* Stake Distribution Section */}
      <div className="grid grid-cols-1 gap-8">
        <StakeDistribution />
      </div>
    </div>
  );
}

// Helper components
function MetricItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function PriceChangeIndicator({ change }: { change?: number }) {
  if (change === undefined) return null;

  const isPositive = change >= 0;
  return (
    <span
      className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
    >
      {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(2)}%
    </span>
  );
}
