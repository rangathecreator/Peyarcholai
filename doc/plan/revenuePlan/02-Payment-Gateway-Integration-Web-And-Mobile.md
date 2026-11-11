# பெயர்ச்சோலை (Peyarcholai) — Payment Gateway Integration Architecture (Web & Mobile)

**Document ID:** `REV-PLAN-02`  
**Location:** `doc/plan/revenuePlan/02-Payment-Gateway-Integration-Web-And-Mobile.md`  
**Status:** Approved Technical Architecture  
**Target Release:** GA v1.1 (Multi-Platform Payment Integration)

---

## 1. Multi-Platform Payment Architecture Overview

பெயர்ச்சோலை (Peyarcholai) operates as a cross-platform progressive digital product (Responsive Web App + React Native / Flutter Android & iOS mobile clients).

To optimize transaction fees and maximize conversion across diverse user segments, payments are routed through platform-native rails:
1. **Web App (Desktop & Mobile Browsers):** Direct UPI, QR, RuPay/Visa/MasterCard, NetBanking, and Wallets via **Razorpay** (or Cashfree fallback) with low domestic MDR (~0% for RuPay UPI, 1.8%–2% for cards/wallets).
2. **Android App (Google Play Store):** **Google Play Billing v6.x** for digital in-app goods, adhering to Google Play policies with 15% tier-1 developer commission.
3. **iOS App (Apple App Store):** **Apple StoreKit 2** with In-App Purchase (IAP) adhering to App Store Review Guidelines with 15% Small Business Program commission.
4. **Unified Entitlement Engine:** A centralized, multi-tenant Postgres / Supabase database syncing entitlements via phone OTP / email across web, Android, and iOS.

```
                           PAYMENT ORCHESTRATION PIPELINE
                           
    [ Web Client ]             [ Android App ]              [ iOS App ]
      (Next.js)                 (React Native)             (StoreKit 2)
          |                            |                         |
          v                            v                         v
     Razorpay SDK             Google Play Billing         Apple In-App Purchase
  (UPI / QR / Cards)           (In-App Products)           (StoreKit API)
          |                            |                         |
          v                            v                         v
   Razorpay Webhook            Google Cloud Pub/Sub       App Store Notifications
  (/api/webhooks/rzp)         (/api/webhooks/play)        (/api/webhooks/apple)
          |                            |                         |
          +----------------------------+-------------------------+
                                       |
                                       v
                    +------------------------------------+
                    |  Centralized Entitlement Service   |
                    |   - Verify cryptographic signatures|
                    |   - Update DB user entitlement     |
                    |   - Issue signed JWT session token |
                    |   - Generate 18% GST Invoice       |
                    +------------------------------------+
                                       |
                                       v
                    [ User Granted Instant Access (Web/App) ]
```

---

## 2. Web Payment Collection (Razorpay Integration)

### 2.1 Prerequisites & Corporate Configuration
Before collecting live payments on the Web, the following operational prerequisites must be established:
1. **Business Entity:** Sole Proprietorship or Private Limited registered in India.
2. **Current Bank Account:** Linked to business PAN with auto-settlement enabled (T+1 day cycle).
3. **GST Registration:** Mandatory for digital services exceeding threshold or interstate supply (SAC Code: `998431` — Online Information & Database Access).
4. **Razorpay Merchant Account (Standard / Custom):**
   - Completed KYC (PAN, Aadhaar of signatory, cancelled business cheque).
   - Activated Payment Modes: UPI Intent, UPI Dynamic QR, NetBanking (50+ banks), Domestic Credit/Debit Cards, EMI.
5. **Required Environment Variables (`.env.production`):**
   ```bash
   # Razorpay Production API Credentials
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx

   # Business GST Profile for Automated Invoicing
   BUSINESS_LEGAL_NAME="Peyarcholai Technologies"
   BUSINESS_GSTIN="33AAAAA0000A1Z5"
   BUSINESS_STATE_CODE="33" # Tamil Nadu
   ```

