// tslint:disable-next-line: no-empty-interface
interface ICommonRequestOptions { }

// tslint:disable-next-line: no-empty-interface
export interface ICurrentUserRequestOptions extends ICommonRequestOptions { }

export interface IStreamRequestOptions extends ICommonRequestOptions {
  page?: IPageOptions;
  filter?: IFilterOptions;
  include?: TIncludeStrings[];
  fields?: IFieldOptions;
  "json-api-use-default-includes"?: boolean;
  "json-api-version"?: JsonApiVersionKey;
}

type TIncludeStrings = "recent_comments.commenter" | "recent_comments.commenter.flairs.campaign" |
  "recent_comments.parent" | "recent_comments.post" | "recent_comments.first_reply.commenter" |
  "recent_comments.first_reply.parent" | "recent_comments.first_reply.post";

enum JsonApiVersionKey {
  v1 = "1.0",
}

interface IFieldOptions {
  comment?: CommentFieldKey[];
  post?: PostFieldKey[];
  user?: UserFieldKey[];
  flair?: FlairFieldKey[];
}

enum FlairFieldKey {
  ImageTinyUrl = "image_tiny_url",
  Name = "name",
}

enum UserFieldKey {
  ImageUrl = "image_url",
  FullName = "full_name",
  Url = "url",
}

enum PostFieldKey {
  CommentCount = "comment_count",
}

enum CommentFieldKey {
  Body = "body",
  Created = "created",
  DeletedAt = "deleted_at",
  IsByPatron = "is_by_patron",
  IsByCreator = "is_by_creator",
  VoteSum = "vote_sum",
  CurrUserVote = "current_user_vote",
  ReplyCount = "reply_count",
}

interface IFilterOptions {
  is_following: boolean;
}

interface IPageOptions {
  cursor: string | null;
  count?: number;
}
