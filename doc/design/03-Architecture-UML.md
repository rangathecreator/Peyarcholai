# 05 – Architecture & UML

## 1. Architecture decisions (ADR summary)

| ADR | Decision | Alternatives | Why |
| :-- | :-- | :-- | :-- |
| ADR-01 | **Monorepo (pnpm + Turborepo), TypeScript end-to-end** | Polyglot (Flutter + Python) | One shared core (numerology/nakshatra) for web, mobile, server; AI agents work well with a single language |
| ADR-02 | **Mobile: Expo / React Native** | Flutter, native | Shares TS core; OTA updates (EAS Update) cut store-release friction; one team |
| ADR-03 | **Web: Next.js (SSG/ISR) + PWA** | SPA | SEO for 150k name pages; fast on low-end phones |
| ADR-04 | **Backend: NestJS modular monolith** | Microservices | Small team, low cost; modules can be split later |
| ADR-05 | **DB: PostgreSQL** (+`pg_trgm`, FTS, `pgvector`) | Mongo, Elastic | Relational taxonomy, one engine for search; cheapest |
| ADR-06 | **Offline-first: SQLite snapshot on device** | Always online | India connectivity; near-zero server load for browsing |
| ADR-07 | **Numerology + nakshatra computed on device** | Server API | Zero latency, zero cost, privacy for birth data |
| ADR-08 | **AI via OmniRoute gateway** (OpenAI-compatible) | Direct vendor SDKs | Provider fallback, free-tier pooling, no vendor lock-in |
| ADR-09 | **Auth: Firebase Auth / Supabase Auth (phone OTP + Google)** | Custom | Phone OTP is the norm in India; login optional (guest mode) |
| ADR-10 | **Hosting: Cloud Run (asia-south1) or Fly.io Mumbai + Cloudflare** | VMs, k8s | Scale-to-zero, free tier |

## 2. System context

```mermaid
flowchart TB
    subgraph Users
        P[Parents / Families]
        C[Curators & Experts]
    end
    subgraph NamingGuru Platform
        M[Mobile App<br/>Android / iOS]
        W[Web / PWA]
        API[API Gateway + NestJS]
        ADM[Admin Console]
    end
    subgraph External
        PK[Prokerala API<br/>optional]
        OR[OmniRoute AI Gateway]
        LLM[LLM providers<br/>free + paid fallback]
        FCM[Firebase FCM / Analytics]
        PAY[Razorpay<br/>v1.x payments]
        GT[Google Trends / media signals]
    end
    P --> M
    P --> W
    C --> ADM
    M --> API
    W --> API
    ADM --> API
    API --> PK
    API --> OR
    OR --> LLM
    API --> FCM
    API --> PAY
    API --> GT
```

## 3. Container / component view

```mermaid
flowchart LR
    subgraph Client["Client (Expo RN / Next.js)"]
        UI[UI Layer]
        CORE["@namingguru/core<br/>numerology + nakshatra"]
        SQL[(SQLite snapshot)]
        UI --> CORE
        UI --> SQL
    end

    subgraph Server["Backend (NestJS modular monolith)"]
        AUTH[Auth module]
        NAMES[Names module<br/>search, filter, detail]
        SHORT[Shortlist & share module]
        CONTENT[Predictions content module]
        INGEST[Ingestion & curation module]
        AI[AI module<br/>RAG + enrichment jobs]
        REPORT[Report/PDF module]
        QUEUE[[Job queue<br/>pg-boss / BullMQ]]
    end

    DB[(PostgreSQL<br/>+pg_trgm +pgvector)]
    OBJ[(Object storage<br/>audio, PDFs, snapshots)]
    CDN[Cloudflare CDN]

    Client -->|HTTPS REST/JSON| CDN --> Server
    NAMES --> DB
    SHORT --> DB
    CONTENT --> DB
    INGEST --> DB
    INGEST --> QUEUE
    AI --> QUEUE
    AI --> OR2[OmniRoute]
    REPORT --> OBJ
    AUTH --> DB
    SQL -. weekly delta .-> OBJ
```

## 4. Sequence – name discovery with horoscope

