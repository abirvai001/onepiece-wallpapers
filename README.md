# Grand Line Wallpapers

A production-ready **One Piece wallpaper website** with arc/character categories, trending & recent sections, admin-only publishing, download/share, artist info, and resolution display.

## Features

- **Categories**: Browse by One Piece arc (Wano, Marineford, etc.), character (Luffy, Zoro, etc.), Trending, and Recently Added
- **Admin panel**: Only admins can publish, hide, or delete wallpapers (`/admin/login`)
- **Wallpaper details**: Artist name/link, resolution, views, downloads, categories
- **Download & Share**: One-click download + native share / copy link
- **One Piece theme**: Pirate/navy/gold color palette, wanted-poster styling
- **Ad/sponsorship placeholders**: Ready for your sponsors — contact info in footer
- **Contact footer** on every page:
  - X: [@abirphotomail](https://x.com/abirphotomail)
  - Email: abirodroid.admob@gmail.com

## Quick Start (Local)

```bash
cd onepiece-wallpapers
npm install
cp .env.example .env   # edit AUTH_SECRET and admin password
npm run db:setup       # migrate + seed categories & admin user
npm run dev
```

Open http://localhost:3000

**Default admin login** (change in `.env` before production):
- Email: `admin@grandlinewallpapers.com`
- Password: `changeme123`

Admin panel: http://localhost:3000/admin/login

## Publishing Wallpapers (Admin)

1. Log in at `/admin/login`
2. Upload an image (JPEG, PNG, or WebP)
3. Fill in title, artist name, optional artist URL & description
4. Select arc and/or character categories
5. Optionally mark as **Trending**
6. Click **Publish Wallpaper**

## Production Deployment Guide

### Recommended Stack

| Component | Service | Why |
|-----------|---------|-----|
| App hosting | **Vercel** or **Railway** | Easy Next.js deploy |
| Database | **Neon** (PostgreSQL) | Serverless-friendly, free tier |
| Image storage | **Cloudflare R2** or **Uploadthing** | Persistent uploads (not ephemeral disk) |

> **Important**: SQLite + local `public/uploads/` works for local dev only. Serverless hosts wipe the filesystem on each deploy. Use PostgreSQL + cloud storage for production.

---

### Option A: Vercel + Neon (Recommended)

#### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial One Piece wallpaper site"
git remote add origin https://github.com/YOUR_USER/onepiece-wallpapers.git
git push -u origin main
```

#### Step 2 — Create Neon Database

1. Go to [neon.tech](https://neon.tech) → Create project
2. Copy the PostgreSQL connection string

#### Step 3 — Switch Prisma to PostgreSQL

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Step 4 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Set environment variables:

```
DATABASE_URL=postgresql://...neon...
AUTH_SECRET=<run: openssl rand -base64 32>
ADMIN_EMAIL=abirodroid.admob@gmail.com
ADMIN_PASSWORD=<strong-password>
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

3. Build command: `prisma migrate deploy && npm run db:seed && next build`
4. Deploy

#### Step 5 — Run migrations (first deploy)

In Vercel project → Settings → add build command above, or run locally:

```bash
DATABASE_URL="your-neon-url" npx prisma migrate deploy
DATABASE_URL="your-neon-url" npm run db:seed
```

#### Step 6 — Custom domain

Vercel → Project → Settings → Domains → Add your domain.

Update `NEXT_PUBLIC_SITE_URL` to your custom domain.

---

### Option B: Railway (All-in-one)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Add **PostgreSQL** plugin (Railway provides `DATABASE_URL` automatically)
3. Set env vars: `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
4. Switch Prisma to PostgreSQL (same as above)
5. Railway persists volumes — mount to `/app/.next/standalone/public/uploads` (see PRODUCTION.md)

---

### Option C: VPS / Docker (Full control)

```bash
docker build -t onepiece-wallpapers .
docker run -p 3000:3000 \
  -e AUTH_SECRET="your-secret" \
  -e ADMIN_EMAIL="abirodroid.admob@gmail.com" \
  -e ADMIN_PASSWORD="strong-password" \
  -e NEXT_PUBLIC_SITE_URL="https://yourdomain.com" \
  -v uploads:/app/.next/standalone/public/uploads \
  onepiece-wallpapers
```

Use **Nginx** or **Caddy** as reverse proxy with SSL (Let's Encrypt).

---

### Image Storage for Production (Cloudflare R2)

For large wallpaper libraries, store images on R2 instead of local disk:

1. Create R2 bucket at [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Enable public access or use a custom domain
3. Upload images via admin (future: integrate R2 SDK in `/api/admin/upload`)
4. Store full URLs in `imagePath` field

Your existing `OnePieceWallpaperServer/cloudflare/` setup can be reused for video/live wallpaper assets.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite (dev) or PostgreSQL (prod) |
| `AUTH_SECRET` | Yes | NextAuth JWT secret |
| `ADMIN_EMAIL` | Yes | Admin login email (seeded) |
| `ADMIN_PASSWORD` | Yes | Admin login password (seeded) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL for share links |

## Project Structure

```
onepiece-wallpapers/
├── prisma/           # Database schema & migrations
├── public/uploads/   # Wallpaper images (local dev)
├── src/
│   ├── app/          # Pages & API routes
│   ├── components/   # UI components
│   └── lib/          # Auth, DB, utilities
└── README.md
```

## Sponsorship & Ads

Ad placeholder zones are built into:
- Home page (banner + inline)
- Category pages (sidebar)
- Wallpaper detail page (sidebar)
- Footer CTA

Replace `<AdPlaceholder />` components with your ad network scripts (Google AdSense, etc.) or sponsor banners. Visitors can contact you for sponsorship at **@abirphotomail** or **abirodroid.admob@gmail.com**.

## Legal Note

This is a fan-made wallpaper gallery. One Piece © Eiichiro Oda / Shueisha / Toei Animation. Not affiliated with official One Piece.