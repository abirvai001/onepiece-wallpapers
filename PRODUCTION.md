# opwalls — Production Deployment Guide

This guide walks you through putting **opwalls** live on the internet.

---

## Before you start — what you need

| Item | Why |
|------|-----|
| **GitHub account** | Host your code |
| **Strong admin password** | Replace `changeme123` |
| **Domain (optional)** | e.g. `opwalls.com` — can use free `.vercel.app` first |

### Critical: two things change in production

1. **Database** — SQLite (local) → **PostgreSQL** (cloud). Serverless hosts cannot use SQLite files.
2. **Uploaded images** — On Vercel, the disk is wiped on every deploy. You need **persistent storage** (Railway volume or Cloudflare R2).

---

## Recommended path for beginners: Railway (easiest)

Railway runs your Next.js app + PostgreSQL + **persistent disk** for wallpaper uploads in one place.

### Step 1 — Push code to GitHub

Open PowerShell in your project folder:

```powershell
cd C:\Users\ACER\onepiece-wallpapers

git init
git add .
git commit -m "opwalls — One Piece wallpaper site"

# Create a new empty repo on https://github.com/new (name: onepiece-wallpapers)
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/onepiece-wallpapers.git
git push -u origin main
```

### Step 2 — Switch Prisma to PostgreSQL

The Dockerfile (used by Railway) automatically uses `prisma/schema.production.prisma` during the build.

You no longer need to manually copy the schema before deploying.

(If you want to test locally with Postgres, you can still copy it manually.)

Commit and push your code (including the Dockerfile).

> Keep developing locally? Restore SQLite later with `git checkout prisma/schema.prisma` from a backup, or maintain two branches.

### Step 3 — Create Railway project

1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo** → select `onepiece-wallpapers`
3. Click your service → **Settings**:
   - **Root Directory**: leave blank
   - **Start Command**: `npm start`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`

### Step 4 — Add PostgreSQL database

1. In the same Railway project → **+ New** → **Database** → **PostgreSQL**
2. Click the Postgres service → **Variables** → copy `DATABASE_URL`
3. Click your **web service** → **Variables** → add:

```
DATABASE_URL          = (paste from Postgres service — use the private URL)
AUTH_SECRET           = (generate below)
ADMIN_EMAIL           = abirodroid.admob@gmail.com
ADMIN_PASSWORD        = YourStrongPasswordHere123!
NEXT_PUBLIC_SITE_URL  = https://YOUR-APP.up.railway.app
NODE_ENV              = production
```

Generate `AUTH_SECRET` in PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Or use any long random string (32+ characters).

### Step 5 — Persistent storage for uploads

1. Web service → **Settings** → **Volumes**
2. **Add Volume**:
   - Mount path: `/app/public/uploads`
   - Size: 1 GB (increase later)
3. Redeploy

Without this volume, uploaded wallpapers disappear after redeploy.

**Note**: The project now includes a `Dockerfile` for reliable Next.js standalone builds on Railway. Railway will auto-detect the Dockerfile. The volume is mounted at the standard public location used by the Dockerfile. Re-upload any existing wallpapers after the new deploy.

### Step 6 — Seed the database (first deploy only)

Open Railway → web service → **Settings** → change **Start Command** temporarily to:

```
npx tsx prisma/seed.ts && npm start
```

Deploy once (creates admin user + categories), then change Start Command back to `npm start`.

Or run locally against Railway DB:

```powershell
$env:DATABASE_URL="postgresql://..."
$env:ADMIN_EMAIL="abirodroid.admob@gmail.com"
$env:ADMIN_PASSWORD="YourStrongPasswordHere123!"
npx tsx prisma/seed.ts
```

### Step 7 — Get your live URL

Railway → web service → **Settings** → **Networking** → **Generate Domain**

You get something like: `https://onepiece-wallpapers-production.up.railway.app`

Update `NEXT_PUBLIC_SITE_URL` to that URL and redeploy.

