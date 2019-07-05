import * as rqst from "request";
import * as request from "request-promise-native";
import { IFileUrlQS } from "../../types/internal";
import { TCurrentUserResponse } from "../../types/patreon-response/current_user";
import { TPostsResponse } from "../../types/patreon-response/posts";
import { TStreamResponse } from "../../types/patreon-response/stream";
import { ICurrentUserRequestOptions, IStreamRequestOptions } from "../../types/request";
import { ITypedResponse } from "../../types/response";
import { BasicAuthenticatedPatreonRequest } from "./request-proto";

export class PatreonRequest extends BasicAuthenticatedPatreonRequest {

  public async getCampaign(campaignId: string, options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto(`api/campaigns/${campaignId}`, options);
  }

  public async getCampaignPostTags(campaignId: string, options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto(`api/campaigns/${campaignId}/post-tags`, options);
  }
  public async getCurrentUser(options?: ICurrentUserRequestOptions): Promise<ITypedResponse<TCurrentUserResponse>> {
    return this.getRequestProto("api/current_user", options);
  }

  public getFile(identifier: IFileUrlQS): rqst.Request {
    const requestOptions: request.OptionsWithUrl = {
      ...this.getRequestOptions,
      json: false,
      qs: identifier,
      url: "/file",
    };
    return rqst(requestOptions);
  }

  // TODO: response type
  public async getPosts(options?: any): Promise<ITypedResponse<TPostsResponse>> {
    return this.getRequestProto("api/posts", options);
  }

  public async getRewardItems(options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto("api/reward-items", options);
  }

  public async getRewards(rewardId: string, options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto(`api/rewards/${rewardId}`, options);
  }

  public async getSimilar(options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto("api/similar", options);
  }

  public async getStream(options?: IStreamRequestOptions): Promise<ITypedResponse<TStreamResponse>> {
    return this.getRequestProto("api/stream", options);
  }

  public async getUserInfo(userId: string, options?: any): Promise<ITypedResponse<any>> {
    return this.getRequestProto(`api/user/${userId}`, options);
  }

  public async login(options?: any): Promise<ITypedResponse<any>> {
    return this.postRequestProto("api/login", options);
  }

  private async getRequestProto(url: string, options?: any) {
    return request({
      ...this.getRequestOptions,
      qs: options,
      url,
    });
  }

  private async postRequestProto(url: string, options?: any) {
    return request({
      ...this.postRequestOptions,
      qs: options,
      url,
    });
  }
}
