# RWAP Backend - RSS Aggregator (Docker + Railway ready)

This repository contains a production-ready Node.js backend for RWAP.ai:
- Fetches RSS feeds (list in `feeds.csv`)
- Extracts media & thumbnails
- Summarizes content using Google Gemini (60-word news style)
- Downloads images to `/images` (for Canva bulk upload)
- Stores results into PostgreSQL (schema in `schema.sql`)

## Quick start (local with Docker Compose)

1. Copy `.env.example` to `.env` and fill values.
2. Build and run:
   ```bash
   docker-compose up --build
   ```
3. Visit `http://localhost:3000/run` to trigger a fetch (or it runs every 4 hours automatically).

## Deployment to Railway

1. Create a GitHub repo and push this project.
2. Create a Railway project and connect the GitHub repo.
3. Add secrets to GitHub Actions / Railway:
   - `RAILWAY_API_KEY` (if using GitHub Action)
   - Set environment variables in Railway UI (DATABASE_URL, GEMINI_API_KEY, PORT).
4. Push to `main` — GitHub Action will deploy to Railway.

## Files

- `src/` - application source code
- `feeds.csv` - list of feeds (sample or imported)
- `.env.example` - environment template
- `schema.sql` - PostgreSQL schema for `news` table
- `.github/workflows/deploy.yml` - GitHub Action for Railway deploy

