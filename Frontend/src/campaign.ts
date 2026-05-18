
export type Campaign = {
  campaign_id: number;
  name: string;
  due_date: string | null;
  created_at: string | null;
};

export type PaginatedResponse<T> = {
  data: T;
  next: string | null;
};
