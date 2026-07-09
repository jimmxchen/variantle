# Personal ML/Neuro/BCI Skills — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 23 portable personal Claude Code skills under `~/.claude/skills/` that make Claude sharply better at ML research, computational neuroscience, BCI, CS coursework, and math — plus meta-skills that improve how Claude works.

**Architecture:** Each skill is a directory `~/.claude/skills/<name>/` containing a `SKILL.md` with a fixed five-section spine, plus an optional `references/` dir for heavy material (progressive disclosure). A single shared `~/.claude/skills/_shared/house-style.md` holds conventions (seed, checkpoint naming, repo layout, figure palette, default logger) so they never drift. Skills cross-reference each other and defer to already-installed tools (superpowers, code-review) rather than duplicating them.

**Tech Stack:** Markdown (SKILL.md content). Worked examples reference PyTorch, MNE-Python, pytest, matplotlib, and Jimmy's real artifacts. No runtime code ships in the skills beyond example snippets.

## Global Constraints

- Install root: `~/.claude/skills/` (personal, machine-wide). Never under a repo.
- Every `SKILL.md` frontmatter has exactly `name:` and `description:`; the `description` is written as a **trigger** ("Use when …") because it is all Claude sees when deciding to fire the skill.
- Every `SKILL.md` has the five-section spine: (1) Frontmatter, (2) Procedure as a numbered checklist, (3) House style / defaults, (4) Worked example, (5) Red flags / failure-modes table.
- ML examples are **PyTorch-concrete**. Neuro/ML-specific skills use **real artifacts** as worked examples; broadly-applicable skills use **generic** examples.
- Conventions live in exactly one place: `~/.claude/skills/_shared/house-style.md`. Skills reference it, never restate it.
- Non-duplication: defer planning to superpowers `writing-plans`, debugging to `systematic-debugging`, general code review to the `code-review` plugin. Skills add only their domain-specific value.
- Commits allowed for this work (lives outside any repo). Commit per skill. Never touch the variantle codebase.
- `name` must be kebab-case and match the directory name.

## Real artifacts available for dry-runs

- **Spike TSVs:** `~/Desktop/Jimmy Jacob neuro text files - Both Ice.tsv` (and `Both Clove`, `Head Only`, `Tail Only`). Format: comment lines starting `#`; data rows are `time<TAB>time<TAB>markerID,` where markerID 1=head, 2=tail, 5/9=open circuit.
- **PyTorch/RL code:** `~/Desktop/GitHub Projects/Team-Quantum/models/` (`DefaultCNN.py`, `PPO.py`), `model_training/`.
- **RL playground:** `~/Desktop/GitHub Projects/Lectures/rl_fun_times/`.
- **Untested backends:** `~/Desktop/GitHub Projects/nttracker/` (Flask + raw SQL).
- **Env sprawl:** `crown-env`, `cellular_automata_env`, per-project venvs, Anaconda.

---

## File Structure

```
~/.claude/skills/
  _shared/
    house-style.md          # single source of conventions
    SKILL-TEMPLATE.md        # the five-section spine, copy to start any skill
  <skill-name>/
    SKILL.md                 # required, five sections
    references/              # optional, heavy checklists/templates
```

Each skill directory is self-contained and independently testable. `_shared/` is built first (Task 0) because every later task reads `house-style.md`.

---

## Task 0: Foundation — shared conventions + skill template

**Files:**
- Create: `~/.claude/skills/_shared/house-style.md`
- Create: `~/.claude/skills/_shared/SKILL-TEMPLATE.md`

**Interfaces:**
- Produces: `house-style.md` conventions referenced by every skill; `SKILL-TEMPLATE.md` the five-section skeleton every skill copies.

- [ ] **Step 1: Write `house-style.md`** with these concrete conventions:

```markdown
# House Style (shared conventions)

Skills reference this file instead of restating conventions.

## Reproducibility
- Default seed: 1337. Set it for python, numpy, and torch (+ cuda) together.
- Deterministic torch: `torch.use_deterministic_algorithms(True)` when feasible; note the perf cost.

## Experiment tracking
- Default logger: lightweight JSON-lines run log committed next to code
  (`runs/<UTC-timestamp>_<git-short-sha>/{config.json,metrics.jsonl,checkpoint.pt}`).
- Escalate to Weights & Biases or MLflow only when explicitly requested.
- Every run records: full config, git sha, seed, dataset id/version, metric history.

## Checkpoint naming
- `<model>_<dataset>_<git-sha>_step<N>.pt`. Never overwrite; never anonymous `model.pth`.

## Research repo layout
- `data/` (raw, immutable) · `src/` (importable package) · `experiments/` (run scripts + configs) · `configs/` · `results/` · `README.md`.

## Figures
- Colorblind-safe palette (Okabe-Ito). Axis labels + units always. Font >= 12pt. Save vector (SVG/PDF) + 300dpi PNG.

## Testing
- pytest for Python, Vitest for TS/React. Test behavior, not implementation.

## Deferrals
- Planning -> superpowers:writing-plans. Debugging -> superpowers:systematic-debugging.
  General code review -> code-review plugin. Skills add only their domain value.
```

