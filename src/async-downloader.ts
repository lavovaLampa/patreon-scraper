import * as cd from "content-disposition"
import * as fs from "fs"
import { PatreonRequest } from "./request/patreon-endpoint"
import { DownloaderOptions, RequestHandler } from "../type/async-downloader"
import { DownloadIdentifier } from "../type/common"
import { Stream } from "stream"
import Request from "got/dist/source/core"
import { promisify } from "util"

const DEFAULT_OUTPUT_DIR = "attachment_out"

const pipeline = promisify(Stream.pipeline)

export class AttachmentDownloader {
  protected existingFileSet: Set<string> = new Set()
  protected readonly outputDirectory: string
  protected queue: DownloadIdentifier[]
  protected working = false

  private readonly request: PatreonRequest

  constructor(
    request: PatreonRequest,
    fileList?: DownloadIdentifier[],
    options?: DownloaderOptions
  ) {
    this.request = request
    this.queue = fileList ?? []
    this.outputDirectory = options?.outputDirectory ?? DEFAULT_OUTPUT_DIR
    this.checkDownloadedFiles()
  }

  public addToQueue(files: DownloadIdentifier[]): void {
    this.queue.push(...files)
    this.runQueue()
  }

  private getDownloadStream(file: DownloadIdentifier): Request {
    const request = this.request.getFile(file.url)

    return request
  }

  // private getFileByIds({ h, i }: AttachmentIdentifier): Request {
  //   const request = this.request.getFile({ h, i })
  //   const fileName = "parseError"

  //   request.on("response", response =>
  //     this.fileRequestResponseHandler({
  //       fileName,
  //       outputDirectory: this.outputDirectory,
  //       request,
  //       response
  //     })
  //   )
  //   return request
  // }

  private checkDownloadedFiles(): void {
    if (fs.existsSync(this.outputDirectory)) {
      try {
        const stat = fs.lstatSync(this.outputDirectory)
        if (stat.isDirectory()) {
          const dir = fs.readdirSync(this.outputDirectory)
          this.existingFileSet = new Set(dir)
        }
      } catch (e) {
        console.error(e)
      }
    } else {
      console.log("Output directory does not exist")
      console.log("Creating folder now...")
      try {
        fs.mkdirSync(this.outputDirectory)
      } catch (e) {
        console.log("Failed to create new directory")
        console.error(e)
      }
    }
  }

  private async enqueueNext(): Promise<void> {
    const currAttachment = this.queue.pop()

    if (currAttachment) {
      if (!this.existingFileSet.has(currAttachment.fileName)) {
        console.log(currAttachment.fileName + "...")
        const fileRequest = this.getDownloadStream(currAttachment)

        // Stream.pipeline(
        //   fileRequest,
        //   fs.createWriteStream(
        //     `${this.outputDirectory}/${currAttachment.fileName}`
        //   ),
        //   (err) => {
        //     console.log(err?.message)
        //   }
        // )

        try {
          /// @ts-ignore
          await pipeline(
            fileRequest,
            fs.createWriteStream(
              `${this.outputDirectory}/${currAttachment.fileName}`
            ),
            /// @ts-ignore
            err => {
              console.log(err?.message)
            }
          )
        } catch (err) {
          console.log(err)
        }
        // console.error(
        //   "There was problem downloading file: " + currAttachment.fileName
        // )
        // console.error(err)

        // fileRequest.on("complete", () => {
        //   console.log("DONE")
        //   setTimeout(() => this.enqueueNext(), 1000 * Math.random())
        // })

        // fileRequest.on("error", err => {
        //   console.log("file download error: " + err)
        // })
      } else {
        console.log(
          currAttachment.fileName + " already downloaded, skipping..."
        )
        return this.enqueueNext()
      }
    } else {
      this.working = false
      return
    }
  }

  // private fileRequestResponseHandler(this: void, params: RequestHandler): void {
  //   if (params.response.headers["content-disposition"]) {
  //     const parsedCd = cd.parse(params.response.headers["content-disposition"])
  //     if (parsedCd && parsedCd.parameters && parsedCd.parameters.filename) {
  //       params.fileName = parsedCd.parameters.filename
  //     }
  //   }
  //   params.request.pipe(
  //     fs.createWriteStream(`${params.outputDirectory}/${params.fileName}`)
  //   )
  // }

  private runQueue(): void {
    if (!this.working) {
      this.working = true
      this.enqueueNext()
    }
  }
}
