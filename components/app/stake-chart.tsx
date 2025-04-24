"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps
} from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

// Type definitions
type EpochNumber = number;
type LamportsAmount = number;
type SOLAmount = number;

interface EpochData {
  [epoch: string]: LamportsAmount;
}

interface BalanceChart {
  name: string;
  data: EpochData;
}

interface StakeStats {
  total: LamportsAmount;
}

interface StakeData {
  stats: StakeStats;
  epochCharts: {
    balance: BalanceChart;
  };
}

interface ChartDataPoint {
  epoch: EpochNumber;
  value: SOLAmount;
}

// Helper functions with type annotations
function formatNumber(num?: number): string {
  if (num === undefined || num === null) return "N/A";
  return new Intl.NumberFormat("en-US").format(num);
}

function formatLargeNumber(num: number): string {
    const units = ['', 'K', 'M', 'B', 'T'];
    const order = Math.floor(Math.log10(Math.abs(num)) / 3);
    const unitValue = Math.pow(10, order * 3);
    const formattedValue = (num / unitValue).toFixed(1);
    return `${formattedValue}${units[order]}`;
}


async function fetchStakeData(): Promise<StakeData> {
  const response = await fetch('/api/solana-compass/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch Solana stake data');
  }
  return response.json() as Promise<StakeData>;
}

// Custom Tooltip component with proper typing
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    return (
      <div className="bg-background border p-4 rounded-lg shadow-sm">
        <p className="font-medium">{`Epoch ${label}`}</p>
        <p className="text-sm">
          {`Staked: ${formatNumber(value)} SOL`}
        </p>
      </div>
    );
  }
  return null;
};

export function StakeChart() {
  const { data, isLoading, error } = useQuery<StakeData, Error>({
    queryKey: ["solana-stake-data"],
    queryFn: fetchStakeData,
    refetchInterval: 60 * 1000,
  });

  if (isLoading) return <div className="text-center py-8">Loading stake data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

  const epochData = data?.epochCharts.balance.data;
  if (!epochData) return <div className="text-center py-8">No data available</div>;

  // Convert the epoch data to chart format with proper typing
  const chartData: ChartDataPoint[] = Object.entries(epochData)
    .map(([epoch, value]): ChartDataPoint => ({
      epoch: Number(epoch),
      value: value,
    }))
    .sort((a, b) => a.epoch - b.epoch);

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-xl font-semibold mb-4">Solana Stake Over Epochs</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 50,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="epoch" 
            tickFormatter={(value: number) => `Epoch ${value}`}
            tick={{ fill: '#888' }}
          />
          <YAxis 
            tickFormatter={(value: number) => `${formatNumber(value)} SOL`}
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            content={<CustomTooltip />}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Staked SOL"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}