import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties
} from "../response"

export interface IAttachment extends CommonDataProperties {
  attributes: IAttachmentAttributes
  type: DataTypeKey.Attachment
}

interface IAttachmentAttributes extends CommonAttributes {
  name: string
  url: string
}
