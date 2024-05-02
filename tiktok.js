import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
export async function getAds(usersign, webid, timestamp,queryString) {
  let request=await fetch(`
  https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/list?${queryString}`, {
    headers: {
      accept: "application/json, text/plain, */*",
      timestamp: timestamp,
      "user-sign": usersign,
      "web-id": webid,
    },
    body: null,
    method: "GET",
  });
  let data = await request.json();
  return data;
}
export function delayedFetch(id, usersign, webid, timestamp, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(`https://ads.tiktok.com/creative_radar_api/v1/top_ads/v2/detail?material_id=${id}`, {
        headers: {
          accept: "application/json, text/plain, */*",
          timestamp: timestamp,
          "user-sign": usersign,
          "web-id": webid,
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
export async function getCredentials() {
  try {
    let userSign = null;
    let webId = null;
    let timestamp = null;
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
      headless: true,
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
