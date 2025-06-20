export interface PaginatedResponse<T> {
  limit: number;
  page: number;
  count: number; 
  exceedCount: boolean; 
  exceedTotalPages: boolean; 
  result: T[]; 
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number; 
}

export enum ACTION {
  DELETE_PAYOUT = 'DELETE_PAYOUT',
  UPDATE_PAYOUT = 'UPDATE_PAYOUT'
}

export interface Payout {
  id?: string;
  country: string;
  amount: number;
  campaignId?: string;
  createdAt?: string;
}

export interface Campaign {
  id: string;
  title: string;
  landingPageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  isRunning: boolean;
  payouts: Payout[];
}