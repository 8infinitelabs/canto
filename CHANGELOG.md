# Canto Changelog

## 0.1.4 — 2026-04-17

- Now also published to [Open VSX Registry](https://open-vsx.org/extension/infinitelabs/canto-claude) — installable from Cursor, Windsurf, VSCodium, Gitpod, and Theia.
- CI workflow publishes to VS Code Marketplace and Open VSX in parallel on tag push.

## 0.1.3 — 2026-04-17

- Display name: "Canto Markdown Editor" (the "for Claude Code" suffix was too close to an existing extension). Name is clearer about what the extension does — the Claude Code integration is still front and center in the description and features.

## 0.1.2 — 2026-04-17

- Display name: "Canto for Claude Code" (the shorter "Canto" was taken
  in the Marketplace). The product is still Canto — just more specific
  in the listing for discoverability.

## 0.1.1 — 2026-04-17

- Publisher: Infinite Labs OÜ (`infinitelabs`)
- GitHub repo: [8infinitelabs/canto](https://github.com/8infinitelabs/canto)
- Landing site: [canto.infinitelabs.co](https://canto.infinitelabs.co)
- Badges + clearer links at the top of the README

## 0.1.0 — 2026-04-17

Initial release.

- **WYSIWYG markdown editor** — edit `.md` files directly in the rendered view, powered by Vditor
- **Claude sidebar view** — CLAUDE.md, Memory, Plans, Config
- **Documents tree view** — all markdown files in the workspace, organized
- **Commands:**
  - `Canto: Open WYSIWYG Editor` — open the current or selected `.md` with the Canto editor
  - `Canto: Open CLAUDE.md` — jump straight to the project's CLAUDE.md
  - `Canto: New Memory` — create a memory file with the correct frontmatter
  - `Canto: New Plan` — scaffold a new plan in `docs/superpowers/plans/` or `.claude/plans/`
  - `Canto: Refresh` — refresh the sidebar views
- **Theme-aware** — follows VS Code dark/light theme automatically