```mermaid
sequenceDiagram
    actor Parent
    participant App as Mobile App
    participant Core as core lib (on device)
    participant DB as SQLite snapshot
    participant API as Backend API
    Parent->>App: Enter DOB, TOB, place + filters
    App->>Core: nakshatra(birth)
    Core-->>App: nakshatra, pada, syllables
    App->>DB: query(filters + syllables)
    DB-->>App: ranked names (offline)
    App->>Core: numerology(name) for each candidate
    Core-->>App: numbers + compatibility
    App-->>Parent: list with scores
    opt Online & user opens detail
        App->>API: GET /names/{id} (meaning, audio, trend)
        API-->>App: enriched record
    end
    Parent->>App: Add to shortlist
    App->>API: POST /shortlists (if signed in) else local only
```

## 5. Sequence – AI enrichment & verification pipeline

```mermaid
sequenceDiagram
    participant Cur as Curator
    participant ING as Ingestion module
    participant Q as Job queue
    participant AI as AI module
    participant OR as OmniRoute
    participant DB as PostgreSQL
    participant Exp as Expert reviewer
    Cur->>ING: Upload source batch (CSV/JSON/URL)
    ING->>DB: store raw + provenance
    ING->>Q: enqueue normalise + dedupe
    Q->>AI: classify + draft meaning (batch of 50)
    AI->>OR: chat/completions model=auto/best-free (JSON schema)
    OR-->>AI: structured result + confidence (fallback handled by gateway)
    AI->>DB: save draft (status=candidate)
    AI->>Exp: push to review queue (if low confidence / sensitive)
    Exp->>DB: approve / edit / reject
    DB-->>Cur: publish release names-YYYY.MM.N
```

## 6. Domain class diagram

```mermaid
classDiagram
    class Name {
        +UUID id
        +string canonicalLatin
        +Gender gender
        +Status status
        +int easeScore
        +TrendClass trend
        +scripts() NameScript[]
        +meanings() NameMeaning[]
    }
    class NameScript { +string script +string text +string ipa }
    class NameMeaning { +string lang +string text +string citation }
    class Source { +string title +string licence +TrustTier tier }
    class Taxonomy { <<abstract>> +string code +string label }
    class Religion
    class Language
    class Community
    class State
    class Theme
    class User { +UUID id +string locale +bool consent }
    class BirthProfile { +Date dob +Time tob +string place +string nakshatra +int pada }
    class Shortlist { +string title +add(Name) +remove(Name) +share() }
    class ReviewTask { +State state +assign(Curator) +approve() +reject(reason) }
    Name "1" *-- "many" NameScript
    Name "1" *-- "many" NameMeaning
    Name "many" o-- "many" Source
    Name "many" o-- "many" Taxonomy
    Taxonomy <|-- Religion
    Taxonomy <|-- Language
    Taxonomy <|-- Community
    Taxonomy <|-- State
    Taxonomy <|-- Theme
    User "1" o-- "0..1" BirthProfile
    User "1" o-- "many" Shortlist
    Shortlist "many" o-- "many" Name
    ReviewTask "many" --> "1" Name
```

## 7. State diagram – name record lifecycle

```mermaid
stateDiagram-v2
    [*] --> Candidate: ingested
    Candidate --> Enriched: AI classify + draft
    Enriched --> AutoAccepted: >=2 sources + conf>=0.9 + not sensitive
    Enriched --> InReview: low confidence / sensitive
    InReview --> Reviewed: expert edits
    InReview --> Rejected: invalid / offensive / duplicate
    AutoAccepted --> Verified: 5% audit passed
    Reviewed --> Verified: second check on sensitive
    Verified --> Flagged: user report
    Flagged --> InReview: triage
    Flagged --> Verified: report dismissed
    Rejected --> [*]
    Verified --> Retired: obsolete / merged
    Retired --> [*]
```

## 8. Deployment view

