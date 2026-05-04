# ai-handoff

Claude Code skill repository. Single skill: `handoff`.

## Structure

```
skills/handoff/skill.md   — the skill definition and prompt
README.md                  — user-facing docs
CONTRIBUTING.md            — contributor guide
CHANGELOG.md               — version history
```

## Editing the Skill

The skill lives entirely in `skills/handoff/skill.md`. It has two parts:

1. **Frontmatter** (`---` block) — name, description, trigger conditions
2. **Body** — instructions Claude follows when the skill activates

When editing, test all trigger phrases listed in the frontmatter description. The output template in the body is what users see — keep it copy-paste ready.

## Release Process

Bump version in CHANGELOG.md. Tag with `git tag v{version}`. Push tag.
