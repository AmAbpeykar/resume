# Amin Abpeykar · Portfolio

A bilingual Next.js portfolio. English uses /en/ and Persian uses /fa/ with a right-to-left layout. The root route opens English.

## Run locally

Use Node.js 24 LTS (or Node.js 22.13+ within the 22.x release).

    npm ci
    npm run dev

Open http://localhost:3000/en/ or http://localhost:3000/fa/.

## Content and configuration

- Edit English and Persian copy in src/messages/en.json and src/messages/fa.json.
- Edit project links, technologies, and skill groups in src/data/portfolio.ts.
- Edit the default phone, email, and LinkedIn in src/data/site.ts. Copy .env.example to .env.local to override email or LinkedIn, add a professional profile, or set the production origin. Set PORTFOLIO_SITE_URL to the real HTTPS origin to emit absolute language alternates, canonical URLs, and social preview image URLs.

## Build and verify

    npm run lint
    npm run typecheck
    npm run build

The build produces out/. Serve that directory with any static web server that supports directory index files. To preview the export locally with Python installed, run python -m http.server 4173 --directory out and open http://localhost:4173/.
