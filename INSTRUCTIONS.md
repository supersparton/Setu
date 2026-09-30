# INSTRUCTIONS.md — Operating Rules for This Repo
**Read this before writing a single line of code. Applies to every human and every AI agent on the team.**

Read alongside: `SETU_FINAL.md` (frozen spec) · `PRD.md` (scope + phases) · `TEAM.md` (ownership + hours)

---

## 0. The one rule that overrides everything else

**`main` is what we submit.** Freeze is H+9 = 20:30. A broken `main` is a failed submission,
regardless of how good the branch is.

Everything below exists to protect that sentence.

---

## 1. Non-negotiables

1. **Never commit directly to `main`.** No exceptions. Not for a typo, not for a README fix,
   not because it is 22:55 and you are panicking.
2. **Every change starts on a new branch**, created *before* the first edit.
3. **Merge happens through a pull request**, opened by the author, merged by someone else.
   Self-merge your own PR only with an explicit `APPROVED` in the PR thread.
4. **`main` must be deployable at every commit.** If it is broken, that is the top-priority bug.
5. **No secrets, ever.** Not in code, not in a committed `.env`, not in a log line, not in a
   screenshot in the deck.
6. **A wrong number in a screenshot is a worse bug than a missing feature.** The product is an
   evidence receipt. Its credibility is the whole product.

---

## 2. Bootstrap — do this once, right now

```powershell
cd D:\Google-hackathon
git init
git branch -M main

git add SETU_FINAL.md PRD.md TEAM.md INSTRUCTIONS.md .env.example .gitignore
git commit -m "docs: frozen spec, phased PRD, team ownership, operating rules"
```

Then create the remote and push:

```powershell
gh repo create setu --public --source=. --remote=origin --push
```

Verify before continuing:

```powershell
git status                 # must be clean
git branch --show-current  # must print: main
git log --oneline          # must show the docs commit
```

`.env.example` is committed. `.env` is **never** committed. Confirm `.gitignore` contains it:

```
.env
.env.*
!.env.example
node_modules/
dist/
__pycache__/
*.pyc
cache/
data/*.dta
.DS_Store
```

`data/*.dta` is ignored on purpose: the Mission Antyodaya file is large and redistributing it
would breach its licence. The build script downloads it, the commit contains only derived JSON.

---

## 3. Branching

### Naming

```
<type>/<owner>-<short-description>
```

`type` ∈ `feat` · `fix` · `docs` · `chore` · `data` · `infra`

The `owner` segment is not decoration. It routes the PR.

| Good | Bad |
|---|---|
| `feat/p1-infra-gap` | `feature` |
| `feat/p2-ingest-endpoint` | `stuff` |
| `fix/p3-receipt-vintage-label` | `final` |
| `chore/p2-cloudrun-deploy` | `wip-2` |

### Rules

- **One branch, one job.** If the branch name needs an "and," split it.
- **Branch from an up-to-date `main`**, not from another feature branch. Feature branches do not
  stack; we do not have the time to untangle a three-deep chain before freeze.
- **Rebase on `main` before opening the PR**, so the reviewer reads a clean diff.
- **Delete the branch after merge.** `--delete-branch` on merge. Branches cost nothing but
  confusion at H+8.
- **A branch lives at most 6 hours.** Anything older is either merged or abandoned. State a
  branch's purpose in the PR title within the first hour.

### Why "ask before you merge" matters here

Three people, one laptop-swap away from each other, twelve hours. A direct push to `main` from
P2 while P1 is mid-scoring gives P1 a broken `build_infra_index.py` with no way to get back to a
known-good state. The PR is not ceremony here — it is a rollback path.

---

## 4. Pull requests

### Opening one

```powershell
git switch -c feat/p1-infra-gap
# ... work, with at least one commit ...
git fetch origin
git rebase origin/main
git push -u origin feat/p1-infra-gap
gh pr create --base main --fill
```

A PR description that gets merged in under a minute:

