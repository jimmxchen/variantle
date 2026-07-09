# Design: Personal Claude Code Skills for ML Research, Comp-Neuro & BCI

**Date:** 2026-07-06
**Author:** Jimmy Chen (with Claude)
**Status:** Approved design — ready for implementation planning

## Goal

Build a portable library of **23 personal Claude Code skills** that make Claude
Code sharply better at helping Jimmy do — and grow into — AI/ML research,
computational neuroscience, and BCI work. Skills install to `~/.claude/skills/`
so they apply across every repo on the machine (Team-Quantum, nttracker, neuro
analysis, variantle, coursework), not just this one.

**Completion (one line):** All 23 skills exist under `~/.claude/skills/`, each
passes its five-section spine check and a dry-run against a real artifact, and no
skill duplicates an existing superpowers or code-review capability.

## Context that shaped this

Jimmy is an incoming freshman at a top university, operating well above that level
(teaches, ships production apps, does real RL). A codebase survey across his
machine found consistent strengths and gaps:

- **Strengths:** full-stack TS/Next.js; Python (Flask, raw SQL, Docker, CI);
  real ML (PyTorch CNNs, PPO/A2C/DQN RL, gym, CMA-ES, xgboost/sklearn/statsmodels);
  sophisticated, deliberate Claude Code user (custom governance prompts, CHANGES logs).
- **Gaps the skills target:** no test culture; ad-hoc experiment tracking
  (CSV/JSON/`.pth` dumps, results not tied to configs); conda + multi-venv sprawl;
  manual numbered-file versioning; notebook↔script mixing with no promotion path;
  strong docs for apps but none for research data (raw electrophysiology TSVs with
  no pipeline).

