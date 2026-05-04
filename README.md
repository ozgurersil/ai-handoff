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

### Option 1 — skills CLI (works with all AI tools)

```bash
npx skills@latest add ozgurersil/ai-handoff
```

Installs to Claude Code, Cursor, Windsurf, Antigravity, Codex, Copilot, Aider, Gemini — whichever you use.

### Option 2 — Claude Code plugin marketplace

```bash
claude plugin marketplace add ozgurersil/ai-handoff && claude plugin install handoff
```

### Option 3 — Manual

```bash
git clone https://github.com/ozgurersil/ai-handoff.git
mkdir -p ~/.claude/skills/handoff
cp ai-handoff/skills/handoff/SKILL.md ~/.claude/skills/handoff/SKILL.md
```

---

**First use:** When you run `/handoff` for the first time, Claude will ask which AI coding tool you use and save the preference. All future handoff files include resume instructions tailored to that tool. To reconfigure: say `"handoff setup"` anytime.

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
Continue from handoff: handoffs/handoff-2026-05-04-1430_claude.md
```

Claude reads the file and resumes immediately.

---

## Output Format

Generated file: `./handoffs/handoff-YYYY-MM-DD-HHmm_{model-slug}.md`

Examples: `handoffs/handoff-2026-05-04-1437_claude.md`, `handoffs/handoff-2026-05-04-1437_gpt.md`

The `handoffs/` directory is created automatically if it doesn't exist.

```
# AI Handoff — my-project — 2026-05-04 14:30

> Handoff reason: rate limit approaching
> Resume command: Continue from handoff: handoffs/handoff-2026-05-04-1430_claude.md

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

## Supported Tools

The handoff file includes per-tool resume instructions. Skill auto-detects which tools are configured in your project and asks which one will resume.

You choose your tool once during setup. Handoff files include only your tool's resume instructions.

| Tool | Resume method |
|------|--------------|
| **Claude Code** | `Continue from handoff: handoffs/{file}` |
| **Cursor** | `@{file}` in chat |
| **Windsurf** | `@{file}` in Cascade |
| **Antigravity** (Google) | `@{file}` in chat |
| **OpenAI Codex CLI** | `codex --context {file} "Continue"` |
| **GitHub Copilot** | `#file:{file}` in Copilot Chat |
| **Aider** | `aider --read {file}` |
| **Gemini CLI** | `gemini --context {file} "Continue"` |
| Any other tool | Paste file contents as first message |

To change your tool: `handoff setup`

---

## Why This Matters

| Without ai-handoff | With ai-handoff |
|-------------------|-----------------|
| Context lost on rate limit | Full context preserved |
| Re-explain project from scratch | AI resumes in seconds |
| Decisions forgotten | Decision log captured |
| Next steps unclear | Prioritized action list |
| Works only in Claude Code | Portable across all major AI tools |

---

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

Bug reports → [GitHub Issues](https://github.com/ozgurersil/ai-handoff/issues)

---

## License

MIT — see [LICENSE](LICENSE).
