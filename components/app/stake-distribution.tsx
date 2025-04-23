import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchStakeDistribution, 
  StakeDistributionData, 
  StakeDistributionItem 
} from "@/lib/helpers/fetchStakeDistribution";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PieChartData {
  name: string;
  value: number;
  fullIdentity?: string;
  stake?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

const LoadingState = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40 mb-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] rounded" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 border rounded">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

const ErrorState = () => (
  <Alert variant="destructive">
    <AlertTitle>Error Loading Data</AlertTitle>
    <AlertDescription>
      There was a problem loading the stake distribution data. Please try again later.
    </AlertDescription>
  </Alert>
);

export function StakeDistribution() {
  const {
    data: stakeDistribution,
    isLoading: loadingStakeDistribution,
    isError: errorGettingStakeDistribution,
  } = useQuery<StakeDistributionData>({
    queryKey: ["stakeDistribution"],
    queryFn: fetchStakeDistribution,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
  
  const [selectedIdentity, setSelectedIdentity] = useState<StakeDistributionItem | null>(null);
  
  if (loadingStakeDistribution) return <LoadingState />;
  if (errorGettingStakeDistribution || !stakeDistribution) return <ErrorState />;

  const sortedDistribution = [...stakeDistribution.distribution].sort(
    (a, b) => b.percent - a.percent
  );

  const topStakers = sortedDistribution.slice(0, 9);

  const otherPercent = sortedDistribution
    .slice(9)
    .reduce((sum, item) => sum + item.percent, 0);

  const pieData: PieChartData[] = [
    ...topStakers.map((item) => ({
      name: shortenAddress(item.identity),
      value: item.percent,
      fullIdentity: item.identity,
      stake: item.stake,
    })),
    { name: "Others", value: otherPercent },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatPercent = (percent: number): string => {
    return percent.toFixed(2) + "%";
  };

  function shortenAddress(address: string): string {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  }

  const handlePieClick = (data: PieChartData): void => {
    const { fullIdentity } = data;
    if (fullIdentity) {
      const clickedIdentity = sortedDistribution.find(
        (item) => item.identity === fullIdentity
      );
      if (clickedIdentity) {
        setSelectedIdentity(clickedIdentity);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 text-white p-2 rounded shadow">
          <p className="font-bold">{data.name}</p>
          <p>Percent: {formatPercent(data.value)}</p>
          {data.stake && <p>Stake: {formatNumber(data.stake)}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 grid md:grid-cols-2 grid-cols-1 gap-4 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Distribution by Percent</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Top Stakers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topStakers.map((item, index) => (
              <div
                key={item.identity}
                className="p-3 border rounded hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer dark:border-slate-600"
                onClick={() => setSelectedIdentity(item)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {shortenAddress(item.identity)}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatPercent(item.percent)}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Stake: {formatNumber(item.stake)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedIdentity && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Selected Identity Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-700 dark:text-slate-300 mb-1">
                  <span className="font-medium">Identity:</span>{" "}
                  {selectedIdentity.identity}
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-1">
                  <span className="font-medium">Stake:</span>{" "}
                  {formatNumber(selectedIdentity.stake)}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Percent:</span>{" "}
                  {formatPercent(selectedIdentity.percent)}
                </p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                onClick={() => setSelectedIdentity(null)}
              >
                ✕
              </button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-4 col-span-full justify-center">
        <AlertCircle size={16} />
        <p>
          This visualization shows a subset of the full data. The complete
          dataset may be up to 20x larger.
        </p>
      </div>
    </div>
  );
}