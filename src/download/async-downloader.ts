import * as cd from "content-disposition";
import * as fs from "fs";
import { Request, Response } from "request";
import { IAttachment } from "../../types/internal";
import { PatreonRequest } from "../request/patreon-endpoint";

export class AttachmentDownloader extends PatreonRequest {
  protected queue: IAttachment[];
  protected existingFileSet: Set<string>;
  protected working: boolean;

  constructor(sessionId: string, fileList?: IAttachment[]) {
    super(sessionId);
    this.queue = fileList ? fileList : [];
    this.existingFileSet = new Set();
    this.working = false;
    this.checkDownloadedFiles();
  }

  public getFileByIds({ h, i }: IAttachment): Request {
    const request = this.getFile({ h, i });
    const fileName = "parseError";
    request.on("response",
      (response) => this.fileRequestResponseHandler({ fileName, request, response }));
    return request;
  }

  public addToQueue(files: IAttachment[]): void {
    this.queue.push(...files);
    this.runQueue();
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
    params.request.pipe(fs.createWriteStream(`out/${params.fileName}`));
  }

  private runQueue(): void {
    if (!this.working) {
      this.working = true;
      this.enqueueNext();
    }
  }

  private checkDownloadedFiles(outDir = "out"): void {
    try {
      const stat = fs.lstatSync(outDir);
      if (stat.isDirectory()) {
        const dir = fs.readdirSync(outDir);
        this.existingFileSet = new Set(dir);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

interface IRequestHandler {
  request: Request;
  response: Response;
  fileName: string;
}
