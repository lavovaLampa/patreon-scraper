import { PatreonFileHandle } from "../type/internal";
import { PatreonRequest } from "./patreon-request";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { exit } from "process";

const pipeline = promisify(stream.pipeline);

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
    this.buildFileSet();
  }

  public addToQueue(files: PatreonFileHandle[]): void {
    this.queue.push(...files);
  }

  public startDownload(): void {
    this.queue = this.queue.filter(
      (x) => !this.existingFileSet.has(this.getHandlePath(x))
    );
    void this.getNext();
  }

  private getHandlePath(handle: PatreonFileHandle): string {
    return `${this.outDir}/${handle.creatorId}/${handle.fileName}`;
  }

  private createDownloadDir(): void {
    try {
      const stat = fs.statSync(this.outDir);
      if (!stat.isDirectory()) {
        console.error(`Path: "${fs.realpathSync(this.outDir)}" is not a directory!`);
        exit(2);
      }
    } catch {
      fs.mkdirSync(this.outDir);
    }
  }

  private buildFileSet(currPrefix: string = this.outDir): void {
    if (fs.existsSync(currPrefix)) {
      let accessible = false;

      try {
        fs.accessSync(currPrefix);
        accessible = true;
      } catch (e) {
        console.warn(`Directory: ${currPrefix} is not accessible!`);
      }

      if (accessible) {
        const stat = fs.statSync(currPrefix);
        if (stat.isDirectory()) {
          const dirEntries = fs.readdirSync(currPrefix);

          for (const entry of dirEntries) {
            const entryPath = `${currPrefix}/${entry}`;
            const entryStat = fs.statSync(entryPath);

            if (entryStat.isFile()) {
              this.existingFileSet.add(entryPath);
            } else {
              this.buildFileSet(entryPath);
            }
          }
        }
      }
    }
  }

  private checkHandleDir(handle: PatreonFileHandle): void {
    const dirPath = `${this.outDir}/${handle.creatorId}`;

    try {
      const stat = fs.statSync(dirPath);
      if (!stat.isDirectory()) {
        console.error(`Path: "${fs.realpathSync(dirPath)}" is not a directory!`);
        exit(2);
      }
    } catch (e) {
      fs.mkdirSync(dirPath);
    }
  }

  private async getNext(): Promise<void> {
    const currHandle = this.queue.pop();

    if (currHandle) {
      const filePath = `${this.outDir}/${currHandle.creatorId}/${currHandle.fileName}`;
      this.checkHandleDir(currHandle);

      if (!this.existingFileSet.has(filePath)) {
        try {
          const fileRequest = this.request.getUrlStream(currHandle.url);
          const fileWriteStream = fs.createWriteStream(filePath);

          console.log(
            `Starting download of file "${currHandle.fileName}". (${this.queue.length} remaining)`
          );
          await pipeline(fileRequest, fileWriteStream);
          console.log("DONE!");

          if (this.queue.length > 0) {
            // Wait for some time between downloads, just to be sure
            await new Promise((res) => setTimeout(res, 500));
            void this.getNext();
          }
        } catch (e) {
          console.error("Error " + e + " happened!");
        }
      } else {
        void this.getNext();
      }
    }
  }
}
