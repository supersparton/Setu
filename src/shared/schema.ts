/**
 * Shared API contracts. Frozen at H+3 (TEAM.md).
 *
 * Per INSTRUCTIONS.md 5, any change here needs P2 (author) AND P1 (consumer of the
 * data contract) to approve. Frontend reads these at /api/schema; it does not
 * hand-roll types, so a field rename cannot silently drift between client and server.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Themes
// ---------------------------------------------------------------------------

/** Scored themes. Order matches the PRD 3.1 sacrifice order, most valuable last. */
export const SCORED_THEMES = [
  'roads_connectivity',
  'education_access',
  'electricity_energy',
  'sanitation_drainage',
  'health_access',
  'drinking_water',
] as const;

/** Classified and displayed, but carry no infrastructure score and no ranked works. */
export const UNSCORED_THEMES = [
  'maternal_child_health',
  'livelihood_employment',
  'housing_tenure',
  'disaster_resilience',
  'digital_connectivity',
  'other',
] as const;

export const ThemeSchema = z.enum([...SCORED_THEMES, ...UNSCORED_THEMES]);
export type Theme = z.infer<typeof ThemeSchema>;

/** Languages the team can genuinely verify. Demo transcript may be any of these. */
export const SUPPORTED_LANGS = ['hi', 'en', 'bn', 'ta', 'te'] as const;
export const LangSchema = z.enum(SUPPORTED_LANGS);
export type Lang = z.infer<typeof LangSchema>;

// ---------------------------------------------------------------------------
// Vintages (SETU_FINAL.md 5.3)
// ---------------------------------------------------------------------------

/**
 * Every value carries the vintage of its source. A judge asking "you're deciding
 * 2026 money on 2011 data" must find the answer already on screen, so a receipt
 * without a vintage is a bug, not a gap.
 */
export const SourceVintageSchema = z.object({
  source: z.string(),
  vintage: z.number().int(),
  label: z.string(),
});
export type SourceVintage = z.infer<typeof SourceVintageSchema>;

export const VINTAGE_REGISTER: Record<string, SourceVintage> = {
  antyodaya_facilities: { source: 'Mission Antyodaya', vintage: 2020, label: 'Antyodaya 2020' },
  antyodaya_deprivation: { source: 'Mission Antyodaya', vintage: 2020, label: 'Antyodaya 2020' },
  census_vd: { source: 'Census Village Directory', vintage: 2011, label: 'Census VD 2011 (fallback)' },
  census_pca: { source: 'Census Primary Census Abstract', vintage: 2011, label: 'Census PCA 2011 (fallback denominator)' },
  secc: { source: 'SECC', vintage: 2012, label: 'SECC 2012 (fallback equity)' },
  pmgsy: { source: 'PMGSY', vintage: 0, label: 'PMGSY (snapshot)' },
  utilisation: { source: 'Lok Sabha USQ 4517', vintage: 2025, label: 'Aug 2025 (state-level)' },
  synthetic: { source: 'generated', vintage: 0, label: 'Synthetic (generated)' },
};

/** Missing values render as DATA_MISSING, never as a bare neutral 0.5. */
export const DATA_MISSING = 'DATA_MISSING' as const;

// ---------------------------------------------------------------------------
// Ingest
// ---------------------------------------------------------------------------

/**
 * A normalised complaint. `shrid` comes from an explicit state/district/village
 * picker (P3) - there is no free-text NER anywhere in this pipeline, so no fuzzy
 * joins can invalidate the "real join" claim.
 */
export const ComplaintSchema = z.object({
  id: z.string(),
  theme: ThemeSchema,
  severity: z.number().min(0).max(1),
  urgency: z.number().min(0).max(1),
  facility: z.string(),
  lang: LangSchema,
  text: z.string(),
  shrid: z.string(),
  synthetic: z.boolean().default(false),
  created_at: z.string(),
});
export type Complaint = z.infer<typeof ComplaintSchema>;

export const IngestRequestSchema = z.object({
  text: z.string().min(1).optional(),
  audio_base64: z.string().optional(),
  lang_hint: LangSchema.optional(),
  shrid: z.string().min(1),
  synthetic: z.boolean().default(false),
});
export type IngestRequest = z.infer<typeof IngestRequestSchema>;

export const IngestResponseSchema = z.object({
  complaint: ComplaintSchema,
  transcript: z.string(),
  model: z.string(),
  cached: z.boolean(),
  degraded: z.boolean().default(false),
});
export type IngestResponse = z.infer<typeof IngestResponseSchema>;

// ---------------------------------------------------------------------------
// Scoring (SETU_FINAL.md 7)
// ---------------------------------------------------------------------------

