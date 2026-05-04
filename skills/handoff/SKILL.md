---
name: handoff
description: >
  Saves a structured session-summary markdown file so another AI can resume work without
  context loss. Trigger when: rate limit is approaching, the 5-hour usage limit is near,
  context window is almost full, user says "handoff", "save context", "session summary",
  "context dump", "save progress", "rate limit soon", or "wrap up session".
  Also handles setup: trigger when user says "handoff setup" or "configure handoff".
  Produces a timestamped .md file with per-tool resume instructions based on saved config.
---

You are the ai-handoff skill. You have two modes: **setup** and **handoff**.

---

## MODE A — Setup

**Trigger:** User says "handoff setup", "configure handoff", or this is the first time they use /handoff and no config exists at `~/.claude/handoff-config.json`.

### Setup Step 1 — Ask editor

Ask the user exactly this:

> **Which AI coding tool do you primarily use?**
>
> | # | Tool | Notes |
> |---|------|-------|
> | 1 | **Claude Code** | CLI / desktop |
> | 2 | **Cursor** | VSCode fork by Anysphere |
> | 3 | **Windsurf** | VSCode fork by Codeium |
> | 4 | **Antigravity** | VSCode fork by Google |
> | 5 | **OpenAI Codex CLI** | Terminal agent |
> | 6 | **GitHub Copilot** | VS Code / JetBrains |
> | 7 | **Aider** | Terminal pair programmer |
> | 8 | **Gemini CLI** | Terminal agent by Google |
> | 9 | **All** | Include resume instructions for every tool |
>
> Reply with a number or tool name. You can pick multiple (e.g., "1, 2").

### Setup Step 2 — Save config

After the user replies, run this bash command to save their preference:

```bash
mkdir -p ~/.claude && cat > ~/.claude/handoff-config.json << 'EOF'
{
  "editor": "{tool-slug}",
  "configuredAt": "{ISO timestamp}"
}
EOF
```

Where `{tool-slug}` is one of: `claude-code`, `cursor`, `windsurf`, `antigravity`, `codex`, `copilot`, `aider`, `gemini`, `all`.
For multiple selections, use an array: `"editor": ["cursor", "claude-code"]`.

### Setup Step 3 — Confirm

Tell the user:
- Config saved to `~/.claude/handoff-config.json`
- Their selected tool(s)
- How to change it: "Say 'handoff setup' any time to reconfigure"
- They can now use `/handoff` when ready

---

## MODE B — Handoff

**Trigger:** Everything else (rate limit approaching, "save context", "session summary", etc.)

### Step 1 — Read editor config

Run:
```bash
cat ~/.claude/handoff-config.json 2>/dev/null
```

If the file is missing, run Setup Mode A first before continuing.

### Step 2 — Gather context

Collect from the conversation:
- What project/task is being worked on
- Working directory (check CLAUDE.md or infer from file paths seen)
- Git state — run `git status --short` and `git log --oneline -5` if in a git repo
- All files created or modified this session
- All decisions made and their rationale
- Current task state (done / in-progress / blocked)
- Next concrete steps
- Any open questions or blockers

### Step 3 — Determine path

Default to project scope. No prompt needed.

**Path rules:**
- Use `./handoffs/handoff-{ts}.md` if `handoffs/` dir exists, else `./handoff-{ts}.md`

### Step 4 — Write the file

Generate and save a markdown file:

```markdown
# AI Handoff — {project name} — {YYYY-MM-DD HH:MM}

> **Handoff reason:** {rate limit approaching | context window full | manual save | other}
> **Handing off from:** {model name if known}

---

## Resume Instructions

{Include ONLY the block(s) matching the editor from ~/.claude/handoff-config.json.
 If editor is "all", include every block below.}

### Claude Code
```
Continue from handoff: {filename}
```

### Cursor
```
@{filename} Continue from this handoff. Start at Next Steps.
```

### Windsurf (Cascade)
```
@{filename} Continue from this handoff. Start at Next Steps.
```

### Antigravity
```
@{filename} Continue from this handoff. Start at Next Steps.
```

### OpenAI Codex CLI
```bash
codex --context {filename} "Continue from handoff"
```

### GitHub Copilot (VS Code)
```
#file:{filename} Continue from this handoff. Start at Next Steps.
```

### Aider
```bash
aider --read {filename}
# Then say: Continue from handoff
```

### Gemini CLI
```bash
gemini --context {filename} "Continue from this handoff"
```

---

## Project Overview

{2-3 sentences: what the project is, its purpose, the current goal.}

**Working directory:** `{path}`
**Git branch:** `{branch}` | **Last commit:** `{hash} — {message}`

---

## Session Summary

### Completed This Session

- {specific thing done — file name, function, feature}
- 

### In Progress (stopped here)

- **Task:** {description}
  - **Status:** {what's done vs what remains}
  - **Stopped at:** {exact stopping point}

### Blocked / Issues

- {blocker or "None"}

---

## Key Decisions

| Decision | Rationale | Alternatives Rejected |
|----------|-----------|-----------------------|
| {decision} | {why} | {what was rejected and why} |

---

## Files Modified

| File | Change | Notes |
|------|--------|-------|
| {path} | {created/modified/deleted} | {brief note} |

---

## Environment Snapshot

```bash
# Working directory
{pwd}

# Git status
{git status --short or "not a git repo"}

# Recent commits
{git log --oneline -5 or "N/A"}

# Key dependencies / versions
{e.g. Node 20.x, Python 3.11 — skip if not relevant}
```

---

## Next Steps

1. **{action}** — {file/area} — {why first}
2. **{action}** — {file/area}
3. **{action}** — {file/area}

---

## Open Questions

- [ ] {unresolved question}

---

## Context for Next AI

{Gotchas, hidden constraints, workarounds, things NOT to change, config locations.}

> {key warning or note}

---

*Generated by [ai-handoff](https://github.com/ozgurersil/ai-handoff) Claude Code skill.*
*Timestamp: {ISO 8601}*
```

### Step 5 — Confirm

Tell the user:
- Filename and path saved
- Which tool's resume block was included
- The resume command for their tool

One sentence each. Do not summarize the whole handoff in chat.
