import moment from "moment";
import { PatreonFileHandle, Optional } from "../../type/internal";
import { DataTypeKey } from "../../type/response";
import { StreamResponse } from "../../type/response/stream";
import { Attachment } from "../../type/response_includes/attachment";
import { Media } from "../../type/response_includes/media";
import { PatreonRequest } from "../patreon-request";

const PAGE_POST_COUNT = 12;

export class StreamApi {
  private readonly request: PatreonRequest;
  private readonly id: Optional<number>;
  private currPage: Optional<StreamResponse>;

  constructor(request: PatreonRequest, creatorId?: number) {
    this.request = request;
    this.id = creatorId ?? null;
    this.currPage = null;
  }

  public async nextPage(): Promise<boolean> {
    const nextCursor = this.nextCursor() ?? "null";
    const postCount = this.currPage?.meta.posts_count ?? Number.MAX_SAFE_INTEGER;
    let result = false;

    if (postCount >= PAGE_POST_COUNT) {
      try {
        let response;
        if (this.id) {
          response = await this.request.getUserStream(nextCursor, this.id);
        } else {
          response = await this.request.getUserStream(nextCursor);
        }
        this.currPage = response.body;
        result = true;
      } catch (e) {
        console.error(e);
      }
    }

    return result;
  }

  public getAttachments(): PatreonFileHandle[] {
    let attachments: PatreonFileHandle[] = [];

    if (this.currPage?.included) {
      const filteredIncludes = this.currPage.included.filter(
        (x) => x.type === DataTypeKey.Attachment
      ) as Attachment[];
      attachments = this.parseAttachments(filteredIncludes);
    }

    return attachments;
  }

  public getMedia(): PatreonFileHandle[] {
    let media: PatreonFileHandle[] = [];

    if (this.currPage?.included) {
      const filteredIncludes = this.currPage.included.filter(
        (x) => x.type === DataTypeKey.Media
      ) as Media[];
      media = this.parseMedia(filteredIncludes);
    }

    return media;
  }

  private parseAttachments(attachments: readonly Attachment[]): PatreonFileHandle[] {
    return attachments.map((att) => {
      return {
        fileName: att.attributes.name,
        url: att.attributes.url,
        creatorId: this.id ?? 0,
      };
    });
  }

  private parseMedia(media: readonly Media[]): PatreonFileHandle[] {
    return media.map((med) => {
      return {
        fileName: med.attributes.file_name,
        url: med.attributes.download_url,
        creatorId: this.id ?? 0,
      };
    });
  }

  private nextCursor(): Optional<string> {
    if (this.currPage?.data?.length && this.currPage.data.length > 0) {
      const lastPost = this.currPage.data[this.currPage.data.length - 1];
      // FIXME: Add back data types
      // @ts-ignore
      if (lastPost?.attributes?.published_at) {
        /// @ts-ignore
        const publishedAt = lastPost.attributes.published_at;
        return moment(publishedAt).subtract(1, "ms").utc().format();
      }
    }
    return null;
  }
}
