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
- Git state — one call: `git log --oneline -1 2>/dev/null; git status --short --branch 2>&1`
  - Output starts with `fatal:` → **not** a repo. Skip all git output, follow the no-VCS rules below.
  - `## No commits yet on <branch>` → repo with zero commits. Use the branch, omit the commit.
  - Otherwise: first line is the last commit, `## <branch>...` is the branch, remaining lines are uncommitted changes.
- All files created or modified this session
- All decisions made and their rationale
- Current task state (done / in-progress / blocked)
- Next concrete steps
- Any open questions or blockers

### Step 3 — Determine path

Default to project scope. No prompt needed.

**Path rules:**
- Always save to `./handoffs/`. Create it if missing: `mkdir -p ./handoffs`
- Filename format: `handoff-{summary-slug}-{YYYY-MM-DD-HHmm}-{model-slug}.md`
  - `{summary-slug}`: 2–4 words describing what the session was about, kebab-case, lowercase, no punctuation. E.g. `fix-auth-redirect`, `add-stripe-webhooks`, `refactor-db-layer`.
  - Get current time via `date '+%Y-%m-%d-%H%M'`
  - Model slug: `claude` for any Claude model, `gpt` for OpenAI, `gemini` for Google, etc.
  - Example: `handoffs/handoff-fix-auth-redirect-2026-05-04-1437-claude.md`

### Step 4 — Write the file

Write densely. Rules:
- **Omit any section that has no content.** Never emit "None", "N/A", or placeholder rows.
- Facts only — no restating, no filler, no prose where a bullet works.
- Bullets are fragments, not sentences. Drop articles and hedging.
- Do not include a section's data twice (e.g. a file listed under Completed need not repeat in Files Modified unless the note adds something).

**No git? (or any VCS)** — the handoff still works, it just carries more weight:
- Drop the branch/commit part of the Context line; keep `{cwd}`.
- The **Files** section is now the only record of what changed — list every file touched this session, no exceptions, and say what changed in each. Do not rely on the next AI running `git diff`.
- Under **Gotchas**, note anything unsaved or unrecoverable (edits with no commit to fall back on, generated files, manual steps already applied to a DB/service).

Template (skip empty parts):

```markdown
# Handoff — {project} — {YYYY-MM-DD HH:MM} — {model}

**Reason:** {rate limit | context full | manual}

## Resume ({tool})

    {resume command — see table below}

## Context

{1–2 sentences: what the project is + the current goal.}

{Pick one line:}
{  git:     } `{cwd}` | branch `{branch}` | last `{hash} {message}`
{  no git:  } `{cwd}`
{Uncommitted files, only if git and dirty — one line, paths only}
{Stack/versions only if non-obvious or version-sensitive}

## Done

- {thing done — file/function/feature}

## In Progress

**{task}** — {what's done vs what remains}. Stopped at: {exact point}.

## Blocked

- {blocker + what unblocks it}

## Decisions

- **{decision}** — {why}; rejected {alt} because {reason}

## Files

- `{path}` — {created|modified|deleted}, {what changed}

## Next Steps

1. **{action}** — `{file/area}` — {why first}
2. **{action}** — `{file/area}`

## Open Questions

- [ ] {question}

## Gotchas

- {constraint, workaround, thing NOT to change, config location}

---
*[ai-handoff](https://github.com/ozgurersil/ai-handoff) — {ISO 8601}*
```

**Resume commands** — emit only the row matching the configured editor (all rows if `all`):

| Tool | Command |
|------|---------|
| Claude Code | `Continue from handoff: {filename}` |
| Cursor / Windsurf / Antigravity | `@{filename} Continue from this handoff. Start at Next Steps.` |
| GitHub Copilot | `#file:{filename} Continue from this handoff. Start at Next Steps.` |
| OpenAI Codex CLI | `codex --context {filename} "Continue from handoff"` |
| Aider | `aider --read {filename}` then `Continue from handoff` |
| Gemini CLI | `gemini --context {filename} "Continue from this handoff"` |

### Step 5 — Confirm

Tell the user:
- Filename and path saved
- Which tool's resume block was included
- The resume command for their tool

One sentence each. Do not summarize the whole handoff in chat.
