import { AttachmentDownloader } from "./download/async-downloader";
import { PatreonRequest } from "./request/patreon-endpoint";
import { AttachmentScraper } from "./stream/patreon-stream";

const sessionId = "";

main();

async function main() {
  const patreonRequest = new PatreonRequest(sessionId);
  const patreonScraper = new AttachmentScraper(patreonRequest);
  const patreonDownloader = new AttachmentDownloader(patreonRequest);

  if (await testAuth()) {
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

async function testAuth(): Promise<boolean> {
  const patreonRequest = new PatreonRequest(sessionId);

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
