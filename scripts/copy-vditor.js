const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', 'node_modules', 'vditor', 'dist')
const dst = path.join(__dirname, '..', 'media', 'vditor')

if (!fs.existsSync(src)) {
  console.error('vditor not in node_modules — run npm install first')
  process.exit(1)
}

// Only these js sub-packages are needed for core editing:
//   lute  — markdown parser (required)
//   highlight.js — code syntax highlighting (common in CLAUDE.md)
const JS_ALLOWLIST = new Set(['lute', 'highlight.js'])

function copyDir(from, to, filter) {
  fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (filter && !filter(entry.name)) continue
    const s = path.join(from, entry.name)
    const d = path.join(to, entry.name)
    if (entry.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true })

// Root files (index.min.js, index.css, method.min.js)
copyDir(src, dst, (name) => !fs.statSync(path.join(src, name)).isDirectory())

// css/ and images/ — icons and themes
copyDir(path.join(src, 'css'),    path.join(dst, 'css'))
copyDir(path.join(src, 'images'), path.join(dst, 'images'))

// js/ — only allowlisted sub-packages
const jsSrc = path.join(src, 'js')
const jsDst = path.join(dst, 'js')
fs.mkdirSync(jsDst, { recursive: true })
for (const dir of fs.readdirSync(jsSrc, { withFileTypes: true })) {
  if (dir.isDirectory() && JS_ALLOWLIST.has(dir.name)) {
    copyDir(path.join(jsSrc, dir.name), path.join(jsDst, dir.name))
  }
}

const total = du(dst)
console.log(`✓ vditor dist → media/vditor/  (${(total / 1024 / 1024).toFixed(1)} MB)`)

function du(dir) {
  let size = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    size += entry.isDirectory() ? du(full) : fs.statSync(full).size
  }
  return size
}
