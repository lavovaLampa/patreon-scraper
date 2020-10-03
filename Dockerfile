FROM node:alpine

WORKDIR /patreon-scraper

COPY . .
RUN npm install

ENTRYPOINT ["node","-r","ts-node/register","/patreon-scraper/index.ts"]
CMD ["--help"]
