import { FullResponse } from "request-promise-native";

export interface ITypedResponse<T> extends FullResponse {
  body: T;
}

export interface IStreamResponse {
  data: IPostData[];
  included: IIncludeDataObject[];
  links?: ILinkData;
  meta: { posts_count: number };
}

interface ILinkData {
  first: string;
  next: string;
}

interface IPostData {
  attributes: IPostAttributes;
  id: string;
  relationships: IRelationships;
  type: DataTypeKey;
}

interface IPostAttributes {
  comment_count: number;
  content: string;
  created_at: Date | null;
  current_user_can_delete: boolean;
  current_user_can_view: boolean;
  current_user_has_liked: boolean;
  deleted_at: Date | null;
  edit_url: string;
  edited_at: Date | null;
  embed: any | null;
  image: IImageAttributes;
  is_automated_monthly_charge: boolean;
  is_paid: boolean;
  like_count: number;
  // TODO: type?
  min_cents_pledged_to_view: null;
  patreon_url: string;
  patron_count: number;
  pledge_url: string;
  post_file: IFileAttributes;
  post_type: PostTypeKey;
  published_at: Date;
  scheduled_for: Date | null;
  teaser_text: string | null;
  thumbnail: IThumbnailData;
  title: string;
  url: string;
  was_posted_by_campaign_owner: boolean;
}

interface IRelationships {
  access_rules?: IBasicRelationAttributes;
  attachments?: IBasicRelationAttributes;
  campaign?: IBasicRelationAttributes;
  poll?: IBasicRelationAttributes;
  user?: IBasicRelationAttributes;
  user_defined_tags?: IBasicRelationAttributes;
}

interface IBasicRelationAttributes {
  data: IDataIdentifier;
  links?: { related: string };
}

interface IDataIdentifier {
  id: string;
  type: DataTypeKey;
}

interface IThumbnailData {
  huge: string;
  large: string;
  large_2: string;
  old_thumb: string;
  small: string;
  small_2: string;
  square_large: string;
  square_large_2: string;
  square_small: string;
  square_small_2: string;
  url: string;
}

interface IFileAttributes {
  name: string;
  url: string;
}

interface IImageAttributes {
  height: number;
  width: number;
  large_url: string;
  thumb_url: string;
  url: string;
}

enum PostTypeKey {
  Image = "image_file",
}

export enum DataTypeKey {
  Attachment = "attachment",
  Post = "post",
  Reward = "reward",
  AccessRule = "access-rule",
  PostTag = "post_tag",
  Campaign = "campaign",
  User = "user",
}

export interface IFileUrlQS {
  h: string;
  i: string;
}

export interface IIncludeDataObject {
  attributes: IObjectAttributes;
  // numeric string
  id: string;
  type: DataTypeKey;
}

interface IObjectAttributes {
  name: string;
  url: string;
}
