FROM node:current

# Configure default locale (important for chrome-headless-shell). 
ENV LANG en_US.UTF-8

# RUN apt-get update \
#     && apt-get install -y wget gnupg dbus dbus-x11 \
#     libglib2.0-0 libnss3 libxss1 libasound2 libatk1.0-0 \
#     libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libatspi2.0-0 libavcodec58 libatomic1 \
#     libavformat58 libavutil56 libc6 libcairo2 libdbus-1-3 libevent-2.1-6 libexpat1 libflac8 libfontconfig1
#     -y --no-install-recommends\
#     && service dbus start \
#     && rm -rf /var/lib/apt/lists/* \
#     && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] https://dl-ssl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 dbus dbus-x11 \
      --no-install-recommends \
    && service dbus start \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r pptruser && useradd -rm -g pptruser -G audio,video pptruser

WORKDIR /home/pptruser

COPY app.js package.json package-lock.json ./

ENV DBUS_SESSION_BUS_ADDRESS autolaunch:
RUN npm install
USER pptruser
CMD ["node","app.js"]