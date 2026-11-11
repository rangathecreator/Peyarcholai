# NamingGuru Tamil (`app/`) — Web MVP

AI-Curated **Tamil Baby Naming, Natchathiram (Birth Star), Numerology, 7-Dimension Scorecard & Family Poll** web application.

## Quick Start

1. **Ensure OmniRoute AI Gateway is running** on `http://localhost:20128/v1`:
   ```powershell
   curl.exe -s http://localhost:20128/health
   ```
2. **Install dependencies & run tests**:
   ```powershell
   npm install
   npm test
   ```
3. **(Optional) Enrich Tamil Name Seed via OmniRoute**:
   ```powershell
   npm run enrich:names
   ```
4. **Start the Web App** (runs on `http://localhost:3020`):
   ```powershell
   npm run dev
   ```

## Architecture & Design Docs
- Full Planning Index: [`../doc/plan/00-README-Index.md`](../doc/plan/00-README-Index.md)
- Web MVP Technical Design: [`../doc/plan/13-Web-MVP-Implementation-Design.md`](../doc/plan/13-Web-MVP-Implementation-Design.md)
- PostgreSQL Schema (Supabase / Neon): [`src/data/schema.sql`](src/data/schema.sql)
