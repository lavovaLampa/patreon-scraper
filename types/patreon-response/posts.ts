import { IPost } from "../patreon-data-types/post";
import { IGenericResponse } from "../response";

export type TPostsResponse = IGenericResponse<IPost[], IPostsResponseMeta>;

interface IPostsResponseMeta {
  pagination: IPaginationInfo;
}

interface IPaginationInfo {
  cursors: ICursorsInfo;
  total: number;
}

interface ICursorsInfo {
  next: string;
}
