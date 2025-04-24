// types/stake-concentration.ts
export interface LorenzCurvePoint {
    populationPercentage: number;
    stakePercentage: number;
  }
  
  export interface CurrentStakeDistribution {
    totalValidators: number;
    totalStake: number;
    average: number;
    median: number;
  }
  
  export interface StakeConcentrationData {
    giniCoefficient: number;
    lorenzCurve: LorenzCurvePoint[];
    currentStats: CurrentStakeDistribution;
    historicalData: any; // You might want to type this more precisely
    timestamp: string;
  }
  
  export interface ApiError {
    error: string;
  }