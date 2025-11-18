import { GoogleGenerativeAI } from '@google/generative-ai';
const gen = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = gen.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5' });

export async function summarize(text) {
  try {
    const prompt = `Summarize the following news into EXACTLY 60 words in a neutral news tone.\n\n${text}`;
    const resp = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    const txt = resp?.candidates?.[0]?.content?.parts?.[0]?.text || resp?.response?.text || '';
    return (txt || '').trim();
  } catch (e) {
    console.log('Gemini error', e.message);
    return text.slice(0, 200);
  }
}