### Step 8 — Custom domain (optional)

Railway → **Networking** → **Custom Domain** → add `opwalls.com` (or your domain).

At your domain registrar, add the CNAME record Railway shows you.

Update `NEXT_PUBLIC_SITE_URL` to `https://opwalls.com` and redeploy.

### Step 9 — Verify

| Check | URL |
|-------|-----|
| Homepage | `https://your-url/` |
| Admin login | `https://your-url/admin/login` |
| Upload test | Log in → upload a wallpaper → view on site |

---

## Alternative: Vercel + Neon (best long-term scale)

Use this when you want the fastest global CDN and are okay setting up cloud image storage.

### Architecture

```
Vercel (Next.js app)  +  Neon (PostgreSQL)  +  Cloudflare R2 (wallpaper images)
```

### Step 1–2 — Same as Railway (GitHub + PostgreSQL schema)

### Step 3 — Create Neon database

1. [neon.tech](https://neon.tech) → Sign up → **New Project**
2. Copy the connection string (starts with `postgresql://`)

### Step 4 — Deploy on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo
2. **Environment Variables**:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | Random 32+ char secret |
| `ADMIN_EMAIL` | `abirodroid.admob@gmail.com` |
| `ADMIN_PASSWORD` | Your strong password |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |

3. **Build & Development Settings** → Override build command:

```
npx prisma generate && npx prisma db push && npm run build
```

4. Deploy

### Step 5 — Seed database

Locally (one time):

```powershell
cd C:\Users\ACER\onepiece-wallpapers
$env:DATABASE_URL="your-neon-connection-string"
$env:ADMIN_EMAIL="abirodroid.admob@gmail.com"
$env:ADMIN_PASSWORD="YourStrongPassword"
npx tsx prisma/seed.ts
```

### Step 6 — Image storage (required on Vercel)

Vercel deletes `public/uploads/` on every deploy. Options:

| Service | Cost | Notes |
|---------|------|-------|
| **Cloudflare R2** | ~$0 egress | You already have R2 docs in `OnePieceWallpaperServer/cloudflare/` |
| **Vercel Blob** | Free tier available | Easiest Vercel integration |
| **Uploadthing** | Free tier | Good for admin uploads |

Until R2/Blob is integrated, use **Railway** for uploads — it works today with zero code changes.

### Step 7 — Custom domain on Vercel

Vercel → Project → **Settings** → **Domains** → add your domain.

---

## Environment variables reference

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host/db` |
| `AUTH_SECRET` | Yes | Random 32+ characters |
| `ADMIN_EMAIL` | Yes (seed) | `abirodroid.admob@gmail.com` |
| `ADMIN_PASSWORD` | Yes (seed) | Strong unique password |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://opwalls.com` |

---

## Post-deploy checklist

- [ ] Changed admin password from `changeme123`
- [ ] `NEXT_PUBLIC_SITE_URL` matches your live domain (share links work)
- [ ] Uploaded a test mobile + desktop wallpaper
- [ ] Download button works on wallpaper page
- [ ] Footer shows @abirphotomail link correctly
- [ ] Persistent storage configured (Railway volume or R2)

---

## Costs (approximate)

| Setup | Monthly cost |
|-------|-------------|
| Railway (hobby) | ~$5 credit included, then usage-based |
| Vercel (hobby) | Free for personal projects |
| Neon (free tier) | Free up to 0.5 GB |
| Cloudflare R2 | ~$0.015/GB storage, free egress |

---

## Troubleshooting

**Build fails on Prisma**
```powershell
npx prisma generate
npx prisma db push
```

**Admin login fails**
Re-run seed with correct `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.

**Uploads work then disappear**
You are on Vercel without cloud storage. Switch to Railway + volume, or integrate R2.

**Share links show localhost**
Update `NEXT_PUBLIC_SITE_URL` to your production URL and redeploy.

---

## Need help?

Contact @abirphotomail on X or abirodroid.admob@gmail.com