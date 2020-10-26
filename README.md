# Patreon-scraper
Patreon-scraper is a Patreon attachment scraper/downloader written in TypeScript.

# Description
A work-in-progress Patreon attachment downloader. Currently tries to download all attachments to specified folder (otherwise defaults to "./attachment_out"), skipping files that exist (checks filename).

# Requirements
- NodeJS (anything 10+ should work)
- npm

# Installation
- Clone repo
- `npm install`

# Running
- `./index.ts --help`
- If you are on an LTS distribution, there's a chance you don't have an updated version of `env` executable. If that's the case, you can run the script using:
- `node -r ts-node/register index.ts`

## Docker
```
git clone https://github.com/lavovaLampa/patreon-scraper.git
cd patreon-scraper
docker build -t patreon-scraper .
docker run --rm -d --name patreon-scraper -v ~/patreon-scraper:/patreon-scraper/attachment_out patreon-scraper:latest
#  --rm - cleans up afterwards
#  -d   - deatch
#  -v   - map ~/patreon-scraper on the host to the output folder.
```

# TODO
- [x] Choose Your Own Download Folder™
- [x] Accept sessionId as argument/~~environment variable~~
- [ ] Download speed/stats?
- [x] Better auth/connection checking
- [ ] Use selenium/webdriver to log in?
