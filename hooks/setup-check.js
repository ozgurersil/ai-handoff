#!/usr/bin/env node
// ai-handoff — Claude Code SessionStart hook
//
// On every session start:
//   1. Checks if ~/.claude/handoff-config.json exists
//   2. If missing (first run after install): emits a one-time setup prompt
//   3. If present: silent — config already set

const fs = require('fs');
const path = require('path');
const os = require('os');

const configPath = path.join(os.homedir(), '.claude', 'handoff-config.json');

if (fs.existsSync(configPath)) {
  // Already configured — nothing to do
  process.stdout.write('OK');
  process.exit(0);
}

// First run after install — emit setup prompt as session context
const setupPrompt = `
<handoff-setup>
The **ai-handoff** skill was just installed. Before your first /handoff, tell Claude:

  "handoff setup"

Claude will ask which AI coding tool you use and save your preference.
Supported tools: Claude Code, OpenAI Codex CLI, Cursor, Windsurf, Antigravity, GitHub Copilot, Aider, Gemini CLI.
This prompt will not appear again after setup is complete.
</handoff-setup>
`.trim();

process.stdout.write(setupPrompt);
process.exit(0);
