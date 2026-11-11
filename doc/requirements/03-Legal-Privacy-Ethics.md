# 11 – Legal, Privacy & Ethics

> This is an engineering/product view, **not legal advice**. Budget ₹30–60k for a lawyer review before launch.

## 1. Privacy (DPDP Act 2023 and rules)

| Topic | Policy |
| :-- | :-- |
| Personal data | Birth date/time/place, child’s prospective names, parents’ names, contact (if login) |
| Data minimisation | Birth profile **kept on device by default**; server sync is opt-in |
| Consent | Clear, itemised, in the user’s language, withdrawable; no pre-ticked boxes |
| Children’s data | The app targets parents; a newborn’s birth data is entered by the parent. No child accounts |
| Rights | Access, correction, erasure (≤ 30 days), grievance officer contact |
| Retention | Inactive accounts purged after 24 months; logs 90 days |
| Cross-border | Prefer India region (Mumbai) storage |
| Security | Encryption in transit/at rest; column-level encryption for birth data |
| AI | No birth data or identifiers sent to any LLM; only generic text |
| Analytics | Event-level, pseudonymous, no PII; consent banner on web |

## 2. Content licensing

| Content | Rule |
| :-- | :-- |
| Name strings | Facts; free to collect |
| Meanings/descriptions | Authored by us (human-verified); do not copy from commercial sites |
| Datasets (Kaggle/GitHub) | Record licence per source; use for candidate names only unless licence permits |
| Wikipedia/Wikidata | Honour CC-BY-SA attribution/CC0 |
| Scriptures | Use public-domain originals; avoid copyrighted translations |
| Swiss Ephemeris | AGPL or commercial licence (see doc 03 §3.3) |
| UGC | Contributor licence in ToS; moderation; takedown process |
| Fonts/Audio | Open fonts (OFL Noto); TTS terms checked for commercial use |

## 3. Ethics and sensitivity

| Principle | Rule |
| :-- | :-- |
| Inclusive | All faiths and non-religious families are first-class; no default religion |
| No caste inference | Community tags only from expert/user selection; never auto-derived from names; no caste-based ranking |
| Respect | Religion-sensitive names verified by community experts; deity/holy names flagged where usage guidelines exist |
| Belief neutrality | Numerology/astrology labelled “traditional belief, not scientific fact”; user can hide them |
| Non-harmful predictions | No health, death, or fear-based statements; “tendencies” tone; no “bad name” labels—use “less aligned with the selected system” |
| Gender | Support unisex and gender-neutral names; no stereotyping language |
| Transparency | Show source/citation and verification status on each name |
| Commercial | Clear ad labelling; no paid ranking in organic results |

## 4. Consumer-law notes
* Avoid claims such as “guaranteed success/luck”; follow ASCI guidelines on health/astrology claims.
* Refund policy for premium reports; GST invoices.
* Apple/Google policies: no misleading predictions; disclose that content is for entertainment/cultural guidance.

## 5. Compliance checklist (release gate G5)

- [ ] Privacy policy + terms in EN + HI
- [ ] Consent flows tested (grant/withdraw/delete)
- [ ] Data-source licence register complete (no “unknown” sources in verified set)
- [ ] Swiss Ephemeris decision recorded
- [ ] Disclaimer on numerology/horoscope screens
- [ ] Grievance officer and takedown email live
- [ ] Penetration/ASVS checklist passed


## 6. Social poll – privacy and safety (added from input `doc/04`)

| Topic | Rule |
| :-- | :-- |
| Personal data | Voters’ opinions and optional names, plus family names in the shortlist, are personal data under DPDP; the child may be unborn/newborn |
| Consent | Voter ticks a short consent to store their comments; link page states purpose and retention |
| Visibility | Private by default; public polls only if the parent explicitly chooses; voters never see each other’s comments |
| Minimisation | No login, no phone/email required from voters; optional display label only |
| Retention & deletion | Poll and votes auto-delete N days after close (default 30); parent and voter can request deletion |
| Abuse | Rate limit per link and device/IP, profanity filter, report button, parent can delete any comment |
| Family harm | Parent is the sole decider; no ranking labelled “bad name”; reason categories are neutral; no public shaming features |
| Children’s data | No child name or details are published without the parent’s explicit action |
