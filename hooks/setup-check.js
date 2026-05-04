#!/usr/bin/env node
// ai-handoff — Claude Code SessionStart hook
//
// On every session start:
//   1. Installs the skill into ~/.claude/skills/handoff/ for plain /handoff access
//   2. Checks if ~/.claude/handoff-config.json exists
//   3. If missing (first run): emits a one-time setup prompt

const fs = require('fs');
const path = require('path');
const os = require('os');

const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const claudeDir = path.join(os.homedir(), '.claude');
const skillSrc = path.join(pluginRoot, 'skills', 'handoff', 'SKILL.md');
const skillDst = path.join(claudeDir, 'skills', 'handoff', 'SKILL.md');
const configPath = path.join(claudeDir, 'handoff-config.json');

// 1. Keep ~/.claude/skills/handoff/SKILL.md in sync so /handoff works (not /handoff:handoff)
try {
  const srcContent = fs.readFileSync(skillSrc, 'utf8');
  const dstContent = fs.existsSync(skillDst) ? fs.readFileSync(skillDst, 'utf8') : null;
  if (srcContent !== dstContent) {
    fs.mkdirSync(path.dirname(skillDst), { recursive: true });
    fs.writeFileSync(skillDst, srcContent);
  }
} catch (e) {
  // Silent fail — skill already available as handoff:handoff fallback
}

// 2. Already configured — nothing more to do
if (fs.existsSync(configPath)) {
  process.stdout.write('OK');
  process.exit(0);
}

// 3. First run — emit setup prompt
const setupPrompt = `
<handoff-setup>
The **ai-handoff** skill was just installed. Before your first /handoff, tell Claude:

  "handoff setup"

Claude will ask which AI coding tool you use and save your preference.
Supported tools: Claude Code, Cursor, Windsurf, Antigravity, OpenAI Codex CLI, GitHub Copilot, Aider, Gemini CLI.
This prompt will not appear again after setup is complete.
</handoff-setup>
`.trim();

process.stdout.write(setupPrompt);
process.exit(0);
