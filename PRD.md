# SETU — Product Requirements
**Track 1 · AI for Digital Public Infrastructure & Governance · BRICS Theme: Innovation**

| | |
|---|---|
| **Deadline** | **30 Sep 2026, 23:00 IST** — hard. Submit by 22:00, one hour of buffer. |
| **Build ends** | H+9.5 = 21:30. **H+9 = 20:30 hard freeze.** No new code after that. |
| **H+0** | 11:00 IST, 30 Sep 2026 |
| **Spec** | `SETU_FINAL.md` is the frozen technical contract. This document is *what and when*. |
| **Team** | `TEAM.md` — 3 people, ownership, hour-by-hour |
| **Status** | Ready to build. Stop redesigning. |

---

## 1. Problem, user, decision

**Problem.** Governments cannot answer three questions: what are people actually asking for
(requests live in fragmented systems, mostly local-language, often voice); where is the gap
real (national priorities are set against aggregate indices, so a citizen with no all-weather
road for 6 km is invisible); and did we spend well (no loop, no measurement).

**User.** A Member of Parliament allocating ₹5 crore of MPLADS funds each year.

**The decision we demonstrate.** Which works, in which villages, at what cost, ranked by
evidence — subject to the SC/ST floors, the prohibited-works list, and the scheme's convergence
rules. Every constraint on it is public and citable.

**The national claim.** The same evidence rolls up. A national table shows where infrastructure
need is highest, with published state-level utilisation and sanction-time data alongside.
MP-as-demo, national-as-claim. **The deck must never read as "we narrowed the brief."**

---

## 2. What we ship

A multilingual citizen-intake platform (voice, text, Telegram) joining citizen demand to
village-level infrastructure evidence, producing a constraint-aware works shortlist for a ₹
budget, where every number traces to raw complaints and raw data rows with its data vintage
shown, plus an impact ledger tracking whether demand fell and how fast recommendations were
sanctioned.

**Five differentiators, in priority order if we are short on time:**

1. **Real data, real join.** Infrastructure and deprivation evidence from Mission Antyodaya
   2020 on one key at one vintage, joined to live citizen demand. Survives "how do you know
   this isn't made up?"
2. **Money, not sentiment.** "People want roads" is a chart. "₹4.2 Cr, 12,400 beneficiaries,
   3 years, unlocks SDG 6.1" is a decision.
3. **Provenance on every number.** Expand any recommendation to the raw complaints in their
   original language plus the exact data rows and the exact calculation.
4. **Reporting-bias correction.** Poorest villages have the lowest literacy and phone access,
   so raw complaint counts undercount them. We correct for it and prove the correction works.
5. **Live policy experiment.** The equity weight is an input. A judge moves it to zero and the
   shortlist changes. That choice is theirs, not ours.

---

## 3. Scope tiers and kill rules

**Every cut below has a written reason. Do not relitigate during the build.**

| Tier | Contents | Rule |
|---|---|---|
| **1 — must ship** | Voice + text intake → normalise → location picker → score → constrained allocation → **evidence receipt with vintages** → weight input → **deployed link + video + deck + repo** | If Tier 1 isn't done, nothing else matters. Cut inside Tier 1 in this order: weight sliders → single numeric input; location picker → three dropdowns; memo → already cut; then drop a scored theme (§3.1) |
| **2 — clause-bearing, downgrade before deleting** | Telegram adapter · impact ledger (static panel is fine) · national table (static table is fine) | Each answers an explicit statement clause. Downgrade, never delete |
| **3 — cut freely, no discussion** | LLM memo · EN/HI UI toggle · extra languages beyond 5 · animations · charts beyond the national table | Cut without asking |

### 3.1 Theme cut order if we fall behind

**Scored themes, in the order to sacrifice:** `education_access` → `electricity_energy` →
`roads_connectivity`. Never sacrifice `drinking_water` — it is the demo's opening and the
only theme with strong Census fallback data.

