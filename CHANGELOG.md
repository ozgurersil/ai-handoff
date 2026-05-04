# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-05-04

### Added

- Initial release of the `handoff` Claude Code skill
- Structured markdown output: project overview, session summary, key decisions, files modified, environment snapshot, next steps, open questions, context for next AI
- Timestamped output filename (`handoff-YYYY-MM-DD-HHMM.md`)
- Auto-detection of `handoffs/` directory for organized output
- Git state capture (branch, last commit, status)
- Natural language triggers: "save context", "rate limit approaching", "session summary", "handoff", "wrap up session", "context dump", "save progress"
- Resume prompt embedded in output file