```markdown
## What
One or two sentences. The number that changes, if any.

## Why
Which PRD phase / which differentiator (PRD.md §2).

## Evidence
- Acceptance criterion: `[ ]` → `[x]`, PRD.md §5
- Command run, and its output
- Screenshot for any UI change

## Risk
- What breaks if this is wrong
- What was deliberately NOT done
```

### Merging

- **Squash merge.** One commit per PR. Linear history, trivial revert, fast bisect before freeze.
- **One approval, from someone other than the author.** A PR that touches a `shared/` file needs
  the owner of that file to approve. See §5.
- **Review within 15 minutes during the build window.** If review is blocked, say so in the group
  chat immediately. A stalled PR at H+6 is a schedule failure.
- **Delete the branch on merge.**

### When the schedule genuinely cannot wait

At H+6 or later, a one-line typo fix on the demo path may go through as a PR that is opened and
merged within the same minute by the other person. That is still a PR. The *record* is what
matters — it is the audit trail that proves `main` was never broken. **A direct push to `main`
leaves no such record and is never acceptable.**

---

## 5. Review matrix — who must approve what

Derived from `TEAM.md` §2. An approval from the wrong person is not an approval.

| Path | Must be approved by |
|---|---|
| `src/shared/**`, `/api/schema` | **P2** (author) **+ P1** (consumer of the data contract) |
| `build_infra_index.py`, anything under `data/` | **P2** (author) **+ P1** (owns the fields) |
| `src/scoring/**`, `allocator`, `eligibility` | **P1** |
| `src/llm/**`, `Dockerfile`, `cloudbuild.yaml`, `wrangler`/`cloudrun` config | **P2** |
| `public/**` (all UI) | **P3** |
| Anything that changes a number rendered on screen | **P1** |
| Anything that changes a claim in the deck or README | **P1** |
| `.github/**`, `INSTRUCTIONS.md`, `TEAM.md` | any, inform all three |

**Two-person rule for the receipt:** the evidence receipt is the hero screen. No PR that touches
provenance joins without P1 *and* P3 agreeing that a number on it can be defended. If a
provenance row cannot be produced, the row does not ship.

---

## 6. Commits

### Format — Conventional Commits, with a scope

```
<type>(<scope>): <subject>

<body — why, not what. What is visible in the diff.>

Refs: PRD §4 Phase 2
```

| Type | Use for |
|---|---|
| `feat` | new capability |
| `fix` | bug fix — body must say what was wrong, not what changed |
| `docs` | documentation only |
| `chore` | deps, config, scaffolding |
| `data` | converter, index build, schema of derived data |
| `infra` | deploy, CI, repo plumbing |

Scopes match the spec: `scoring`, `allocator`, `eligibility`, `ingest`, `enrich`, `cache`,
`provenance`, `index`, `ui`, `receipt`, `deploy`.

### Examples

```
fix(scoring): clamp r to 0.3-1.0 before weighting

r_raw went to 0 in the sparsest constituency, which pushed those
villages to the bottom of the ranking for a reason that is an artifact
of the normalisation, not of need. Clamped per SETU_FINAL.md §7.2.
Asserted in eval.ts.

Refs: PRD §5 Scoring
```

```
feat(ui): add vintage + DATA_MISSING label to receipt rows

Every number now opens its source, and a missing datum is visibly
missing rather than a silent 0.5. A judge can tell the difference
between "we have no data" and "the need is average".

Refs: PRD §5 Evidence
```

### Rules

- Imperative mood, no capital, no full stop.
- **Never** `fixed stuff`, `wip`, `asdf`, `final v2`, `temp commit`.
- One logical change per commit. A commit that does two things is two commits.
- **WIP commits are local only.** Rebase or squash before pushing — the reviewer should not read
  your scratch work.
- **Amend freely before the push; never rewrite pushed history** on a shared branch.

---

## 7. Secrets and data

```bash
# .env — gitignored, never committed
GEMINI_API_KEY=...
CONGRESS=<your constituency key>
```