Unscored themes (`maternal_child_health`, `livelihood_employment`, `housing_tenure`,
`disaster_resilience`, `digital_connectivity`, `other`) are still classified and their demand
displayed, but carry **no infrastructure score and no ranked works.** The UI says so. **Do not
invent a gap formula to fill them.**

---

## 4. Phases

Each phase has an exit criterion. **A failing exit criterion at its deadline means we cut into
the next phase's Tier 3 — we do not extend the timeline.**

### Phase 0 — Gates · H+0 to H+1 · 11:00–12:00
**Entry:** none. **Exit:** every gate has a recorded answer.

| Gate | Question | Owner |
|---|---|---|
| G0 | Does the `.dta` converter run and produce the demo files? | P2 |
| G1 | Do the Antyodaya fields in `SETU_FINAL.md` §5.2 exist and hold data? Record non-null, missing %, values | P1 |
| G2 | Can assembly constituencies roll up to Lok Sabha constituencies? | P1 |
| G3a | **Is `gemini-3.5-transcribe` reachable with quota on our actual free-tier key?** | P2 |
| G4 | Is Cloud Run reachable from a phone on mobile data? | P2 |
| G5 | Is PMGSY status usable per village? | P1 |
| G6 | **What do the 2023 prohibited-works rules actually say about repair and maintenance?** | P1 |

**Go/no-go at H+1:**
- **G3a fails** → voice path is dead. Pivot to browser text intake, and say so on stage. Do not
  ship a voice UI that cannot transcribe.
- **G1 fails for Antyodaya** → fall back to Census VD 2011 for infra and equity, and accept the
  vintage criticism. Label everything.
- **G6 unresolved** → ship the eligibility table with `VERIFIED_2023: false` and a UI banner.
  Do not encode a blanket maintenance ban. **Do not block the build.**
- **G2 fails** → static AC→PC mapping table.

### Phase 1 — Data spine + contract · H+1 to H+3 · 12:00–14:00
**Exit:** the data contract is published and the API contract is frozen.

- `build_infra_index.py` produces per-constituency JSON: infra fields, equity fields, `r`
  inputs, vintages, missingness flags
- **Data contract published** (field names, value domains, vintages, missing %) — this is what
  unblocks P2 and P3
- zod schemas frozen at `src/shared/schema.ts`, exposed at `/api/schema`, one contract test
- `llm/cache.ts` — hash → disk JSONL, retry/backoff for free tier
- `seed_corpus.ts` — independent generation, 5 languages, 15% noise floor, `latent_demand`
  held back for eval

**Go/no-go at H+3:** if the data contract isn't published, P2 and P3 build against a hand-written
mock and the integration debt is paid later. **This is the most important handoff in the build.**

### Phase 2 — The decision · H+3 to H+6 · 14:00–17:00
**Exit:** a real allocation comes back from real data, with the eligibility filter applied.

- `scoring/`: `infra_gap`, `equity`, `r`, `demand_adj`, `urgency`, weighted sum
- Eligibility model with reason codes (§4 of the spec)
- Constraint-aware greedy allocator: SC/ST floors, soft flags, unallocated figure
- `enrich.ts` — taxonomy mapping, 20 rows/call
- `/api/ingest`, `/api/hotspots`, `/api/alloc`, `/api/provenance`
- Frontend: map, hotspot layer, shortlist screen with constraint bar

**Go/no-go at H+6:** if the allocator doesn't satisfy the SC/ST floors, ship without the
constraint bar rather than shipping a wrong one. Hard constraints are non-negotiable in the
output.

### Phase 3 — Proof · H+6 to H+8 · 17:00–19:00
**Exit:** the demo runs end to end on a clean clone, and we have numbers for the deck.

- **Evidence receipt** — the hero screen. Original-language complaints, data rows, exact
  calculation, vintages, `DATA_MISSING` flags
- `eval.ts` — reporting-bias recovery, equity ablation, `r`-range assertion, eligibility
  filter, constraint satisfaction, national invariance, greedy-vs-exact