### 2.2 Payment Flow & Cryptographic Handshake
1. **Step 1: Order Creation (`/api/payments/create-order`)**
   - Client sends requested tier (`micro_49` or `family_499`).
   - Server initializes a Razorpay Order with currency `INR`, amount in paise (₹49 = 4900, ₹499 = 49900), and custom metadata (user ID, phone number).
   ```typescript
   import Razorpay from "razorpay";

   const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID!,
     key_secret: process.env.RAZORPAY_KEY_SECRET!,
   });

   export async function POST(req: Request) {
     const { tier, userId, phone } = await req.json();
     const amountPaise = tier === "family_499" ? 49900 : 4900;

     const order = await razorpay.orders.create({
       amount: amountPaise,
       currency: "INR",
       receipt: `rcpt_${userId}_${Date.now()}`,
       notes: { tier, userId, phone, app: "peyarcholai" },
     });

     return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency });
   }
   ```

2. **Step 2: Client Checkout Modal (Razorpay Standard Checkout)**
   - Client triggers Razorpay modal. On mobile browsers, it auto-detects installed UPI apps (GPay, PhonePe, Paytm, CRED) and launches seamless UPI Intent without requiring VPA manual typing.
   ```javascript
   const options = {
     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
     amount: order.amount,
     currency: order.currency,
     name: "பெயர்ச்சோலை (Peyarcholai)",
     description: tier === "family_499" ? "குடும்பச் சோலை — 30 Days Family Pro Pass" : "தனிநபர் வழிகாட்டி — 14 Days Pass",
     image: "/logo-transparent.png",
     order_id: order.orderId,
     prefill: { contact: userPhone, email: userEmail },
     theme: { color: "#78350f" }, // Mahogany plum theme
     handler: async function (response) {
       await verifyPaymentOnServer(response);
     }
   };
   const rzp = new window.Razorpay(options);
   rzp.open();
   ```

3. **Step 3: Server-Side Signature Verification & Webhook Safety**
   - **Crucial Anti-Tamper Check:** Never trust client-reported success alone.
   - The primary source of truth is the Razorpay Webhook endpoint (`/api/webhooks/razorpay`), authenticated via HMAC-SHA256 signature verification using `RAZORPAY_WEBHOOK_SECRET`.
   - On event `order.paid` or `payment.captured`:
     - Validate signature: `crypto.createHmac("sha256", secret).update(rawBody).digest("hex") === reqHeaderSignature`.
     - Check idempotency: If payment ID already processed, return `200 OK` immediately.
     - Calculate validity: For ₹499, `expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000`.
     - Update user record in database.
     - Dispatch automated WhatsApp confirmation message with invoice link and WhatsApp voting shortlink.

---

## 3. Mobile App Payment Collection (Google Play & Apple IAP)

Because பெயர்ச்சோலை sells access to digital content, AI features, and voting software consumed inside the app, app store guidelines mandate In-App Purchase systems for mobile client distributions.

### 3.1 Google Play Billing (Android)
* **SDK Version:** Google Play Billing Library v6.1+
* **Product Catalog Configuration (Play Console):**
  - **Product 1 (₹49 Tier):** Managed In-App Product (Non-consumable): `inapp_micro_49_pass` (Title: *14-Day Naming Decision Pass*, Base Price: ₹49).
  - **Product 2 (₹499 Tier):** In-App Product (Non-consumable / 30-Day Period): `inapp_family_499_pro` (Title: *30-Day Family Pro & WhatsApp Voting Pass*, Base Price: ₹499).
* **Server Verification Architecture:**
  1. App calls Google Play Billing purchase flow.
  2. Google Play returns `purchaseToken` and `orderId`.
  3. App sends `purchaseToken`, `productId`, and `packageName` to `/api/payments/verify-google-play`.
  4. Server calls Google Android Publisher API (`androidpublisher.purchases.products.get`) using service account OAuth credentials.
  5. Real-Time Developer Notifications (RTDN): A standing Google Cloud Pub/Sub subscription forwards refund, void, and subscription status events to `/api/webhooks/google-play`.

