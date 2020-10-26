import { IAccessRule } from "./patreon-data-types/access_rule"
import { Attachment } from "./patreon-data-types/attachment"
import { ICampaign } from "./patreon-data-types/campaign"
import { Media } from "./patreon-data-types/media"
import { Poll } from "./patreon-data-types/poll"
import { IPollChoice } from "./patreon-data-types/poll_choice"
import { IPost } from "./patreon-data-types/post"
import { IPostTag } from "./patreon-data-types/post_tag"
import { IUser } from "./patreon-data-types/user"

export interface GenericResponse<T, U> {
  data: T
  included: TDataObject[]
  links: CommonLinks
  meta: U
}

export interface CommonDataProperties {
  id: string
}

export type TDataObject =
  | IUser
  | IPost
  | IPollChoice
  | IPostTag
  | IAccessRule
  | Attachment
  | ICampaign
  | Poll
  | Media

export interface CommonAttributes {}

// tslint:disable-next-line: no-empty-interface
export interface CommonRelationships {}

export type ICommonRelationshipAttributes = GenericRelationshipAttributes<
  DataIdentifier,
  CommonLinks
>

export interface GenericRelationshipAttributes<
  T,
  U extends CommonLinks | void
> {
  data: T
  links?: U
}

export interface CommonLinks {
  first?: string
  next?: string
  related?: string
  self?: string
}

export interface DataIdentifier {
  id: string
  type: DataTypeKey
}

export enum DataTypeKey {
  Attachment = "attachment",
  Post = "post",
  Reward = "reward",
  AccessRule = "access-rule",
  PostTag = "post_tag",
  Campaign = "campaign",
  User = "user",
  Poll = "poll",
  PollChoice = "poll_choice",
  Pledge = "pledge",
  Media = "media"
}
