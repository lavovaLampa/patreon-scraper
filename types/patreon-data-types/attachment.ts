import { DataTypeKey, ICommonAttributes, ICommonDataProperties } from "../response";

export interface IAttachment extends ICommonDataProperties {
  attributes: IAttachmentAttributes;
  type: DataTypeKey.Attachment;
}

interface IAttachmentAttributes extends ICommonAttributes {
  name: string;
  url: string;
}
