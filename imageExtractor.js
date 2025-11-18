import axios from 'axios';
import fs from 'fs';
import path from 'path';
export async function downloadImage(url, id) {
  if (!url) return null;
  try {
    const dir = path.join(process.cwd(), 'images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    const file = path.join(dir, `${id}.jpg`);
    fs.writeFileSync(file, res.data);
    return file;
  } catch (e) {
    return null;
  }
}
