# 04 — OmniRoute Cloudflare Tunnel Deployment Guide (Task 23 — Option A)

**Location:** `doc/deployment/04-OmniRoute-Cloudflare-Tunnel-Guide.md`  
**Security Architecture:** Defense-in-Depth (`OMNIROUTE_SERVER_HOST=127.0.0.1` + `REQUIRE_API_KEY=true` + `cloudflared` + Cloudflare Access Service Token + Edge Rate Limiting)

---

## 1. HP Z4 Workstation Setup (Ubuntu)

1. **Bind OmniRoute to Loopback Only (`~/.omniroute/.env`):**
   ```env
   OMNIROUTE_SERVER_HOST=127.0.0.1
   REQUIRE_API_KEY=true
   ```
2. **Install & Authenticate `cloudflared`:**
   ```bash
   curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
   sudo apt-get update && sudo apt-get install -y cloudflared
   cloudflared tunnel login
   cloudflared tunnel create peyarcholai-omniroute
   cloudflared tunnel route dns peyarcholai-omniroute omniroute.donorconnect.in
   ```
3. **Configure `/etc/cloudflared/config.yml`:**
   ```yaml
   tunnel: <TUNNEL_UUID>
   credentials-file: /root/.cloudflared/<TUNNEL_UUID>.json
   ingress:
     - hostname: omniroute.donorconnect.in
       service: http://127.0.0.1:20128
     - service: http_status:404
   ```
   ```bash
   sudo cloudflared service install && sudo systemctl enable --now cloudflared
   ```

---

## 2. Cloudflare Zero-Trust & Vercel Env Vars

1. In **Cloudflare Zero Trust → Access → Service Auth → Service Tokens**, create a token (`vercel-peyarcholai`).
2. Add an Access Application for `omniroute.donorconnect.in` with Policy Action **Service Auth** allowing that token.
3. Add a Cloudflare WAF Rate Limiting rule (`60 req/min` per IP on `/v1/*`).
4. Set these environment variables in **Vercel → Project Settings → Environment Variables**:
   - `OMNIROUTE_BASE_URL=https://omniroute.donorconnect.in/v1`
   - `OMNIROUTE_API_KEY=<your-omniroute-bearer-key>`
   - `CF_ACCESS_CLIENT_ID=<cloudflare-service-token-id>`
   - `CF_ACCESS_CLIENT_SECRET=<cloudflare-service-token-secret>`

`app/src/lib/omniroute.ts` automatically attaches both the `Authorization: Bearer` header and `CF-Access-Client-Id` / `CF-Access-Client-Secret` headers, and falls back deterministically to the local catalog engine whenever the HP Z4 workstation is offline.
