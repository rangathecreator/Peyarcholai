# Vercel Deployment Verification & Build-Failure Monitoring Automation Guide

**Application:** பெயர்ச்சோலை (Peyarcholai) — `https://peyar.donorconnect.in`  
**Document Path:** `E:\project\Apps\KidNamingApp\doc\deployment\site\05-Vercel-Deployment-Monitoring-Automation.md`  
**Created:** 2026-11-19  
**Related Task:** `TODO.md` → **Task 42 (`T42-1`, `T42-2`)**

---

## 1. Latest Production Deployment Verification (`main` @ `8e4b2f0`, 2026-11-19 09:09–09:11 IST)

Commit `8e4b2f0` (`feat(mobile): add collapsible header & section menus, mobile UX fixes, caching perf fix, and mobile testing docs`) built and deployed on Vercel (`bom1` Mumbai edge):

| Route | Live HTTP Status | Edge Cache (`x-vercel-cache`) | Size / Notes | Status |
| :--- | :---: | :--- | :--- | :--- |
| `https://peyar.donorconnect.in/` | `200` | `PRERENDER` | `454,501 B` — `headerDrawer=True`, `sectionMenu=True`, `mobileH1=True`, `noWrapCta=True` | ✅ **LIVE & PASS** |
| `https://peyar.donorconnect.in/name/yazhini` | `200` | `PRERENDER` | `61,219 B` | ✅ **PASS** |
| `https://peyar.donorconnect.in/why-peyarcholai` | `200` | `PRERENDER` | `49,283 B` | ✅ **PASS** |
| `https://peyar.donorconnect.in/docs` | `200` | `PRERENDER` | `63,176 B` | ✅ **PASS** |
| `https://peyar.donorconnect.in/guide` | `200` | `PRERENDER` | `63,182 B` | ✅ **PASS** |
| `https://peyar.donorconnect.in/api/names?gender=girl&nameCategory=pure_tamil&page=1` | `200` | `HIT` (`967ms`) | `329,617 B`, `Cache-Control: public` | ✅ **PASS** |
| `https://peyar.donorconnect.in/p/sample-tamil-poll` | **`500`** | — | **Root Cause:** `DATABASE_URL` (Neon) is set in Vercel, but `V1__kidnaming_auth_poll.sql` tables (`family_polls`) are not yet created in Neon and `loadPoll()` lacked graceful fallback. | 🔴 **Defect Caught → Fixed in `dev19Nov2026` (T41-1)** |
| `https://peyar.donorconnect.in/api/polls/sample-tamil-poll` | **`500`** | — | Same Neon table-not-migrated root cause. | 🔴 **Defect Caught → Fixed in `dev19Nov2026` (T41-1)** |
| `https://peyar.donorconnect.in/api/survey?slug=yazhini` | **`500`** | — | Same Neon `class_collision_surveys` table-not-migrated root cause. | 🔴 **Defect Caught → Fixed in `dev19Nov2026` (T41-1)** |

> **Action Required in Neon SQL Editor (One-Time):** Execute [`app/src/lib/db/V1__kidnaming_auth_poll.sql`](../../../app/src/lib/db/V1__kidnaming_auth_poll.sql) in the `peyarcholai-prod` Neon SQL Editor so `family_polls`, `family_poll_votes`, and `class_collision_surveys` exist in production. Meanwhile, `dev19Nov2026` adds resilient error handling & bundled-demo fallback so missing tables never cause HTTP `500`.

---

## 2. Automation Possibilities to Monitor Vercel Build Failures & Production Regressions

Below are **5 zero-cost / low-cost automation tiers** ranked from simplest to most comprehensive:

