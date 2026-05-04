# ai-handoff

A [Claude Code](https://claude.ai/code) skill that saves a structured session-summary markdown file when your rate limit or context window is approaching — so another AI (or a fresh session) can resume work without losing context.

---

## The Problem

Claude Code has a **5-hour rolling usage limit**. When it hits, your session ends cold — all context, decisions, and in-progress work disappears. Starting a new session means re-explaining everything from scratch.

## The Solution

`/handoff` generates a self-contained markdown file capturing:

- What was accomplished this session
- Exactly where work stopped
- Key decisions and their rationale
- All files modified
- Prioritized next steps
- Environment snapshot (git state, directory, deps)
- Gotchas and context the next AI needs

The next session opens the file and picks up immediately.

---

## Install

### Option 1 — Claude Code plugin marketplace (recommended)

```bash
# Add the marketplace, then install the plugin
claude plugin marketplace add ozgurersil/ai-handoff
claude plugin install handoff
```

### Option 2 — Manual

```bash
# Clone
git clone https://github.com/ozgurersil/ai-handoff.git

# Copy skill to your Claude skills directory
mkdir -p ~/.claude/skills/handoff
cp ai-handoff/skills/handoff/skill.md ~/.claude/skills/handoff/SKILL.md
```

---

## Usage

### Trigger manually

```
/handoff
```

### Natural language triggers

Any of these phrases activates the skill automatically:

- "save context"
- "session summary"
- "rate limit approaching"
- "context dump"
- "wrap up session"
- "handoff"
- "save progress"

### Resume in new session

Open a new Claude Code session, then:

```
Continue from handoff: handoff-2026-05-04-1430.md
```

Claude reads the file and resumes immediately.

---

## Output Format

Generated file: `./handoff-YYYY-MM-DD-HHMM.md`

```
# AI Handoff — my-project — 2026-05-04 14:30

> Handoff reason: rate limit approaching
> Resume command: Continue from handoff: handoff-2026-05-04-1430.md

## Project Overview
## Session Summary
  - Completed This Session
  - In Progress (stopped here)
  - Blocked / Issues
## Key Decisions
## Files Modified
## Environment Snapshot
## Next Steps
## Open Questions
## Context for Next AI
```

---

## Why This Matters

| Without ai-handoff | With ai-handoff |
|-------------------|-----------------|
| Context lost on rate limit | Full context preserved |
| Re-explain project from scratch | AI resumes in seconds |
| Decisions forgotten | Decision log captured |
| Next steps unclear | Prioritized action list |
| Random file names searched | Exact files + change summary |

---

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Bug reports → [GitHub Issues](https://github.com/ozgurersil/ai-handoff/issues)

---

## License

MIT — see [LICENSE](LICENSE).
