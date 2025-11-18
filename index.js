import express from 'express';
import { loadFeeds, fetchAllFeeds } from './rssFetcher.js';
import { summarize } from './summarizer.js';
import { downloadImage } from './imageExtractor.js';
import { db } from './db.js';

const app = express();
app.use(express.json());
app.get('/', (_, res) => res.send('RWAP backend alive'));

async function pipeline() {
  try {
    const feeds = await loadFeeds();
    const items = await fetchAllFeeds(feeds);
    for (const it of items) {
      if(!it.link) continue;
      const exists = await db.query('SELECT 1 FROM news WHERE link=$1 LIMIT 1', [it.link]);
      if (exists.rowCount) continue;
      const summary = await summarize(it.content || it.title || '');
      const imgPath = await downloadImage(it.media || '', Date.now().toString(36));
      await db.query(
        `INSERT INTO news(title, link, summary, img_path, created_at) VALUES($1,$2,$3,$4,NOW()) ON CONFLICT (link) DO NOTHING`,
        [it.title, it.link, summary, imgPath]
      );
    }
  } catch (e) {
    console.log('pipeline error', e.message);
  }
}

app.get('/run', async (req, res) => {
  await pipeline();
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening', port));

// schedule every 4 hours in-process
setInterval(pipeline, 1000 * 60 * 60 * 4);
