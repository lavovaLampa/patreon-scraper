# patreon-scraper
WIP Patreon attachment download written in TypeScript

# Description
A work-in-progress Patreon attachment downloader. Currently tries to download all attachments to specified folder (otherwise defaults to "./attachments_out"), skipping files that exist (checks filename).

Written in TypeScript because I like it. I will try to work on TODO list when I have time/interest. PRs and Issues are very welcome :).

# Requirements
- NodeJS (anything 10+ should work)
- npm

# Installation
- Clone repo
- `npm install`

# Running
- `./index.ts --help`

# TODO
- [x] Choose Your Own Download Folder™
- [x] Accept sessionId as argument/~~environment variable~~
- [ ] Download speed/stats?
- [x] Better auth/connection checking
- [ ] Use selenium/webdriver to log in?
