import { FullResponse } from "request-promise-native";
import { IAccessRule } from "./patreon-data-types/access_rule";
import { IAttachment } from "./patreon-data-types/attachment";
import { ICampaign } from "./patreon-data-types/campaign";
import { IPoll } from "./patreon-data-types/poll";
import { IPollChoice } from "./patreon-data-types/poll_choice";
import { IPost } from "./patreon-data-types/post";
import { IPostTag } from "./patreon-data-types/post_tag";
import { IUser } from "./patreon-data-types/user";

export interface ITypedResponse<T> extends FullResponse {
  body: T;
}

export interface IGenericResponse<T, U> {
  data: T;
  included: TDataObject[];
  links: ICommonLinks;
  meta: U;
}

export interface ICommonDataProperties {
  id: string;
}

export type TDataObject = IUser | IPost | IPollChoice | IPostTag | IAccessRule | IAttachment | ICampaign | IPoll;

// tslint:disable-next-line: no-empty-interface
export interface ICommonAttributes { }

// tslint:disable-next-line: no-empty-interface
export interface ICommonRelationships { }

export type ICommonRelationshipAttributes = IGenericRelationshipAttributes<IDataIdentifier, ICommonLinks>;

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
