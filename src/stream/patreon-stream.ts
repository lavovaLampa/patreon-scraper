import * as moment from "moment";
import * as qs from "qs";
import { IAttachmentIdentifier, IFileUrlQS } from "../../types/internal";
import { IAttachment } from "../../types/patreon-data-types/attachment";
import { IFileAttributes } from "../../types/patreon-data-types/post";
import { TStreamResponse } from "../../types/patreon-response/stream";
import { IStreamRequestOptions } from "../../types/request";
import { DataTypeKey, ITypedResponse } from "../../types/response";
import { PatreonRequest } from "../request/patreon-endpoint";

const PAGE_POST_COUNT = 12;

export class AttachmentScraper extends PatreonRequest {
  protected currPage: TStreamResponse | null = null;
  protected nextCursor: string | null = null;

  public getCurrAttachments(): IAttachmentIdentifier[] {
    if (this.currPage && this.currPage.included) {
      const attachments =
        this.currPage.included.filter((obj) => obj.type === DataTypeKey.Attachment) as any as IAttachment[];
      return this.dataToAttachment(attachments);
    } else {
      return [];
    }
  }

  public getCurrPostFiles(): IFileAttributes[] {
    if (this.currPage && this.currPage.data) {
      const postsWithoutAttachment = this.currPage.data.filter((post) => {
        if (post.relationships && post.relationships.attachments) {
          return false;
        } else {
          if (post.attributes && post.attributes.post_file) {
            return true;
          } else {
            return false;
          }
        }
      });
      return postsWithoutAttachment.map((post) => post.attributes.post_file);
    } else {
      return [];
    }
  }

  public isLastPage(): boolean {
    const postCount = this.getPostsCount();
    return postCount < PAGE_POST_COUNT && postCount >= 0;
  }

  public async nextPage(): Promise<boolean> {
    const streamOptions: IStreamRequestOptions = {
      page: {
        cursor: this.nextCursor,
      },
    };
    let response: ITypedResponse<TStreamResponse> | null = null;

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

  public resetState(): void {
    this.currPage = null;
    this.nextCursor = null;
  }

  private dataToAttachment(data: IAttachment[]): IAttachmentIdentifier[] {
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
    return sparseArray.filter((val) => val !== null) as IAttachmentIdentifier[];
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
