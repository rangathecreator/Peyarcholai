# பெயர்ச்சோலை (Peyarcholai) — Three-Tier Monetization Architecture

**Document ID:** `REV-PLAN-01`  
**Location:** `doc/plan/revenuePlan/01-Three-Tier-Monetization-Architecture.md`  
**Referenced Base Document:** [`doc/plan/13-Revenue-Plan.md`](../13-Revenue-Plan.md)  
**Status:** Approved Architecture Draft  
**Target Release:** Beta v1.0 (Free Tier) $\rightarrow$ GA v1.1 (Paid Monetization)

---

## 1. Executive Summary & Monetization Philosophy

பெயர்ச்சோலை (Peyarcholai) operates on a **Community Trust-First, High-Intent Value Exchange** model. Choosing a child’s name is one of the most culturally profound, emotional, and anxiety-inducing decisions parents make.

Our monetization framework adheres strictly to three non-negotiable principles:
1. **The Honesty Layer is Never Compromised:** Sourcing authenticity, Tolkappiyam Sandhi rules, and University of Madras Lexicon references are never paywalled or distorted to drive sales. We never sell "fear-based astrological remedies" or "unlucky name cures."
2. **Free Tier Drives Acquisition & Cultural Accessibility:** Every parent, regardless of economic background, has access to authentic Tamil names, birth-star calculations, and basic numerology.
3. **Premium Tiers Monetize Family Collaboration & Deep Synthesis:** Monetization focuses on high-utility decision tools: multi-device family consensus polling via WhatsApp, comprehensive 14-dimension comparative dossiers, AI-driven astrological alignment, and printable keepsake certificates.

---

## 2. The Three Monetization Tiers

```
+---------------------------------------------------------------------------------------+
|                                    TIER HIERARCHY                                     |
+---------------------------------------------------------------------------------------+
|  [ FREE TIER ]                --> Wide Top-of-Funnel Discovery & Community Trust     |
|  ₹0 / Lifetime                     (Search, 27 Stars, Basic Numerology, SEO Pages)   |
+---------------------------------------------------------------------------------------+
|  [ ₹49 MICRO-PASS ]           --> Single-Family Immediate Decision Pass               |
|  ₹49 One-Time (14 Days)            (Full 14D Unlocked, 1 High-Res Certificate PDF)    |
+---------------------------------------------------------------------------------------+
|  [ ₹499 FAMILY PRO PASS ]     --> Collaborative Family Decision & Heritage Pass       |
|  ₹499 (30 Days Validity)           (WhatsApp Voting Links, AI Advisor, Full Dossiers) |
+---------------------------------------------------------------------------------------+
```

### Tier 1: Free Tier (இலவசப் பதிப்பு — Community Discovery)
* **Price:** ₹0 (Free forever, no credit card or login required for basic search)
* **Target Audience:** Expecting parents in early exploratory stages, casual browsers, students of Tamil literature.
* **Core Value:** Instant access to 20,700+ verified Tamil names with starting-letter filters and birth star syllable matching.
* **Monetization Engine:** Non-intrusive, ethically curated family-care advertisements (DonorConnect, organic baby essentials) and high-volume SEO traffic conversion.

### Tier 2: ₹49 Subscription / Micro-Pass (தனிநபர் வழிகாட்டி — Name Decision Pass)
* **Price:** ₹49 one-time payment (Valid for 14 days)
* **Target Audience:** Parents who have narrowed down their selection to 1–2 specific candidate names and need definitive validation before official birth registration or naming ceremonies (*Thottil ceremony*).
* **Core Value:** Unlocks the full 14-dimension scorecard for any 3 selected names, removes ad banners, unlocks official passport/document fit analysis, and generates one high-resolution, watermark-free naming certificate PDF.

### Tier 3: ₹499 Subscription (குடும்பச் சோலை — Collaborative Family Pro)
* **Price:** ₹499 one-time payment (Valid for 30 days of active family decision-making)
* **Target Audience:** Couples actively coordinating with extended families (grandparents, siblings, in-laws across India and global diaspora) to reach harmonious consensus without conflict.
* **Core Value:** Unlimited AI Name Advisor consultations, side-by-side 5-name comparative dossiers, and **exclusive access to the Interactive WhatsApp Family Voting System**.

---

## 3. Comprehensive Feature Entitlement Matrix

