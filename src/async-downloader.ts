import * as fs from "fs"
import { PatreonRequest } from "./request/patreon-endpoint"
import { DownloaderOptions } from "../type/async-downloader"
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

        try {
          await pipeline(
            fileRequest,
            fs.createWriteStream(
              `${this.outputDirectory}/${currAttachment.fileName}`
            )
          )
        } catch (err) {
          console.error("Failed to download file")
          console.error(`Type: ${err.name}`)
          console.error(`Reason: "${err.message}"`)
        }
      } else {
        console.log(
          currAttachment.fileName + " already downloaded, skipping..."
        )
      }

      // Always queue next attachment to be downloaded regardless of last download result
      this.enqueueNext()
    } else {
      this.working = false
      return
    }
  }

  private runQueue(): void {
    if (!this.working) {
      this.working = true
      this.enqueueNext()
    }
  }
}
