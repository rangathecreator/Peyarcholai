# பெயர்ச்சோலை (Peyarcholai) — Paid User PDF Dossier Generation Specification

**Document ID:** `PLAN-PDF-08`  
**Location:** `doc/plan/08-Paid-PDF-Dossier-Report-Specification.md`  
**Status:** Approved Feature Specification  

---

## 1. Product Requirements & Visual Dossier Design

For paid subscribers (both the **சுவடி நிலை - ₹49** single-name decision pass and the **குடும்பச் சோலை - ₹499** family pass), parents need a tangible, beautifully designed document that can be:
- Printed and framed as a keepsake for the child's naming ceremony (*தொட்டில் விழா* / *பெயர் சூட்டு விழா*).
- Shared digitally with grandparents and elders to demonstrate authentic literary pedigree.
- Retained for the child's baby memory book.

### Document Specifications:
- **Dimensions:** High-Resolution A4 Portrait ($2480 \times 3508$ pixels at 300 DPI).
- **Aesthetic:** Traditional Tamil royal manuscript theme (deep maroon and warm gold ornamental borders, Tamil calligraphy header, celestial star cradle emblem).
- **Watermarking Policy:**
  - **Free Tier:** Sample preview with diagonal "பெயர்ச்சோலை மாதிரி (Peyarcholai Preview Sample)" watermark.
  - **Paid Tiers (₹49 and ₹499):** Pristine, watermark-free, museum-quality vector rendering with official verification seal.

---

## 2. Dossier Sections & Content Layout

```
+---------------------------------------------------------------------------------+
| [ Ornamental Gold Floral Border ]                                               |
|                                                                                 |
|                        பெயர்ச்சோலை (PEYARCHOLAI)                                |
|                  தூய தமிழ்ப் பெயர் ஆய்வுச் சான்றிதழ்                             |
|                                                                                 |
|                                  கவின்                                          |
|                                (KAVIN)                                          |
|                                                                                 |
| 1. நேரடி வேர்ச்சொல் பொருள் (Literal Root Meaning): அழகு, கருணை, மாண்பு         |
| 2. கவிதை வழிப்பொருள் (Derived Poetic Meaning): பேரழகு மற்றும் கருணை நிறைந்த பண்பு |
|                                                                                 |
| [ SECTION A: இலக்கியச் சான்று & வேர்ச்சொல் ]                                     |
| - பழந்தமிழ் இலக்கியம்: கலித்தொகை (Kalithogai, Verse 56)                         |
| - சென்னைப் பல்கலைக்கழகப் பேரகராதி பதிவு: DSAL Headword Reference #ta-00412       |
| - தொல்காப்பியப் புணர்ச்சி விதி: தனிக்குறில் முன் ஒற்று இரட்டித்தல்                 |
|                                                                                 |
| [ SECTION B: வானியல் & எண் கணிதப் பொருத்தம் ]                                  |
| - பிறப்பு நட்சத்திரம்: அசுவினி (Ashwini) · பாதம்: 1                             |
| - இராசி: மேஷம் (Aries) · ஆட்சி கிரகம்: செவ்வாய் (Mars)                           |
| - பித்தகோரியன் எண் கணிதம்: 5 (சுக்கிரன் / புதன் அதிர்வு)                        |
| - சால்டியன் எண் கணிதம்: 6 (அதிர்ஷ்டச் சேர்க்கை)                                  |
|                                                                                 |
| [ SECTION C: நடைமுறைப் பயன் & ஆவணப் பொருத்தம் ]                                 |
| - பாஸ்போர்ட் / ஆதார் ஆவணப் பொருத்தம்: K. Kavin (3 தமிழ் எழுத்துக்கள்)           |
| - உச்சரிப்பு எளிமை: 96/100 (Native Tamil: 99% · Pan-India: 95% · Global: 92%)    |
| - எழுத்துப் பிழை அபாயம்: குறைவு (Low Risk)                                      |
| - மக்கள் பயன்பாட்டுத் தனித்துவம்: 99.2th Percentile (💎 தனித்துவப் பொக்கிஷம்)       |
| - பிற மொழி ஆய்வு: மலையாளம், தெலுங்கு, கன்னடம், இந்தி, ஆங்கிலத்தில் தூய பொருள்    |
|                                                                                 |
| [ Official Cryptographic Verification Seal & Date Stamp ]                       |
+---------------------------------------------------------------------------------+
```

---

## 3. Technical Generation Pipeline

1. **Rendering Engine:** Headless Chromium (`puppeteer-core` / `@sparticuz/chromium` on AWS Lambda/Vercel) converting pre-styled HTML/Tailwind templates to PDF.
2. **Endpoint:** `GET /api/reports/download-pdf?slug=kavin&token=JWT`
3. **Entitlement Guard:** Validates session JWT (`tier === 'tier_49' || tier === 'tier_499'`).
4. **Streaming:** Streams `application/pdf` with `Content-Disposition: attachment; filename="Peyarcholai-Kavin-Dossier.pdf"`.