- `.env.example` is committed and contains **only key names**, no values.
- The API key is read from `process.env` and fails loudly if absent. No fallback value, ever.
- CI uses a repository secret, not a committed file.
- **Before every public push:** `git log -p --all | Select-String 'AIza'` must return nothing.
- Derivative data (complaints, allocations) is committed — that is the reproducible artifact.
  The raw `.dta` is not, per its licence.
- Synthetic complaints carry `synthetic: true` in the API, the UI, and the README. There is no
  version of this project where generated data is presented as collected data.

---

## 8. Definition of done — a PR is not done until all of these

- [ ] Acceptance criterion in `PRD.md` §5 ticked, with the command or screenshot that proves it
- [ ] `npm run build` clean; `npm test` green; `npm start` boots
- [ ] No `console.log`, no commented-out block, no `TODO` left without an owner
- [ ] No secret in the diff
- [ ] `src/shared/**` changes ship in their own PR, with `/api/schema` regenerated
- [ ] Anything new is in `.gitignore` if it is generated
- [ ] PR description answers *why*, and links the phase
- [ ] **Reviewer can reproduce the claim from the description alone**

---

## 9. Agent-specific rules

**Before the first edit of any task:**

```powershell
git fetch origin
git switch main
git pull --ff-only
git switch -c <type>/<owner>-<description>
git status          # must be clean
```

**Then, and only then, edit.** Never edit on `main`. If you find yourself editing on `main`,
stop, `git stash`, branch, unstash, and continue.

**At the end of any task:**

1. `git status` — nothing unexpected
2. `git add` **specific paths**, never `git add -A`
3. Review your own diff before committing: `git diff --cached`
4. Commit with Conventional Commits and a scope
5. Push the branch
6. **Open the PR. Then stop and ask the user to review and merge it.** Never merge your own PR
   without an explicit instruction to do so.
7. Report back: branch name, PR URL, what changed, what was deliberately not done, and what
   still needs a human decision.

**Never do these, even if asked in passing:**

- Push to `main`
- Merge a PR without being told to
- `git reset --hard` or `git checkout .` on someone else's work
- Force-push to a shared branch
- Amend or rebase a commit that is already on someone else's branch
- Commit `.env`, a `dist/` build, `node_modules/`, or a raw `.dta`
- Report a task as done without having run the check that proves it
- Silently change a scoring weight, a threshold, or a claim

**The last one is the important one.** If a task requires a number, a threshold, or a claim to
change, and the instruction is ambiguous, ask. Do not pick a defensible-looking value and move
on. On this project an invented threshold is indistinguishable from a result, and that is the
exact failure the receipt exists to prevent.

---

## 10. Before freeze — H+9 = 20:30

No new code after this. From H+9 the only allowed PRs are bug fixes on the demo path, and each
one still goes through a PR.

```powershell
# Is main clean and green?
git fetch origin
git status
git log --oneline origin/main -20
npm ci
npm run build
npm test
npm start          # boots clean?

# Any secret anywhere in history?
git log -p --all | Select-String 'AIza|sk-|BEGIN PRIVATE KEY'

# Clean-clone rehearsal — the acceptance test that matters
$env:CLONE_DIR = "$env:TEMP\setu-clean"
Remove-Item -Recurse -Force $env:CLONE_DIR -ErrorAction SilentlyContinue
git clone $PWD $env:CLONE_DIR
cd $env:CLONE_DIR
npm ci
npm start
```

- [ ] `main` is green and deployable
- [ ] Clean clone boots with `npm ci && npm start`
- [ ] No secret in any commit
- [ ] Cloud Run serves that exact `main` commit
- [ ] Public URL works from a phone on mobile data
- [ ] Video recorded and plays
- [ ] Deck numbers match `eval.ts` output
- [ ] CC-BY-4.0 licence present

**Submit by H+10.5 = 22:00.** One hour of buffer is not optional — it absorbs the
Cloudflare/cloud/portal failure that would otherwise end the project at 22:59.
