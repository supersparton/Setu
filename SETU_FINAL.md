# SETU — Constituency Investment Decision Engine
**FROZEN TECHNICAL SPECIFICATION**

Track 1 — AI for Digital Public Infrastructure & Governance · BRICS Theme: Innovation
Build with AI: Code for Communities — Second Edition (Google Cloud / GDG India / Hack2Skill)

| | |
|---|---|
| **Status** | **Frozen.** This is the implementation contract. Do not redesign during the build. |
| **Deadline** | **30 Sep 2026, 23:00 IST.** Build ends H+9.5 (21:30), submit by H+10.5 (22:00). |
| **H+0** | 11:00 IST, 30 Sep 2026 |
| **One-liner** | Turn citizen requests and public infrastructure data into an evidence-backed shortlist of works for where the next rupee helps most. |
| **Category** | **Designed as** a Digital Public Good, CC-BY-4.0, runs on a laptop or a district server |
| **Scope** | India deep; portable via a shipped country-adapter interface (§11) |
| **Stack** | NestJS/TypeScript + static vanilla-JS frontend + Gemini + SHRUG. Python only in the offline build script. |

Everything here is decided. If you think something is wrong, raise it in the next 30-minute
sync and change it here — not in your own module.

---

## 1. The problem statement

> **The problem:** Governments often struggle to consolidate citizen feedback and align it
> with national infrastructure priorities. Development requests live in fragmented systems,
> leading to misaligned public spending, unaddressed infrastructure gaps, and no way to
> measure the impact of large-scale digital public infrastructure initiatives.
>
> **The challenge:** Build a scalable, multilingual AI platform — designed as a **Digital
> Public Good** — that aggregates citizen development requests via **voice, text, and
> messaging apps** across diverse linguistic regions. The system should analyse large
> datasets combining citizen feedback with **national demographic data, infrastructure
> indices, and public investment plans**, surfacing **demand hotspots** and recommending
> **high-priority development projects to national policymakers across BRICS nations**.

### 1.1 Compliance map

| # | Clause | Our answer | Status |
|---|---|---|---|
| 1 | Digital Public Good | CC-BY-4.0, open schema, no vendor lock, local-only path | Plan |
| 2 | Multilingual | 5 team-verified languages, one voice path; taxonomy carries no language logic | Plan |
| 3 | Voice | Gemini 3.5 Transcribe (85+ locales, code-switching) | **Gate G3a** |
| 4 | Text | Same endpoint | Plan |
| 5 | Messaging apps | Telegram adapter | Plan — Tier 2, last to cut |
| 6 | National demographic data | Antyodaya 2020 population; Census 2011 PCA fallback | Plan — **vintage shown** |
| 7 | Infrastructure indices | Antyodaya 2020 village facilities; Census VD fallback; PMGSY | Plan — **Gate G1** |
| 8 | Public investment plans | `investment_gap`, computed only where scheme data is village-level | Partial by design |
| 9 | Demand hotspots | Theme × sub-district, reporting-adjusted | Plan |
| 10 | High-priority projects | Constraint-aware works shortlist in ₹ | Plan |
| 11 | National policymakers | MP-as-demo, national-as-claim; national table | Plan |
| 12 | BRICS nations | India deep + adapter interface, honest framing | §11 |
| 13 | Measure impact | Impact ledger incl. sanction latency vs the 45-day rule | Plan — Tier 2 |
| 14 | Innovation | Live weight inputs + reporting-bias correction | Plan |

---

## 2. Landscape and positioning

| Existing | Does | Our gap |
|---|---|---|
| **CPGRAMS + Samadhan Didi** (launched 30 May 2026, DARPG + Bhashini) | Voice/text grievance intake, 22 scheduled languages, auto-categorisation, routing | Case redress. Does not join demand to village infrastructure and existing schemes, and does not recommend where capital should go. |
| **MPLADS / eSAKSHI** (portal from 1 Apr 2023) | Digital recommend → sanction → pay workflow | Workflow, not decision support. Nothing ranks works by evidence. |
| **Antyodaya 2020, Census 2011, PMGSY, SECC 2012** (via SHRUG) | Open village-level facility, deprivation, asset and programme data | Not connected to live citizen demand. |

**Positioning line — use verbatim, and do not claim the parts we cannot do:**

> *"Intake is being solved — Samadhan Didi already hears citizens in 22 languages. The gap we
> target is connecting what citizens say to village-level infrastructure and investment
> evidence, then producing an explainable works shortlist a decision-maker can act on."*

