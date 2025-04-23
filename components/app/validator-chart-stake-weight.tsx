"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useValidatorData } from "@/hooks/useValidatorData";

interface ChartDataPoint {
  name: string;
  count: number;
}

export function ValidatorChartStakeWeight() {
  const { data, isLoading, error } = useValidatorData();

  if (isLoading) return <Skeleton className="h-[300px] w-full" />;
  if (error) return <div className="text-red-500">Error: {error.error}</div>;

  const chartData: ChartDataPoint[] =
    data?.labels.map((label, index) => ({
      name: label,
      count: data?.counts[index] || 0,
    })) || [];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} validators`, "Count"]}
            labelFormatter={(label) => `Stake Range: ${label}`}
          />
          <Bar
            dataKey="count"
            fill="#8884d8"
            name="Validators"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
