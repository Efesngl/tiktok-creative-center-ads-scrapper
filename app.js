import { defaultArgs } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
async function getAds(usersign, webid, timestamp) {
  let request = await fetch("https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list?period=7&industry=25300000000,25304000000&page=1&limit=20&order_by=ctr&country_code=US", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "anonymous-user-id": "f3f9c261-008b-4f74-97c1-be28bdf9598d",
      lang: "en",
      "sec-ch-ua": '"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      timestamp: timestamp,
      "user-sign": usersign,
      "web-id": webid,
      Referer: "https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=TR&secondIndustry=25300000000%2C25304000000",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
  let data = await request.json();
  return data;
}
async function getAdDetail(id, usersign, webid, timestamp) {
  let detail = await fetch(`https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail?material_id=${id}`, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      "anonymous-user-id": "f3f9c261-008b-4f74-97c1-be28bdf9598d",
      lang: "en",
      "sec-ch-ua": '"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      timestamp: timestamp,
      "user-sign": usersign,
      "web-id": webid,
      Referer: "https://ads.tiktok.com/business/creativecenter/topads/7247115758849441794/pad/en?countryCode=TR&from=001110&period=30",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });
  let data = await detail.json();
  return data;
}
function delayedFetch(id, usersign, webid, timestamp, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail?material_id=${id}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          "anonymous-user-id": "f3f9c261-008b-4f74-97c1-be28bdf9598d",
          lang: "en",
          "sec-ch-ua": '"Not A(Brand";v="99", "Opera GX";v="107", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          timestamp: timestamp,
          "user-sign": usersign,
          "web-id": webid,
          Referer: "https://ads.tiktok.com/business/creativecenter/topads/7247115758849441794/pad/en?countryCode=TR&from=001110&period=30",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    }, delay);
  });
}
async function getCredentials() {
  try {
    let userSign = null;
    let webId = null;
    let timestamp = null;
    // let cookie = null;
    // let auid = null;
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: true,
      // uncomment this for use with node js and comment the first executablePath
      // executablePath: "./chrome/linux-124.0.6367.91/chrome-linux64/chrome",
      executablePath: "/usr/bin/google-chrome",
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      let url = request.url();
      if (url?.includes("access_token")) {
        let headers = request.headers();
        userSign = headers["user-sign"];
        webId = headers["web-id"];
        timestamp = headers["timestamp"];
        // cookie=headers["cookie"]
        // auid=headers["anonymous-user-id"]
      }
      request.continue();
    });
    await page.goto("https://ads.tiktok.com/business/creativecenter/inspiration/topads/pad/en?period=30&region=TR&secondIndustry=25300000000%2C25304000000", {
      waitUntil: "networkidle2",
    });
    const pages = await browser.pages();
    await Promise.all(pages.map((page) => page.close()));
    await browser.close();
    return {
      usersign: userSign,
      webid: webId,
      timestamp: timestamp,
    };
  } catch (error) {
    console.log(error.message);
  }
}
(async () => {
  console.log("Making request");
  let cred = await getCredentials();
  let ads = await getAds(cred.usersign, cred.webid, cred.timestamp);
  for (const ad of ads.data.materials) {
    let data = await delayedFetch(ad.id, cred.usersign, cred.webid, cred.timestamp, 500);
    console.log(data);
    console.log("-".repeat(100));
  }
})();
