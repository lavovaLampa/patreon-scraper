import { PatreonFileHandle, Optional } from "../../type/internal";
import { DataTypeKey } from "../../type/response";
import { CampaignResponse } from "../../type/response/campaign";
import { Attachment } from "../../type/response_includes/attachment";
import { Media } from "../../type/response_includes/media";
import { PatreonRequest } from "../patreon-request";

export class CampaignApi {
  private readonly request: PatreonRequest;
  private readonly id: number;
  private currPage: Optional<CampaignResponse>;

  constructor(campaignId: number, request: PatreonRequest) {
    this.request = request;
    this.id = campaignId;
    this.currPage = null;
  }

  public async nextPage(): Promise<boolean> {
    const nextCursor = this.currPage?.meta.pagination.cursors?.next;
    let result = false;

    if (this.currPage && nextCursor) {
      try {
        const { body } = await this.request.getCampaignPosts(this.id, nextCursor);
        this.currPage = body;
        result = true;
      } catch (e) {
        console.error(e);
        result = false;
      }
    } else if (!this.currPage) {
      try {
        const { body } = await this.request.getCampaignPosts(this.id);
        this.currPage = body;
        result = true;
      } catch (e) {
        console.error(e);
        result = false;
      }
    } else {
      result = false;
    }

    return result;
  }

  public getAttachments(): PatreonFileHandle[] {
    let attachments: PatreonFileHandle[] = [];

    if (this.currPage?.included) {
      const includedAttachments = this.currPage.included.filter(
        (x) => x.type === DataTypeKey.Attachment
      ) as Attachment[];
      attachments = this.parseAttachments(includedAttachments);
    }

    return attachments;
  }

  public getMedia(): PatreonFileHandle[] {
    let media: PatreonFileHandle[] = [];

    if (this.currPage?.included) {
      const includedMedia = this.currPage.included.filter(
        (x) => x.type === DataTypeKey.Media
      ) as Media[];
      const accessibleMedia = includedMedia.filter((x) => x.attributes.download_url);
      media = this.parseMedia(accessibleMedia);
    }

    return media;
  }

  private parseAttachments(attachments: readonly Attachment[]): PatreonFileHandle[] {
    return attachments.map((att) => {
      return {
        fileName: att.attributes.name,
        url: att.attributes.url,
        creatorId: this.id,
      };
    });
  }

  private parseMedia(media: readonly Media[]): PatreonFileHandle[] {
    return media.map((med) => {
      return {
        fileName: med.attributes.file_name,
        url: med.attributes.download_url,
        creatorId: this.id,
      };
    });
  }
}