---

## 3. The user and the decision

### 3.1 The instrument

| Fact | Value | Source |
|---|---|---|
| Entitlement | **₹5 crore per MP per year**, single instalment from FY 2023-24 | MPLADS Guidelines 2023; RS 2559, 11.08.2025 |
| SC/ST floor | **≥15%** of entitlement for SC-inhabited areas, **≥7.5%** for ST-inhabited areas | 2023 guidelines. Softened to "advisable" in Apr 2023, **reinstated as mandatory** by corrigendum |
| Who acts | MP **recommends**; District Authority **sanctions** and implements | 2023 guidelines |
| Sanction clock | IDA must sanction or reject within **45 days** of receipt | Salient feature 5, LS Starred Q.338 |
| Convergence | Works may be pooled with Central/State schemes; **other scheme funds used first** | para 3.17; salient feature 19 |
| Sectors | An **indicative** list (Annexure-VIII in the 2023 text). Explicitly *"not to be treated as an exhaustive list, nor a shelf of projects/master list"* | PIB, Aug 2023 |
| Outside constituency | Up to ₹50 lakh/year (₹1 crore in severe calamity) | 2023 guidelines |
| Prohibited works | **Binding negative list.** See §4 | **Gate G6** |
| CSR pooling | **Prohibited** | Salient feature 14(ix), LS Starred Q.338 |
| Utilisation | Defined as *amount recommended ÷ entitlement* — measures MP recommendations, not district spending. Below 60% in **331 of 538** listed constituencies | LS USQ 4517, 20.08.2025 |
| Sanction time | 2024-25 state averages ranged **32.7 to 152.6 days**; includes Model Code of Conduct periods | LS USQ 4517, Annexure IV |

**Do not use** the older 75-day sanction rule (superseded). **Do not cite** any state
government page as the legal basis for the prohibited list.

### 3.2 Framing — say it in this order

1. *National policymakers set infrastructure priorities. Those priorities are only as good as
   the evidence connecting citizen demand to real gaps.*
2. *An MP's ₹5 crore is the decision we can demonstrate end to end, because every constraint
   on it is public and citable.*
3. *The same evidence rolls up: a national table shows where infrastructure need is highest,
   with published state-level utilisation and sanction-time data alongside.*

**The deck must never read as "we narrowed the brief."** The MP demo proves the engine; the
national table is the national claim. This is why the national table cannot be cut to zero.

### 3.3 Adjacent hook — one sentence, no more

> *"MPLADS already invites ideas from residents through One MP – One Idea; Setu is the
> evidence layer that could sit under that intake."*

It selects innovative *ideas* for cash awards at the MP's request. **Never describe our
output as the competition's top three.** A judge-MP will catch it.

### 3.4 Stated approximation

The SC/ST floor is measured as *SC/ST population share of the benefiting area* above a stated
threshold. **This is our approximation, not the official compliance test.** A Lok Sabha
evaluation annexure recommends districts notify designated SC/ST areas annually; a real
deployment would ingest that list. Say so.

---

## 4. Eligibility model

Every candidate intervention carries:

```ts
eligibility: {
  status:      'permitted' | 'prohibited' | 'human_review';
  reason_code: string;     // e.g. OFFICE_BUILDING, MANDATORY_MAINTENANCE_CONDITION
  source:      string;     // "MPLADS Guidelines 2023, <exact clause>"
  conditions?: string;     // present when status = human_review
  route?:      string;     // named scheme to refer to, from investment_plans.csv
}
```

**The allocator only receives `status === 'permitted'`.**

### 4.1 Rules of engagement

- **Do not encode a blanket prohibition on maintenance, renovation or repair.** The 2023
  guidelines made *"admissibility of repair and maintenance of public assets"* a stated
  change. Anything in the repair / maintenance / upgradation / retrofitting family is
  **`human_review`** until Gate G6 is complete.
- Many prohibited items carry **carve-outs** (hand-pump re-boring, railway halt stations,
  specified retrofitting, tricycles for disabled persons). This is why the model is
  reason-coded, not boolean.
- `human_review` items surface to the user as
  **"Not fundable via MPLADS without district confirmation — <conditions>. May be routed to
  <route>."** Not as a silent exclusion, and never as a bare "no".
- Appendix A holds the item list once G6 is done. Until then the table ships with
  `VERIFIED_2023: false` and the UI shows a banner.