/** infra_gap and equity are ABSOLUTE [0,1] and comparable across constituencies. */
export const AbsoluteScoreSchema = z.number().min(0).max(1);

/**
 * demand_adj and urgency are ranked WITHIN one constituency only. Comparing them
 * across constituencies would mix 2011 and 2020 population bases. See PRD 5.
 */
export const RelativeScoreSchema = z.number().min(0).max(1);

export const ScoreTermSchema = z.object({
  value: z.number().min(0).max(1),
  status: z.enum(['measured', 'fallback', 'missing']),
  source_vintage: SourceVintageSchema,
});

export const WeightsSchema = z.object({
  infra_gap: z.number().min(0).max(1),
  equity: z.number().min(0).max(1),
  demand_adj: z.number().min(0).max(1),
  investment_gap: z.number().min(0).max(1),
  urgency: z.number().min(0).max(1),
});
export type Weights = z.infer<typeof WeightsSchema>;

export const DEFAULT_WEIGHTS: Weights = {
  infra_gap: 0.3,
  equity: 0.25,
  demand_adj: 0.25,
  investment_gap: 0.1,
  urgency: 0.1,
};

export const VillageScoreSchema = z.object({
  shrid: z.string(),
  name: z.string(),
  constituency: z.string(),
  score: z.number().min(0).max(1),
  terms: z.record(z.string(), ScoreTermSchema),
  missing_flags: z.array(z.string()).default([]),
  vintages: z.array(SourceVintageSchema),
});
export type VillageScore = z.infer<typeof VillageScoreSchema>;

// ---------------------------------------------------------------------------
// Eligibility (SETU_FINAL.md 8) and allocation
// ---------------------------------------------------------------------------

export const EligibilitySchema = z.object({
  scheme: z.string(),
  status: z.enum(['permitted', 'prohibited', 'human_review']),
  reason_code: z.string(),
  source: z.string(),
  conditions: z.array(z.string()).default([]),
  route: z.string(),
  /** False until G6 reads the 2023 prohibited-works annexure. UI shows a banner. */
  verified_2023: z.boolean().default(false),
});
export type Eligibility = z.infer<typeof EligibilitySchema>;

export const RecommendedWorkSchema = z.object({
  id: z.string(),
  shrid: z.string(),
  village: z.string(),
  constituency: z.string(),
  theme: ThemeSchema,
  description: z.string(),
  cost_inr: z.number().nonnegative(),
  beneficiaries: z.number().int().nonnegative(),
  cost_per_beneficiary_inr: z.number().nonnegative(),
  score: z.number().min(0).max(1),
  sc_or_st: z.enum(['SC', 'ST', 'GEN']),
  eligibility: EligibilitySchema,
});
export type RecommendedWork = z.infer<typeof RecommendedWorkSchema>;

export const AllocResponseSchema = z.object({
  budget_inr: z.number().positive(),
  allocated_inr: z.number().nonnegative(),
  unallocated_inr: z.number().nonnegative(),
  sc_share: z.number().min(0).max(1),
  st_share: z.number().min(0).max(1),
  works: z.array(RecommendedWorkSchema),
  /** Greedy vs exact optimum gap, measured and reported per PRD 5. */
  greedy_gap: z.number().min(0).default(0),
});
export type AllocResponse = z.infer<typeof AllocResponseSchema>;

// ---------------------------------------------------------------------------
// Provenance (the hero screen)
// ---------------------------------------------------------------------------

export const ProvenanceSchema = z.object({
  work_id: z.string(),
  calculation: z.array(z.object({ step: z.string(), expression: z.string(), value: z.number() })),
  complaints: z.array(z.object({
    id: z.string(),
    text: z.string(),
    lang: LangSchema,
    theme: ThemeSchema,
    synthetic: z.boolean(),
  })),
  data_rows: z.array(z.record(z.string(), z.unknown())),
  vintages: z.array(SourceVintageSchema),
  missing_flags: z.array(z.string()).default([]),
});
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const HotspotSchema = z.object({
  shrid: z.string(),
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
  theme: ThemeSchema,
  complaint_count: z.number().int().nonnegative(),
  score: z.number().min(0).max(1),
});
export type Hotspot = z.infer<typeof HotspotSchema>;

export const ALL_SCHEMAS = {
  Theme: ThemeSchema,
  Complaint: ComplaintSchema,
  IngestRequest: IngestRequestSchema,
  IngestResponse: IngestResponseSchema,
  Weights: WeightsSchema,
  VillageScore: VillageScoreSchema,
  Eligibility: EligibilitySchema,
  RecommendedWork: RecommendedWorkSchema,
  AllocResponse: AllocResponseSchema,
  Provenance: ProvenanceSchema,
  Hotspot: HotspotSchema,
} as const;
