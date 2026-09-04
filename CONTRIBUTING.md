# Contributing

This is a Hack The Weather 2026 team repository (2–5 people, one Team Lead). We want a working, trusted Conduit action layer by **9 Sep 2026 15:00 EAT**, not a pile of unrelated experiments.

By participating you also follow the hackathon [Code of Conduct](https://hack-the-weather.devpost.com/rules) (respect, no harassment, no lifting other teams’ work).

## Before you write code

1. Read [README.md](README.md), [docs/problem.md](docs/problem.md), and [SECURITY.md](SECURITY.md).
2. Confirm you are registered on [Devpost](https://hack-the-weather.devpost.com/) and on only one competing team.
3. Join the team’s agreed channel (JHUB Discord plus whatever we use for PRs).
4. Do not commit secrets. See [SECURITY.md](SECURITY.md).

Substantial product work belongs in the official hackathon window (6–9 Sep). Before that: research, wireframes, environment setup, and reading public data are allowed.

## What we are building

**Hatua** — trust gate on Conduit instrument 61, then heat / UV, humidity, and rain-onset actions. We are **not** building a weather dashboard, a fake soil-moisture irrigator, or a national flood model.

If a change does not help that story, it does not belong on the default branch.

## How to contribute

1. Create a branch from the default branch: `feat/…`, `fix/…`, or `docs/…`.
2. Keep the diff small and on-purpose. Prefer changing existing files over adding new top-level folders.
3. Application code goes in `src/`. Tests go in `tests/`. Challenge notes stay in `docs/`. Station extracts stay in `data/`.
4. Files stay under ~500 lines. Split rather than grow a blob.
5. Do not add `.claude-flow/`, `.env`, or editor junk. They are gitignored for a reason.
6. Open a pull request against the default branch. Say **what** changed and **why** (user-facing or trust-gate behaviour, not a file list).
7. Another teammate reviews when possible. The Team Lead can merge.

Direct pushes to the default branch are for the Team Lead only, and only when a PR would miss the submission deadline.

## Commit messages

Use a short, imperative subject. Conventional prefixes help the log:

```
feat: flag rain gauge 2 as stuck
fix: stop treating health spikes as climate
docs: describe CHORDS ingest
```

Do not add a `Co-Authored-By` trailer for an AI tool unless this project’s settings explicitly require it. Humans on the team are the authors.

## Data and notebooks

- Prefer the existing GeoCSV in `data/`. If you pull a longer CHORDS archive, keep it under `data/` and say so in the PR (time range, instrument id).
- Do not commit derived dumps that contain API keys in the URL or file header.
- Notebooks are fine for exploration; they are not the product. The judged artefact is a running prototype plus README.

## AI tools

AI coding assistants are allowed by the official rules. You must still be able to explain the architecture, the Conduit fields, and the trust rules. If AI writes a meaningful chunk, note it in the PR so we can disclose it on Devpost.

Do not paste secrets into a prompt. Do not paste other teams’ code.

## Issues and questions

- Product / data questions: team chat or Devpost discussion, then Discord for organisers.
- Security: [SECURITY.md](SECURITY.md) — not a public issue.
- “Should we add satellite X?” — only if it residual-checks Conduit gauge 1 or serves a named action. Otherwise no.

## Pull request checklist

- [ ] Conduit remains load-bearing (unplugging station 61 would break the insight)
- [ ] No secrets, `.env`, or credentials in the diff
- [ ] README still matches what the app actually does
- [ ] Faulty series (gauge 2, cloned gust direction, health spikes) are not treated as climate
- [ ] I can demo or test the change locally

## Licence

Contributions are accepted under the [MIT Licence](LICENSE) already in this repository. Do not add third-party code whose licence we cannot meet. Attribute Conduit, CHORDS, and any extra datasets in the README.
