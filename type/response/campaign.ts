import { ApiResponse } from "../response";

export type CampaignResponse = ApiResponse<StreamMeta>;

interface StreamMeta {
  pagination: Pagination;
}

interface Pagination {
  cursors?: Cursors;
  total: number;
}

interface Cursors {
  next: string;
}
