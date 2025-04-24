"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface LineChartProps<T> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
  className?: string;
  xAxisProps?: {
    label?: string;
    tickFormatter?: (value: any) => string;
  };
  yAxisProps?: {
    label?: string;
    tickFormatter?: (value: any) => string;
    type?: 'number' | 'category';
  };
  tooltipFormatter?: (payload: T) => React.ReactNode;
}

export function LineChart<T>({
  data,
  xKey,
  yKey,
  className,
  xAxisProps,
  yAxisProps,
  tooltipFormatter,
}: LineChartProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey={xKey as string}
            label={xAxisProps?.label}
            tickFormatter={xAxisProps?.tickFormatter}
          />
          <YAxis
            label={yAxisProps?.label}
            tickFormatter={yAxisProps?.tickFormatter}
            type={yAxisProps?.type || 'number'}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length && tooltipFormatter) {
                return tooltipFormatter(payload[0].payload as T);
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey={yKey as string}
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            connectNulls={true}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}