import { IPost } from "./common";
import { IGenericResponse } from "./response";

export type TStreamResponse = IGenericResponse<IPost[], IStreamResponseMeta>;

interface IStreamResponseMeta {
  posts_count: number;
}
