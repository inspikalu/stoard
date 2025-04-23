// components/TopValidators.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopValidators } from '@/lib/helpers/fetchTopValidators';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function TopValidators({ initialCount = 10 }: { initialCount?: number }) {
  const [count, setCount] = React.useState(initialCount);
  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ['topValidators', count],
    queryFn: () => fetchTopValidators(count),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading || isRefetching) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
          <Skeleton className="h-10 w-[100px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading validator data: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Alert>
        <AlertDescription>No validator data available</AlertDescription>
      </Alert>
    );
  }

  // Format data for visualization
  const chartData = data.map(validator => ({
    name: validator.name || validator.pubkey.slice(0, 8),
    stake: validator.stake / 1_000_000, // Convert to millions for readability
    commission: validator.commission,
    performance: validator.performance,
    isSuperminority: validator.superminority,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Validators by Stake</CardTitle>
        <Select 
          value={count.toString()}
          onValueChange={(value:string) => setCount(parseInt(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Top 5</SelectItem>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="15">Top 15</SelectItem>
            <SelectItem value="20">Top 20</SelectItem>
            <SelectItem value="25">Top 25</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Stake (millions)', position: 'bottom' }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tickFormatter={(value) => value.length > 10 ? `${value.slice(0, 8)}...` : value}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'stake') return [`${value}M SOL`, 'Stake'];
                    if (name === 'commission') return [`${value}%`, 'Commission'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="stake" name="Stake (millions)">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isSuperminority ? '#FF6B6B' : COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table View */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Validator</TableHead>
                  <TableHead>Stake (SOL)</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((validator) => (
                  <TableRow key={validator.pubkey}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        {validator.image && (
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={validator.image} 
                            alt={validator.name || 'Validator'} 
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {validator.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {validator.pubkey.slice(0, 8)}...{validator.pubkey.slice(-4)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(validator.stake / 1_000_000).toLocaleString()}M
                    </TableCell>
                    <TableCell>
                      {validator.commission}%
                    </TableCell>
                    <TableCell>
                    <Badge 
                        variant={
                          validator.performance > 90 
                            ? 'default' // use 'default' for success
                            : validator.performance > 80 
                              ? 'secondary' // use 'secondary' for warning
                              : 'destructive'
                        }
                      >
                        {validator.performance}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Superminority validators are highlighted in red in the chart.</p>
          <p>Data refreshes automatically every 5 minutes.</p>
        </div>
      </CardContent>
    </Card>
  );
}