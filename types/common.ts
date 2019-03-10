interface ICommonDataProperties {
  id: string;
}

export type TDataObject = IUser | IPost | IPollChoice | IPostTag | IAccessRule | IAttachment | ICampaign | IPoll;

export interface IUser extends ICommonDataProperties {
  attributes: IUserAttributes;
  relationships: IUserRelationships;
  type: DataTypeKey.User;
}

export interface IPost extends ICommonDataProperties {
  attributes: IPostAttributes;
  relationships: IPostRelationships;
  type: DataTypeKey.Post;
}

export interface IPollChoice extends ICommonDataProperties {
  attributes: IPollChoiceAttributes;
  type: DataTypeKey.PollChoice;
}

export interface IPostTag extends ICommonDataProperties {
  attributes: IPostTagAttributes;
  type: DataTypeKey.PostTag;
}

export interface IAccessRule extends ICommonDataProperties {
  attributes: IAccessRuleAttributes;
  relationships: IAccessRuleRelationships;
  type: DataTypeKey.AccessRule;
}

export interface IAttachment extends ICommonDataProperties {
  attributes: IAttachmentAttributes;
  type: DataTypeKey.Attachment;
}

export interface ICampaign extends ICommonDataProperties {
  attributes: ICampaignAttributes;
  type: DataTypeKey.Campaign;
}

export interface IPoll extends ICommonDataProperties {
  attributes: IPollAttributes;
  relationships: IPollRelationships;
  type: DataTypeKey.Poll;
}

interface ICommonAttributes {

}

interface IPollAttributes extends ICommonAttributes {
  closes_at: Date | null;
  created_at: Date;
  num_responses: number;
  question_text: string;
  question_type: IPollQuestionTypeKey;
}

interface IUserAttributes extends ICommonAttributes {
  full_name: string;
  image_url: string;
  social_connections: ISocialConnections;
  url: string;
}

interface ICampaignAttributes extends ICommonAttributes {
  avatar_photo_url?: string;
  earnings_visibility: EarningsVisibilityTypeKey;
  is_monthly: boolean;
  is_nsfw: boolean;
  name: string;
  url: string;
}

interface IPollChoiceAttributes extends ICommonAttributes {
  choice_type: ChoiceTypeTypeKey;
  num_responses: number;
  position: number;
  text_content: string;
}

interface IPostTagAttributes extends ICommonAttributes {
  background_image_url: string | null;
  cardinality: number;
  is_featured: boolean;
  ordinal_number: number | null;
  tag_type: TagTypeTypeKey;
  value: string;
}

interface IAccessRuleAttributes extends ICommonAttributes {
  access_rule_type: AccessRuleTypeKey;
  amount_cents: number | null;
  post_count: number;
}

interface IAttachmentAttributes extends ICommonAttributes {
  name: string;
  url: string;
}

interface IFileAttributes extends ICommonAttributes {
  name: string;
  url: string;
}

interface IImageAttributes extends ICommonAttributes {
  height: number;
  width: number;
  large_url: string;
  thumb_url: string;
  url: string;
}

interface IPostAttributes extends ICommonAttributes {
  change_visibility_at: Date | null;
  comment_count: number;
  content: string;
  created_at?: Date | null;
  current_user_can_delete: boolean;
  current_user_can_view: boolean;
  current_user_has_liked: boolean;
  deleted_at?: Date | null;
  edit_url?: string;
  edited_at?: Date | null;
  // TODO: embed type
  embed: any | null;
  image: IImageAttributes;
  is_automated_monthly_charge?: boolean;
  is_paid: boolean;
  like_count: number;
  min_cents_pledged_to_view: number | null;
  patreon_url: string;
  patron_count: number;
  pledge_url: string;
  post_file: IFileAttributes;
  post_type: PostTypeKey;
  published_at: Date;
  scheduled_for?: Date | null;
  teaser_text: string | null;
  thumbnail?: IThumbnailData;
  title: string;
  upgrade_url?: string;
  url: string;
  was_posted_by_campaign_owner: boolean;
}

interface ISocialConnections {
  deviantart: any | null;
  discord: any | null;
  facebook: any | null;
  instagram: any | null;
  reddit: any | null;
  spotify: any | null;
  twitch: any | null;
  twitter: any | null;
  youtube: any | null;
}

enum ChoiceTypeTypeKey {
  Toggle = "toggle",
}

enum TagTypeTypeKey {
  UserDefined = "user_defined",
}

enum AccessRuleTypeKey {
  Patrons = "patrons",
}

enum EarningsVisibilityTypeKey {
  Public = "public",
}

enum IPollQuestionTypeKey {
  MultipleChoice = "multiple_choice",
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

enum PostTypeKey {
  Image = "image_file",
}

interface ICommonRelationships {

}

interface IUserRelationships extends ICommonRelationships {
  campaign?: ICommonRelationshipAttributes;
}

interface IAccessRuleRelationships extends ICommonRelationships {
  tier?: IGenericRelationshipAttributes<any | null, void>;
}

interface IPostRelationships extends ICommonRelationships {
  access_rules?: ICommonRelationshipArrayAttributes;
  attachments?: ICommonRelationshipArrayAttributes;
  campaign?: ICommonRelationshipAttributes;
  poll?: IGenericRelationshipAttributes<any | null, void>;
  user?: ICommonRelationshipAttributes;
  user_defined_tags?: ICommonRelationshipArrayAttributes;
}

interface IPollRelationships extends ICommonRelationships {
  choices?: IGenericRelationshipAttributes<IDataIdentifier[], void>;
  current_user_responses?: IGenericRelationshipAttributes<any[], void>;
}

type ICommonRelationshipAttributes = IGenericRelationshipAttributes<IDataIdentifier, ICommonLinks>;
type ICommonRelationshipArrayAttributes = IGenericRelationshipAttributes<IDataIdentifier[], ICommonLinks>;

interface IGenericRelationshipAttributes<T, U extends ICommonLinks | void> {
  data: T;
  links?: U;
}

export interface ICommonLinks {
  first?: string;
  next?: string;
  related?: string;
  self?: string;
}

interface IDataIdentifier {
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
