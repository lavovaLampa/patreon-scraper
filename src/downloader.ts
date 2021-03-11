import { PatreonFileHandle } from "../type/internal";
import { PatreonRequest } from "./patreon-request";
import fs from "fs";
import stream from "stream";

export class PatreonDownloader {
  protected readonly request: PatreonRequest;
  protected queue: PatreonFileHandle[];
  protected readonly outDir: string;
  protected existingFileSet: Set<string>;

  constructor(request: PatreonRequest, outDir: string) {
    this.request = request;
    this.queue = [];
    this.outDir = outDir;
    this.existingFileSet = new Set();

    this.createDownloadDir();
    this.checkDownloadedFiles();
  }

  public addToQueue(files: PatreonFileHandle[]): void {
    this.queue.push(...files);
  }

  public startDownload(): void {
    void this.getNext();
  }

  private createDownloadDir(): void {
    let dirExists = false;

    try {
      const stat = fs.statSync(this.outDir);
      if (stat.isDirectory()) {
        dirExists = true;
      }
    } catch {
      dirExists = false;
    }

    if (!dirExists) {
      fs.mkdirSync(this.outDir);
    }
  }

  private checkDownloadedFiles(): void {
    try {
      const stat = fs.statSync(this.outDir);
      if (stat.isDirectory()) {
        const dirFiles = fs.readdirSync(this.outDir);
        this.existingFileSet = new Set(dirFiles);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  private async getNext(): Promise<void> {
    const currHandle = this.queue.pop();

    if (currHandle) {
      const filePath = `${this.outDir}/${currHandle.fileName}`;
      if (!this.existingFileSet.has(currHandle.fileName)) {
        try {
          const fileRequest = this.request.getUrlStream(currHandle.url);
          const fileWriteStream = fs.createWriteStream(filePath);

          console.log(`Starting download of file \"${currHandle.fileName}`);

          stream.pipeline(fileRequest, fileWriteStream, async (err) => {
            if (err) {
              console.log("Error " + err + " happened!");
            } else {
              console.log("DONE!");

              if (this.queue.length > 0) {
                // Wait for some time between downloads, just to be sure
                await new Promise((res) => setTimeout(res, 1500));
                this.getNext();
              }
            }
          });
        } catch (e) {
          console.error("Error " + e + " happened!");
        }
      } else {
        this.getNext();
      }
    }
  }
}