### 3.2 Apple In-App Purchase (iOS / App Store)
* **Framework:** StoreKit 2 (iOS 15+)
* **Product Catalog Configuration (App Store Connect):**
  - **Product 1 (₹49 Tier):** Non-Consumable IAP: `com.peyarcholai.micro49` (Tier 1: ₹49).
  - **Product 2 (₹499 Tier):** Non-Renewing Subscription / Non-Consumable: `com.peyarcholai.family499` (Tier 5: ₹499).
* **Server Verification Architecture:**
  1. StoreKit 2 produces signed JWS (JSON Web Signature) transaction receipt upon user Face ID / Touch ID confirmation.
  2. Client submits JWS payload to `/api/payments/verify-apple-iap`.
  3. Server decodes and verifies cryptographic signature against Apple Root CA.
  4. App Store Server Notifications v2 webhook handles refunds and family sharing changes.

### 3.3 Store Fee Differential & Strategic Parity
- **Apple / Google Store Cut:** 15% under Apple Small Business Program and Google Play 15% tier-1 rate for the first \$1M USD annual revenue.
- **Net Realization Comparison:**
  - **Web (UPI via Razorpay):** ₹499 $\rightarrow$ **₹489.02 net** (~2% gateway fee).
  - **Mobile In-App Purchase:** ₹499 $\rightarrow$ **₹424.15 net** (15% platform commission).
- **Parity Policy:** We maintain price parity (₹49 and ₹499) across all platforms for consumer trust and compliance with Google/Apple anti-steering policies.

---

## 4. Cross-Platform Entitlement Synchronization

Users often discover names on mobile web via WhatsApp, but want to continue on laptop or native mobile app.

```
+-------------------------------------------------------------------------------+
|                       CROSS-PLATFORM SYNC WORKFLOW                            |
+-------------------------------------------------------------------------------+
| 1. User logs in with Phone Number via 6-digit OTP (Web or App).               |
| 2. Backend queries `user_entitlements` table by verified E.164 phone number.  |
| 3. If a valid, non-expired purchase exists from any channel (Razorpay, Google |
|    Play, or Apple App Store), all entitlements are instantly loaded.          |
| 4. User can create WhatsApp polls on Web and manage them from Mobile App.     |
+-------------------------------------------------------------------------------+
```

### Database Schema for Entitlements (`user_entitlements`)

```sql
CREATE TABLE user_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    tier VARCHAR(30) NOT NULL CHECK (tier IN ('free', 'micro_49', 'family_499')),
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('web_razorpay', 'google_play', 'apple_iap', 'admin_comp')),
    external_order_id VARCHAR(255) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'captured',
    amount_inr NUMERIC(10, 2) NOT NULL,
    tax_amount_inr NUMERIC(10, 2) NOT NULL,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    unlocked_slugs TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_entitlements_phone ON user_entitlements(phone);
CREATE INDEX idx_user_entitlements_active ON user_entitlements(user_id, is_active, expires_at);
```

---

## 5. Tax, GST & Automated Invoicing Requirements

1. **GST Compliance (18% Digital Service):**
   - Base Price (₹49 Tier): ₹41.53 + 18% GST (₹7.47) = **₹49.00**.
   - Base Price (₹499 Tier): ₹422.88 + 18% GST (₹76.12) = **₹499.00**.
   - Tax Breakdown: Intra-state (Tamil Nadu) = 9% CGST + 9% SGST. Inter-state = 18% IGST.
2. **Automated Invoice Delivery:**
   - On successful webhook capture, a PDF invoice (`INV-2026-XXXX`) is automatically generated via standard HTML-to-PDF microservice.
   - Includes business legal details, SAC 998431, customer phone/email, and QR verification stamp.
   - Sent automatically to customer email and via WhatsApp receipt notification.

