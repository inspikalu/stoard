export interface ValidatorStakeData {
  labels: string[];
  counts: number[];
}

export interface ApiError {
  error: string;
}

export type Validator = {
  pubkey: string;
  name: string;
  image: string;
  website: string;
  stake: number;
  commission: number;
  performance: number;
  superminority: boolean;
};