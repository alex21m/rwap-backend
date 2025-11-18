-- PostgreSQL schema for RWAP
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT,
  link TEXT UNIQUE,
  summary TEXT,
  img_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