- Cloud Run deployed and verified from a phone
- Telegram adapter (Tier 2)
- Impact ledger as a static panel (Tier 2)
- National table as a static table (Tier 2)

**Go/no-go at H+8:** **video is recorded.** It is a graded 3–5 minute deliverable, not a backup.
If the video isn't shot, everything else is unshippable.

### Phase 4 — Ship · H+8 to H+10.5 · 19:00–22:00
- H+9 (20:30) **hard freeze** — no new code
- Deck 10–12 slides, numbers from `eval.ts`
- README, CC-BY licence, public repo
- Rehearse the demo three times
- **H+10.5 (22:00) submit**, one hour of buffer before the deadline

---

## 5. Acceptance criteria

Written as pass/fail. A criterion that cannot be checked is not a criterion.

**Data**
- [ ] Every field used appears in the G1 evidence file with a non-null count and missing %
- [ ] Every receipt shows a data vintage for every source it used
- [ ] Missing values render as `DATA_MISSING`, never as a bare neutral 0.5

**Scoring**
- [ ] `0.3 ≤ r.min()` and `max(r) = 1.0` asserted and reported
- [ ] `demand_adj` and `urgency` are ranked within one constituency only
- [ ] No village scores 0 because a term is missing
- [ ] SC/ST share appears in the allocator floor and **nowhere in `equity`**
- [ ] Cost appears in allocation and **nowhere in the score**
- [ ] Weights are adjustable at runtime and the ranking re-scores

**Eligibility**
- [ ] No recommended work has `eligibility.status = prohibited`
- [ ] `human_review` items are routed with a named scheme, never silently dropped
- [ ] The UI shows `VERIFIED_2023: false` if G6 is unresolved

**Allocation**
- [ ] Every allocation satisfies ≥15% SC and ≥7.5% ST
- [ ] `unallocated` is displayed
- [ ] Greedy vs exact optimum gap is measured and reported

**Evidence**
- [ ] Any number on screen opens its source row
- [ ] No row is displayed that we cannot actually produce
- [ ] Synthetic complaints labelled `synthetic: true` in the API, the UI and the README

**Delivery**
- [ ] `npm install && npm start` works on a laptop that has never run the code
- [ ] Public URL reachable from a phone on mobile data
- [ ] No secret in the repo
- [ ] Video 3–5 min, recorded, plays
- [ ] Deck ≤12 slides
- [ ] CC-BY-4.0 licence present

---

## 6. Non-goals

Each was considered and rejected. **If someone starts one, ask which differentiator it advances.**

Auth/RBAC · WhatsApp Business integration (documented, not built) · vector database · RAG ·
embeddings / DBSCAN · React / Next.js / any frontend build step · mobile app · UI i18n beyond
English · database migrations · free-text location extraction · a real second-country pipeline ·
a second scoring normalisation scheme · an LLM-written memo.

---

## 7. Risks

| Risk | Severity | Fallback | Owner |
|---|---|---|---|
| **G3a — model unreachable on our key** | **Critical** | Text intake; say so on stage. Voice UI never ships broken | P2 |
| **G6 — 2023 repair/maintenance rule unread** | **Critical** | Ship `VERIFIED_2023: false` + banner. Never encode a blanket maintenance ban | P1 |
| **G1 — Antyodaya columns empty or missing** | **High** | Census VD 2011 fallback, labelled. Accept the vintage attack | P1 |
| **P1 is a serial bottleneck** | **High** | P2 takes the converter, P1 takes verification + rules. Escalate to all three at the daily sync | all |
| **Deadline misunderstanding** | **Critical** | Assume 23:00. Verify on the dashboard immediately | P1 |
| **Deployed link broken** | **High** | Cloud Run by H+7. Any reachable public URL, never localhost | P2 |
| **Quota / API flake on stage** | **High** | Everything cached to disk. One live request only. Pre-recorded video is a full substitute | P2 |
| **Video not recorded** | **High** | Scheduled H+8, not at the freeze | P3 |
| **Circular synthetic data attacked** | **High** | Independent generation + labelled + recovery ablation | P1 |
| **A recommendation is prohibited** | **High** | Eligibility filter before ranking + unit test | P1 |
| **"You narrowed the brief"** | **High** | MP-as-demo, national-as-claim. National table survives | P1 |
| **"You did one country"** | **High** | Adapter interface. Said before it's asked | P1 |
| **2011 population base** | **Medium** | Antyodaya 2020 primary; label everything; never compare `demand_adj` across constituencies | P1 |
| **Regional-language text errors** | **Medium** | 5 languages, team-verified only | P2 |
| **"Samadhan Didi already does this"** | **Medium** | §2 positioning line | P1 |
| **"Is this real data?"** | Certain | Infrastructure: yes, immediately. Complaints: no, immediately. Credibility beats theatre | all |

