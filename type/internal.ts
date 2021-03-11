export interface PatreonFileHandle {
  fileName: string;
  url: string;
  creatorId: number;
}

export type Optional<T> = T | null;

export interface ParsedArgs {
  s?: string;
  session_id?: string;
  d?: string;
  output_dir?: string;
  _: string[];
}

export interface InternalArgs {
  sessionId: Optional<string>;
  outputDir: string;
  campaignIds: readonly number[];
}
