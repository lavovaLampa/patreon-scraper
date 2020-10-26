#! /usr/bin/env -S node -r ts-node/register

import { AttachmentDownloader } from "./src/async-downloader"
import { AttachmentScraper } from "./src/patreon-stream"
import { PatreonRequest } from "./src/request/patreon-endpoint"
import { CmdOptionsParser } from "./src/utils/parsing"
import { ParseResult } from "./types/utils/parsing"

async function testAuth(tmpSessionId: string): Promise<boolean> {
  const patreonRequest = new PatreonRequest(tmpSessionId)

  try {
    const response = await patreonRequest.getCurrentUser()
    if (response) {
      return response.statusCode === 200
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

function printHelp(): void {
  console.log(
    "patreon-scraper 0.0.1\n\n" +
      "Usage:\n" +
      "\tpatreon-scraper [-s <sessionId>] [-o <outputDir>]\n\n" +
      "-s --sessionId\t\tPatreon sessionID cookie. Can be obtained after logging in on patreon.com; using developer tools (storage → cookies).\n" +
      "-o --outputDir\t\tDownload directory.\n"
  )
}

async function main(currOptions: ParseResult): Promise<void> {
  if (currOptions.printHelp) {
    printHelp()
    process.exit(0)
  }

  if (currOptions.sessionId) {
    const sessionId = currOptions.sessionId
    const outputDirectory = currOptions.outputDir

    const patreonRequest = new PatreonRequest(sessionId)
    const patreonScraper = new AttachmentScraper(patreonRequest)
    const patreonDownloader = new AttachmentDownloader(
      patreonRequest,
      undefined,
      { outputDirectory }
    )

    if (await testAuth(sessionId)) {
      while (!patreonScraper.isLastPage()) {
        if (await patreonScraper.nextPage()) {
          const att = patreonScraper.getCurrAttachments()
          patreonDownloader.addToQueue(att)
        }
      }
    } else {
      console.log("User is not authorized/session ID is incorrect")
      if (sessionId.length === 0) {
        console.warn("Session ID is empty, you probably forgot to provide one")
      }
    }
  } else {
    console.error("No patreon session ID defined, try using --help")
    process.exit(1)
  }
}

// program startup
const optionsParser = new CmdOptionsParser()
const currOptions = optionsParser.parseOptions()
main(currOptions)
