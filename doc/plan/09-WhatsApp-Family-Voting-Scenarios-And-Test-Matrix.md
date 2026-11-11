# பெயர்ச்சோலை (Peyarcholai) — WhatsApp Family Voting Scenarios & Test Matrix

**Document ID:** `PLAN-WHATSAPP-09`  
**Location:** `doc/plan/09-WhatsApp-Family-Voting-Scenarios-And-Test-Matrix.md`  
**Status:** Approved Feature Specification  

---

## 1. Feature Architecture & Deep Review

The **WhatsApp Family Voting System** is the flagship collaborative feature exclusive to the **குடும்பச் சோலை (₹499 Family Pro Pass)** with **30-day time validity**.

### The Friction-Free Guarantee:
- **Host Parent:** Must be an authenticated ₹499 subscriber to generate the poll link.
- **Family Voters (Grandparents, In-laws, Friends):** **ZERO login, ZERO app installation, ZERO payment required.** They click the link on their mobile phone, tap their favorite name, and submit in under 10 seconds.

---

## 2. Working Scenarios & User Journeys

```
+---------------------------------------------------------------------------------------+
| SCENARIO 1: Happy Path — Host Generates & Shares Link                                  |
+---------------------------------------------------------------------------------------+
| 1. Parent shortlists 4 names: `கவின்`, `யாழினி`, `இளவேனில்`, `மாறன்`.                 |
| 2. Clicks "💬 Share on WhatsApp" -> Link generated: `peyarcholai.com/poll/v?id=8f29`  |
| 3. WhatsApp opens with prefilled Tamil/English invitation message.                     |
| 4. Parent sends to Family WhatsApp Group ("எங்கள் குடும்பக் குழு").                   |
+---------------------------------------------------------------------------------------+
| SCENARIO 2: Friction-Free Voting by Relatives                                         |
+---------------------------------------------------------------------------------------+
| 1. Grandmother taps WhatsApp link on mobile. Page loads in <800ms.                    |
| 2. Sees simple cards with Tamil name, audio play button for pronunciation, meaning.   |
| 3. Taps "👍 Vote for Yazhini" -> Optional comment: "பாட்டிக்கு இந்த பெயர் பிடித்துள்ளது"|
| 4. Success animation displays: "வாக்கு பதிவானது! நன்றி."                              |
+---------------------------------------------------------------------------------------+
| SCENARIO 3: Live Consensus Leaderboard & Tie-Breaking                                 |
+---------------------------------------------------------------------------------------+
| 1. Host opens Dashboard: Live scores update via WebSockets/polling.                   |
| 2. Yazhini (8 votes), Kavin (8 votes), Ilavenil (3 votes).                            |
| 3. Built-in Borda Count ranked-choice scoring resolves tie by second-preference.      |
| 4. Parent exports "Family Consensus Verdict Card" back to WhatsApp.                  |
+---------------------------------------------------------------------------------------+
| SCENARIO 4: Expiration & Read-Only Archival after 30 Days                             |
+---------------------------------------------------------------------------------------+
| 1. On Day 31: Voter clicks link -> Sees polite notice: "வாக்கெடுப்பு நிறைவுற்றது".     |
| 2. Final leaderboard is preserved permanently as a PDF keepsake for the child.       |
+---------------------------------------------------------------------------------------+
```

---

## 3. Test Matrix & Automated Test Cases

| Test Case ID | Test Category | Preconditions & Inputs | Expected Output / Behavior | Pass Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **TC-WA-01** | **Entitlement Gate** | Free or ₹49 user clicks "Create WhatsApp Poll" | Triggers upgrade modal; blocks API `/api/polls/create-shareable` with `HTTP 403`. | Upgrade modal shown; 0 unauthorized polls. |
| **TC-WA-02** | **Link Generation** | ₹499 user selects 3 names | Returns unique 8-character ID, HMAC signature, and 30-day `expiresAt` timestamp. | `HTTP 200`, valid HTTPS URL generated. |
| **TC-WA-03** | **WhatsApp URI Encoding** | Poll URL generated | Deep link `whatsapp://send?text=...` encodes Tamil glyphs, emojis, and URL safely. | WhatsApp mobile client launches pre-filled text. |
| **TC-WA-04** | **No-Login Voter Access** | Unauthenticated user opens `/poll/v?id=...` | Page renders cleanly without requiring Google/Facebook login or personal information. | Full voter card renders in $< 1\text{s}$. |
| **TC-WA-05** | **Double-Voting Prevention** | Same voter taps button twice | Browser fingerprint / anonymous voter cookie prevents duplicate voting within 24h. | Shows "Your vote is already recorded". |
| **TC-WA-06** | **Real-Time Aggregation** | 5 family members vote simultaneously | Host consensus dashboard increments count without race conditions or locks. | All 5 votes accurately counted in total. |
| **TC-WA-07** | **30-Day Expiry Gate** | Voter clicks poll after 31 days (`now > expiresAt`) | Voting buttons disabled; renders "Voting Concluded — View Final Results". | No new votes accepted after Day 30. |

