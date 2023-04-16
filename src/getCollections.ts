import fetch from "node-fetch";
import { writeFile } from "node:fs";

interface BaseInfo {
  id: string;
  slug: string;
  num_name: number;
  name: { en: string };
}

interface CollectionInfo extends BaseInfo {
  subs: CollectionInfo[];
}

function getDigitSubs() {
  return fetch("https://api.godid.io/api/collections/v2?compact=true")
    .then((res) => res.json())
    .then((results: CollectionInfo[]) => {
      const digitInfo = results.find((ele) => ele.slug == "digits");
      if (!digitInfo) {
        throw new Error("info not found");
      }
      return digitInfo.subs;
    });
}

interface SubDetail extends BaseInfo {
  names: string[];
}

function getSubDetail(subId: string): Promise<SubDetail> {
  return fetch(
    `https://api.godid.io/api/collections/${subId}?compact=false`
  ).then((res) => res.json());
}

interface ConfigItem extends SubDetail {
  classes: string[];
}

getDigitSubs().then(async (digitSubs) => {
  // console.log("digitSubs", digitSubs);
  const config: { [slug: string]: ConfigItem } = {};
  for (let index = 0; index < digitSubs.length; index++) {
    const digitElement = digitSubs[index];
    await Promise.all(
      digitElement.subs.map((ele) => getSubDetail(ele.id))
    ).then((results) => {
      results.forEach((ele) => {
        // console.log("ele", ele);
        if (config[ele.slug]) {
          config[ele.slug].classes.push(digitElement.slug);
        } else {
          config[ele.slug] = {
            classes: [digitElement.slug],
            id: ele.id,
            slug: ele.slug,
            names: ele.names,
            num_name: ele.num_name,
            name: ele.name,
          };
        }
      });
    });
  }
  writeFile("src/configs.json", JSON.stringify(config), (err) => {
    if (err) {
      throw err;
    }
    console.log("write file success!");
  });
});
