# SETU — Team, Ownership, Schedule
**3 people · 30 Sep 2026 · H+0 = 11:00 IST · hard deadline 23:00**

| | |
|---|---|
| **Spec** | `SETU_FINAL.md` — frozen. Do not redesign. |
| **Scope & phases** | `PRD.md` |
| **Hard freeze** | **H+9 = 20:30** — no new code |
| **Submit by** | **H+10.5 = 22:00** — one hour of buffer before 23:00 |

---

## 1. The three roles

| | **P1 — Rules, Data, Scoring** | **P2 — Backend, AI, DevOps** | **P3 — Frontend, Demo** |
|---|---|---|---|
| **Owns** | MPLADS rules · the dataset · the score · the allocator · the deck | the API · the AI calls · the deployment · the repo | every screen · the receipt · the video |
| **Decides alone** | Score weights, eligibility encoding, data fallbacks, claims language in the deck | Endpoint shapes, cache strategy, deploy approach, dependency choices | Layout, interaction, copy in the UI, demo order |
| **Needs a 5-min huddle** | Anything that changes a number on screen | Anything that changes a response shape | Anything that changes what a judge sees first |
| **Needs all three** | Changing the scoring model, changing the framing, cutting a scored theme | — | — |

**Rule: nobody changes a number, a shape, or a claim without saying it out loud in the group
chat.** The receipt's credibility is the whole product; silent drift is how it dies.

---

## 2. Ownership — every item, one owner

| Item | Owner | By |
|---|---|---|
| G1 Antyodaya column verification + evidence file | **P1** | H+1 |
| G2 AC → PC constituency rollup | **P1** | H+1 |
| G5 PMGSY per-village usability | **P1** | H+1 |
| G6 read 2023 prohibited-works annexure | **P1** | H+1 |
| `build_infra_index.py` (the `.dta` converter) | **P2** | H+2 |
| Data contract published (fields, domains, vintages, missingness) | **P1** | H+3 |
| `infra_gap` + `equity` (Antyodaya 2020) | **P1** | H+4 |
| `r` reporting-propensity formula + range assertion | **P1** | H+4 |
| `demand_adj` + `urgency` + weighted sum | **P1** | H+5 |
| Eligibility model with reason codes | **P1** | H+5 |
| Constraint-aware greedy allocator | **P1** | H+6 |
| `benchmarks.csv`, `investment_plans.csv` | **P1** | H+6 |
| `eval.ts` + deck numbers | **P1** | H+8 |
| Pitch deck, claims language, final integration | **P1** | H+9 |
| G0 converter runs end to end | **P2** | H+1 |
| G3a model reachable on our actual key | **P2** | H+0.5 |
| G4 Cloud Run reachable from a phone | **P2** | H+1 |
| zod contracts frozen + `/api/schema` + contract test | **P2** | H+3 |
| `llm/cache.ts` (hash → disk, retry/backoff) | **P2** | H+2 |
| `enrich.ts` taxonomy mapping, 20 rows/call | **P2** | H+4 |
| `/api/ingest`, `/hotspots`, `/alloc`, `/provenance` | **P2** | H+5 |
| `/api/national`, `/api/impact` | **P2** | H+6 |
| Telegram adapter | **P2** | H+7 |
| Cloud Run deploy, Dockerfile, `cloudbuild.yaml` | **P2** | H+7 |
| README, CC-BY licence, public repo, secrets hygiene | **P2** | H+9 |
| Tailwind tokens, screen wireframes, mock data file | **P3** | H+1 |
| Mic capture → `/api/ingest`, live transcript | **P3** | H+3 |
| Location picker (3 dropdowns) | **P3** | H+3 |
| Map + hotspot layer | **P3** | H+5 |
| Works shortlist screen + SC/ST constraint bar | **P3** | H+6 |
| **Evidence receipt screen** (hero) | **P3** | H+7 |
| National table + impact ledger panel | **P3** | H+7 |
| **Demo video, 3–5 min** | **P3** | **H+8** |
| Demo script rehearsal ×3 | **P3** | H+9 |

---

## 3. Schedule

### H+0 to H+1 · 11:00–12:00 — Gates, in parallel

| P1 | P2 | P3 |
|---|---|---|
| **G6 first** (browser, 15 min) — the 2023 prohibited-works annexure. **Then** G1: verify every Antyodaya field in the spec, record non-null / missing % / values. G2, G5. | **G3a immediately** — is `gemini-3.5-transcribe` reachable with quota on our real key? Then G0: get the converter running. G4. | Tailwind tokens. Five screen wireframes. Build `mock.json` with realistic field names from the spec so frontend work never waits. |

**H+1 sync (15 min, all three).** Read G6's output together — one person's reading of a policy
document is a single point of failure. Report G3a, G1, G2, G5. Decide:
- G3a failed → text-only intake, say it on stage
- G1 failed → Census VD fallback, accept the vintage attack
- G6 unresolved → `VERIFIED_2023: false` + banner, **do not encode a blanket maintenance ban**
- Pick the 3 constituencies and 5 languages

### H+1 to H+3 · 12:00–14:00 — Data spine + contract freeze

| P1 | P2 | P3 |
|---|---|---|
| Build the index from converter output: infra, equity, `r` inputs, vintages, missingness flags. | Finish the converter → per-constituency JSON. `llm/cache.ts`. Start `seed_corpus.ts`. | Mic capture against the mock. Location picker. |
| **H+2: publish the data contract.** | **H+3: freeze zod schemas** at `src/shared/schema.ts`, expose `/api/schema`, one contract test. | **H+3: contract test against the mock.** |

