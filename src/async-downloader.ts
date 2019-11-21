import * as cd from "content-disposition"
import * as fs from "fs"
import { Request } from "request"
import { AttachmentIdentifier } from "../types/common"
import { PatreonRequest } from "./request/patreon-endpoint"
import { DownloaderOptions, RequestHandler } from "../types/async-downloader"

const DEFAULT_OUTPUT_DIR = "attachment_out"

export class AttachmentDownloader {
  protected existingFileSet: Set<string> = new Set()
  protected readonly outputDirectory: string
  protected queue: AttachmentIdentifier[]
  protected working = false

  private readonly request: PatreonRequest

  constructor(
    request: PatreonRequest,
    fileList?: AttachmentIdentifier[],
    options?: DownloaderOptions
  ) {
    this.request = request
    this.queue = fileList ?? []
    this.outputDirectory = options?.outputDirectory ?? DEFAULT_OUTPUT_DIR
    this.checkDownloadedFiles()
  }

  public addToQueue(files: AttachmentIdentifier[]): void {
    this.queue.push(...files)
    this.runQueue()
  }

  public getFileByIds({ h, i }: AttachmentIdentifier): Request {
    const request = this.request.getFile({ h, i })
    const fileName = "parseError"

    request.on("response", response =>
      this.fileRequestResponseHandler({
        fileName,
        outputDirectory: this.outputDirectory,
        request,
        response
      })
    )
    return request
  }

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
    const tempFile = this.queue.pop()

    if (tempFile) {
      if (!this.existingFileSet.has(tempFile.name)) {
        console.log(tempFile.name + "...")
        const fileRequest = this.getFileByIds(tempFile)

        fileRequest.on("complete", () => {
          console.log("DONE")
          setTimeout(() => this.enqueueNext(), 1000 * Math.random())
        })

        fileRequest.on("error", err => {
          console.log("file download error: " + err)
        })
      } else {
        console.log(tempFile.name + " already downloaded, skipping...")
        return this.enqueueNext()
      }
    } else {
      this.working = false
      return
    }
  }

  private fileRequestResponseHandler(this: void, params: RequestHandler): void {
    if (params.response.headers["content-disposition"]) {
      const parsedCd = cd.parse(params.response.headers["content-disposition"])
      if (parsedCd && parsedCd.parameters && parsedCd.parameters.filename) {
        params.fileName = parsedCd.parameters.filename
      }
    }
    params.request.pipe(
      fs.createWriteStream(`${params.outputDirectory}/${params.fileName}`)
    )
  }

  private runQueue(): void {
    if (!this.working) {
      this.working = true
      this.enqueueNext()
    }
  }
}
