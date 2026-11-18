# Slips

A slip is one job's own note. Each job conversation writes exactly one: `docs/slips/<name>.md`, where `<name>` is the
job's name on the board and its branch is `job/<name>`. Nobody else edits it. The hub reads it when it brings the job
into `main`.

There are no slips yet: no job has started.

## What a slip holds

Keep it short and in plain words. Update it as you go, not only at the end.

```
# <name>: <what the job is, in a few words>

Branch: job/<name>      Last commit: <short hash>      Updated: <date and time>

## What it built
- <each piece, and the file to open>

## What Chris said here
- <each decision he made in this conversation, with the date>

## What was copied in
- <each asset, and that its line is in assets/INDEX.csv>

## What was checked, and how
- <the check, and its result as a simple number>
- Not checked: <what wasn't>

## Unfinished
- <what is left>

## For the hub
- <anything needed on the board, in decisions.md, in questions.md, or in another job's files>
```

## Rules

- A job writes only its own slip under `docs/`. If it needs the board, the decisions, the questions or the asset list
  changed, it says so under "For the hub".
- Every decision Chris makes in the job's conversation goes in the slip the same day, so the hub can copy it to
  `docs/decisions.md`.
- No keys and no private details: the repo is public.
