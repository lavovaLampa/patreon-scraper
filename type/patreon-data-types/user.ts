import {
  DataTypeKey,
  CommonAttributes,
  CommonDataProperties,
  ICommonRelationshipAttributes,
  CommonRelationships
} from "../response"

export interface IUser extends CommonDataProperties {
  attributes: IUserAttributes
  relationships: IUserRelationships
  type: DataTypeKey.User
}

interface IUserAttributes extends CommonAttributes {
  about: string | null
  can_see_nsfw: boolean | null
  comment_count?: number
  created: Date
  default_country_code: string | null
  discord_id: string | null
  email: string
  facebook: string | null
  facebook_id: string | null
  first_name: string | null
  full_name: string
  gender: number
  has_password: boolean
  hide_pledges?: boolean | null
  image_url: string
  is_deleted: boolean
  is_email_verified: boolean
  is_nuked: boolean
  is_suspended: boolean
  last_name: string | null
  like_count?: number
  social_connections: ISocialConnections
  thumb_url: string
  twitch: string | null
  twitter: string | null
  url: string
  // public username
  vanity: string | null
  youtube?: string | null
}

interface IUserRelationships extends CommonRelationships {
  campaign?: ICommonRelationshipAttributes
  memberships?: ICommonRelationshipAttributes[]
}

interface ISocialConnections {
  deviantart: string | null
  discord: string | null
  facebook: string | null
  instagram: string | null
  reddit: string | null
  spotify: string | null
  twitch: string | null
  twitter: string | null
  youtube: string | null
}
