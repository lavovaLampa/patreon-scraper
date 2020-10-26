import { IPost } from "../patreon-data-types/post"
import { GenericResponse } from "../response"

export type TStreamResponse = GenericResponse<IPost[], IStreamResponseMeta>

interface IStreamResponseMeta {
  posts_count: number
}
