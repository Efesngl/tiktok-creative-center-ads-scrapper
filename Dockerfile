FROM node:slim

# Configure default locale (important for chrome-headless-shell). 
ENV LANG en_US.UTF-8

RUN apt-get update \
  && apt-get install -y wget gnupg \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /home/pptruser

COPY server.js tiktok.js filters.json package.json package-lock.json ./

ENV PUPPETEER_CACHE_DIR /home/pptruser/.cache/puppeteer
RUN npm i \
&& groupadd -r pptruser && useradd -m -r -g pptruser -G audio,video pptruser \
&& chown -R pptruser:pptruser /home/pptruser
USER pptruser
ARG PORT=3000
EXPOSE $PORT