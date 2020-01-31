import { FileUrlQS } from "../../types/common"
// import { TPostsResponse } from "../../types/response/posts"
// import { TStreamResponse } from "../../types/response/stream"
import { IStreamRequestOptions } from "../../types/request"
import { TypedResponse } from "../../types/response"
import { BasicAuthenticatedPatreonRequest } from "./request-proto"
import { RequestPromise } from "request-promise"
import * as requestPromise from "request-promise"
import * as cloudscraper from "cloudscraper"
import { OptionsWithUrl } from "cloudscraper"
import { TCurrentUserResponse } from "../../types/response/current_user"
import { TStreamResponse } from "../../types/response/stream"

export class PatreonRequest extends BasicAuthenticatedPatreonRequest {
  // public async getCampaign(
  //   campaignId: string,
  //   options?: unknown
  // ): Promise<TypedResponse<any>> {
  //   return this.getRequestProto(`api/campaigns/${campaignId}`, options)
  // }

  // public async getCampaignPostTags(
  //   campaignId: string,
  //   options?: any
  // ): Promise<TypedResponse<any>> {
  //   return this.getRequestProto(
  //     `api/campaigns/${campaignId}/post-tags`,
  //     options
  //   )
  // }

  // public async getCurrentUser(
  //   options?: ICurrentUserRequestOptions
  // ): Promise<TypedResponse<TCurrentUserResponse>> {
  //   return this.getRequestProto("api/current_user", options)
  // }

  public getCurrentUser(): RequestPromise<TypedResponse<TCurrentUserResponse>> {
    return this.getRequest("api/current_user")
  }

  public getFile(identifier: FileUrlQS): RequestPromise<TypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.requestBase,
      json: false,
      qs: identifier,
      url: "/file"
    }
    return cloudscraper(requestOptions)
  }

  // TODO: response type
  // public async getPosts(options?: any): Promise<TypedResponse<TPostsResponse>> {
  //   return this.getRequestProto("api/posts", options)
  // }

  // public async getRewardItems(options?: any): Promise<TypedResponse<any>> {
  //   return this.getRequestProto("api/reward-items", options)
  // }

  // public async getRewards(
  //   rewardId: string,
  //   options?: any
  // ): Promise<TypedResponse<any>> {
  //   return this.getRequestProto(`api/rewards/${rewardId}`, options)
  // }

  // public async getSimilar(options?: any): Promise<TypedResponse<any>> {
  //   return this.getRequestProto("api/similar", options)
  // }

  // public async getStream(
  //   options?: IStreamRequestOptions
  // ): Promise<TypedResponse<TStreamResponse>> {
  //   return this.getRequestProto("api/stream", options)
  // }

  public getStream(
    options?: IStreamRequestOptions
  ): requestPromise.RequestPromise<TypedResponse<TStreamResponse>> {
    return this.getRequest("api/stream", options)
  }

  // public async getUserInfo(
  //   userId: string,
  //   options?: any
  // ): Promise<TypedResponse<any>> {
  //   return this.getRequestProto(`api/user/${userId}`, options)
  // }

  // public async login(options?: any): Promise<TypedResponse<any>> {
  //   return this.postRequestProto("api/login", options)
  // }
}
