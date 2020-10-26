export interface DownloaderOptions {
  outputDirectory: string
}

export interface RequestHandler {
  fileName: string
  outputDirectory: string
  // request: Request
  // response: Response
}
