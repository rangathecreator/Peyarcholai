# Tamil name catalog (sharded)

10,600 name records, split from the former single `tamil-names-seed.json` (~85 MB) into small files.

| File | Purpose |
| :--- | :--- |
| `index.json` | Manifest: total count and one entry per shard (`file`, `letter`, `count`). The runtime reads this first. |
| `<letter>-NN.json` | Up to 400 records whose Tamil name starts with that letter, sorted by `slug`. Example: `ka-01.json` holds names starting with க. |

## Rules
- Each record is one object with the 14-dimension schema (`TamilNameRecord` in `src/lib/repository.ts`).
- `slug` and `nameTamil` must be unique across **all** shards.
- A record belongs in the shard for the first letter of `nameTamil`. Do not hand-move records between shards.
- Hand edits to a single record are fine (small, reviewable diffs). Keep `index.json` counts in sync, or re-run the split (below).

## Commands (run from `app/`)
| Task | Command |
| :--- | :--- |
| Regenerate the whole catalog (also rewrites shards) | `npm run build:names` |
| Re-shard after hand edits or a monolithic import | `npm run names:split -- path/to/seed.json` |
| Export one merged JSON file | `npm run names:merge -- out.json` |

Shared code: `scripts/lib/name-shards.mjs`. The runtime reader is `readNameShards()` in `src/lib/repository.ts`.

