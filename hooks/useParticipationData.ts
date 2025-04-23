import { useQuery, useQueries } from '@tanstack/react-query';
import { formatLamports } from '@/lib/participation-utils';
import { ActiveStakeTrend, ParticipationData } from '@/types/participation-type';

async function fetchCurrentParticipation(): Promise<ParticipationData> {
  const response = await fetch('/api/participation');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch data');
  return data.data;
}

interface UseParticipationDataResult {
  data?: ParticipationData & { historicalStake?: ActiveStakeTrend[] };
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

export function useParticipationData(): UseParticipationDataResult {
  const currentQuery = useQuery<ParticipationData, Error>({
    queryKey: ['participation', 'current'],
    queryFn: fetchCurrentParticipation,
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,
    retry: 3,
    retryDelay: attempt => Math.min(attempt * 1000, 5000),
  });

  // Type the item parameter explicitly
  const historicalQueries = useQueries({
    queries: currentQuery.data?.activeStakeTrends
      ? currentQuery.data.activeStakeTrends.map((item: ActiveStakeTrend) => ({
          queryKey: ['participation', 'history', item.epoch],
          queryFn: () => Promise.resolve(item),
          staleTime: 60 * 60 * 1000,
          enabled: !!currentQuery.data,
        }))
      : [],
  });

  // Combine data with proper typing
  const combinedData = currentQuery.data && {
    ...currentQuery.data,
    historicalStake: historicalQueries
      .filter(q => q.data)
      .map(q => q.data as ActiveStakeTrend)
      .sort((a, b) => a.epoch - b.epoch),
  };

  return {
    data: combinedData,
    isLoading: currentQuery.isLoading,
    error: currentQuery.error || null,
    refetch: async () => {
      await currentQuery.refetch();
    },
    isRefetching: currentQuery.isRefetching,
  };
}