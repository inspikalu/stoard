// components/stake-concentration-dashboard.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStakeConcforGiniCoeff } from "@/lib/helpers/fetchStakeConcforGiniCoeff";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";

export function StakeConcentrationDashboard() {
  const {
    data: stakeData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stake-concentration"],
    queryFn: fetchStakeConcforGiniCoeff,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  console.log("Stake Data: ", stakeData);
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading stake concentration data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Stake Concentration Analysis</h2>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gini Coefficient</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stakeData?.giniCoefficient.toFixed(4)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Measures inequality (0 = perfect equality, 1 = maximum
                inequality)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validators</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {stakeData?.currentStats
                  ? stakeData.currentStats.totalValidators.toLocaleString()
                  : "-"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Total active validators
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stake Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg">
                  Avg:{" "}
                  <span className="font-semibold">
                    {stakeData?.currentStats
                      ? stakeData.currentStats.average.toLocaleString()
                      : "-"}
                  </span>
                </p>
                <p className="text-lg">
                  Median:{" "}
                  <span className="font-semibold">
                    {stakeData?.currentStats
                      ? stakeData.currentStats.median.toLocaleString()
                      : "-"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lorenz Curve</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stakeData?.lorenzCurve}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="populationPercentage"
                    label={{
                      value: "Cumulative % of Validators",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    label={{
                      value: "Cumulative % of Stake",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Stake Percentage"]}
                    labelFormatter={(value) => `Validators: ${value}%`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="stakePercentage"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Stake Distribution"
                  />
                  <Line
                    type="monotone"
                    dataKey="populationPercentage"
                    stroke="#82ca9d"
                    dot={false}
                    name="Perfect Equality"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
