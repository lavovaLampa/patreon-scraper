import { PatreonAttachmentScrapper } from './stream/patreon-stream';
import { PatreonAttachmentDownloader } from './download/async-downloader';

const sessionId = '';

main();

async function main() {
  const patreonRequest = new PatreonAttachmentScrapper(sessionId);
  const patreonDownloader = new PatreonAttachmentDownloader(sessionId);

  while (!patreonRequest.isLastPage()) {
    if (await patreonRequest.getNextStreamPage()) {
      const att = patreonRequest.getCurrAttachments();
      patreonDownloader.addToQueue(att);
    }
  }
}