---

## 8. Demo script — 3 minutes

> **0:00–0:20 — Hook.** "Setu turns citizen requests and public infrastructure data into an
> evidence-backed shortlist of works — where the next rupee could help most. Intake is being
> solved; decisions are not." Speak a water complaint. Transcript, theme, picked village.

> **0:20–0:50 — Scale and channel.** "Synthetic requests in five languages, real government data
> underneath." *(Tier 2)* Telegram voice note: "Same pipeline, second channel."

> **0:50–1:30 — The decision.** "National policymakers set priorities; an MP's five crore a year
> is the decision we can show end to end, because every constraint on it is public. Fifteen
> percent of funds to SC areas, seven and a half to ST. Here are the works, per beneficiary,
> constraints met, unfunded need shown. We also encoded the prohibited-works rules as a filter,
> so ineligible works never reach the shortlist — and where eligibility is conditional, we say
> so instead of guessing."

> **1:30–1:55 — Honest gaps.** "Where we can see village-level scheme data — roads — we avoid
> duplicating it. Where we can't, it says *no data*. Every number carries its data vintage.
> Facilities and deprivation come from Mission Antyodaya 2020; Census 2011 is only a fallback."

> **1:55–2:25 — The receipt.** Click a work → complaints in the original language, the exact
> data rows, the exact calculation, the vintages.

> **2:25–2:45 — The experiment.** Move equity to zero; the shortlist changes. Toggle the
> reporting correction; low-literacy villages move up. "That choice is yours, not ours."

> **2:45–3:00 — Loop and scale.** National need table with published state-level utilisation
> alongside; impact ledger. "Open source, CC-BY. The intake, taxonomy and scoring don't know
> this is India — only the infrastructure adapter does."

---

## 9. Deck outline — 11 slides

1. Title — one line
2. The problem — national priorities need an evidence layer; an MP's ₹5 cr is the decision we can show
3. What exists (Samadhan Didi, eSAKSHI) + one-line One MP–One Idea hook + the gap
4. The data unlock — SHRUG, one key, Antyodaya 2020, government's own data, vintages shown
5. Solution — pipeline
6. Live demo / video
7. The decision — constrained shortlist + equity input
8. Proof — eval numbers, incl. reporting-bias recovery
9. Impact loop — sanction latency vs the 45-day rule
10. Designed as a Digital Public Good — licence, open schema, data residency, one-command deploy
11. Scale — national table, adapter interface, "verified in five languages, architecturally unbounded"

---

## 10. Open questions

Answered at the 11:00 sync. Default in brackets if unanswered.

1. **Deadline** — is 23:00 today correct on the dashboard? [`yes`, assume tonight]
2. **Weights** — accept §7.2 defaults, or change before H+3? [`accept defaults`]
3. **Which 3 constituencies** and **which 5 languages** can the team genuinely verify? [`P1 proposes at H+1`]
4. **Consistency check** — accept Antyodaya 2020 as the single primary source for infra, equity and population, with Census 2011 as fallback? [`accept`]
5. **Project name** — clear "Setu" against existing Indian civic-tech organisations before it goes on a slide [`P1 checks`]
