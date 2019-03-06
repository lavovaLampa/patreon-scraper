import * as moment from "moment";
import * as qs from "qs";
import { IAttachment } from "../../types/internal";
import { IStreamRequestOptions } from "../../types/request";
import { DataTypeKey, IFileUrlQS, IStreamResponse } from "../../types/response";
import { PatreonRequest } from "../request/patreon-endpoint";

const PAGE_POST_COUNT = 12;

export class PatreonAttachmentScrapper extends PatreonRequest {
  protected currPage: IStreamResponse | null = null;
  protected nextCursor: string | null = null;

  public getCurrAttachments(): IAttachment[] {
    if (this.currPage && this.currPage.included) {
      const filteredAttachments = this.currPage.included.filter((obj) => obj.type === DataTypeKey.Attachment);
      const mappedAttachments = filteredAttachments.map((val) => {
        return { name: val.attributes.name, url: val.attributes.url };
      });
      return mappedAttachments.map((val) => {
        const url = val.url;
        const urlQsPart = url.split("?")[1];
        const result: IFileUrlQS = qs.parse(urlQsPart);
        return {
          name: val.name,
          ...result,
        };
      });
    } else {
      return [];
    }
  }

  public resetState(): void {
    this.currPage = null;
    this.nextCursor = null;
  }

  public async getNextStreamPage(): Promise<boolean> {
    const streamOptions: IStreamRequestOptions = {
      page: {
        cursor: this.nextCursor,
      },
    };
    const response = await this.getStream(streamOptions);

    if (response && response.body !== undefined && response.statusCode === 200) {
      this.currPage = response.body;
      this.nextCursor = this.isLastPage() ? this.nextCursor : this.nextCursorLocation();
      return true;
    } else {
      console.log("received status code: " + response.statusCode);
      console.log("page state not updated");
      return false;
    }
  }

  public isLastPage(): boolean {
    return this.getPostsCount() < PAGE_POST_COUNT && this.getPostsCount() >= 0;
  }

  private getPostsCount(): number {
    if (this.currPage && this.currPage.meta && this.currPage.meta.posts_count) {
      return this.currPage.meta.posts_count;
    } else {
      return -1;
    }
  }

  private nextCursorLocation(): string | null {
    if (this.currPage && this.currPage.data && this.currPage.data.length > 0) {
      const lastPost = this.currPage.data[this.currPage.data.length - 1];
      if (lastPost && lastPost.attributes && lastPost.attributes.published_at) {
        const publishedAt = lastPost.attributes.published_at;
        return moment(publishedAt).subtract(1, "ms").utc().format();
      }
    }
    return null;
  }
}
