import * as rqst from "request";
import * as request from "request-promise-native";
import { OptionsWithUrl } from "request-promise-native";
import { TCurrentUserResponse } from "../../types/current_user-response";
import { IFileUrlQS } from "../../types/internal";
import { TPostsResponse } from "../../types/posts-response";
import { ICurrentUserRequestOptions, IStreamRequestOptions } from "../../types/request";
import { ITypedResponse } from "../../types/response";
import { TStreamResponse } from "../../types/stream-response";
import { BasicAuthenticatedPatreonRequest } from "./request-proto";

export class PatreonRequest extends BasicAuthenticatedPatreonRequest {
  public async getCurrentUser(options?: ICurrentUserRequestOptions): Promise<ITypedResponse<TCurrentUserResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/current_user",
    };
    return request(requestOptions);
  }

  protected async login(options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.postRequestOptions,
      qs: options,
      url: "/api/login",
    };
    return request(requestOptions);
  }

  protected async getStream(options?: IStreamRequestOptions): Promise<ITypedResponse<TStreamResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/stream",
    };
    return request(requestOptions);
  }

  protected async getSimilar(options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/similar",
    };
    return request(requestOptions);
  }

  // TODO: response type
  protected async getPosts(options?: any): Promise<ITypedResponse<TPostsResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/posts",
    };
    return request(requestOptions);
  }

  // TODO: this is not happening?
  // should return 302 Found, redirect to real file
  protected getFile(identifier: IFileUrlQS): rqst.Request {
    const requestOptions: request.OptionsWithUrl = {
      ...this.getRequestOptions,
      json: false,
      qs: identifier,
      url: "/file",
    };
    return rqst(requestOptions);
  }
}
