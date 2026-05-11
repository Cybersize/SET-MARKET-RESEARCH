# Running SET Research Locally on Windows

## Prerequisites

1. **Node.js 20+** — download from https://nodejs.org (LTS version)
2. **pnpm** — after installing Node, open PowerShell and run:
   ```
   npm install -g pnpm
   ```

## 1. Download the project

Export/download the project from Replit as a ZIP, then extract it to a folder like `C:\Projects\set-research`.

## 2. Install dependencies

Open PowerShell in the project root folder and run:
```
pnpm install
```

## 3. Configure environment variables

### API server
Copy the example file and fill in your values:
```
copy artifacts\api-server\.env.local.example artifacts\api-server\.env.local
```
Edit `artifacts\api-server\.env.local`:
```
PORT=5000
SET_API_KEY=your-set-api-key-here
SESSION_SECRET=any-long-random-string
```

### Frontend (React app)
Copy the example file and fill in your Firebase credentials:
```
copy artifacts\set-research\.env.local.example artifacts\set-research\.env.local
```
Edit `artifacts\set-research\.env.local` with your Firebase project values
(found in Firebase Console → Project Settings → Your apps → SDK setup):
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abc123
```

## 4. Build the API server

The API server is compiled before running:
```
pnpm --filter @workspace/api-server run build
```

## 5. Run both servers

Open **two separate PowerShell windows**:

**Window 1 — API server** (port 5000):
```
pnpm --filter @workspace/api-server run start
```
You should see: `{"port":5000,"msg":"Server listening"}`

**Window 2 — Frontend** (port 5173):
```
pnpm --filter @workspace/set-research run dev
```
You should see: `Local: http://localhost:5173/`

Then open http://localhost:5173 in your browser.

> The frontend dev server automatically proxies all `/api` requests to the API
> server on port 5000, so everything works exactly as it does on Replit.

## 6. After code changes to the API server

The API server is a compiled Node app — rebuild it before restarting:
```
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `pnpm: command not found` | Run `npm install -g pnpm` |
| Port 5000 already in use | Change `PORT=5001` in api-server `.env.local` and update the proxy target in `vite.config.ts` |
| Firebase auth errors | Double-check all `VITE_FIREBASE_*` values in `.env.local` |
| SET API returns 401 | Verify `SET_API_KEY` in api-server `.env.local` matches your subscription key |
| `Cannot find module` errors | Run `pnpm install` again from the project root |
