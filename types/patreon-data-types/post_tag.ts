import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties
} from "../response"

export interface IPostTag extends CommonDataProperties {
  attributes: IPostTagAttributes
  type: DataTypeKey.PostTag
}

interface IPostTagAttributes extends CommonAttributes {
  background_image_url: string | null
  cardinality: number
  is_featured: boolean
  ordinal_number: number | null
  tag_type: TagTypeTypeKey
  value: string
}

enum TagTypeTypeKey {
  UserDefined = "user_defined"
}
