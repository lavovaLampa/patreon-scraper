import * as moment from "moment";
import * as qs from "qs";
import { IAttachment } from "../../types/internal";
import { IStreamRequestOptions } from "../../types/request";
import { DataTypeKey, IFileUrlQS, IIncludeDataObject, IStreamResponse, ITypedResponse } from "../../types/response";
import { PatreonRequest } from "../request/patreon-endpoint";

const PAGE_POST_COUNT = 12;

export class PatreonAttachmentScrapper extends PatreonRequest {
  protected currPage: IStreamResponse | null = null;
  protected nextCursor: string | null = null;

  public getCurrAttachments(): IAttachment[] {
    if (this.currPage && this.currPage.included) {
      const attachments = this.currPage.included.filter((obj) => obj.type === DataTypeKey.Attachment);
      return this.dataToAttachment(attachments);
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
    let response: ITypedResponse<IStreamResponse> | null = null;

    try {
      response = await this.getStream(streamOptions);
    } catch (e) {
      console.error("failed to execute request");
      console.error(e);
    }
    if (response && response.body !== undefined && response.statusCode === 200) {
      this.currPage = response.body;
      this.nextCursor = this.isLastPage() ? this.nextCursor : this.nextCursorLocation();
      return true;
    } else if (response !== null) {
      console.log("received status code: " + response.statusCode);
      console.log("page state not updated");
      return false;
    } else {
      return false;
    }
  }

  public isLastPage(): boolean {
    const postCount = this.getPostsCount();
    return postCount < PAGE_POST_COUNT && postCount >= 0;
  }

  private dataToAttachment(data: IIncludeDataObject[]): IAttachment[] {
    const sparseArray = data.map((val) => {
      const urlSplit = val.attributes.url.split("?");
      if (urlSplit.length > 1) {
        const qsPart = urlSplit[1];
        const result: IFileUrlQS | null | undefined = qs.parse(qsPart);
        if (result !== null && result !== undefined) {
          return {
            name: val.attributes.name,
            ...result,
          };
        }
      }
      console.error("file queryString parsing fail");
      return null;
    });
    return sparseArray.filter((val) => val !== null) as IAttachment[];
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
