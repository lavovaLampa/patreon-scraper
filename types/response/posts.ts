import { IPost } from "../patreon-data-types/post"
import { GenericResponse } from "../response"

export type TPostsResponse = GenericResponse<IPost[], IPostsResponseMeta>

interface IPostsResponseMeta {
  pagination: IPaginationInfo
}

interface IPaginationInfo {
  cursors: ICursorsInfo
  total: number
}

interface ICursorsInfo {
  next: string
}