**This is the most important handoff in the build.** If the data contract slips, P2 and P3 build
against guesses and pay for it in Phase 4.

### H+3 to H+6 · 14:00–17:00 — The decision

| P1 | P2 | P3 |
|---|---|---|
| `infra_gap`, `equity`, `r`, `demand_adj`, `urgency`, weighted sum. Then the eligibility model. | `enrich.ts`. `/api/ingest`, `/api/hotspots`, `/api/alloc`, `/api/provenance`. | Map, hotspot layer, shortlist screen with the SC/ST constraint bar. |
| **H+5: score produces real numbers from real data.** | **H+5: all four endpoints respond.** | **H+6: shortlist renders with constraints met.** |

**H+6 go/no-go:** if the allocator doesn't satisfy the SC/ST floors, ship without the constraint
bar rather than shipping a wrong one.

### H+6 to H+8 · 17:00–19:00 — Proof

| P1 | P2 | P3 |
|---|---|---|
| `eval.ts` — recovery, equity ablation, `r` range, eligibility, invariance, greedy-vs-exact. Publish the numbers the deck needs. | **Cloud Run deploy + verify from a phone (H+7).** Telegram. `/api/impact`, `/api/national`. README, licence. | **The evidence receipt — hero screen.** National table, impact panel. |
| **H+8: numbers to P1 for the deck.** | **H+7: public URL works on mobile data.** | **H+8: VIDEO RECORDED.** |

**H+8 is a hard gate.** The video is a graded 3–5 minute deliverable, not a backup. If it isn't
shot, nothing else is shippable.

### H+8 to H+10.5 · 19:00–22:00 — Ship

| P1 | P2 | P3 |
|---|---|---|
| Deck, 11 slides, using real eval numbers. Final integration. | Repo public, secrets verified, clean-clone boot test. | Rehearse ×3. Record the fallback capture. |

**H+9 = 20:30 hard freeze. No new code.** Bug fixes only. **H+10.5 = 22:00 submit.**

---

## 4. The bottleneck, named

**P1 carries a serial front-end that blocks two other people.**

G6 and G1 must resolve before `infra_gap` exists. `infra_gap` must exist before the score, the
allocator, the map, and the receipt. That is six dependent items in one column.

**Mitigations, in order of importance:**

1. **P2 took the converter, not P1.** The `.dta` → JSON build is a script, not a judgement call.
   P1 does verification and rules; P2 does the build. Removes the largest serial chunk.
2. **G6 does not block the build.** If it isn't resolved by H+1, ship `VERIFIED_2023: false`
   with a banner. Nobody waits.
3. **The data contract at H+2 unblocks P2 and P3** even if scoring isn't finished.
4. **P1 escalates, not absorbs.** If G1 is incomplete at H+1.5, say so in the group chat.
   Falling behind on the critical path is a team problem, not a personal one.

---

## 5. Escalation rules

| If this happens | Then |
|---|---|
| G3a fails | Voice path is dead. Pivot to text intake, tell P3 immediately so no voice UI is built. Say it on stage. |
| G1 fails for Antyodaya | Census VD 2011 fallback. Label every receipt. Don't hide it. |
| G6 unresolved at H+1 | `VERIFIED_2023: false` + banner. Never encode a blanket maintenance ban. |
| Data contract slips past H+2.5 | P2 and P3 switch to `mock.json`. P1 owes the real one by H+3.5. |
| A phase exit criterion fails | Cut the next phase's Tier 3 in the documented order. **Do not extend the timeline.** |
| Someone wants a feature not in the spec | Ask which of the five differentiators it advances. If none, it waits. |
| A number on screen looks wrong | **Stop and fix it.** A wrong number in a live demo is worse than a missing feature. |
| You are more than 30 min behind | Say so in the group chat, immediately. Not at the next sync. |

---

## 6. Definition of done

**P1**
- [ ] G1 evidence file exists with non-null counts and missing % for every field used
- [ ] `r` range assertion passes and is reported
- [ ] No recommended work is `prohibited`; `human_review` items are routed with a named scheme
- [ ] Every allocation meets the SC/ST floors
- [ ] Eval numbers exist and are in the deck
- [ ] Every claim in the deck is one we can defend, and the unverified ones are labelled

**P2**
- [ ] `npm install && npm start` works on a machine that has never run the code
- [ ] Public URL works from a phone on mobile data
- [ ] No secret in the repo
- [ ] `/api/national` returns real dated state-level figures, no simulated utilisation
- [ ] Every LLM response is cached to disk and re-runs cost nothing

**P3**
- [ ] Every number on screen opens its source row
- [ ] Missing data renders as `DATA_MISSING`, never a bare 0.5
- [ ] Synthetic complaints are labelled in the UI
- [ ] Every receipt shows a vintage for every source used
- [ ] Video recorded, 3–5 min, plays
- [ ] Demo rehearsed three times

---

## 7. Syncs

| When | Who | What |
|---|---|---|
| **H+0.5** | all three, 10 min | G3a result. It changes what P3 builds. |
| **H+1** | all three, 15 min | All gates. Peer-check G6. Constituencies and languages chosen. |
| **H+3** | all three, 15 min | Data contract and API contract frozen. Integration check. |
| **H+6** | all three, 10 min | Go/no-go on the allocator and shortlist. |
| **H+8** | all three, 10 min | **Video check.** Deploy check. |
| **H+9** | all three, 5 min | Freeze. Confirm submission. |

Between syncs: **post progress in the group chat, not in your head.** The whole risk here is one
person silently being 40 minutes behind at H+6.
