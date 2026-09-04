# Security policy

This repository is a student hackathon project (Hack The Weather 2026). It still handles live environmental APIs, deployment credentials, and possibly notification tokens. Treat those as secrets.

## Supported versions

Only the default branch (`main` / `master`) is supported. There is no long-term release train. If we tag a demo for judging, that tag is in scope until the hackathon judging window ends (15 Sep 2026).

## What is in scope

- Secrets or credentials committed to git or leaked in issues, Discord, or the Devpost video
- Remote code execution, injection, or auth bypass in any app we ship
- Path traversal or unrestricted file reads on the demo host
- Abuse of Conduit / CHORDS credentials we hold
- Exposure of teammate personal data (emails, phones, API tokens)

Weather observations from Conduit@Empathy / 3D-PAWS are environmental time series, not personal data. Do not mix them with names, phone numbers, or student IDs in the same store.

## What is out of scope

- Bugs in [conduit.jhubafrica.com](https://conduit.jhubafrica.com/), CHORDS, or third-party forecast APIs — report those to the operators
- Theoretical issues in dependencies with no path in this repo
- Missing soil / vegetation / water-quality series (data gap, not a vulnerability)
- Social-engineering of judges or other teams

## Reporting a vulnerability

**Do not open a public GitHub issue for a security problem.**

Email the repository owner and the team lead with:

- A short description of the issue and impact
- Steps to reproduce or a proof of concept (no mass scanning)
- Affected file paths or URLs if known
- Whether you plan to disclose, and on what timeline

Contact: the GitHub account that owns this repository, or the Team Lead listed in the README.

If the issue involves Conduit or JKUAT systems rather than this code, also tell JHUB via [info.jhub@jkuat.ac.ke](mailto:info.jhub@jkuat.ac.ke) so they can rotate keys if needed.

We will acknowledge a valid report as soon as we see it, patch or rotate before the demo if we can, and credit you in the README if you want that.

## Secrets and credentials

Never commit:

- `.env`, `.env.*`, PEM/key files, `credentials.json`
- CHORDS `email` / `api_key` query parameters
- Conduit signup API keys from `conduit.jhubafrica.com`
- SMS / WhatsApp / cloud tokens
- SSH keys or cookies

The Conduit twin dashboard embeds third-party CHORDS credentials in frontend JavaScript. **Do not copy those values into this repo.** If live fetches need auth, put them in environment variables on the developer machine or host. Document the *names* of the variables in the README, not the values.

If a secret lands in git:

1. Rotate it with the provider (CHORDS, Conduit, SMS, cloud).
2. Remove it from the tree on a new commit.
3. Assume the old value is public even after `git rm`.
4. Tell the team on a private channel, not in a public issue.

## Data handling

- The shared GeoCSV under `data/` is station telemetry. Keep it in `data/`. Do not scrape or republish personal information.
- Do not log full API URLs that contain keys.
- Demo accounts should be throwaway. Do not reuse personal passwords.
- Public GitHub is required for judging. Assume every file in the default branch is world-readable.

## Application rules (when code exists)

- Validate and bound query parameters (`start`, `end`, station id).
- Do not interpolate raw sensor strings into HTML without escaping.
- Do not disable TLS to talk to CHORDS or Conduit.
- Rate-limit any outbound alert channel so a bad loop cannot spam a phone number.
- Health values such as `33501705` are sensor faults. Do not treat them as user input to eval or as array indices.

## Hackathon disclosure

Official rules require teams to explain the system and to disclose significant AI use. That is not a licence to paste secrets into the README, the demo video, or Discord screenshots. Redact keys in recordings.
