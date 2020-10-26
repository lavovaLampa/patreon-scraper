import moment from "moment"
import { DownloadIdentifier, Maybe } from "../type/common"
import { Attachment } from "../type/patreon-data-types/attachment"
import { TStreamResponse } from "../type/response/stream"
import { DataTypeKey } from "../type/response"
import { PatreonRequest } from "./request/patreon-endpoint"
import { Media } from "../type/patreon-data-types/media"

const PAGE_POST_COUNT = 12

export class AttachmentScraper {
  private currPage: Maybe<TStreamResponse> = null
  private nextCursor: Maybe<string> = null
  private readonly request: PatreonRequest

  constructor(request: PatreonRequest) {
    this.request = request
  }

  public getCurrAttachments(): DownloadIdentifier[] {
    let files: DownloadIdentifier[] = []

    if (this.currPage?.included) {
      const attachments = this.currPage.included.filter(
        obj => obj.type === DataTypeKey.Attachment
      ) as Attachment[]

      files = attachments.map(obj => {
        return {
          fileName: obj.attributes.name,
          url: obj.attributes.url
        }
      })
    }

    return files
  }

  public getCurrMedia(): DownloadIdentifier[] {
    let files: DownloadIdentifier[] = []

    if (this.currPage?.included) {
      const media = this.currPage.included.filter(
        obj => obj.type === DataTypeKey.Media
      ) as Media[]

      files = media.map(obj => {
        return {
          url: obj.attributes.download_url,
          fileName: obj.attributes.file_name
        }
      })
    }

    return files
  }

  // public getCurrPostFiles(): IFileAttributes[] {
  //   if (this.currPage?.data) {
  //     const validImagePosts = this.currPage.data.filter(
  //       post =>
  //         post?.attributes?.post_type === ApiPostTypeKey.ImageFile &&
  //         post?.attributes?.post_file
  //     )

  //     const postsWithoutAttachment = validImagePosts.filter(
  //       post => !((post?.relationships?.attachments?.length ?? -1) > 0)
  //     )
  //     return postsWithoutAttachment.map(post => post.attributes.post_file)
  //   } else {
  //     return []
  //   }
  // }

  public isLastPage(): boolean {
    const postCount = this.getPostsCount()
    return postCount < PAGE_POST_COUNT && postCount >= 0
  }

  public async nextPage(): Promise<boolean> {
    const result = await this.request.getStream(this.nextCursor)

    if (result) {
      const { statusCode, body } = result
      if (statusCode == 200 && body) {
        this.currPage = body
        this.advanceCursor()
        return true
      } else {
        console.warn("received status code: " + statusCode)
        console.warn("page state not updated")
      }
    } else {
      console.error("failed to execute request")
    }

    return false
  }

  public resetState(): void {
    this.currPage = null
    this.nextCursor = null
  }

  private advanceCursor(): void {
    if (!this.isLastPage()) {
      this.nextCursor = this.nextCursorLocation()
    }
  }

  // private dataToAttachment(data: Attachment[]): AttachmentIdentifier[] {
  //   const sparseArray = data.map(val => {
  //     const urlSplit = val.attributes.url.split("?")
  //     if (urlSplit.length > 1) {
  //       const qsPart = urlSplit[1]
  //       const result: FileUrlQS | null | undefined = qs.parse(qsPart)
  //       if (result) {
  //         return {
  //           name: val.attributes.name,
  //           ...result
  //         }
  //       }
  //     }
  //     console.error("file queryString parsing fail")
  //     return null
  //   })
  //   return sparseArray.filter(val => val !== null) as AttachmentIdentifier[]
  // }

  private getPostsCount(): number {
    if (this.currPage?.meta?.posts_count) {
      return this.currPage.meta.posts_count
    } else {
      return -1
    }
  }

  private nextCursorLocation(): Maybe<string> {
    if (this.currPage?.data?.length && this.currPage.data.length > 0) {
      const lastPost = this.currPage.data[this.currPage.data.length - 1]
      if (lastPost?.attributes?.published_at) {
        const publishedAt = lastPost.attributes.published_at
        return moment(publishedAt)
          .subtract(1, "ms")
          .utc()
          .format()
      }
    }
    return null
  }
}
