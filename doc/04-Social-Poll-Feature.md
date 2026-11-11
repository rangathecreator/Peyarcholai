# 04 – Social Poll: "Vote Out a Name" Feature

## Concept
Parents shortlist up to 10 names and publish them as a poll. Relatives and friends do **not** just vote; they pick the names they would **remove** and give a reason. Parents read the reasons and make the final decision. The parent is always the decider, which avoids family-pressure outcomes.

## User flow
1. Parent creates a shortlist (max 10) with optional notes (meaning, numerology).
2. App generates a private share link plus a WhatsApp-ready card (WhatsApp is the main channel in India; also support Instagram/Facebook share).
3. Voter opens link (no app install needed, web view) and:
   - marks names to **remove** (and optionally ones they love),
   - picks a reason category and/or writes a comment.
4. Parent dashboard shows per name: remove count, love count, reasons grouped by category, comments.
5. Parent marks the final name(s); optional announcement card to share.

## Reason categories (structured, so reasons can be aggregated)
- Hard to pronounce
- Easy to misspell
- Unfortunate meaning in some language
- Too common / too rare
- Family clash (similar to a relative's name)
- Numerology / astrology concern
- Nickname risk (teasing)
- Personal dislike
- Other (free text)

## Design decisions
| Topic | Recommendation |
|---|---|
| Voter identity | Optional name; default **anonymous-but-invited** via unique link to reduce spam |
| Visibility | Poll is private by default; parent chooses who sees comments |
| Anonymity vs. politeness | Show anonymous reasons to parent only; voters see no one else's comments (prevents pile-ons) |
| Moderation | Profanity filter on comments; parent can delete any comment |
| Poll lifetime | Auto-close after N days (default 7) |
| Abuse | Rate limit per link, max votes per device/IP, report button |
| Languages | Comments in any language; show original and optional auto-translation |

## Insights shown to the parent
- "Most removed" ranking with reason mix.
- Auto-detected flags, e.g. 3+ voters said "unfortunate meaning" → run the name through the evaluation engine and highlight.
- Voter segments (family vs friends), if voters tag themselves.

## Feasibility
- **Technically low-medium**: standard CRUD, link sharing, aggregation. No heavy data needs.
- **Growth value high**: every poll invites 10–50 new people to the app/web, a built-in viral loop.
- **Risks**: family conflict from comments, privacy of children's information (see below), spam.

## Privacy & compliance notes
- The poll covers a child who may be unborn/newborn, but data is about family members' opinions and names; treat as personal data.
- India's Digital Personal Data Protection Act, 2023 applies. Collect only what is needed, obtain consent from voters for storing their comments, allow deletion, and set retention limits. Get legal review before launch; this document is not legal advice.
- Never publish a poll publicly unless the parent explicitly chooses to.

## Metrics
- Polls created per active parent, avg voters per poll, comment rate, % of polls that end with a "final name" selected, invite-to-install conversion.
