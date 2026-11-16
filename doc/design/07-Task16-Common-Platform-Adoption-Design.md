# Design 07 — Task 16: Adopting `E:\project\Apps\common` as the Shared Package

**Status:** Proposed for adoption · **Related:** Task 16 decisions 16A (Java 21), 16B (PostgreSQL), 16C (local monorepo → GitHub Packages); [`COMMON-AUTH-02`](../../../common/doc/Plan/02-User-Authentication-And-Authorization.md)

## 1. Current state of `common` (measured, not assumed)

| Area | Evidence | Reality |
| :-- | :-- | :-- |
| Version control | `E:\project\Apps\common` is **not a git repository** | No history, no tags → cannot publish versions (16C) until fixed |
| TS packages (`@platform/*`, 13) | `src/index.ts` = 26–106 lines each (`auth` 49, `payments` 106, `storage` 39) | Typed skeletons with unit tests (vitest); no I/O, no framework adapters |
| Java modules (`common-*`, 11) | 1–4 `.java` files each (`common-auth`: `SubscriptionTier.java` only) | Build scaffolds; **no JWT/security/user code lifted from DonorConnect yet** |
| Docs | Plan docs exist (`COMMON-AUTH-02` etc.) but reference `@common/auth` / `packages/auth` while code uses `@platform/auth` / `frontend-ts/packages/auth` | Naming drift to fix |
| DonorConnect source to lift | `features/auth/security/{JwtTokenProvider,JwtAuthenticationFilter,CustomUserDetailsService,OAuth2AuthenticationSuccessHandler}.java`, `features/admin/model/UserEntity.java` (`dc_users`), web `AuthContext.tsx`, `LoginPage.tsx` | Mature patterns, but stateless-JWT, DonorConnect-specific roles (`REGISTERED`, geo scopes, karma) |

**Conclusion:** "use the common module" today means *build the first real slice of it* — not import something finished. That is the correct scope for this iteration.

## 2. Architecture decision: two stacks, one contract

KidNamingApp is Next.js/TypeScript on Vercel; DonorConnect is Spring Boot. Forcing KidNamingApp to call a Java service would add a deployment, cold starts and cost for no gain.

| Concern | Java apps (DonorConnect) | TS apps (KidNamingApp) | Shared contract |
| :-- | :-- | :-- | :-- |
| Auth core | `common-auth` (Spring Security, JJWT) | `@platform/auth` (pure TS, Web Crypto) | Same `users`/`user_accounts`/`entitlements` SQL (Flyway-style `V*.sql` in `common/db/`) and the same `SessionClaims`/tier model |
| Tiers | `SubscriptionTier.java` | `SubscriptionTier` TS | Identical enum strings: `free`, `tier_49`, `tier_499` (app maps `suvadi_49`↔`tier_49`, `kudumba_499`↔`tier_499` in one adapter) |
| Session | stateless JWT (HS256) | DB-backed opaque session (Design 06 §3) | `getSession()` returns the same `Session` shape in both |

## 3. First slice to build in `common` (consumed by KidNamingApp)

| Package | New exports (all pure functions, no framework imports) | Consumed by |
| :-- | :-- | :-- |
| `@platform/auth` | `hashToken(s)` (SHA-256 hex), `generateToken(bytes=16)` (base32, CSPRNG), `activeTier(entitlements, now)`, `requireTier(session, tier)` + `AuthError{status,code}`, `resolveResourceRole(session, ownerUserId)`, cookie helpers `buildSessionCookie()` / `parseCookie()` with `__Host-` flags | Polls API, report routes, `/api/me` |
| `@platform/authz` | `can(session, action, resource)` with a small policy table | Guards |
| `@platform/core` | `Result`, `assertNever`, `clamp`, `rateLimit` token-bucket (in-memory interface + store port) | Vote/magic-link throttling |
| `common/db/V1__users_sessions_entitlements.sql` | Schema from Design 06 §4 (users/user_accounts/sessions/entitlements) | KidNamingApp migration + `common-auth` Java entities |

Out of scope this iteration (stay as scaffolds): `payments`, `ads`, `contact`, `i18n`, `seo`, `telemetry`, `metrics`, all Java modules except aligning `SubscriptionTier`.

## 4. Packaging & consumption (16C hybrid, concrete steps)

1. **Fix version control first:** `git init` in `E:\project\Apps\common`, add `.gitignore` (`node_modules`, `dist`, `target`), initial commit, create remote (suggested: `rangathecreator/platform-common`).
2. **Phase 1 – local link:** KidNamingApp `package.json` → `"@platform/auth": "file:../../common/code/frontend-ts/packages/auth"`; `next.config.mjs` adds `transpilePackages: ['@platform/auth','@platform/core','@platform/authz']`. Developer loop: edit common → `npm run build -w @platform/auth` → restart dev.
3. **Phase 2 – publish (before first Vercel deploy that needs it):** GitHub Packages npm registry (`@rangathecreator` scope or rename to match owner), semver tags `auth-v0.2.0`, CI workflow `common/.github/workflows/publish.yml`; KidNamingApp `.npmrc` with `//npm.pkg.github.com/:_authToken=${NPM_TOKEN}` (Vercel env var).
4. **Gate:** Phase 2 is done only when a Vercel build succeeds from a clean clone using the registry alone (no `file:` paths). **Production deploys must not depend on `common` until that gate passes**: the `file:` link is for local/dev only, so any change that makes the deployed app import `@platform/*` is held on `dev` until Phase 2 is complete.

## 5. Quality bar for each common package (Six-Sigma SG-gates)

- ≥ 90% line coverage on new exports; vitest green; `tsc --noEmit` clean; `exports` map with ESM + `types`.
- No Node-only API in packages that run on Vercel Edge (use `crypto.subtle`; Node `crypto` only in an `/node` subpath).
- Public API documented in `common/doc/Plan/02-…` (fix naming drift `@common/auth` → `@platform/auth` in the same PR).
- Changelog + semver; breaking change ⇒ major bump; KidNamingApp pins exact version.

## 6. Risks & mitigations

| Risk | Mitigation |
| :-- | :-- |
| `common` evolves faster than the app | Pin exact versions; one slice at a time; contract tests in common run against KidNamingApp fixtures |
| `file:` link breaks CI | Phase 2 gate above |
| Over-engineering (13 packages) | Only `auth`, `authz`, `core` + SQL in this iteration |
| Java/TS drift | Shared SQL + a JSON-schema for `Session` checked by both test suites (`common/contracts/session.schema.json`) |

## 7. Acceptance criteria

| ID | Assertion |
| :-- | :-- |
| AC-16-01 | `common` is a git repo with initial commit and tag `auth-v0.2.0` |
| AC-16-02 | `npm test -w @platform/auth` passes with ≥ 90% coverage of new exports |
| AC-16-03 | KidNamingApp imports `activeTier`/`requireTier`/`resolveResourceRole` **from `@platform/auth`**, not local copies (grep test) |
| AC-16-04 | `npm run build` in KidNamingApp succeeds with `transpilePackages`; `npm test` 100% |
| AC-16-05 | `common/contracts/session.schema.json` validates sample sessions produced by TS tests |
| AC-16-06 | Docs in `common/doc` use `@platform/*` names consistently |