- [ ] **Step 2: Write `SKILL-TEMPLATE.md`** with the copy-ready spine:

```markdown
---
name: <kebab-name>
description: Use when <trigger condition>. <One clause on what it does.>
---

# <Title>

<One-sentence purpose.>

## Procedure
1. <step>
2. <step>

## House style / defaults
- Pulls conventions from `~/.claude/skills/_shared/house-style.md`.
- <skill-specific default>

## Worked example
<one concrete run-through>

## Red flags — you're doing it wrong if…
| Signal | Fix |
|--------|-----|
| <smell> | <correction> |
```

- [ ] **Step 3: Verify both files exist and template frontmatter is valid**

Run: `ls ~/.claude/skills/_shared/ && head -6 ~/.claude/skills/_shared/SKILL-TEMPLATE.md`
Expected: both files listed; frontmatter shows `name:` and `description:` keys.

- [ ] **Step 4: Commit**

```bash
cd ~/.claude/skills && git init -q 2>/dev/null; git add _shared && git commit -q -m "feat(skills): shared house-style + skill template"
```
(If `~/.claude/skills` is not its own repo and shouldn't be, skip git and note it — see Execution Handoff.)

---

## Per-skill task shape (applies to Tasks 1–23)

Every skill task has the same five steps. Only the **content** differs, and each task below supplies that content in full (description string, procedure, defaults, dry-run artifact, red flags).

1. **Author `SKILL.md`** — copy `SKILL-TEMPLATE.md`, fill all five sections with the content given in the task.
2. **Add `references/` if the task lists them** — heavy checklists/templates.
3. **Validate frontmatter** — `head -4 ~/.claude/skills/<name>/SKILL.md` shows valid `name:`/`description:`; `name` matches dir.
4. **Dry-run against the named artifact** — run the given prompt; confirm output matches the "Expected" description.
5. **Commit** — `git add <name> && git commit -m "feat(skills): add <name>"`.

Steps 3–5 are identical in form for every skill, so each task below specifies only Steps 1–2 content plus its **Dry-run** (Step 4) line.

---

# WAVE 1 — Core work-accelerators

## Task 1: experiment-tracker

**Files:** Create `~/.claude/skills/experiment-tracker/SKILL.md`; `references/run-logger.py`.

**description:** `Use when starting, refactoring, or reviewing a model training run so config, metrics, and checkpoints are logged and comparable across runs.`

**Procedure:**
1. Identify the run's config surface (hyperparameters, dataset id/version, seed, git sha).
2. Create the run dir per house-style (`runs/<UTC-ts>_<sha>/`).
3. Dump `config.json` before training; append `metrics.jsonl` per eval; save named checkpoints.
4. Print the run dir path so the user can find it.
5. Default to the JSON-lines logger; wire W&B/MLflow only if asked.

**House style / defaults:** logger + naming from house-style; JSON-lines default; escalate on request.

**references/run-logger.py:** a ~40-line drop-in `RunLogger` class (init writes config.json + git sha; `.log(step, **metrics)` appends jsonl; `.checkpoint(model, step)` saves named `.pt`).

**Dry-run (Step 4):** "Add experiment tracking to `Team-Quantum/models/PPO.py`." Expected: proposes a `runs/` dir, injects `RunLogger`, logs reward/loss per update, saves named checkpoints — no overwrite of anonymous `.pth`.

## Task 2: repro-guardrails

**Files:** Create `~/.claude/skills/repro-guardrails/SKILL.md`.

**description:** `Use when a training run or experiment must be reproducible — before publishing results, sharing a checkpoint, or comparing runs.`

**Procedure:**
1. Set seed 1337 across python/numpy/torch(+cuda) in one helper.
2. Enable deterministic algorithms; note the perf tradeoff.
3. Pin dataset id/version and dependency versions (lockfile).
4. Record git sha + dirty-tree warning.
5. Adopt the checkpoint naming convention; ban anonymous `model.pth`.
6. Output a filled repro checklist for the run.

**House style / defaults:** seed, determinism, checkpoint naming from house-style.

**Dry-run:** "Make this training script reproducible" against a snippet with no seeding. Expected: inserts a `set_seed(1337)` helper covering all RNGs, deterministic flag, and a checklist.

## Task 3: training-loop-audit

**Files:** Create `~/.claude/skills/training-loop-audit/SKILL.md`; `references/footguns.md`.

**description:** `Use when reviewing a PyTorch training or eval loop for correctness bugs before trusting its results.`

**Procedure (the footgun checklist):**
1. `optimizer.zero_grad()` present and correctly placed?
2. `model.train()` / `model.eval()` toggled around eval? `torch.no_grad()` for eval?
3. Device consistency (model, inputs, targets on same device)?
4. Loss reduction matches metric aggregation (mean vs sum)?
5. Metrics computed on the correct split — no train/val leakage?
6. Data shuffling on train, off on val/test?
7. LR scheduler stepped at the right cadence?
8. Gradient accumulation / clipping consistent with effective batch size?

**House style / defaults:** defer general review to code-review plugin; add only these ML checks.

**references/footguns.md:** each check with a wrong/right code snippet.

**Dry-run:** audit `Team-Quantum/model_training/` CNN loop. Expected: a checklist verdict citing real line numbers, flags any missing `zero_grad`/`eval()`.

## Task 4: notebook-to-module

**Files:** Create `~/.claude/skills/notebook-to-module/SKILL.md`.

**description:** `Use when exploratory notebook code is worth keeping — to promote it into an importable, tested Python module.`

**Procedure:**
1. Identify cells that are reusable logic vs one-off exploration.
2. Extract logic into pure functions with type hints in `src/<pkg>/`.
3. Replace notebook cells with imports from the new module.
4. Hand off to `test-bootstrapper` to generate tests.
5. Leave the notebook as a thin demo that imports the module.

**House style / defaults:** repo layout from house-style; cross-ref `test-bootstrapper`.

**Dry-run:** point at a notebook in `Lectures/`. Expected: proposes a `src/` module with extracted functions + an import-based notebook.

## Task 5: test-bootstrapper

**Files:** Create `~/.claude/skills/test-bootstrapper/SKILL.md`.

**description:** `Use when code has no tests — to generate a real pytest or Vitest suite covering its behavior and edge cases.`

**Procedure:**
1. Detect stack (pytest for Python, Vitest for TS/React).
2. Identify units and their observable behavior (inputs → outputs, side effects).
3. Write behavior tests first (happy path, boundary, failure), not implementation mirrors.
4. Add fixtures for shared setup; mock external I/O (DB, network).
5. Run the suite; report coverage of the targeted units.

**House style / defaults:** test behavior not implementation; defer general review to code-review.

**Dry-run:** target an untested `nttracker` Flask endpoint. Expected: a `test_*.py` with request/response + edge-case tests and a DB fixture/mock.

## Task 6: research-repo-scaffold

**Files:** Create `~/.claude/skills/research-repo-scaffold/SKILL.md`; `references/repo-skeleton/` (README template, dir stubs).

**description:** `Use when starting a new ML or neuroscience research project — to lay out a reproducible repo with research-grade docs.`

**Procedure:**
1. Create `data/ src/ experiments/ configs/ results/` + README.
2. README states: question, data provenance, how to reproduce, results index.
3. Add `.gitignore` for checkpoints/large data; add a `configs/` example.
4. Wire in `repro-guardrails` seed helper and `experiment-tracker` run dir.

**House style / defaults:** layout + docs from house-style; cross-ref repro + tracker skills.

**Dry-run:** "Scaffold a repo for the planarian nerve-conduction analysis." Expected: full tree + README naming the TSV data provenance.

---

# WAVE 2 — Domain + research literacy

## Task 7: spike-train-analysis

**Files:** Create `~/.claude/skills/spike-train-analysis/SKILL.md`; `references/tsv-format.md`.

**description:** `Use when analyzing spike-timing / event-marker electrophysiology data — to parse it and compute rasters, ISI, firing rates, and condition comparisons.`

**Procedure:**
1. Parse the TSV: skip `#` comments; columns = time, time, `markerID,` (strip trailing comma).
2. Map marker IDs (1=head, 2=tail, 5/9=open-circuit → drop).
3. Compute per-condition: raster, inter-spike-interval distribution, firing rate.
4. Compare conditions (Head/Tail/Both); hand statistics to `neuro-stats`.
5. Plot with `figure-polish` conventions.

**House style / defaults:** real TSV format documented in references; cross-ref neuro-stats + figure-polish.

**references/tsv-format.md:** the exact Jacob TSV schema with a sample.

**Dry-run:** run against `~/Desktop/Jimmy Jacob neuro text files - Both Ice.tsv`. Expected: correct parse (ignores comments, drops open-circuit), a raster + ISI + firing-rate summary.

## Task 8: neuro-stats

**Files:** Create `~/.claude/skills/neuro-stats/SKILL.md`; `references/test-picker.md`.

**description:** `Use when running statistics on neural/spike data — to pick the correct test and correction instead of a naive t-test.`

**Procedure:**
1. Characterize the data (counts? rates? paired? normal? small-n?).
2. Prefer permutation/bootstrap tests for spike counts and small samples.
3. Apply multiple-comparison correction (FDR/Bonferroni) across channels/bins.
4. Report effect sizes + CIs, not just p-values.
5. State assumptions checked and why the test fits.

**House style / defaults:** rigor-first; cross-ref spike-train-analysis.

**references/test-picker.md:** a decision table (data shape → recommended test).

**Dry-run:** "Compare firing rates Head vs Tail, n=12 events each." Expected: recommends a permutation test + effect size, not a bare t-test; mentions correction if multiple bins.

## Task 9: paper-digest

**Files:** Create `~/.claude/skills/paper-digest/SKILL.md`.

**description:** `Use when reading an ML or neuroscience paper (arXiv/PDF) — to produce a structured digest of method, results, and what to reproduce.`

**Procedure:**
1. Extract: problem, prior-work gap, method, key equations, datasets, results, limitations.
2. Note the single core idea in one sentence.
3. List what is reproducible and what to steal for your own work.
4. Flag claims that lack ablations or fair baselines.
5. Output a fixed-template digest.

**House style / defaults:** fixed digest template; cross-ref implement-from-paper.

**Dry-run:** digest a short arXiv abstract+method the user pastes. Expected: filled template with the one-sentence core idea + a "what to reproduce" list.

## Task 10: implement-from-paper

**Files:** Create `~/.claude/skills/implement-from-paper/SKILL.md`.

**description:** `Use when turning a paper's method section into a minimal, correct PyTorch implementation with a verification plan.`

**Procedure:**
1. Restate the method as equations/pseudocode; verify math with `derivation-check`.
2. Establish a `baseline-first` comparison and metric.
3. Implement the smallest faithful version; wire `experiment-tracker`.
4. Write a verification plan: unit tests for components, a sanity task with known answer.
5. Compare to the paper's reported numbers; log discrepancies.

**House style / defaults:** cross-ref derivation-check, baseline-first, experiment-tracker.

**Dry-run:** "Implement the PPO clipped objective from the method text." Expected: pseudocode → minimal torch module + a verification plan (gradient sanity, known-env reward).

## Task 11: baseline-first

**Files:** Create `~/.claude/skills/baseline-first/SKILL.md`.

**description:** `Use before building anything sophisticated — to establish and document a dumb baseline and the metric it must beat.`

**Procedure:**
1. Define the metric and how it's measured.
2. Implement the dumbest reasonable baseline (majority class, random policy, linear model).
3. Record its score in the run log.
4. Only then propose the fancier approach, stated as "must beat X".

**House style / defaults:** cross-ref experiment-tracker for logging the baseline.

**Dry-run:** "I want to train a CNN to classify these." Expected: insists on a majority-class / logistic-regression baseline + metric before the CNN.

## Task 12: research-log

**Files:** Create `~/.claude/skills/research-log/SKILL.md`.

**description:** `Use when doing research over multiple sessions — to maintain a dated lab-notebook of hypothesis, what was tried, result, and next step.`

**Procedure:**
1. Append a dated entry: hypothesis → what I tried → result (with run link) → next step.
2. Keep it in `results/research-log.md` in the repo.
3. Link entries to run dirs from `experiment-tracker`.
4. Surface stale open questions at session start.

**House style / defaults:** entry template; cross-ref experiment-tracker.

**Dry-run:** "Log today: tried lr=3e-4, reward plateaued at 200." Expected: a correctly-formatted dated entry with a next-step prompt.

---

# WAVE 3 — CS / math / meta + remaining stretch

## Task 13: algorithms-coach

**Files:** Create `~/.claude/skills/algorithms-coach/SKILL.md`.

**description:** `Use when solving a data-structures/algorithms problem for coursework or interviews — to analyze it rigorously before and after coding.`

**Procedure:**
1. Restate the problem + constraints in your own words.
2. Name the pattern (two-pointer, DP, graph, greedy…).
3. State the target time/space complexity budget.
4. Enumerate edge cases before coding.
5. After coding, verify the solution against every edge case + the complexity claim.

**House style / defaults:** teach the analysis, don't just hand a solution.

**Dry-run:** "Solve: longest substring without repeating characters." Expected: pattern named (sliding window), complexity budget stated, edge cases listed, then verified solution.

## Task 14: code-reading

**Files:** Create `~/.claude/skills/code-reading/SKILL.md`.

**description:** `Use when getting oriented in an unfamiliar codebase or library — to map entry points, data flow, and where to make a change.`

**Procedure:**
1. Find entry points (main, exports, routes, `__init__`).
2. Trace the primary data flow through the key modules.
3. Identify the core abstractions and their boundaries.
4. Locate exactly where the intended change goes + what it touches.
5. Output a short map + the change site.

**House style / defaults:** generic example (portable across repos).

**Dry-run:** "Help me understand how chessops is used in variantle." Expected: entry points → data flow → the files a change would touch.

## Task 15: cs-concept-explain

**Files:** Create `~/.claude/skills/cs-concept-explain/SKILL.md`.

**description:** `Use when learning a CS or ML concept deeply — to explain it from first principles with a runnable example and the common misconception.`

**Procedure:**
1. First-principles explanation (why it exists, what problem it solves).
2. Minimal runnable example.
3. The one misconception that trips people up, stated and corrected.

**House style / defaults:** generic; distinct from math-intuition (math) and paper-digest (papers).

**Dry-run:** "Explain attention." Expected: first-principles → tiny runnable numpy example → the "it's not just averaging" misconception.

## Task 16: derivation-check

**Files:** Create `~/.claude/skills/derivation-check/SKILL.md`.

**description:** `Use when verifying a mathematical proof or derivation — to check each step and flag every hand-wave or unjustified jump.`

**Procedure:**
1. Restate what is being proved + the assumptions.
2. Check each step: does it follow from the previous by a named rule?
3. Flag jumps ("clearly", "it follows") that skip justification.
4. Note where an assumption is silently used.
5. Verdict: valid / gap-at-step-N / wrong.

**House style / defaults:** generic; cross-ref implement-from-paper.

**Dry-run:** check a short pasted derivation (e.g. bias-variance decomposition). Expected: per-step verdict, flags any skipped algebra.

## Task 17: math-intuition

**Files:** Create `~/.claude/skills/math-intuition/SKILL.md`.

**description:** `Use when building intuition for linear algebra, probability, or optimization — via first principles plus a runnable numerical demo and a visualization.`

**Procedure:**
1. First-principles framing of the concept.
2. A small numpy demo that makes it concrete.
3. A visualization that shows the behavior.
4. Connect it to where it shows up in ML.

**House style / defaults:** figure conventions from house-style; generic examples.

**Dry-run:** "Give me intuition for eigenvectors." Expected: framing → numpy demo (matrix acting on vectors) → a plot → PCA/ML connection.

## Task 18: decompose-and-verify

**Files:** Create `~/.claude/skills/decompose-and-verify/SKILL.md`.

**description:** `Use when a problem is hard or ambiguous — to break it into a dependency-ordered set of small pieces, each with a concrete "done when" check.`

**Procedure:**
1. State the goal in one line.
2. List sub-problems; order them by dependency.
3. Give each a "done when" verifiable check.
4. Identify the riskiest piece to attempt first.
5. Stop — hand implementation to `writing-plans` if it's a build.

**House style / defaults:** lighter than writing-plans; defer full plans to it.

**Dry-run:** "I want to decode movement direction from EEG." Expected: ordered sub-problems (acquire → preprocess → feature → decoder → eval), each with a done-when.

## Task 19: assumption-surfacer

**Files:** Create `~/.claude/skills/assumption-surfacer/SKILL.md`.

**description:** `Use before executing an ambiguous request — to surface the hidden assumptions and name the riskiest one to confirm first.`

**Procedure:**
1. List the interpretations the request allows.
2. Make the implicit assumptions explicit.
3. Rank by risk (what's costliest if wrong).
4. Ask about the top risk before proceeding; note assumptions taken if running unattended.

**House style / defaults:** operationalizes CLAUDE.md rule #1; generic.

**Dry-run:** "Clean up the data." Expected: surfaces interpretations (dedupe? impute? drop outliers?) and asks about the riskiest before acting.

## Task 20: env-consolidator

**Files:** Create `~/.claude/skills/env-consolidator/SKILL.md`.

**description:** `Use when Python environments have sprawled — to audit conda/venvs and produce one reproducible spec plus lockfile per project.`

**Procedure:**
1. Inventory environments (conda envs, venvs, per-project `.venv`).
2. Map which project actually needs which packages.
3. Emit one canonical `environment.yml` or `requirements.txt` + lockfile per project.
4. Flag orphans (e.g. stray `path/to/venv`) for deletion.

**House style / defaults:** one reproducible env per project.

**Dry-run:** run against Jimmy's env list (`crown-env`, per-project venvs). Expected: a consolidation plan + per-project lockfile proposal + orphan flags.

## Task 21: sweep-runner

**Files:** Create `~/.claude/skills/sweep-runner/SKILL.md`.

**description:** `Use when tuning hyperparameters — to run a structured sweep (grid/random/Optuna) with results collated instead of ad-hoc loops.`

**Procedure:**
1. Define the search space + objective metric.
2. Pick strategy (grid for small, Optuna for larger).
3. Log each trial via `experiment-tracker` (config → metric).
4. Collate results into a ranked table + best config.

**House style / defaults:** cross-ref experiment-tracker; Optuna default for >2 dims.

**Dry-run:** "Sweep lr and batch size for the PPO agent." Expected: an Optuna study wiring each trial to the run logger + a results table.

## Task 22: eeg-bci-pipeline

**Files:** Create `~/.claude/skills/eeg-bci-pipeline/SKILL.md`; `references/mne-recipe.md`.

**description:** `Use when building an EEG/neural-signal decoding pipeline — to preprocess signals toward a decoder using MNE-Python idioms.`

**Procedure:**
1. Load raw signal (MNE `Raw`); set montage/reference.
2. Filter (band-pass, notch); reject artifacts (ICA/threshold).
3. Epoch around events; baseline-correct.
4. Extract features (band power, CSP) → decoder.
5. Cross-validate with subject-aware splits (no leakage).

**House style / defaults:** MNE idioms in references; cross-ref baseline-first, neuro-stats.

**references/mne-recipe.md:** the canonical filter→epoch→ICA→CSP snippet.

**Dry-run:** "Set up motor-imagery decoding from EEG." Expected: an MNE preprocessing → CSP → classifier pipeline with subject-aware CV.

## Task 23: figure-polish

**Files:** Create `~/.claude/skills/figure-polish/SKILL.md`.

**description:** `Use when a matplotlib figure needs to be publication-quality — to apply consistent, colorblind-safe, fully-labeled styling.`

**Procedure:**
1. Apply the Okabe-Ito colorblind-safe palette.
2. Label axes with units; title; legend; >=12pt fonts.
3. Remove chartjunk; set consistent figure size + dpi.
4. Save vector (SVG/PDF) + 300dpi PNG.

**House style / defaults:** figure conventions from house-style.

**Dry-run:** polish a basic `plt.plot` of firing rate vs condition. Expected: labeled, palette-corrected, dual-format save.

---

## Self-Review

**Spec coverage:** All 23 skills in the spec map to Tasks 1–23; Wave 0 foundation (house-style + template) = Task 0; the five-section spine + shared conventions file + non-duplication guardrail are Global Constraints enforced per task. Build order matches the spec's waves. ✓

**Placeholder scan:** No "TBD/TODO/handle edge cases". Each task carries its real description string, real procedure steps, and a concrete dry-run artifact + expected output. The per-skill Steps 3–5 are defined once in "Per-skill task shape" (identical in form) rather than repeated 23× — this is deliberate deduplication of *identical mechanical steps*, not omitted content; every task's *substance* (Steps 1–2 + Dry-run) is spelled out. ✓

**Type consistency:** Cross-references resolve to skills defined in this plan (`test-bootstrapper`, `derivation-check`, `baseline-first`, `experiment-tracker`, `neuro-stats`, `figure-polish`, `writing-plans`) and to installed tools. `RunLogger` API (`.log`, `.checkpoint`) referenced consistently by experiment-tracker, sweep-runner, baseline-first. ✓

**Open decision for execution:** whether `~/.claude/skills/` should be its own git repo (Task 0 Step 4). Resolve at handoff.