### Option A — GitHub Actions `deployment_status` Webhook + Synthetic Health Check (Recommended — $0 Free)
Vercel automatically emits GitHub `deployment_status` events (`error`, `failure`, `success`) to the linked GitHub repository (`rangathecreator/Peyarcholai`).
- **How it works:**
  1. Add `.github/workflows/vercel-deploy-monitor.yml` triggered on `on: [deployment_status]` and a scheduled `cron: '*/30 * * * *'`.
  2. If `github.event.deployment_status.state == 'failure'` or `'error'`, immediately open/comment on a GitHub Issue (`label: deploy-failure`) and send a Webhook notification (Telegram Bot / Discord / Slack / Email).
  3. If `state == 'success'`, automatically execute `node app/scripts/check-prod-health.mjs --json` against `https://peyar.donorconnect.in` to catch runtime `500`s (like our Neon DB `500` above!) even when the Next.js build succeeded.

```yaml
# .github/workflows/vercel-deploy-monitor.yml (reference template)
name: Vercel Deployment & Health Monitor
on:
  deployment_status:
  schedule:
    - cron: "*/30 * * * *"
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Alert on Vercel Build Failure
        if: github.event_name == 'deployment_status' && (github.event.deployment_status.state == 'failure' || github.event.deployment_status.state == 'error')
        run: |
          echo "::error::Vercel deployment FAILED for ${{ github.sha }} — ${{ github.event.deployment_status.target_url }}"
          exit 1
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Run Synthetic Production Health Check
        if: github.event_name != 'deployment_status' || github.event.deployment_status.state == 'success'
        run: node app/scripts/check-prod-health.mjs
```

### Option B — Vercel Built-in Email & Slack/Discord Notifications ($0 Free)
- **Setup:** Vercel Dashboard → Project `peyarcholai` → **Settings → Notifications** (or Account Settings → Notifications).
- Enable **Deployment Failed** alerts via Email, Slack, or Discord webhook.
- **Pros:** Zero code, instant build-log link.
- **Cons:** Only monitors build failures; does **not** detect post-deploy runtime `500`s (e.g., DB schema mismatch).

### Option C — Vercel Deployment Webhooks (`deployment.error`, `deployment.succeeded`)
- **Setup:** Vercel Project → **Settings → Webhooks** (available on Pro or via Vercel Integrations on Hobby).
- Subscribe to `deployment.created`, `deployment.succeeded`, `deployment.error`, `deployment.canceled`.
- Point to a lightweight Cloudflare Worker or `/api/webhooks/vercel` endpoint verifying `x-vercel-signature` (HMAC-SHA1) and forwarding alerts to WhatsApp/Telegram/Email.

### Option D — Vercel REST API Polling Script (`VERCEL_TOKEN`)
- Query `GET https://api.vercel.com/v6/deployments?projectId=<PROJECT_ID>&target=production&limit=5` with `Authorization: Bearer <VERCEL_TOKEN>`.
- Inspect `deployments[0].readyState` (`BUILDING`, `READY`, `ERROR`, `CANCELED`) and `deployments[0].meta.githubCommitSha`.
- Ideal for local developer scripts or Antigravity `/schedule` background monitoring right after `git push origin main`.

### Option E — External Synthetic Uptime Monitors ($0 Free Tier)
- **UptimeRobot / Better Stack / Cloudflare Health Checks:**
  - Ping `https://peyar.donorconnect.in/` and `https://peyar.donorconnect.in/api/names?gender=girl&nameCategory=pure_tamil&page=1` every 5 minutes.
  - Assert HTTP `200` + keyword match (`பெயர்ச்சோலை`).
  - Sends instant Email / Telegram / SMS alerts on downtime or `5xx`.

---

## 3. Reusable Local & CI Health Check Script (`app/scripts/check-prod-health.mjs`)

Run anytime from `e:\project\Apps\KidNamingApp\app`:
```powershell
node scripts/check-prod-health.mjs
# Or machine-readable JSON for CI/webhooks:
node scripts/check-prod-health.mjs --json
# Or test localhost before pushing:
$env:BASE_URL="http://127.0.0.1:3020"; node scripts/check-prod-health.mjs
```
