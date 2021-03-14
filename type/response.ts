import { Attachment as AttachmentInclude } from "./response_includes/attachment";
import { Media as MediaInclude } from "./response_includes/media";

export interface ApiResponse<M> {
  data: unknown[];
  included: readonly IncludeObject[];
  links: unknown;
  meta: M;
}

export interface CommonDataProperties {
  id: string;
}

export type IncludeObject = AttachmentInclude | MediaInclude;

export enum DataTypeKey {
  Attachment = "attachment",
  Media = "media",
}
