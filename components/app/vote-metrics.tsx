import { formatLamports } from "@/lib/participation-utils";
import { type VoteMetrics } from "@/types/participation-type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface VoteMetricsProps {
  data?: VoteMetrics;
}

export default function VoteMetrics({ data }: VoteMetricsProps) {
  if (!data) return null;

  const totalStakeSol = formatLamports(data.totalStake);
  const currentStakeSol = formatLamports(data.currentStake);
  const delinquentStakeSol = formatLamports(data.delinquentStake);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vote Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Performance Metrics */}
          <div className="space-y-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Avg Vote Latency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.averageVoteLatency.toFixed(2)}s</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
                  Missed Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{data.missedVotePercentage.toFixed(2)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Stake Metrics */}
          <div className="space-y-4">
            <Card className="bg-green-50 dark:bg-green-900/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-green-800 dark:text-green-200">
                  Total Stake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{totalStakeSol}</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-purple-50 dark:bg-purple-900/30">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">
                    Current
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">{currentStakeSol}</p>
                  <p className="text-xs mt-1">{data.voteAccountCount} validators</p>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 dark:bg-yellow-900/30">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Delinquent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-bold">{delinquentStakeSol}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