| Feature / Capability | Free Tier (₹0) | ₹49 Micro-Pass (14 Days) | ₹499 Family Pro (30 Days) |
| :--- | :---: | :---: | :---: |
| **Catalog Access (20,700+ Names)** | Unlimited (All 69 shards) | Unlimited | Unlimited |
| **Tamil Starting Letter Filter (`முதல் எழுத்து`)** | Full Access | Full Access | Full Access |
| **27 Nakshatras & 108 Padams Syllable Finder** | Full Access | Full Access | Full Access |
| **Basic Dual Numerology (Pythagorean & Chaldean)** | Yes (Single digit display) | Yes (Letter-by-letter math) | Yes (Letter-by-letter math + parent harmony) |
| **Ancient Literary Citations & Lexicon URLs** | Full Public Access | Full Public Access | Full Public Access |
| **7-Dimension Scorecard Summary** | Overall score (0-100) only | Overall score + 7 dimension badges | Overall score + 7 dimension detailed radar graph |
| **Full 14-Dimension Deep Dive** | Locked (Sample preview of 1) | **Unlocked for up to 3 names** | **Unlimited for all names** |
| **Document Fit & Aadhaar/Passport Assessment** | Preview only | **Full letter/character analysis** | **Full letter/character analysis** |
| **Multilingual Meaning Cross-Check (5 Languages)** | Tamil + English only | All 5 Dravidian & Global languages | All 5 Dravidian & Global languages |
| **Sibling Harmonic Matching Suggestions** | 1 sample suggestion | Up to 5 suggestions | Unlimited suggestions |
| **Family Shortlist Capacity** | Up to 5 names (Local storage) | Up to 25 names (Cloud synced) | Unlimited shortlists + folders |
| **Printable High-Res PDF Dossier** | Watermarked preview | **1 Official Name Certificate** | **Up to 5 Comparative Family Dossiers** |
| **OmniRoute AI Name Advisor Queries** | 2 free trial prompts | 10 deep prompts | **Unlimited AI Advisor consultations** |
| **WhatsApp Family Voting Share Link** | ❌ **Locked** (Demo mode only) | ❌ **Locked** | ✅ **Full Access (Active for 30 Days)** |
| **Live Family Consensus Leaderboard** | Static sample preview | Static sample preview | **Real-time multi-voter live ranking** |
| **Voter Commenting & Sentiment Tracking** | ❌ None | ❌ None | **Full voter sentiment & elder notes** |
| **Ad-Free Experience** | Displays ethical banners | **100% Ad-Free** | **100% Ad-Free** |

---

## 4. Technical Enforcement & Restriction Mechanics

Security, tamper-resistance, and seamless progressive disclosure are vital to ensure paying users get immediate access while preventing bypasses via browser devtools.

```
                              CLIENT REQUEST
                                     |
                                     v
                       +---------------------------+
                       |   Next.js API Middleware  |
                       +---------------------------+
                                     |
              +----------------------+----------------------+
              |                                             |
     [ Public Endpoints ]                          [ Gated Endpoints ]
     - /api/names                                  - /api/advisor
     - /api/suggestions                            - /api/polls/create-shareable
     - /api/nakshatra                              - /api/reports/generate-pdf
              |                                             |
              v                                             v
     Returns Public Payload                     Verify JWT Session Token
     (14D fields redacted                       (`tier: 'family_499'`,
      for unauthenticated)                       validity > Date.now())
                                                            |
                                              +-------------+-------------+
                                              |                           |
                                           [ Valid ]                  [ Invalid ]
                                              |                           |
                                              v                           v
                                      Serve Full Data              HTTP 402 / 403
                                                                   + Upsell Modal
```

### 4.1 Token Structure & Entitlement Claims
User sessions are governed by cryptographically signed JWTs (issued by the Next.js auth handler upon successful webhook receipt from Razorpay, Apple, or Google):

```typescript
export interface UserEntitlementToken {
  userId: string;
  phoneOrEmail: string;
  tier: "free" | "micro_49" | "family_499";
  activatedAt: number;     // Epoch timestamp (ms)
  expiresAt: number;       // Epoch timestamp (ms)
  unlockedSlugs: string[]; // For ₹49 tier: up to 3 name slugs
  pdfGenerationsRemaining: number;
  features: {
    whatsappPolling: boolean;
    aiAdvisorUnlimited: boolean;
    adFree: boolean;
    full14Dimensions: boolean;
  };
  signature: string;       // HMAC-SHA256 signature
}
```

### 4.2 Progressive Disclosure & Visual Blur (Client-Side)
- **14-Dimension Gated Fields:** In [`NamingGuruDashboard.tsx`](../../app/src/components/NamingGuruDashboard.tsx) and `/name/[slug]`, for non-entitled users, dimensions 8–14 (Document Fit, Phonetic False-Friend checks, Sibling Harmony) render with a gentle Tailwind blur:
  ```tsx
  <div className="relative">
    <div className={isUnlocked ? "" : "filter blur-sm select-none pointer-events-none opacity-40"}>
      <DocumentFitDetails data={name.documentFit} />
    </div>
    {!isUnlocked && (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-xl p-4 text-center">
        <span className="text-amber-800 text-lg font-bold">🔒 14-Dimension Deep Dive</span>
        <p className="text-xs text-stone-600 mt-1 max-w-xs">
          Passport fit, phonetic risk, and sibling harmony are unlocked in the ₹49 Decision Pass or ₹499 Family Pro.
        </p>
        <button onClick={() => openCheckoutModal('micro_49')} className="mt-2.5 rounded-xl bg-amber-800 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-amber-900">
          Unlock for ₹49 →
        </button>
      </div>
    )}
  </div>
  ```
