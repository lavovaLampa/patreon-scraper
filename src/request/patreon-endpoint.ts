import * as rqst from "request";
import * as request from "request-promise-native";
import { OptionsWithUrl } from "request-promise-native";
import { IFileUrlQS } from "../../types/internal";
import { TCurrentUserResponse } from "../../types/patreon-response/current_user";
import { TPostsResponse } from "../../types/patreon-response/posts";
import { TStreamResponse } from "../../types/patreon-response/stream";
import { ICurrentUserRequestOptions, IStreamRequestOptions } from "../../types/request";
import { ITypedResponse } from "../../types/response";
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

  protected async getCampaign(campaignId: string, options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: `/api/campaigns/${campaignId}`,
    };
    return request(requestOptions);
  }

  protected async getCampaignPostTags(campaignId: string, options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: `/api/campaigns/${campaignId}/post-tags`,
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

  // TODO: response type
  protected async getPosts(options?: any): Promise<ITypedResponse<TPostsResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/posts",
    };
    return request(requestOptions);
  }

  protected async getRewardItems(options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/reward-items",
    };
    return request(requestOptions);
  }

  protected async getRewards(rewardId: string, options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: `/api/rewards/${rewardId}`,
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

  protected async getStream(options?: IStreamRequestOptions): Promise<ITypedResponse<TStreamResponse>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: "/api/stream",
    };
    return request(requestOptions);
  }

  protected async getUserInfo(userId: string, options?: any): Promise<ITypedResponse<any>> {
    const requestOptions: OptionsWithUrl = {
      ...this.getRequestOptions,
      qs: options,
      url: `/api/user/${userId}`,
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
}
