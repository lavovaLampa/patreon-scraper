import { PatreonRequest } from "./patreon-request";
import { CampaignApi } from "./apis/campaign";
import { StreamApi } from "./apis/stream";
import { PatreonDownloader } from "./downloader";
import { InternalOpts, Optional } from "../type/internal";
import minimist, { ParsedArgs } from "minimist";

const DEFAULT_OUT_DIR = "downloaded_media";

function printHelp(): void {
  console.log(
    "patreon-scraper 0.1.0\n\n" +
      "Usage:\n" +
      "\tpatreon-scraper [-s <sessionId>] [-o <outputDir>] [campaign_ids...]" +
      "\n\n" +
      "campaign_ids...\t\tCampaign IDs to scrape (as separate positional arguments)\n" +
      "-s --sessionId\t\tPatreon Session ID cookie\n" +
      "-o --outputDir\t\tDownload directory location\n"
  );
}

enum ActionType {
  ScrapeStream,
  ScrapeCampaign,
  PrintHelp,
  Invalid,
}

interface StreamData {
  tag: ActionType.ScrapeStream;
  outputDir: string;
  sessionId: string;
  creatorId: Optional<string>;
}

interface CampaignData {
  tag: ActionType.ScrapeCampaign;
  outputDir: string;
  campaignIds: readonly number[];
  sessionId: Optional<string>;
}

type OpType =
  | StreamData
  | CampaignData
  | { tag: ActionType.Invalid }
  | { tag: ActionType.PrintHelp };

const OPTS = ["d", "output_dir", "s", "session_id", "h", "help", "_"];
const OPT_SET = new Set(OPTS);

function processArgs(parsedArgs: ParsedArgs): InternalOpts {
  const finalArgs: InternalOpts = {
    campaignIds: [],
    outputDir: DEFAULT_OUT_DIR,
    sessionId: null,
    help: false,
    foreignKeys: Object.keys(parsedArgs).filter((key) => !OPT_SET.has(key)),
  };

  if (parsedArgs.d || parsedArgs.output_dir) {
    const outputDir = (parsedArgs.output_dir ?? parsedArgs.d) as string;
    finalArgs.outputDir = outputDir;
  }
  if (parsedArgs.s || parsedArgs.session_id) {
    const sessionId = (parsedArgs.session_id ?? parsedArgs.s) as string;
    finalArgs.sessionId = sessionId;
  }
  if (parsedArgs.h || parsedArgs.help) {
    finalArgs.help = true;
  }
  if (parsedArgs._) {
    finalArgs.campaignIds = (parsedArgs._.filter(
      Number.isInteger
    ) as unknown) as number[];
  }

  return finalArgs;
}

function validateOpts(opts: InternalOpts): boolean {
  if (opts.foreignKeys.length > 0) {
    console.warn(
      `Executable invoked with unknown arguments: ${opts.foreignKeys.toString()}`
    );
  }

  return true;
}

function getScrapeType(opts: InternalOpts): OpType {
  if (opts.help) {
    return {
      tag: ActionType.PrintHelp,
    };
  } else if (opts.campaignIds.length > 0) {
    return {
      tag: ActionType.ScrapeCampaign,
      outputDir: opts.outputDir,
      campaignIds: opts.campaignIds,
      sessionId: opts.sessionId ?? null,
    };
  } else if (opts.sessionId) {
    return {
      tag: ActionType.ScrapeStream,
      outputDir: opts.outputDir,
      creatorId: null,
      sessionId: opts.sessionId,
    };
  } else {
    return {
      tag: ActionType.Invalid,
    };
  }
}

async function scrapeCampaigns(opts: CampaignData) {
  const patreonRequest = new PatreonRequest(opts.sessionId ?? undefined);
  const patreonDownloader = new PatreonDownloader(patreonRequest, opts.outputDir);

  for (const id of opts.campaignIds) {
    const campaignPage = new CampaignApi(id, patreonRequest);
    while (await campaignPage.nextPage()) {
      const attachments = campaignPage.getAttachments();
      const media = campaignPage.getMedia();
      patreonDownloader.addToQueue(attachments);
      patreonDownloader.addToQueue(media);
    }
  }

  patreonDownloader.startDownload();
}

async function scrapeUserStream(opts: StreamData) {
  const patreonRequest = new PatreonRequest(opts.sessionId);
  const patreonDownloader = new PatreonDownloader(patreonRequest, opts.outputDir);

  const userStream = new StreamApi(patreonRequest);
  while (await userStream.nextPage()) {
    const attachments = userStream.getAttachments();
    const media = userStream.getMedia();
    patreonDownloader.addToQueue(attachments);
    patreonDownloader.addToQueue(media);
  }

  patreonDownloader.startDownload();
}

async function main(): Promise<number> {
  const opts = processArgs(minimist(process.argv.slice(2)));
  const optsValid = validateOpts(opts);
  const currOp = getScrapeType(opts);

  let result = 0;
  if (optsValid) {
    switch (currOp.tag) {
      case ActionType.PrintHelp:
        printHelp();
        break;

      case ActionType.ScrapeCampaign:
        await scrapeCampaigns(currOp);
        break;

      case ActionType.ScrapeStream:
        await scrapeUserStream(currOp);
        break;

      case ActionType.Invalid:
        console.error(
          "Invalid arguments specified, try running executable with '--help' argument!"
        );
        result = 1;
        break;
    }
  } else {
    result = 1;
  }

  return result;
}

// Program startup
void main();
