import { DataTypeKey, CommonDataProperties } from "../response";

export interface Attachment extends CommonDataProperties {
  attributes: AttachmentAttributes;
  type: DataTypeKey.Attachment;
}

interface AttachmentAttributes {
  name: string;
  url: string;
}
