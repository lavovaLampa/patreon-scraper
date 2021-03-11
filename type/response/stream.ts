import { ApiResponse } from "../response";

export type StreamResponse = ApiResponse<StreamMeta>;

interface StreamMeta {
  posts_count: number;
}
