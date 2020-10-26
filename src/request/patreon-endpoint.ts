import { BasicAuthenticatedPatreonRequest } from "./request-proto"
import { Maybe } from "../../type/common"
import { URLSearchParams } from "url"
import { TStreamResponse } from "../../type/response/stream"
import { TCurrentUserResponse } from "../../type/response/current_user"
import { Response } from "got/dist/source"

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

  public async getCurrentUser(): Promise<
    Maybe<Response<TCurrentUserResponse>>
  > {
    try {
      const result = await this.getJsonRequest<TCurrentUserResponse>(
        "api/current_user"
      )
      return result
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async getPosts(): Promise<Maybe<Response<string>>> {
    try {
      const result = await this.getJsonRequest<string>("api/posts")
      return result
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public async getStream(
    cursor: Maybe<string>
  ): Promise<Maybe<Response<TStreamResponse>>> {
    const searchParams = cursor
      ? new URLSearchParams([["page[cursor]", cursor]])
      : null

    try {
      const result = await this.getJsonRequest<TStreamResponse>(
        "api/stream",
        searchParams
      )
      return result
    } catch (err) {
      console.error(err)
      return null
    }
  }

  public getFile(url: string) {
    return this.getStreamRequest(url)
  }

  // public getFile(identifier: FileUrlQS) {
  //   const requestOptions: OptionsWithUrl = {
  //     ...this.requestBase,
  //     json: false,
  //     qs: identifier,
  //     url: "/file"
  //   }
  //   return cloudscraper(requestOptions)
  // }

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
