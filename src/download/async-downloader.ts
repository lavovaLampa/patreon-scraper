import * as cd from "content-disposition";
import * as fs from "fs";
import { Request, Response } from "request";
import { IAttachmentIdentifier } from "../../types/internal";
import { PatreonRequest } from "../request/patreon-endpoint";

const DEFAULT_OUTPUT_DIR = "attachment_out";

export class AttachmentDownloader {
  protected existingFileSet: Set<string> = new Set();
  protected readonly outputDirectory: string;
  protected queue: IAttachmentIdentifier[];
  protected working: boolean = false;

  private readonly request: PatreonRequest;

  constructor(request: PatreonRequest, fileList?: IAttachmentIdentifier[], options?: IDownloaderOptions) {
    this.request = request;
    this.queue = fileList ? fileList : [];
    this.outputDirectory = (options && options.outputDirectory) ? options.outputDirectory : DEFAULT_OUTPUT_DIR;
    this.checkDownloadedFiles();
  }

  public addToQueue(files: IAttachmentIdentifier[]): void {
    this.queue.push(...files);
    this.runQueue();
  }

  public getFileByIds({ h, i }: IAttachmentIdentifier): Request {
    const request = this.request.getFile({ h, i });
    const fileName = "parseError";
    request.on("response", (response) => this.fileRequestResponseHandler({
      fileName,
      outputDirectory: this.outputDirectory,
      request,
      response,
    }));
    return request;
  }

  private checkDownloadedFiles(): void {
    if (fs.existsSync(this.outputDirectory)) {
      try {
        const stat = fs.lstatSync(this.outputDirectory);
        if (stat.isDirectory()) {
          const dir = fs.readdirSync(this.outputDirectory);
          this.existingFileSet = new Set(dir);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("output directory doesn't exist");
      console.log("creating folder now...");
      try {
        fs.mkdirSync(this.outputDirectory);
      } catch (e) {
        console.log("failed to create new directory");
        console.error(e);
      }
    }
  }

  private async enqueueNext(): Promise<void> {
    const tempFile = this.queue.pop();

    if (tempFile) {
      if (!this.existingFileSet.has(tempFile.name)) {
        console.log(tempFile.name + "...");
        const fileRequest = this.getFileByIds(tempFile);

        fileRequest.on("complete", () => {
          console.log("DONE");
          setTimeout(() => this.enqueueNext(), 1000 * Math.random());
        });

        fileRequest.on("error", (err) => {
          console.log("file download error: " + err);
        });
      } else {
        console.log(tempFile.name + " already downloaded, skipping...");
        return this.enqueueNext();
      }
    } else {
      this.working = false;
      return;
    }
  }

  private fileRequestResponseHandler(this: void, params: IRequestHandler): void {
    if (params.response.headers["content-disposition"]) {
      const parsedCd = cd.parse(params.response.headers["content-disposition"]);
      if (parsedCd && parsedCd.parameters && parsedCd.parameters.filename) {
        params.fileName = parsedCd.parameters.filename;
      }
    }
    params.request.pipe(fs.createWriteStream(`${params.outputDirectory}/${params.fileName}`));
  }

  private runQueue(): void {
    if (!this.working) {
      this.working = true;
      this.enqueueNext();
    }
  }

}

interface IDownloaderOptions {
  outputDirectory: string;
}

interface IRequestHandler {
  fileName: string;
  outputDirectory: string;
  request: Request;
  response: Response;
}