```mermaid
flowchart TB
    subgraph Internet
        U[Users]
    end
    subgraph Cloudflare
        DNS[DNS + WAF]
        CDN[CDN cache<br/>name pages, snapshot]
    end
    subgraph "GCP asia-south1 (Mumbai)"
        CR[Cloud Run<br/>NestJS API]
        WEB[Cloud Run / Vercel<br/>Next.js]
        JOB[Cloud Run Job<br/>ingestion/enrichment]
        PG[(Cloud SQL / Supabase<br/>PostgreSQL)]
        GCS[(Cloud Storage<br/>R2 alternative)]
        SEC[Secret Manager]
    end
    subgraph "Dev workstation / small VM"
        OMNI[OmniRoute :20128]
    end
    subgraph Stores
        GP[Google Play]
        AS[App Store]
        EAS[Expo EAS OTA]
    end
    U --> DNS --> CDN --> WEB
    CDN --> CR
    CR --> PG
    CR --> GCS
    JOB --> PG
    JOB --> OMNI
    CR --> SEC
    GP --> U
    AS --> U
    EAS --> U
```

## 9. API surface (v1 excerpt)

| Method | Path | Purpose |
| :-- | :-- | :-- |
| GET | `/v1/names?religion=&language=&state=&gender=&trend=&ease_min=&letter=&q=&nakshatra=&numerology=` | Filtered search |
| GET | `/v1/names/{id}` | Detail |
| GET | `/v1/snapshots/latest` | Offline DB manifest + signed URL |
| POST | `/v1/shortlists` · GET `/v1/shortlists/{id}` | Shortlist & share |
| POST | `/v1/suggestions` | UGC suggestion / error report |
| POST | `/v1/assistant/query` | RAG assistant (rate-limited) |
| POST | `/v1/admin/ingest` · `/v1/admin/review/{id}` | Curator workflows (RBAC) |

## 10. Cross-cutting concerns

| Concern | Approach |
| :-- | :-- |
| Security | JWT sessions, RBAC (user/curator/expert/admin), rate limiting, WAF, secrets in manager, dependency scanning |
| Observability | OpenTelemetry → Grafana Cloud free / Sentry; SLO dashboards (SS-07) |
| Config & feature flags | Remote config (Firebase) for rolling out regions/languages |
| i18n | ICU messages; Indic fonts bundled (Noto) for consistent rendering |
| Resilience | Offline-first client, CDN cache, retry/backoff, AI fallbacks via OmniRoute |


## 11. Social poll module (“vote out a name”)

Added from the earlier study (`doc/04-Social-Poll-Feature.md`). A new **Poll module** in the NestJS monolith; the voter experience is a lightweight public web page (no install, no login) reached by an unguessable token link, which also acts as the app’s viral loop.

```mermaid
sequenceDiagram
    actor Parent
    actor Voter as Relative / Friend
    participant App as Parent app/web
    participant API as Poll module
    participant DB as PostgreSQL
    participant Eval as Evaluation engine
    Parent->>App: Select up to 10 names, add notes
    App->>API: POST /v1/polls (shortlist, closes_at=+7d)
    API->>DB: create poll + token
    API-->>App: private link + WhatsApp card
    Parent->>Voter: Share link (WhatsApp / Instagram / Facebook)
    Voter->>API: GET /p/{token} (web view, no install)
    Voter->>API: POST /p/{token}/votes (remove/love + reason + comment + consent)
    API->>API: rate-limit per link/device, profanity filter
    API->>DB: store vote items
    Parent->>API: GET /v1/polls/{id}/results
    API->>DB: aggregate removes, loves, reasons
    opt 3+ voters flag "unfortunate meaning"
        API->>Eval: re-check meaning of that name
        Eval-->>API: flags
    end
    API-->>Parent: ranked "most removed" + reason mix + comments
    Parent->>API: mark final name(s), close poll
```

Design rules (input doc 04): private by default; voters never see other comments; parent can delete comments; auto-close after N days; report button; deletion on request; retention limit. Privacy treatment in [doc 11 §6](11-Legal-Privacy-Ethics.md).

| Method | Path | Purpose |
| :-- | :-- | :-- |
| POST | `/v1/polls` | Create poll from shortlist |
| GET | `/p/{token}` | Public voter page (SSR, minimal data) |
| POST | `/p/{token}/votes` | Submit votes (rate-limited, consent flag) |
| GET | `/v1/polls/{id}/results` | Aggregated results (owner only) |
| DELETE | `/v1/polls/{id}/comments/{cid}` | Owner removes a comment |

Metrics: polls per active parent, voters per poll, comment rate, % polls ending with a final name, invite-to-install conversion.
