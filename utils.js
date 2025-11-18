export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const cleanText = (txt='') => (''+txt).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
