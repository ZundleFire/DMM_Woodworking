/**
 * build-gallery.js
 *
 * Scans assets/work-examples/<category>/ folders and regenerates gallery.json.
 * Run with:  node build-gallery.js
 *
 * Folder name → display label mapping lives in CATEGORY_LABELS below.
 * Supported image extensions: jpg, jpeg, png, webp, avif, gif.
 */

const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────

const WORK_DIR  = path.join(__dirname, 'assets', 'work-examples');
const OUT_FILE  = path.join(__dirname, 'gallery.json');
const IMG_EXTS  = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

/** Maps folder name (lowercase) → category label shown in the gallery filter. */
const CATEGORY_LABELS = {
  kitchen:  'Kitchen',
  bathroom: 'Bathroom',
  other:    'Other',
};

/** Converts a filename (without extension) into a human-readable caption. */
function toCaption(filename) {
  return filename
    .replace(/[-_]/g, ' ')          // dashes/underscores → spaces
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase()); // title-case
}

// ── Scan ──────────────────────────────────────────────────────────────────────

const entries = [];

const categoryFolders = fs.readdirSync(WORK_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

for (const dir of categoryFolders) {
  const folderKey   = dir.name.toLowerCase();
  const category    = CATEGORY_LABELS[folderKey] ?? (dir.name.charAt(0).toUpperCase() + dir.name.slice(1));
  const folderPath  = path.join(WORK_DIR, dir.name);

  const files = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(f => f.isFile() && IMG_EXTS.has(path.extname(f.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const file of files) {
    // Use forward slashes so paths work in browsers on all OSes
    const relativePath = `assets/work-examples/${dir.name}/${file.name}`.replace(/\\/g, '/');
    const caption      = toCaption(path.basename(file.name, path.extname(file.name)));

    entries.push({ file: relativePath, caption, category });
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────

fs.writeFileSync(OUT_FILE, JSON.stringify(entries, null, 2) + '\n', 'utf8');
console.log(`✅  gallery.json updated — ${entries.length} image(s) across ${categoryFolders.length} category folder(s).`);
entries.forEach(e => console.log(`   [${e.category}]  ${e.file}`));
