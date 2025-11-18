import Parser from 'rss-parser';
import fs from 'fs';
import csv from 'csv-parser';
import { sleep, cleanText } from './utils.js';
const parser = new Parser({ timeout: 10000, maxRedirects: 5 });

export const loadFeeds = () =>
  new Promise((resolve) => {
    const feeds = [];
    fs.createReadStream('feeds.csv')
      .pipe(csv())
      .on('data', (row) => feeds.push(row.URL || row.url || row.Url))
      .on('end', () => resolve(feeds));
  });

export async function fetchFeed(url) {
  try {
    return await parser.parseURL(url);
  } catch (e) {
    console.log('Fetch error, retrying:', url);
    try {
      await sleep(2000);
      return await parser.parseURL(url);
    } catch (err) {
      console.log('Feed failed twice:', url);
      return null;
    }
  }
}

export async function fetchAllFeeds(urls) {
  const out = [];
  for (const url of urls) {
    if (!url) continue;
    try {
      const feed = await fetchFeed(url);
      if (feed && feed.items) {
        feed.items.forEach((it) => {
          out.push({
            title: cleanText(it.title || ''),
            link: it.link,
            content: cleanText(it.contentSnippet || it.content || ''),
            isoDate: it.isoDate || it.pubDate,
            media: it.enclosure?.url || (it['media:content'] && it['media:content'].url) || null,
          });
        });
      }
    } catch (e) {
      console.log('err', url, e.message);
    }
    await sleep(600);
  }
  return out;
}