**Decisions locked during brainstorming:**
- Mix: mostly work-accelerators, growth-scaffolds included (blend "C").
- ML skills are **PyTorch-concrete**, not framework-agnostic.
- Install location: **personal** (`~/.claude/skills/`).
- Examples: **hybrid** — real artifacts for neuro/ML-specific skills, generic for
  broadly-applicable ones (author's judgment per skill).
- Conventions live in **one shared `references/house-style.md`** that skills import.

## Non-duplication guardrail

These skills must **not** re-implement capabilities Jimmy already has installed.
They cross-reference instead:
- superpowers: `brainstorming`, `writing-plans`, `systematic-debugging`,
  `using-superpowers`.
- `code-review` plugin and the `ecc:*` review agents.

Concretely: planning-heavy work defers to `writing-plans`; debugging-heavy work
defers to `systematic-debugging`; general code review defers to `code-review` —
the ML skills add only the ML-specific checks on top.

## The 23 skills

Each line: **name** — the repeatable procedure it encodes.

### Experiment & reproducibility (biggest gap)
1. **experiment-tracker** — wire a training run so config → metrics → checkpoint
   are logged and comparable. Default: lightweight JSON+git logger; escalate to
   W&B/MLflow on request.
2. **repro-guardrails** — reproducibility checklist applied for real: seed
   everything, pin data + deps, deterministic flags, checkpoint naming.
3. **training-loop-audit** — review a PyTorch loop against the footgun list:
   missing `zero_grad`, train/eval mode, device mismatch, wrong loss reduction,
   metric on the wrong split, data leakage.

### Code structure
4. **notebook-to-module** — promote exploratory notebook code into an importable,
   tested package. Hands off to `test-bootstrapper`.
5. **test-bootstrapper** — generate real pytest/Vitest suites for untested code
   (RL envs, Flask endpoints, React components). Defers to `code-review` for
   general review.
6. **research-repo-scaffold** — lay out a new ML/neuro repo
   (`data/ src/ experiments/ configs/` + README) with research-grade docs.

### Neuro / BCI
7. **spike-train-analysis** — parse the electrophysiology TSVs → rasters, ISI,
   firing rates, condition comparison (Head/Tail/Both). Worked example uses the
   real Jacob TSV format.
8. **neuro-stats** — pick the right test for neural data: permutation tests,
   multiple-comparison correction, effect sizes.
9. **eeg-bci-pipeline** *(stretch)* — EEG/neural signal preprocessing toward a
   decoder (MNE-Python idioms).

### Research literacy (growth-scaffolds that are genuinely repeatable)
10. **paper-digest** — arXiv/PDF → structured digest: problem, method, key
    equations, results, limitations, what to reproduce or steal.
11. **implement-from-paper** — method section → minimal correct PyTorch
    implementation + verification plan. Uses `derivation-check`, `baseline-first`,
    `experiment-tracker`.
12. **baseline-first** — force a documented dumb baseline + metric before anything
    fancy.
13. **research-log** — maintain a dated lab-notebook: hypothesis → tried → result
    → next step.

### CS-major coding track
14. **algorithms-coach** — DSA problem: restate → name the pattern → complexity
    budget → edge cases → verify solution.
15. **code-reading** — rapidly map an unfamiliar codebase/library: entry points →
    data flow → key abstractions → where to change.
16. **cs-concept-explain** — learn a CS/ML concept: first-principles explanation →
    minimal runnable example → the one common misconception.

### Math track
17. **derivation-check** — verify a proof/derivation step-by-step, flag every
    hand-wave and unjustified jump.
18. **math-intuition** — build intuition for the ML-math trio (linear algebra,
    probability, optimization) via first principles + runnable demo + visualization.

### Meta-skills (help Claude think better / waste less)
19. **decompose-and-verify** — break a hard/ambiguous problem into a
    dependency-ordered set of small pieces, each with a "done when" check. Lighter
    than `writing-plans`.
20. **assumption-surfacer** — before executing an ambiguous request, surface hidden
    assumptions and name the riskiest one to check first. Operationalizes
    `CLAUDE.md` rule #1 across every repo.

### Remaining stretch
21. **env-consolidator** — audit conda + multi-venv sprawl into one reproducible
    spec + lockfile per project.
22. **sweep-runner** — structured hyperparameter sweeps (Optuna/grid) with collated
    results.
23. **figure-polish** — matplotlib → publication-quality figures (labeled,
    colorblind-safe, consistent style).

## Shared anatomy (every skill)

Directory `~/.claude/skills/<name>/` with a `SKILL.md` and optional `references/`
for heavier material (checklists, code templates) that loads only when needed
(progressive disclosure, as `stop-slop` does).

Every `SKILL.md` has the same five-section spine:
1. **Frontmatter** — `name` + a `description` written as a *trigger* (when to fire),
   since the description is all Claude sees when deciding to use the skill.
2. **The procedure** — a numbered checklist, not prose.
3. **House style / defaults** — the opinionated choices; pulls shared conventions
   from `references/house-style.md`.
4. **A worked example** — one concrete run-through (real artifact for
   neuro/ML-specific skills, generic otherwise).
5. **Red flags / failure modes** — a "you're doing it wrong if…" table.

### Shared conventions file
`~/.claude/skills/references/house-style.md` (or a shared location the skills
reference) holds conventions that live in exactly one place: seed value, checkpoint
naming, research-repo layout, figure palette, default logger. Multiple skills read
it so conventions don't drift.

### Cross-references (illustrative)
- `notebook-to-module` → `test-bootstrapper`
- `implement-from-paper` → `derivation-check`, `baseline-first`, `experiment-tracker`
- `training-loop-audit`, `test-bootstrapper` → `code-review` plugin (general),
  add ML-specific checks only
- planning-heavy → `writing-plans`; debugging-heavy → `systematic-debugging`

## Build order

**Wave 0 — Foundation:** `references/house-style.md` + the skill template/anatomy.
Not a skill; the scaffold the rest import.

**Wave 1 — Core work-accelerators:** experiment-tracker, repro-guardrails,
training-loop-audit, notebook-to-module, test-bootstrapper, research-repo-scaffold.

**Wave 2 — Domain + research literacy:** spike-train-analysis, neuro-stats,
paper-digest, implement-from-paper, baseline-first, research-log.

**Wave 3 — CS/math/meta + remaining stretch:** algorithms-coach, code-reading,
cs-concept-explain, derivation-check, math-intuition, decompose-and-verify,
assumption-surfacer, env-consolidator, sweep-runner, eeg-bci-pipeline, figure-polish.

## Per-skill completion check ("done when")

A skill is complete when:
- (a) `SKILL.md` has all five spine sections;
- (b) its `description` is a clean trigger phrase;
- (c) cross-references resolve to real skills/tools;
- (d) it has been dry-run once against a real artifact (or representative snippet)
  and produced sensible output.

The whole set is done when all 23 pass and no skill duplicates an existing
superpowers/code-review capability.

## Out of scope

- Modifying existing superpowers or code-review plugins.
- A grad-application/portfolio skill (premature for an incoming freshman).
- Any changes to the variantle app code — this spec only adds `docs/` here; the
  skills themselves land in `~/.claude/skills/`.
