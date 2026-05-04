# Contributing to ai-handoff

Thank you for your interest in contributing. This document covers how to get involved effectively.

---

## Ways to Contribute

- **Bug reports** — Something in the handoff output is wrong or missing
- **Feature requests** — New sections, triggers, or output formats
- **Skill improvements** — Better prompting, edge case handling
- **Documentation** — Clearer install steps, usage examples

---

## Before You Start

1. Search [existing issues](https://github.com/ozgurersil/ai-handoff/issues) — your idea may already be tracked
2. For significant changes, open an issue first to discuss approach before writing code
3. Keep changes focused — one feature or fix per PR

---

## Development Setup

```bash
git clone https://github.com/ozgurersil/ai-handoff.git
cd ai-handoff

# Install the skill locally for testing
cp -r skills/handoff ~/.claude/skills/
```

Reload Claude Code to pick up the skill change.

---

## Testing Changes

Before submitting, test the skill against these scenarios:

- [ ] `/handoff` in a project with an active git repo
- [ ] `/handoff` in a directory without git
- [ ] Natural language trigger: "rate limit approaching"
- [ ] Natural language trigger: "save context"
- [ ] Output file is valid markdown (renders without errors)
- [ ] Resume prompt in output is accurate

---

## Pull Request Guidelines

- **Title:** Use imperative mood — `Add X`, `Fix Y`, `Improve Z`
- **Scope:** One logical change per PR
- **Description:** Explain *why*, not just *what*
- **Tests:** Describe how you tested the change

### PR Title Format

```
type: short description

Types: feat | fix | docs | refactor | chore
```

Examples:
```
feat: add open questions section to handoff output
fix: handle missing git repo gracefully
docs: add video walkthrough to README
```

---

## Issue Reporting

Use the provided templates. Include:

- Claude Code version (`claude --version`)
- OS and shell
- What you expected vs what happened
- The handoff file generated (redact any sensitive content)

---

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful and constructive.
