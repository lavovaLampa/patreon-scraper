import { Response } from "got/dist/source/core";
import { Cookie, CookieJar } from "tough-cookie";
import got, { Got } from "got";
import { URLSearchParams } from "url";
import { CampaignResponse } from "../type/response/campaign";
import { StreamResponse } from "../type/response/stream";
import { URL } from "url";

const BASE_URL = "https://www.patreon.com";

export class PatreonRequest {
  private readonly request: Got;

  constructor(sessionId?: string) {
    const cookieJar = new CookieJar();
    if (sessionId) {
      cookieJar.setCookieSync(`session_id=${sessionId}`, BASE_URL);
    }

    this.request = got.extend({
      prefixUrl: BASE_URL,
      cookieJar: cookieJar,
      responseType: "json",
    });
  }

  // Protected by cloudflare
  // FIXME: How to bypass?
  public async getCreatorPage(creatorName: string): Promise<Response<string>> {
    return this.request.get(`${creatorName}/posts`, {
      responseType: "text",
    });
  }

  public async getUserStream(
    cursor = "null",
    creatorId?: number
  ): Promise<Response<StreamResponse>> {
    const params = new URLSearchParams({
      include: ["attachments", "audio", "images", "media"],
      "fields[media]": ["id", "download_url", "file_name"],
      // TODO: Should be true?
      "filter[is_following]": "true",
      "page[cursor]": cursor,
    });
    if (creatorId) {
      params.append("filter[creator_id]", creatorId.toString());
    }

    /// @ts-ignore
    return this.request.get("api/stream", {
      searchParams: params,
    });
  }

  public async getCampaignPosts(
    campaignId: number,
    cursor?: string
  ): Promise<Response<CampaignResponse>> {
    const params = new URLSearchParams({
      include: ["attachments", "audio", "images", "media"],
      "fields[media]": ["id", "download_url", "file_name"],
      "filter[campaign_id]": campaignId.toString(),
      "filter[contains_exclusive_posts]": "true",
      sort: "-published_at",
      "json-api-use-default-includes": "false",
      "json-api-version": "1.0",
    });
    if (cursor) {
      params.append("page[cursor]", cursor);
    }

    /// @ts-ignore
    return this.request.get("api/posts", {
      searchParams: params,
    });
  }

  public getUrlStream(url: string) {
    // To override the baseUrl set in the constructor
    const urlObject = new URL(url);

    return this.request.stream.get({
      url: urlObject,
      isStream: true,
    });
  }
}
