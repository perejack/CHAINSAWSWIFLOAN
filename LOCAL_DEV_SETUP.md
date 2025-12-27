# Local Development Setup for Payment Testing

## The Problem
The 500 error occurs because:
- The Vite proxy is configured to forward to `http://localhost:3000` (default)
- But there's no server running on port 3000
- The `/api` functions are Vercel serverless functions that need either:
  1. A deployed Vercel URL, OR
  2. Vercel CLI running (`vercel dev`)

## Solution Options

### Option 1: Use Vercel CLI (Recommended for Local Testing)
This runs both your frontend AND your API functions locally.

```bash
# Install Vercel CLI globally
npm install -g vercel

# Stop npm run dev if it's running (Ctrl+C)

# Run Vercel dev server
vercel dev
```

Then access your app at the URL Vercel CLI provides (usually `http://localhost:3000`).

### Option 2: Deploy to Vercel and Proxy to Production
Deploy your app to Vercel first, then proxy local frontend to production APIs.

```bash
# 1. Deploy to Vercel
vercel --prod

# 2. After deployment, create .env.local file with:
VITE_API_URL=https://your-app-name.vercel.app

# 3. Restart dev server
npm run dev
```

## Quick Fix for NOW
**Use Option 1** - it's the fastest way to test payments locally:

```bash
vercel dev
```

This will:
- ✅ Serve your frontend
- ✅ Serve your `/api` functions
- ✅ Enable payment testing
- ✅ Match production environment

## Current Status
- ✅ Duplicate key warning FIXED
- ⚠️ 500 error remains (need to use Option 1 or 2 above)
