import { PatreonRequest } from "./patreon-request";
import { CampaignApi } from "./apis/campaign";
import { StreamApi } from "./apis/stream";
import { PatreonDownloader } from "./downloader";
import { InternalArgs } from "../type/internal";
import minimist, { ParsedArgs } from "minimist";
import { exit } from "process";

const DEFAULT_OUT_DIR = "downloaded_media";

function printHelp(): void {
  console.log(
    "patreon-scraper 0.1.0\n\n" +
      "Usage:\n" +
      "\tpatreon-scraper [-s <sessionId>] [-o <outputDir>] [campaign_ids...]" +
      "\n\n" +
      "campaign_ids...\t\tCampaign IDs to scrape" +
      "-s --sessionId\t\tSupply Patreon session ID cookie\n" +
      "-o --outputDir\t\tChoose download directory location\n"
  );
}

function processArgs(parsedArgs: ParsedArgs): InternalArgs {
  const finalArgs: InternalArgs = {
    campaignIds: [],
    outputDir: DEFAULT_OUT_DIR,
    sessionId: null,
  };

  if (parsedArgs.d) {
    finalArgs.outputDir = parsedArgs.d as string;
  }
  if (parsedArgs.output_dir) {
    finalArgs.outputDir = parsedArgs.output_dir as string;
  }
  if (parsedArgs.s) {
    finalArgs.sessionId = parsedArgs.s as string;
  }
  if (parsedArgs.session_id) {
    finalArgs.sessionId = parsedArgs.session_id as string;
  }
  if (parsedArgs._) {
    finalArgs.campaignIds = (parsedArgs._.filter(
      Number.isInteger
    ) as unknown) as number[];
  }

  return finalArgs;
}

async function scrapeCampaigns(
  campaignIds: readonly number[],
  outDir: string,
  sessionId?: string
) {
  const patreonRequest = new PatreonRequest(sessionId);
  const patreonDownloader = new PatreonDownloader(patreonRequest, outDir);

  for (const id of campaignIds) {
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

async function scrapeUserStream(sessionId: string, outDir: string) {
  const patreonRequest = new PatreonRequest(sessionId);
  const patreonDownloader = new PatreonDownloader(patreonRequest, outDir);

  const userStream = new StreamApi(patreonRequest);
  while (await userStream.nextPage()) {
    const attachments = userStream.getAttachments();
    const media = userStream.getMedia();
    patreonDownloader.addToQueue(attachments);
    patreonDownloader.addToQueue(media);
  }

  patreonDownloader.startDownload();
}

async function main(): Promise<void> {
  const opts = processArgs(minimist(process.argv.slice(2)));

  if (opts.campaignIds && opts.campaignIds.length > 0) {
    await scrapeCampaigns(opts.campaignIds, opts.outputDir, opts.sessionId ?? undefined);
  } else if (opts.sessionId) {
    await scrapeUserStream(opts.sessionId, opts.outputDir);
  } else {
    console.error(
      "Choose campaigns to scrape or provide session ID to scrape all subscribed creators!"
    );
    exit(1);
  }
}

// Program startup
void main();
