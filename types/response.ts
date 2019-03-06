import { FullResponse } from 'request-promise-native';

export interface TypedResponse<T> extends FullResponse {
  body: T;
}

export interface StreamResponse {
  data: PostData[];
  included: IncludeDataObject[];
  links?: LinkData;
  meta: { posts_count: number };
}

interface LinkData {
  first: string;
  next: string;
}

interface PostData {
  attributes: PostAttributes;
  id: string;
  relationships: Relationships;
  type: DataTypeKey;
}

interface PostAttributes {
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
  image: ImageAttributes;
  is_automated_monthly_charge: boolean;
  is_paid: boolean;
  like_count: number;
  // TODO: type?
  min_cents_pledged_to_view: null;
  patreon_url: string;
  patron_count: number;
  pledge_url: string;
  post_file: FileAttributes;
  post_type: PostTypeKey;
  published_at: Date;
  scheduled_for: Date | null;
  teaser_text: string | null;
  thumbnail: ThumbnailData;
  title: string;
  url: string;
  was_posted_by_campaign_owner: boolean;
}

interface Relationships {
  access_rules?: BasicRelationAttributes;
  attachments?: BasicRelationAttributes;
  campaign?: BasicRelationAttributes;
  poll?: BasicRelationAttributes;
  user?: BasicRelationAttributes;
  user_defined_tags?: BasicRelationAttributes;
}

interface BasicRelationAttributes {
  data: DataIdentifier;
  links?: { related: string };
}

interface DataIdentifier {
  id: string;
  type: DataTypeKey;
}

interface ThumbnailData {
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

interface FileAttributes {
  name: string;
  url: string;
}

interface ImageAttributes {
  height: number;
  width: number;
  large_url: string;
  thumb_url: string;
  url: string;
}

enum PostTypeKey {
  Image = 'image_file'
}

export enum DataTypeKey {
  Attachment = 'attachment',
  Post = 'post',
  Reward = 'reward',
  AccessRule = 'access-rule',
  PostTag = 'post_tag',
  Campaign = 'campaign',
  User = 'user'
}

export interface IFileUrlQS {
  h: string;
  i: string;
}

export interface IncludeDataObject {
  attributes: ObjectAttributes;
  // numeric string
  id: string;
  type: DataTypeKey;
}

interface ObjectAttributes {
  name: string;
  url: string;
}
