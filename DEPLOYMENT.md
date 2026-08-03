# Deployment

This repo is a monorepo with two independently-deployed apps plus a managed database:

- `client/` — Vite + React single-page app → **Vercel** (static CDN)
- `server/` — Express API with passport sessions → **Render** (persistent Node service)
- Database → **Neon** (managed Postgres)

They deploy separately from the same repository by setting each service's **root directory**.

## Why this split (and why not Vercel for the backend)

The API uses `express-session` for auth, which needs a long-lived process — so the
backend must run on a **persistent** host (Render), not a serverless one (Vercel
functions are stateless and would drop the in-memory session between requests).
The frontend is just static files, ideal for a CDN host.

Because the two run on **different domains** in production, the auth cookie is
*cross-site*. That is exactly what tripped everyone up before, and what the config
in [`server/api/express.js`](server/api/express.js) now handles:

- `app.set("trust proxy", 1)` so `secure` cookies work behind the host's HTTPS proxy
- session cookie `sameSite: "none"` + `secure: true` in production, so the browser
  actually sends it cross-site (in dev it falls back to `lax`/non-secure for `localhost`)
- CORS with `credentials: true` and an exact origin allow-list, tolerant of trailing slashes
- the client already sends `credentials: "include"` on every request

## 1. Database — Neon

1. Create a project at [neon.tech](https://neon.tech); it provisions a Postgres database.
2. Copy the **Pooled** connection string
   (`postgresql://user:pass@ep-xxx-pooler.../neondb?sslmode=require`).
3. Put it in `server/.env` as `DATABASE_URL=...`, then create the tables:
   ```bash
   cd server
   npm install
   npm run initdb        # prints "Tables are ready: users, tasks."
   ```

## 2. Backend — Render

1. **New → Web Service** → connect this repo.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment variables:**
   - `DATABASE_URL` — the Neon pooled string
   - `SESSION_SECRET` — a long random string (`openssl rand -hex 32`)
   - `NODE_ENV` — `production`
   - `ORIGINURL` — your frontend URL (fill in after step 3)
6. Deploy and note the service URL, e.g. `https://beyond-todo-api.onrender.com`.

## 3. Frontend — Vercel

1. **New Project** → import this repo.
2. **Root Directory:** `client`
3. Framework preset: **Vite** (build `npm run build`, output `dist`).
4. **Environment variable:**
   - `VITE_SERVER_URL` — the Render backend URL from step 2 (no trailing slash)
5. Deploy and note the URL, e.g. `https://beyond-todo.vercel.app`.

## 4. Close the loop (the ordering gotcha)

The frontend needs the backend URL and the backend needs the frontend URL, so:

1. Deploy the **backend** first → get its URL.
2. Set `VITE_SERVER_URL` on Vercel → deploy the **frontend** → get its URL.
3. Set `ORIGINURL` on Render to the frontend URL → **redeploy the backend**.

`ORIGINURL` accepts a comma-separated list, so you can allow local + production at once:

```
ORIGINURL=http://localhost:5173,https://beyond-todo.vercel.app
```

## Local development

```bash
# backend  → http://localhost:3000
cd server
cp .env.example .env      # fill in DATABASE_URL + SESSION_SECRET
npm install
npm run initdb            # once
npm run dev               # nodemon

# frontend → http://localhost:5173
cd client
cp .env.example .env      # VITE_SERVER_URL=http://localhost:3000
npm install
npm run dev               # vite
```
