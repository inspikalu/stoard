"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useParticipationData } from '@/hooks/useParticipationData';
import { formatLamports } from '@/lib/participation-utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ActiveStakeChart() {
  const { data } = useParticipationData();

  if (!data?.activeStakeTrends?.length) {
    return (
      <Card className="w-full">
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading stake history...
        </CardContent>
      </Card>
    );
  }

  const chartData = data.activeStakeTrends.map(item => ({
    ...item,
    activeStake: item.activeStake / 1e9, // Convert to SOL
    date: new Date(item.timestamp ?? 0).toLocaleDateString()
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Active Stake Trend (Last 10 Epochs)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> {/* Tailwind gray-200 */}
              <XAxis 
                dataKey="epoch" 
                label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <YAxis 
                label={{ value: 'SOL', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => formatLamports(value * 1e9, 0)}
                tick={{ fill: "var(--muted-foreground)" }}
              />
              <Tooltip 
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }}
                formatter={(value) => [value, 'Active Stake']}
                labelFormatter={(label) => `Epoch ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeStake"
                name="Active Stake"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6, fill: "var(--primary)" }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}