- **Crucial Security Rule:** The client never receives full payload data for server-generated reports or AI prompts without entitlement verification. The API strip-filters unearned fields before JSON response serialization.

---

## 5. Spotlight: WhatsApp Family Voting Monetization (₹499 Tier Exclusive)

### 5.1 The High-Value Problem
Parents rarely choose names in isolation. They face conflicting advice:
- Grandparents want traditional Sangam or deity-adjacent classical names.
- Younger parents want crisp, modern, globally portable names.
- In-laws disagree on syllable numerology.
Sharing screenshots over WhatsApp leads to chaotic, unorganized group chats where opinions get lost and arguments brew.

### 5.2 The ₹499 Solution: Interactive Multi-Family Poll
1. **Creation:** The parent selects up to 5 shortlisted names from their dashboard and clicks **"💬 Create WhatsApp Family Voting Link"**.
2. **Entitlement Gate:**
   - If user has an active `family_499` pass: Generates a signed, short voting link: `https://peyarcholai.com/poll/v?id=poll_8f29ab&sig=...`.
   - If user is on `free` or `micro_49`: Opens an interactive demo modal previewing what relatives will see, with a clear one-click upgrade button: *"Unlock WhatsApp Family Voting for 30 Days (₹499)"*.
3. **The WhatsApp Message Template:**
   ```
   ✨ பெயர்ச்சோலை (Peyarcholai) — எங்கள் குடும்பத்தின் செல்லக் குழந்தைக்குப் பெயர் சூட்ட உங்கள் அன்பான வாக்குகளைத் தாருங்கள்!

   நாங்கள் தேர்வு செய்துள்ள 4 அழகிய தமிழ்ப் பெயர்கள்:
   1. கவின் (Kavin) — பேரழகு, கருணை
   2. யாழினி (Yazhini) — இசை ஞானம், இனிமை
   3. இளவேனில் (Ilavenil) — வசந்த காலம்
   4. மாறன் (Maaran) — வீரம், நேர்மை

   👇 உங்கள் விருப்பமான பெயரைத் தேர்ந்தெடுக்க இந்த இணைப்பைச் சொடுக்கவும் (பதிவு செய்யத் தேவையில்லை):
   https://peyarcholai.com/poll/v?id=poll_8f29ab

   வாக்களிக்க கடைசி நாள்: 30 நாட்கள் மட்டுமே!
   ```
4. **Voter Experience (Zero Friction):**
   - Relatives click the link on their mobile phones.
   - **No login, app install, or payment required for voters.**
   - Simple 1-tap card UI showing the Tamil name, meaning, audio pronunciation, and a **"👍 Vote for this Name"** button.
   - Optional 1-sentence blessing/comment field (*"பாட்டி இந்த பெயரை மிகவும் விரும்புகிறேன்"*).
5. **Host Live Consensus Dashboard:**
   - The host parent views the **Live Consensus Leaderboard** updated in real-time.
   - Ranked-choice scoring automatically resolves ties.
   - Generates a **"Family Verdict Summary Card"** to share back to the WhatsApp group.
6. **30-Day Validity & Auto-Archival:**
   - The voting link remains active for exactly 30 calendar days from the moment of purchase (`expiresAt = activatedAt + (30 * 86400 * 1000)`).
   - After day 30, voting closes gracefully. The final leaderboard is permanently preserved as a read-only keepsake PDF for the child's baby book.

---

## 6. Financial Projections & Unit Economics

| Metric | Free Tier (₹0) | ₹49 Micro-Pass | ₹499 Family Pro |
| :--- | :---: | :---: | :---: |
| **Projected Conversion of MAU** | 100% (Baseline) | 3.5% of MAU | 1.2% of MAU |
| **Gross Margin** | ~92% (Ad serving cost only) | 94% (₹46 net per unit) | 91% (₹455 net per unit) |
| **Payment Gateway Fee** | ₹0 | ₹1.10 (Razorpay UPI 2% + GST) | ₹11.20 (Razorpay UPI 2% + GST) |
| **Server/AI Marginal Cost** | ₹0.04 / session | ₹1.80 (PDF generation + storage) | ₹12.50 (OmniRoute AI calls + storage) |
| **Net Contribution per Sale** | Ad CPM (~₹0.40/visit) | **₹46.10** | **₹442.30** |

At a conservative scale of 50,000 MAU:
- Free Tier Ad Revenue: ₹20,000/month
- ₹49 Micro-Pass: $1,750 \times 46.10 = \text{₹80,675/month}$
- ₹499 Family Pro: $600 \times 442.30 = \text{₹2,65,380/month}$
- **Total Monthly Projected Revenue: ~₹3,66,000/month (~₹44 Lakhs/year)** with infrastructure costs remaining under ₹18,000/month.

