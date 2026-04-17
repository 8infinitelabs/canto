# Canto — Claude's markdown companion

> Edit `CLAUDE.md`, memories, plans, and all your markdown — visually, right inside your IDE.

[![Website](https://img.shields.io/badge/website-canto.infinitelabs.co-D67059?style=for-the-badge)](https://canto.infinitelabs.co)
[![GitHub](https://img.shields.io/badge/github-8infinitelabs%2Fcanto-24292F?style=for-the-badge&logo=github)](https://github.com/8infinitelabs/canto)
[![Report an issue](https://img.shields.io/badge/issues-welcome-8B5CF6?style=for-the-badge)](https://github.com/8infinitelabs/canto/issues)

Canto is a VS Code extension that gives [Claude Code](https://claude.com/claude-code) users a dedicated, visual editor for the markdown files that power their Claude projects: `CLAUDE.md`, `.claude/memory/*.md`, plans, and docs.

## Features

### WYSIWYG markdown editor

Edit `.md` files directly in the rendered view — no more switching between raw markdown and a preview.

- Bold, italic, headings, lists, tables, code blocks — all with real-time visual feedback
- Keyboard shortcuts (`⌘B`, `⌘I`, `⌘K` for links)
- Slash commands for quick inserts
- Three modes: **WYSIWYG**, **Instant Rendering**, **Split View**
- Theme-aware — follows your VS Code dark/light theme

### Claude Code sidebar

Dedicated view in the activity bar:

- **CLAUDE.md** — one click to open project instructions
- **Memory** — all your memories, categorized; `+ New Memory` creates one with the right frontmatter
- **Plans** — all your plans from `docs/superpowers/plans/` or `.claude/plans/`
- **Config** — quick access to Claude Code settings

### Documents view

A second tree view showing all markdown in the workspace: root files first, then folders with counts.

## Install

```sh
code --install-extension infinitelabs.canto-claude
```

Or search for **Canto** in the Extensions panel.

### Compatibility

Works in **VS Code** 1.85+, **Cursor**, **Windsurf**, **VSCodium** — any editor built on the VS Code Extension API.

## Development

```sh
git clone git@github.com:8infinitelabs/canto.git
cd canto
npm install
npm run watch
# Press F5 in VS Code to launch Extension Development Host
```

### Publishing

See [PUBLISHING.md](./PUBLISHING.md). Tag with `v*.*.*` to trigger auto-publish:

```sh
npm version patch      # 0.1.1 → 0.1.2
git commit -am "release: v0.1.2"
git tag v0.1.2
git push && git push --tags
```

GitHub Actions publishes to the Marketplace (requires `VSCE_PAT` secret).

## Support

- **Issues:** [github.com/8infinitelabs/canto/issues](https://github.com/8infinitelabs/canto/issues)
- **Email:** [canto@infinitelabs.co](mailto:canto@infinitelabs.co)

## License

MIT © [Infinite Labs OÜ](https://infinitelabs.co)

## Credits

- WYSIWYG editor: [Vditor](https://github.com/Vanessa219/vditor)
