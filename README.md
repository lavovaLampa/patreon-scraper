# Patreon-scraper
Patreon-scraper is a Patreon attachment scraper/downloader written in TypeScript.

# Description
A work-in-progress Patreon attachment downloader. Currently tries to download all attachments to specified folder (otherwise defaults to "./downloaded_media"), skipping files that exist (checks filename).

# Requirements
- NodeJS (anything 10+ should work)
- npm

# Installation
- Use prepackaged versions
or
- Clone repo
- `npm install`
- `npm run build`

# Running
- `node build/src/index.js --help`

# TODO
- [x] Choose Your Own Download Folder™
- [x] Accept sessionId as argument/~~environment variable~~
- [ ] Download speed/stats?
- [x] Better auth/connection checking
- [ ] Use selenium/webdriver to log in?
