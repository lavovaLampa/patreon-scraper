import { DataTypeKey, ICommonAttributes, ICommonDataProperties } from "../response";

export interface IPostTag extends ICommonDataProperties {
  attributes: IPostTagAttributes;
  type: DataTypeKey.PostTag;
}

interface IPostTagAttributes extends ICommonAttributes {
  background_image_url: string | null;
  cardinality: number;
  is_featured: boolean;
  ordinal_number: number | null;
  tag_type: TagTypeTypeKey;
  value: string;
}

enum TagTypeTypeKey {
  UserDefined = "user_defined",
}
