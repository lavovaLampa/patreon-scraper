import { IAccessRule } from "./patreon-response/access_rule";
import { IAttachment } from "./patreon-response/attachment";
import { ICampaign } from "./patreon-response/campaign";
import { IPoll } from "./patreon-response/poll";
import { IPollChoice } from "./patreon-response/poll_choice";
import { IPost } from "./patreon-response/post";
import { IPostTag } from "./patreon-response/post_tag";
import { IUser } from "./patreon-response/user";

export interface ICommonDataProperties {
  id: string;
}

export type TDataObject = IUser | IPost | IPollChoice | IPostTag | IAccessRule | IAttachment | ICampaign | IPoll;

export interface ICommonAttributes { }

export interface ICommonRelationships { }

export type ICommonRelationshipAttributes = IGenericRelationshipAttributes<IDataIdentifier, ICommonLinks>;
export type ICommonRelationshipArrayAttributes = IGenericRelationshipAttributes<IDataIdentifier[], ICommonLinks>;

export interface IGenericRelationshipAttributes<T, U extends ICommonLinks | void> {
  data: T;
  links?: U;
}

export interface ICommonLinks {
  first?: string;
  next?: string;
  related?: string;
  self?: string;
}

export interface IDataIdentifier {
  id: string;
  type: DataTypeKey;
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
}
