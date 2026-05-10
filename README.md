# Activity 12 — Deploy Your Quest API

> **🛠️ Stack for this lesson** — Vercel CLI / GitHub / serverless Node.
> 📥 Template: [/learn/w35/template/activity-12-deployment](/learn/w35/template/activity-12-deployment)

The Quest Tracker you built locally doesn't exist for anyone else. This activity puts it on the internet via Vercel's serverless platform. The serverless entry point (`api/index.js`), the Vercel config, and four script stubs are wired up. You'll fill in the env-var wiring, build/deploy/health scripts, and ship.

**Time:** ~60 minutes · **Concept:** Concept 12 — Going to production

---

## What You'll Build

Five tasks, each one a real deployment step:

| # | TODO | Where |
|---|------|-------|
| 1 | Sign up at [vercel.com](https://vercel.com) with GitHub (free) | Vercel dashboard |
| 2 | Push this folder to a GitHub repo and import it into Vercel | GitHub + Vercel UI |
| 3 | Define your env vars (`NODE_ENV`, any API keys you used in earlier activities) | `backend/.env.example` + Vercel dashboard |
| 4 | Fill in the four script stubs | `scripts/deploy-backend.js`, `scripts/deploy-frontend.js`, `scripts/health-check.js` |
| 5 | After deploy, run `npm run health-check https://your-app.vercel.app` and confirm 5 endpoints respond 200 | terminal |

## Run It Locally First

```bash
npm install
npm start
```

Open `http://localhost:3000` to read the local deployment guide before pushing.

## Deploy

After signing into Vercel:

```bash
# Option A — Vercel UI: import the repo, click Deploy
# Option B — Vercel CLI:
npm install -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

## Verify

Your deployment is done when:

- [ ] Your app is live at a `https://*.vercel.app` URL with the HTTPS padlock.
- [ ] `https://your-app.vercel.app/` returns the JSON root response from your Express app, not a 404.
- [ ] `https://your-app.vercel.app/api/quests` returns the same data your local dev server returns.
- [ ] `npm run health-check https://your-app.vercel.app` reports zero failures across at least 5 endpoints.
- [ ] Setting `NODE_ENV=production` in Vercel's Environment Variables panel and redeploying causes the app to log production-mode behavior (you'll need to add a tiny log in `server.js` to confirm).
- [ ] Pushing a one-line change to GitHub triggers an automatic redeploy without you running anything.
- [ ] DevTools → Console shows zero red errors on the production site.

## Stretch

Pick one and write a short note in your reflection about what you tried:
- Configure [UptimeRobot](https://uptimerobot.com/) to ping your `/api/health` endpoint every 5 minutes and email you on failures.
- Add Sentry error tracking via the Vercel marketplace integration; force a runtime error and confirm it surfaces in the Sentry dashboard.
- Set up a separate **preview environment** with a different `NODE_ENV` value and verify Vercel routes preview deploys correctly.

## 🪞 Reflect on Your Work

Answer in 2-3 sentences each, in this README under your TODO commits. Your tutor reads these as part of grading.

1. **What did you learn that you didn't know before?** Pick the most surprising thing — how serverless cold-starts feel, what Vercel infers from `vercel.json`, the gap between "works locally" and "works deployed".
2. **How did you collaborate with AI?** If you used Claude / ChatGPT / Cursor / Copilot, what part of the work did *you* contribute — the prompt, the verification, the design decision, the bug-fix? If you didn't use AI, what was the hardest thing to figure out alone?
3. **How do you know your code works?** Describe one specific thing you did to confirm — a curl against your live URL, a browser test from your phone (off your laptop's network), the health-check output.

> AI is a great collaborator. Owning your thinking, verifying the output, and explaining your design choices is what *learning* looks like in this course.

## Submit

When the Verify checklist is green, head to **[/learn/w35/certification](/learn/w35/certification)** and submit your live `*.vercel.app` URL with a screenshot of the health-check passing.

<!-- claude-template-fix: readme-v3 -->