### 4.2 Categories known to be prohibited (from official listings, pending G6 confirmation)

Government office and residential buildings · commercial establishments and units · grants
and loans · contributions to relief funds · naming assets after a person · movable items ·
acquisition of land or compensation · reimbursement of completed or partly completed works ·
assets for individual or family benefit · works in places of religious worship · works in
unauthorised colonies · pooling with CSR funds.

---

## 5. Data

**SHRUG** ([Development Data Lab](https://www.devdatalab.org/shrug)) links villages across
censuses and programme data on a single **`shrid2`** key. Download:
<https://www.devdatalab.org/shrug_download>. Do not mix SHRUG versions.

### 5.1 Sources

| Source | File | Role | Vintage |
|---|---|---|---|
| **Mission Antyodaya Village Facilities** | `antyodaya_shrid.dta` on `shrid2`; also aggregated to sub-district, district, AC07, AC08 | **Primary** for `infra_gap`, `equity`, population, households | **2020** |
| Census 2011 Village Directory | `pc11_vd_clean_shrid` | **Fallback** infra source; water source types; doctor staffing (labelled overlay) | 2011 |
| Census 2011 PCA | `pc11_pca_clean_shrid` | Fallback population, literacy, SC/ST share (**floor approximation only — not `equity`**) | 2011 |
| PMGSY | programme data | The one village-level `investment_gap` source | varies |
| SECC 2012 | household assets | Fallback equity only | 2012 |
| NITI SDG India Index 2023-24 | district | SDG tagging | 2023-24 |

**The single-survey story:** all primary facility and deprivation evidence comes from
Mission Antyodaya 2020 on one key at one vintage. Census 2011 is used only where the newer
denominator is unavailable. Say this on stage — it answers "why are you mixing periods?"

### 5.2 Antyodaya field map — **VERIFY AGAINST THE ACTUAL `.dta` IN GATE G1**

Documented schema is a contract, not evidence the columns are populated. Record for each:
field, description, non-null count, total, missing %, source vintage, theme.

| Theme | Fields |
|---|---|
| `drinking_water` | `piped_water_fully_covered`, `total_hhd_having_piped_water_con` |
| `sanitation_drainage` | `closed_drainage`, `open_covered_drainage`, `open_uncovered_drainage`, `open_kuchha_drainage`, `is_community_waste_disposal_syst` |
| `health_access` | `phc`, `sub_centre`, `chc`, `is_aanganwadi_centre_available`, `availability_of_mother_child_hea`, `availability_of_jan_aushadhi_ken` |
| `education_access` | `availability_of_primary_school`, `availability_of_middle_school`, `availability_of_high_school`, `availability_of_ssc_school` |
| `roads_connectivity` | `is_village_connected_to_all_weat`, `internal_pucca_road`, `public_transport` |
| `electricity_energy` | `no_electricity` (inverted), `total_hhd_with_clean_energy` |

**Equity (deprivation shares, 2020):** `total_hhd_with_kuccha_wall_kucch`,
`total_hhd_not_having_sanitary_la`, anaemia counts, `total_hhd_having_pmsbhgy_benefit`,
`total_hhd_in_pmay_permanent_wait`, `total_minority_children_getting_`,
`no_of_children_not_attending_sch`, `total_hhd_mobilized_into_shg`.

**Known traps:**
- Antyodaya has **no handpump or tubewell** fields. Those are Census VD 2011 only.
- Solar/wind electrification fields are **87% missing** — unusable.
- `total_hhd_engaged_cottage_small_` **89% missing**, `total_hhd_source_of_minor_forest`
  **84%**, `any_primary_sch_toilet` **29%** — exclude.
- Baseline missingness is **12%** at shrid level (521,223 non-missing of ~592k shrids).
- Hand-pump re-boring and hand-pump servicing are **permitted carve-outs** — do not encode
  these as prohibited.

### 5.3 Vintage register

| Input | Vintage | Treatment |
|---|---|---|
| Antyodaya facilities / deprivation / population | **2020** | Primary. Missing → neutral 0.5 **and** flagged `DATA_MISSING` |
| Census VD | 2011 | Fallback only, labelled |
| Census PCA | 2011 | Fallback denominator, labelled "2011 base" |
| SECC | 2012 | Fallback equity only, labelled |
| PMGSY | varies | Print snapshot date |
| Utilisation / sanction time | Aug 2025 | State-level only, with date and definition |
| Synthetic complaints | generated | Labelled `synthetic` |

**Every receipt prints the vintage of every source it used.** A judge asking "you're deciding
2026 money on 2011 data" must find the answer already on screen.

### 5.4 Fallbacks

data.gov.in Village Amenities (Census 2011) · Harvard Dataverse (older SHRUG) ·
[datameet/indian_village_boundaries](https://github.com/datameet/indian_village_boundaries)
(ODbL, map geometry). **If SHRUG is blocked, confirm the join key before using any fallback —
name-matching would void the "no fuzzy joins" claim.**

---

## 6. Pipeline

```
 [ audio | text | Telegram ]
        │
 1. TRANSCRIBE  gemini-3.5-transcribe (auto lang, code-switch)      [P2]
        │
 2. NORMALISE   gemini-2.5-flash, structured JSON, 20 rows/call     [P2]
                → { theme, severity, urgency, facility, lang }
        │
 3. LOCATE      explicit picker: state → district → village.        [P3]
                NO free-text NER.                              → shrid
        │
 4. JOIN        shrid → Antyodaya 2020 (+ Census VD fallback)      [P1]
        │
 5. SCORE       additive; absolute infra/equity,                    [P1]
                within-constituency ranks for demand/urgency
        │
 6. ALLOCATE    constraint-aware greedy allocator under ₹5 cr       [P1]
        │
 7. RECEIPT     evidence + exact calculation + data vintage          [P3]
        │
 8. LEDGER      request → recommendation → sanction latency →        [P2]
                demand delta (Tier 2)
```

**Every LLM call is cached to disk keyed by a hash of its input.** Re-runs cost zero and the
demo never blocks on quota. No embeddings, no vector DB, no RAG.

---

## 7. Scoring

### 7.1 Normalisation rule

`infra_gap` and `equity` are **absolute** [0,1] scores, comparable across constituencies and
preserving real severity on receipts. `demand_adj` and `urgency` are **percentile-ranked
within one constituency** because they are inherently relative. **Higher always = higher
priority.**

### 7.2 Terms

| Term | 0 means | 1 means | Source |
|---|---|---|---|
| `infra_gap` | all theme facilities present | none present | Antyodaya 2020; Census VD fallback |
| `equity` | no household deprivation | high household deprivation | Antyodaya 2020 deprivation shares. **SC/ST share is NOT used here** — it drives the allocator floor, and using it in both counts it twice |
| `demand_adj` | little reporting-adjusted demand | high | complaints ÷ population ÷ `r`, then ranked within constituency |
| `investment_gap` | existing programme addresses this | no existing investment found | PMGSY status. Other themes: **"no data" → 0.5, flagged** |
| `urgency` | old / low severity | recent, high severity | `mean(severity_weight × exp(−days_old / τ))`, then ranked within constituency |

```
score = 0.30·infra_gap + 0.25·equity + 0.25·demand_adj
      + 0.10·investment_gap + 0.10·urgency
```

- Weights are live inputs in the UI. Defaults above.
- **Cost is not in the score.** It enters once, in allocation.
- **Additive, not multiplicative** — a zero in one term must not veto a village.
- Missing data → 0.5 **with `status: DATA_MISSING`**, never a bare 0.5.

### 7.3 `infra_gap`

```
infra_gap(theme) = Σ_k w_k · missing_k  /  Σ_k w_k        missing_k ∈ [0,1]
```

`missing_k = 1` if facility *k* is absent in the village. Equal default `w_k`; any change is
documented. If a theme's variables are missing for a village, that theme is unscored there
(0.5, flagged `DATA_MISSING`).

**Known limitation, state it:** a missing PHC and a missing road are not commensurate.
Comparing themes assumes a 0–1 share of missing facilities means comparable severity.

### 7.4 Reporting-propensity correction

Raw complaints per 10,000 people is biased **against** the most deprived villages, because
literacy and phone access are lowest there.

```
lit_n, mob_n = minmax(literacy_rate), minmax(mobile_coverage)   # within comparison set
r_raw        = w1·lit_n + w2·mob_n                              # w1 + w2 = 1
r_raw        = r_raw / max(r_raw)   if max(r_raw) > 0 else 0    # guard: all-zero
r            = 0.3 + 0.7·r_raw

demand_adj   = (complaints / population × 10,000) / r
```

`literacy_rate` and `mobile_coverage` are **fractions in [0,1]**. `w1 = w2 = 0.5` are stated
assumptions, not fitted constants. The 0.3 floor prevents blow-up.

**Normalising by the observed max — not a fixed max — is required.** A weighted average of two
min-maxed inputs does not reach 1.0 unless one unit sits at max on one input and min on the
other, which does not happen in real data. Without this the correction silently does nothing
and the headline ablation number is meaningless.

**The eval must assert and report:**
```
assert 0.3 <= r.min()
assert abs(r.max() - 1.0) < 1e-9
```

### 7.5 `urgency`

```
urgency_raw(complaint)       = severity_weight × exp(−days_old / τ)
urgency(theme, subdistrict)  = mean(urgency_raw over its complaints)   # mean, not sum
```

`severity_weight ∈ {low 0.33, medium 0.67, high 1.0}`, `τ = 30 days` — stated assumptions.
Mean, not sum, because volume belongs to `demand_adj`.

### 7.6 `investment_gap` — honest scope

`investment_plans.csv` (10–15 cited schemes with source URL and year) documents what exists,
but national schemes run in every state, so presence alone carries almost no signal.

- **Roads:** computed from PMGSY status per village → genuine signal.
- **All other themes:** "no data" → 0.5, **visibly flagged** in UI and receipt.

On stage: *"Where we can see village-level scheme data we use it; where we can't, we say so
instead of faking it."*

### 7.7 Deck rationale

Interpretability beats mathematical cleverness in a governance tool. Every term is a
percentage of villages missing a named facility — a district officer can check it by hand.

---

## 8. Allocation

**Constraint-aware greedy allocator** under ₹5 crore (editable). Deliberately not called a
knapsack solver: it does not guarantee optimality. The eval compares it against an exact
solution on small instances and reports the gap.

```
value = score × estimated_beneficiaries ÷ cost_₹
```

- **`estimated_beneficiaries = catchment_population × served_share`.** `served_share` depends
  on intervention type (school asset → students served; road → catchment population;
  community water asset → households served). **It is not village population.** Population base
  is Antyodaya 2020 where available, Census 2011 fallback, labelled.
- **Hard filter first:** only `eligibility.status === 'permitted'` reaches ranking (§4).
- **Hard constraints:** ≥15% of funds to SC-inhabited areas, ≥7.5% to ST-inhabited areas.
- **Soft flags, never blocking:** sector alignment (outside the indicative list →
  "check alignment"); convergence (another scheme should fund first).
- Greedy selection with constraint repair.
- **Honest `unallocated` figure.** Demand we could not fund is a feature.

Output per work: ₹, beneficiaries, cost per beneficiary, horizon, SDG target, eligibility
status, flags, `investment_gap` note, provenance ID.

---

## 9. The Evidence Receipt — the hero screen

Every number is clickable to its source row. **Never display a row we cannot actually produce.**

```
WHY THIS WORK?                              [SYNTHETIC COMPLAINTS · REAL DATA]
score 0.81
  infra_gap 0.93 · equity 0.78 · demand_adj 0.74
  investment_gap 0.50 (no data) · urgency 0.66

EVIDENCE
  N complaints (originals + translations) → theme → village
  Antyodaya rows used · PMGSY status · population · reporting-propensity r used
  Calculation: each term, each weight, each percentile

DATA VINTAGE
  Facilities / deprivation / population: Antyodaya 2020
  [fallback rows shown only if used, each labelled]

FLAGS
  Sector: within indicative list · Convergence: no overlapping scheme found
  Missing data: none
```

A neutral-imputed term renders as `infra_gap 0.50 · ⚠ DATA_MISSING` — never as a bare 0.50,
or a judge will read imputation as measurement.

**The receipt is the product. There is no LLM-written memo.** A deterministic template plus
the provenance chain is more defensible and cannot contradict the ranking.

---

## 10. API contract

```
POST /api/ingest   { audio?, text?, shrid?, location?, channel? }
  -> { complaint_id, transcript, language, theme, severity, urgency,
       shrid, created_at, synthetic }

GET  /api/hotspots?theme=&constituency=&w_gap=&w_equity=&w_demand=&w_invest=&w_urgency=
  -> [ { theme, subdistrict, district, ac, pc, lat, lon, score,
         terms: { infra_gap: {value, status, source_vintage}, ... },
         evidence_count, top_quotes[], vintages{}, flags } ]

GET  /api/alloc?budget=&constituency=&<weights>
  -> { total_budget, allocated, unallocated,
       constraints: { sc_pct, st_pct, ok },
       works: [ { rank, theme, subdistrict, amount_cr, estimated_beneficiaries,
                  cost_per_beneficiary, sdg_target, eligibility_status, sector_flag,
                  convergence_flag, score, provenance_id } ],
       referrals: [ { reason_code, message, route } ] }        // human_review items

GET  /api/national
  -> { constituencies: [...],              // evidence-only need, no demand term
       state_utilisation_context: [...],   // real, dated 20 Aug 2025
       state_sanction_context: [...] }     // real, dated 20 Aug 2025
       // NO simulated utilisation anywhere

GET  /api/provenance/{id}  -> exact complaints + exact data rows + exact calculation + vintages
GET  /api/impact?project=  -> requests, outcome, demand delta, sanction latency vs 45 days
GET  /api/schema           -> published zod contracts
POST /telegram/{token}     -> messaging intake
```

`national_need` = population-weighted mean of absolute `infra_gap` and `equity` (weights 0.6 /
0.4, assumption). Because both terms are absolute, adding or removing a constituency never
changes another's score — **tested** (§12).

---

## 11. Architecture

### 11.1 Python boundary

```
BUILD TIME (once, offline, output committed)
  .dta ──► Python/pandas ──► CSV/JSON ──► committed in /data

RUNTIME (Docker image)
  Node/NestJS ──► COPY data/ ./data/
  no Python · no pandas · no .dta parsing
```

A clean clone must boot with `npm install && npm start`. If it needs pandas, the DPG claim is
false.

### 11.2 Layout

```
Setu/
├─ src/
│   ├─ main.ts · app.module.ts
│   ├─ shared/schema.ts       frozen zod contracts, single source of truth
│   ├─ ingest/                /api/ingest, location resolution
│   ├─ llm/
│   │   ├─ cache.ts           hash → disk JSONL cache, retry/backoff
│   │   ├─ enrich.ts          taxonomy mapping, 20 rows/call
│   │   └─ impact.ts          outcome classification
│   ├─ adapters/
│   │   ├─ base.ts            country adapter interface (§13)
│   │   ├─ web.ts
│   │   └─ telegram.ts
│   ├─ scoring/               score, eligibility, constrained allocator
│   └─ data/                  in-memory loaders for prebuilt CSV/JSON
├─ static/                    index.html, app.js, style.css — no build step
├─ data/
│   ├─ constituency/*.json    infra, equity, r inputs, vintages
│   ├─ national.csv
│   ├─ investment_plans.csv   cited schemes
│   ├─ benchmarks.csv         cited ₹/beneficiary
│   └─ complaints.jsonl       synthetic corpus + normalised output
├─ scripts/
│   ├─ build_infra_index.py   OFFLINE ONLY
│   ├─ verify_antyodaya.py    OFFLINE ONLY — Gate G1 evidence
│   ├─ seed_corpus.ts
│   └─ eval.ts
├─ Dockerfile · cloudbuild.yaml · LICENSE (CC-BY-4.0) · README.md
```

Option A: NestJS serving static vanilla JS. No frontend build. `zod` schemas at
`/api/schema` plus one contract test enforce the contract across the boundary.

---

## 12. Evaluation

| Test | Proves | Expect |
|---|---|---|
| Theme classification accuracy, held-out 20% | AI normalisation works | gold labels from the template bank |
| Cross-lingual grouping | same theme buckets together across all 5 languages | high |
| **Reporting-bias recovery** | rank against evaluator-only `latent_demand`: Spearman, Kendall, top-K recall, observed vs corrected | **headline number** |
| Recovery: matched-form upper bound | same test with generator and corrector sharing a form | report; **never headline** — near-perfect by construction |
| Recovery: `r` range assertion | the correction actually bites | `0.3 ≤ min(r)`, `max(r) = 1.0` |
| Recovery: sensitivity | vary `w1, w2` by ±0.2 | result is not tuned |
| Equity ablation | `w_equity = 0` → how many recommended works change | valid because complaints are independent of deficit |
| **Eligibility filter** | no recommended work is `prohibited`; `human_review` items are routed not dropped | 100% |
| Constraint satisfaction | every allocation meets SC/ST floors | 100% |
| National-score invariance | add/remove a constituency; others' scores unchanged | exact |
| Greedy vs exact | greedy allocation value vs exact optimum on small sets | report the gap |
| Location resolution | picker → correct `shrid` | 100% |
| Vintage check | every receipt prints a vintage for every source used | 100% |

**Do not report "hotspots match deficient villages" as a result.** With independent
generation it is not expected; with anchored generation it is a tautology.

### 12.1 Synthetic corpus rules

This is the project's biggest credibility risk. The rules are strict.

1. **Independent of deficit.** Sample villages by a documented process (population-weighted
   plus noise), **not** by picking deficient ones. Otherwise demand correlates with gap by
   construction and the hotspots are our own input.
2. **Generator deliberately misspecified.** Filing probability rises with literacy and mobile
   coverage through a *nonlinear* form plus an unobserved village-level factor, so the
   corrector in §7.4 is misspecified relative to the generator. **If they match, the recovery
   test proves nothing.**
3. **`latent_demand` (evaluator-only).** Every synthetic village has a true per-capita demand
   per theme, drawn independently of deficit. Observed complaints = latent demand × propensity
   × noise. **Never exposed in the API or UI.**
4. **Natively written**, not translated at runtime. 5 languages, team-verified.
5. **~15% low-signal noise floor.**
6. **Labelled `synthetic: true`** in every API response, the UI, and the README. Say it first,
   unprompted.

**Judge answer to "does this work on real citizens?":**

> *"Infrastructure data is real government data, from Mission Antyodaya 2020 and Census 2011.
> Citizen requests are synthetic because no integrated dataset exists publicly. What we
> demonstrate is the mechanism: the intake path is the same one real requests would use. It's
> verified end to end in five languages and architecturally unbounded — the taxonomy carries
> no country or language logic."*

---

## 13. Adapter interface — the BRICS answer

```ts
interface InfrastructureIndex {
  unitId(): string;                            // 'shrid2' for India
  units(): Unit[];                             // id, lat, lon, admin1, admin2
  deficit(theme: string): Map<string, number>; // 0 adequate .. 1 severe
  equity(): Map<string, number>;               // 0 least .. 1 most deprived
  population(): Map<string, number>;
  households(): Map<string, number>;
  reportingPropensity(): Map<string, number>;  // 0.3..1.0, documented
  investmentPlans(): InvestmentRow[];          // scheme, region, outlay, source_url
  vintages(): Record<string, string>;          // source → year, printed on receipts
}
```

Ship `adapters/base.ts`, the India implementation, `schema/infra_index.csv`, and one conformant
sample file. **The second country is a CSV, not a rewrite.**

**Objection:** *"You built one country; the brief says BRICS."*
**Answer:** India deep, and we say so. The intake, taxonomy (anchored to SDG targets), scoring
and allocator contain no India-specific logic. Only the infrastructure adapter is
country-specific. A new country needs an adapter and new complaint templates.

**Also true and worth saying:** the *method* ports, but complaint volumes are not comparable
across countries — reporting behaviour differs — which is exactly why we correct for reporting
propensity.

**Do not** build a real second-country pipeline in this timebox. A shallow demo a judge can
puncture is worse than an honest India plus a published interface. Brazil's *parlamentary
amendments* may be a comparable instrument — **unverified, do not claim on stage.**

---

## 14. Evaluation gates — first 30 minutes, in parallel

| Gate | Check | Owner | If it fails |
|---|---|---|---|
| **G0** | `.dta` converter runs on a laptop and produces the demo files | P2 | Use SHRUG CSV if offered; else one teammate runs it once and commits the small output |
| **G1** | Antyodaya + PCA + PMGSY load on `shrid2`. Verify every field in §5.2 against the actual `.dta`: non-null count, missing %, values. Record the evidence file. | P1 | Fall back to Census VD for infra. If SHRUG blocked → data.gov.in, **confirm the join key first** |
| **G2** | Constituency keys; can ACs roll up to Lok Sabha constituencies? | P1 | Build a static AC→PC table |
| **G3a** | **`gemini-3.5-transcribe` is reachable and has quota on our actual free-tier AI Studio key**, using a real OGG/Opus sample | P2 | Voice path is dead — pivot to browser text intake, say so on stage. **Do not discover this at H+3** |
| **G4** | Cloud Run hello-world reachable from a phone on mobile data | P2 | Any reachable public URL — never localhost |
| **G5** | PMGSY status usable per village; any village-level water-scheme data | P1 | `investment_gap` = PMGSY only; other themes "no data" |
| **G6** | **Read the 2023 prohibited-works annexure in a browser.** Record item numbers and the repair/maintenance conditions verbatim. `mplads.gov.in` blocks automated fetch — this needs a human | P1 | Ship the eligibility table with `VERIFIED_2023: false` and a UI banner. **Do not block the build.** Do not encode a blanket maintenance ban |

**Peer check:** all three read the G6 output together for 15 minutes before the eligibility
model is frozen. One person's reading of a policy document is a single point of failure.

---

## 15. Deployment and submission

**Cloud Run** satisfies the "utilise Google Cloud technologies" requirement and produces the
required public link from one artifact. Single container, port 8080, `GEMINI_API_KEY` as an
env var — **never in the repo.**

| Deliverable | Owner | Due |
|---|---|---|
| Source code — public GitHub repo | P2 | H+9 |
| Demo video, 3–5 min, end to end | P3 | **H+8** |
| Pitch deck, 10–12 slides | P1 | H+9 |
| Deployed prototype link | P2 | **H+7** |
| Google Cloud usage | P2 | H+7 |
| DPG commitments: CC-BY, open schema, data residency, one-command boot | P2 | H+9 |

**Demo rule:** run from a clean clone on a laptop that has never run the code. If it does not
boot with `npm install && npm start`, the DPG claim is false.

---

## 16. Known limitations — state them, don't hide them

1. **Citizen demand is synthetic.** Every demand result demonstrates the mechanism, not real citizens.
2. **Primary data is 2020**, population 2011 where Antyodaya is missing. Both labelled per receipt.
3. **Cross-theme commensurability is an assumption.** A missing road and a missing PHC share a 0–1 scale.
4. **Only 6 themes are scored.** Unscored themes show demand but no ranked works.
5. **SC/ST floors use a population-share threshold**, not the district's notified list.
6. **`served_share` and cost benchmarks include assumptions.** Each is cited or marked.
7. **Utilisation and sanction-time figures are state-level and dated.** Per-project ledger outcomes are simulated and labelled.
8. **The eligibility filter is our encoding.** Setu recommends; the District Authority decides.
9. **The generator is our own.** Recovery is measured against our misspecified model, not observed reality.

---

## 17. Sources

- Development Data Lab, [The SHRUG](https://www.devdatalab.org/shrug) · [download](https://www.devdatalab.org/shrug_download) · [docs](https://docs.devdatalab.org)
- SHRUG — [Mission Antyodaya Village Facilities (2020)](https://docs.devdatalab.org/SHRUG-Metadata/Mission%20Antyodaya%20Village%20Facilities%20%282020%29/Tables/antyodaya-metadata)
- SHRUG — [Census 2011 Village Directory metadata](https://docs.devdatalab.org/SHRUG-Metadata/Population%20Census/Tables/vd11-metadata/)
- NITI Aayog, [SDG India Index](https://www.niti.gov.in/node/1708)
- [data.gov.in Village Amenities, Census 2011](https://www.data.gov.in/catalog/village-amenities-census-2011) (fallback)
- [datameet/indian_village_boundaries](https://github.com/datameet/indian_village_boundaries) (fallback, ODbL)
- **MPLADS Guidelines 2023** salient features, 45-day rule, eSAKSHI, prohibited works incl. CSR pooling (LS St Q.338, 18.12.2024): <https://eparlib.sansad.in/bitstream/123456789/2986674/1/AS338_TsKdbP.pdf>
- **MPLADS utilisation below 60% and sanction days** (LS USQ 4517, 20.08.2025): <https://sansad.in/getFile/loksabhaquestions/annex/185/AU4517_XZoTZM.pdf>
- MPLADS entitlement and single-instalment change (RS USQ 2559, 11.08.2025): <https://sansad.in/getFile/annex/268/AU2559_BJjfqg.pdf>
- Indicative list is non-exhaustive and may be extended (PIB, Aug 2023): <https://www.pib.gov.in/PressReleasePage.aspx?PRID=1947041>
- MPLADS eSAKSHI portal: <https://www.mplads.mospi.gov.in/digigov/dashboard.html>
- Samadhan Didi launch (AIR): <https://newsonair.gov.in/union-minister-jitendra-singh-launches-ai-enabled-cpgrams-voice-chatbot-samadhan-didi/>
- CPGRAMS monthly report, May 2026 (PIB): <https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jun/doc2026623900801.pdf>
- [Gemini 3.5 Transcribe](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-transcribe) · [rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- Code for Communities: <https://hack2skill.com/event/codeforcommunities> · [prize/finale listing](https://gdg.community.dev/events/details/google-gdg-bhubaneswar-presents-build-with-ai-code-for-communities/)
