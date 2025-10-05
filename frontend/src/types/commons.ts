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
  DELETE_PAYOUT = "DELETE_PAYOUT",
  UPDATE_PAYOUT = "UPDATE_PAYOUT",
}

export interface Team {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
