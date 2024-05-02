import e from "express";
import { getAds, getCredentials, delayedFetch } from "./tiktok.js";
import fs from "fs";
import QueryString from "qs";
const app = e();
let usersign = null;
let webid = null;
let timestamp = null;

async function setCredentials() {
  let creds = await getCredentials();
  usersign = creds.usersign;
  webid = creds.webid;
  timestamp = creds.timestamp;
  return true
}

app.get("/getads", async (req, res) => {
  let qs = QueryString.stringify(req.query);
  let ads = await getAds(usersign, webid, timestamp, qs);
  if (ads.code != 0) {
    setCredentials();
    ads = await getAds(usersign, webid, timestamp, qs);
  }
  res.json(ads);
});
app.get("/getadsdetail", async (req, res) => {
  let qs = QueryString.stringify(req.query);
  let ads = await getAds(usersign, webid, timestamp, qs);
  if (ads.code != 0) {
    setCredentials();
    ads = await getAds(usersign, webid, timestamp, qs);
  }
  let adsArray = [];
  for (const ad of ads.data.materials) {
    let data = await delayedFetch(ad.id, usersign, webid, timestamp, 500);
    adsArray.push(data.data);
  }
  res.json(adsArray);
});
app.get("/getaddetail/:adid", async (req, res) => {
  let detail = await delayedFetch(req.params.adid, usersign, webid, timestamp, 500);
  if (detail.code != 0) {
    setCredentials();
    detail = await delayedFetch(req.params.adid, usersign, webid, timestamp, 500);
  }
  res.json(detail);
});
app.get("/filters", (req, res) => {
  var file = fs.readFileSync("./filters.json", "utf8");
  res.json(JSON.parse(file));
});

const port = process.env.PORT != undefined ? process.env.PORT : 3000;
app.listen(port, async () => {
  if (usersign == null || webid == null || timestamp == null) {
    console.log("Setting credentials please wait !!!");
    await setCredentials();
    console.log("Done !");
    console.clear()
  }
  console.log("app listens at " + port);
});
