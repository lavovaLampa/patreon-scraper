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
  h?: boolean;
  help?: boolean;
  _: string[];
}

export interface InternalOpts {
  sessionId: Optional<string>;
  outputDir: string;
  campaignIds: readonly number[];
  help: boolean;
  foreignKeys: string[];
}
