import e from "express";
import { getAds, getCredentials, delayedFetch } from "./tiktok.js";
import fs from "fs";
import QueryString from "qs";

const app = e();
let credentials=null

async function setCredentials() {
  let c=await getCredentials()
  credentials.userSign=c.us
  credentials.webID=c.wi
  credentials.timestamp=c.ts
  fs.writeFileSync("./creds.json",JSON.stringify(credentials),"utf8")
  return true
}

app.get("/getads", async (req, res) => {
  let qs = QueryString.stringify(req.query);
  let ads = await getAds(credentials.userSign, credentials.webID, credentials.timestamp, qs);
  if (ads.code != 0) {
    console.log("get ads cred");
    await setCredentials();
    ads = await getAds(credentials.userSign, credentials.webID, credentials.timestamp, qs);
  }
  res.json(ads);
});
app.get("/getadsdetail", async (req, res) => {
  let qs = QueryString.stringify(req.query);
  let ads = await getAds(credentials.userSign, credentials.webID, credentials.timestamp, qs);
  if (ads.code != 0) {
    console.log("get adsd etails cred");
    await setCredentials();
    ads = await getAds(credentials.userSign, credentials.webID, credentials.timestamp, qs);
  }
  let adsArray = [];
  for (const ad of ads.data.materials) {
    let data = await delayedFetch(ad.id, credentials.userSign, credentials.webID, credentials.timestamp, 500);
    adsArray.push(data.data);
  }
  res.json(adsArray);
});
app.get("/getaddetail/:adid", async (req, res) => {
  let detail = await delayedFetch(req.params.adid, credentials.userSign, credentials.webID, credentials.timestamp, 500);
  if (detail.code != 0) {
    console.log("get ad detail cred");
    await setCredentials();
    detail = await delayedFetch(req.params.adid, credentials.userSign, credentials.webID, credentials.timestamp, 500);
  }
  res.json(detail);
});
app.get("/filters", (req, res) => {
  var file = fs.readFileSync("./filters.json", "utf8");
  res.json(JSON.parse(file));
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  credentials=await JSON.parse(fs.readFileSync("./creds.json",{encoding:"utf8"}))
  if(credentials.userSign==""||credentials.webID==""||credentials.timestamp==""){
    console.log("Setting credentials please wait !!!");
    await setCredentials()
    console.clear()
    console.log("Done !");
  }
  console.log("app listens at " + port);
});
