import { NextRequest, NextResponse } from 'next/server';
import { 
  getCompleteEpochInfo, 
  getDetailedVoteAccounts, 
  getStakeActivationQueue, 
  getActiveStakeHistory 
} from '@/lib/solana';
import { ApiResponse, ParticipationData } from '@/types/participation-type';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(request: NextRequest) {
    const startTime = Date.now();
    
    try {
      const [
        epochData,
        voteData,
        stakeQueueData
      ] = await Promise.allSettled([
        getCompleteEpochInfo(),
        getDetailedVoteAccounts(),
        getStakeActivationQueue()
      ]);
  
      // Get historical data separately with less aggressive fetching
      const stakeHistoryData = await getActiveStakeHistory(10);
  
      // Graceful error handling
      const epochInfo = epochData.status === 'fulfilled' ? epochData.value.epochInfo : null;
      const slotTime = epochData.status === 'fulfilled' ? epochData.value.slotTime : 400;
      const voteMetrics = voteData.status === 'fulfilled' ? voteData.value : {
        totalStake: 0,
        delinquentStake: 0,
        currentStake: 0,
        voteAccountCount: 0
      };
      const stakeQueues = stakeQueueData.status === 'fulfilled' ? stakeQueueData.value : {
        activation: 0,
        deactivation: 0
      };
  
      if (!epochInfo) {
        throw new Error('Failed to fetch essential epoch info');
      }
  
      // Calculate epoch progress
      const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;
      const msRemaining = slotsRemaining * slotTime;
      const remainingTime = formatRemainingTime(msRemaining);
  
      const data: ParticipationData = {
        epochInfo: {
          epoch: epochInfo.epoch,
          slotIndex: epochInfo.slotIndex,
          slotsInEpoch: epochInfo.slotsInEpoch,
          progressPercentage: (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100,
          remainingTime,
          totalStake: voteMetrics.totalStake / 1e9,
        },
        voteMetrics: {
          ...voteMetrics,
          averageVoteLatency: 0,
          missedVotePercentage: 0,
        },
        stakeQueues,
        activeStakeTrends: stakeHistoryData, // Use the separately fetched history
      };
  
      console.log(`Data fetch completed in ${Date.now() - startTime}ms`);
      return NextResponse.json({ success: true, data });
    } catch (error) {
      console.error('Error in participation endpoint:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          note: 'The API may be rate limited. Please try again later.'
        },
        { status: 500 }
      );
    }
  }

function formatRemainingTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return [
    days > 0 ? `${days}d` : null,
    hours % 24 > 0 ? `${hours % 24}h` : null,
    minutes % 60 > 0 ? `${minutes % 60}m` : null,
    seconds % 60 > 0 ? `${seconds % 60}s` : null,
  ].filter(Boolean).join(' ');
}