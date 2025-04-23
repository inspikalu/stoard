export interface EpochInfo {
    epoch: number;
    slotIndex: number;
    slotsInEpoch: number;
    progressPercentage: number;
    remainingTime: string;
    totalStake?: number; // Made optional
  }
  
  export interface VoteMetrics {
    averageVoteLatency: number;
    missedVotePercentage: number;
    totalStake: number;        // in lamports
    currentStake: number;      // in lamports
    delinquentStake: number;   // in lamports
    voteAccountCount: number;
  }
  
  export interface StakeQueues {
    activation: number;
    deactivation: number;
  }
  
  export interface ActiveStakeTrend {
    epoch: number;
    activeStake: number;
    timestamp?: number;
  }
  
  export interface ParticipationData {
    epochInfo: EpochInfo;
    voteMetrics: VoteMetrics;
    stakeQueues: StakeQueues;
    activeStakeTrends: ActiveStakeTrend[];
  }
  
  export interface ApiResponse {
    success: boolean;
    data?: ParticipationData;
    error?: string;
    note?: string; // Added for additional error context
  }