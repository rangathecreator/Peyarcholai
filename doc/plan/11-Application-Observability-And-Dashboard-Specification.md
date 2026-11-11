# பெயர்ச்சோலை (Peyarcholai) — Application Observability, Metrics & Dashboards Specification

**Document ID:** `PLAN-OBS-11`  
**Location:** `doc/plan/11-Application-Observability-And-Dashboard-Specification.md`  
**Status:** Approved Feature Specification  
**Component Reference:** `@common/observability` (`E:\project\Apps\common\code\packages\observability`)  

---

## 1. Observability Pillars in Consumer Applications

To operate பெயர்ச்சோலை (and upcoming subscription apps) at high reliability, the application implements five observability subsystems:
1. **High-Performance Structured JSON Logger:** Replaces plain `console.log` with structured log records including timestamp, severity, app name, trace ID, route, and latency.
2. **Prometheus Metrics Endpoint (`/api/metrics`):** Exposes live gauges and histograms for Prometheus/Grafana scraping.
3. **Automated Bug Reporting System:** Captures unhandled client and server errors with user impact assessment and stack traces.
4. **Product Usage & Search Analytics:** Anonymously tracks popular starting syllables, numerology filter usage, and conversion funnel drop-offs.
5. **Embedded Operations Dashboard (`/admin/dashboard`):** Real-time web view for monitoring system vitals, payment health, and user traffic without needing external Grafana infrastructure in early stages.

---

## 2. Real-Time Admin Dashboard Metrics Wireframe

```
+---------------------------------------------------------------------------------------+
|  📊 பெயர்ச்சோலை — Operations & System Health Dashboard                                 |
+---------------------------------------------------------------------------------------+
|  [ SYSTEM HEALTH ]       [ ACTIVE TRAFFIC ]      [ CONVERSIONS ]     [ REVENUE (MTD) ]|
|  Status: 🟢 100% OK       Live Users: 142         Total Passes: 84    ₹38,240          |
|  API Latency: 42ms (p95)  Req/Min: 310            ₹49 Pass: 62        Active Subs: 22  |
|  Error Rate: 0.02%        Active Shards: 69       ₹499 Pass: 22       Refunds: 0       |
+---------------------------------------------------------------------------------------+
|  [ POPULAR SEARCH SYLLABLES ]                     [ GATEWAY CONVERSION SUCCESS ]      |
|  - 'க' (Ka): 24.2%                                - Razorpay UPI: 98.4% Success Rate  |
|  - 'அ' (A): 18.1%                                 - Cards/Netbanking: 94.2%           |
|  - 'வி' (Vi): 12.5%                               - Google Play IAP: 99.1%            |
+---------------------------------------------------------------------------------------+
|  [ RECENT SYSTEM EXCEPTIONS & BUG REPORTS (Last 24 Hours) ]                           |
|  [14:22] WARN: Client Search Timeout on Syllable 'ழ' (Resolved in Fallback Node)      |
|  [11:05] INFO: Auto-Approved Community Submission 'செங்கதிர்' (Score: 99%)           |
+---------------------------------------------------------------------------------------+
```

---

## 3. Integration into the Common App Workspace

This observability suite is packaged in `@common/observability` (`E:\project\Apps\common\code\packages\observability`) with plug-and-play middleware for:
- Next.js (App Router API routes and client error boundary)
- Express / Node.js backends
- Client-side React applications
- Future apps inherit the exact same dashboard and metric collectors with zero setup time.

