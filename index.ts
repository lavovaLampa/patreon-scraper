#! /usr/bin/env -S node -r ts-node/register

import { AttachmentDownloader } from "./src/async-downloader";
import { AttachmentScraper } from "./src/patreon-stream";
import { PatreonRequest } from "./src/request/patreon-endpoint";
import { IOptionDefinition } from "./types/internal";

let sessionId: string = "";
let outputDirectory: string = "./attachment_out";

const availableOpts: ReadonlyArray<IOptionDefinition<string>> = [
  { func: setSessionId, longOpt: "--sessionId", shortOpt: "-s", isParsed: false },
  { func: setDownloadFolder, longOpt: "--outputDir", shortOpt: "-o", isParsed: false },
];

parseOptions(availableOpts)
  .then(() => main());

async function main() {
  const patreonRequest = new PatreonRequest(sessionId);
  const patreonScraper = new AttachmentScraper(patreonRequest);
  const patreonDownloader = new AttachmentDownloader(patreonRequest, undefined, { outputDirectory });

  if (await testAuth(sessionId)) {
    while (!patreonScraper.isLastPage()) {
      if (await patreonScraper.nextPage()) {
        const att = patreonScraper.getCurrAttachments();
        patreonDownloader.addToQueue(att);
      }
    }
  } else {
    console.log("user not authorized");
  }
}

async function parseOptions(availableArgs: ReadonlyArray<IOptionDefinition<string>>): Promise<void> {
  // we don't want default arguments
  const args = process.argv.slice(2);

  if (args.length === 1 && args[0] === "--help") {
    printHelp();
    process.exit(0);
  } else if (args.length % 2 === 0 && (args.length / 2) <= availableArgs.length) {
    // always get 2 arguments at a time
    while (args.length >= 2) {
      const value = args.pop();
      const option = args.pop();
      if (value && option) {
        await parseOption(option, value);
      } else {
        console.error("Problem parsing arguments, try running with --help");
        process.exit(1);
      }
    }
  }
}

async function parseOption(parsedOption: string, parsedValue: string): Promise<void> {
  let optionValid = false;

  await Promise.all(availableOpts.map(async (opt) => {
    if (parsedOption === opt.longOpt || parsedOption === opt.shortOpt) {
      // check if the same option wasn't specified multiple times
      if (opt.isParsed) {
        console.error(`Multiple values for option: ${opt.longOpt}`);
        process.exit(1);
      } else {
        await opt.func(parsedValue);
        opt.isParsed = true;
        optionValid = true;
      }
    }
  }));

  if (!optionValid) {
    console.error(`Invalid option: ${parsedOption}, try running with --help`);
    process.exit(1);
  }
}

async function setSessionId(val: string): Promise<void> | never {
  if (await testAuth(val)) {
    sessionId = val;
  } else {
    console.error("Invalid/expired session ID");
    process.exit(1);
  }
}

async function setDownloadFolder(val: string): Promise<void> {
  outputDirectory = val;
}

function printHelp(): void {
  console.log(
    "patreon-scraper 0.0.1\n\n" +
    "Usage:\n" +
    "\tpatreon-scraper [-s<sessionId>][-o<outputDir>]\n\n" +
    "-s --sessionId\t\tSupply Patreon session ID cookie\n" +
    "-o --outputDir\t\tChoose download directory location\n");
}

async function testAuth(tmpSessionId: string): Promise<boolean> {
  const patreonRequest = new PatreonRequest(tmpSessionId);

  try {
    const response = await patreonRequest.getCurrentUser();
    if (response) {
      return response.statusCode === 200;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
