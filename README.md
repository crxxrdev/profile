# Profile site

Simple static profile page showing two accounts (`lovecrxxr` and `crxxralt`) and a page views counter.

Run locally:

```bash
npm install
npm start
# then open http://localhost:3000
```

Notes:
- Socials are shown as Discord usernames and can be copied with the Copy button.
- Page views are stored in `views.json` in the project root.
# profile

Railway deployment

This repo includes a `Procfile` and a `railway.json` so Railway can deploy the app either via GitHub auto-detect or Docker.

Quick deploy steps:

```bash
# 1. In Railway: New Project → Deploy from GitHub → select crxxrdev/profile
# 2. Choose Dockerfile (uses `railway.json`) or let Railway auto-detect Node with `Procfile`
# 3. Deploy — Railway will run `npm start` and set `PORT` automatically.
```

Notes:
- `views.json` is stored on the container filesystem and may not persist across restarts or scaling. For durable counts, use Redis or Railway Persistent Storage.
