"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, TrendingUp } from "lucide-react";

interface StakingData {
  timestamp: string;
  total_staked: number;
  epoch: number;
  circulating_supply?: number;
  non_circulating_supply?: number;
}

export function StakingDashboard() {
  const [data, setData] = useState<StakingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/staking/data");
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/staking/update");
      await fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format data for charts
  const chartData = (Array.isArray(data) ? data : [])
  .map((item) => {
    let dateStr = "-";
    if (item.timestamp) {
      const d = new Date(item.timestamp);
      if (!isNaN(d.getTime())) {
        dateStr = format(d, "PP");
      }
    }
    return {
      date: dateStr,
      staked: item.total_staked / 1e9, // Convert lamports to SOL
      epoch: item.epoch,
      circulating: item.circulating_supply
        ? item.circulating_supply / 1e9
        : null,
      nonCirculating: item.non_circulating_supply
        ? item.non_circulating_supply / 1e9
        : null,
    };
  })
  .reverse(); // Show latest first

  // Calculate growth percentage
  const growthPercentage =
    data.length > 1
      ? (
          ((chartData[0]?.staked - chartData[1]?.staked) /
            chartData[1]?.staked) *
          100
        ).toFixed(2)
      : 0;

  // Get the latest data point safely
  const latest = data.length > 0 ? data[data.length - 1] : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Solana Staking Insights
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={updateData} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Updating..." : "Update Data"}
          </Button>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Last updated: {format(new Date(lastUpdated), "PPpp")}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total SOL Staked
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.total_staked !== undefined
                ? (latest.total_staked / 1e9).toLocaleString()
                : "-"}{" "}
              SOL
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {growthPercentage}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Epoch</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.epoch ?? "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {latest?.timestamp
                ? format(new Date(latest.timestamp), "PPpp")
                : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              Historical records collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Staking Participation
            </CardTitle>
            <span className="h-4 w-4 text-muted-foreground">%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latest?.total_staked !== undefined &&
              latest?.circulating_supply
                ? (
                    (latest.total_staked / latest.circulating_supply) *
                    100
                  ).toFixed(2) + "%"
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              of circulating supply
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SOL Staked Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} SOL`, "Staked"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="staked"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supply Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[chartData[0]]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="date" hide />
                  <Tooltip formatter={(value) => [`${value} SOL`]} />
                  <Legend />
                  <Bar
                    dataKey="circulating"
                    name="Circulating"
                    fill="#82ca9d"
                  />
                  <Bar
                    dataKey="nonCirculating"
                    name="Non-Circulating"
                    fill="#8884d8"
                  />
                  <Bar dataKey="staked" name="Staked" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Staked (SOL)
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Epoch
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {chartData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle">{item.date}</td>
                      <td className="p-4 align-middle">
                        {item.staked.toLocaleString()}
                      </td>
                      <td className="p-4 align-middle">{item.epoch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
