// tools/replace-status-codes.js
// Run: node tools/replace-status-codes.js
// Scans proxy and backend folders and replaces numeric res.status(...) with StatusCodes constants.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIRS = ['proxy', 'backend']; // adjust if your folders are named differently

// mapping numeric -> StatusCodes name
const MAP = {
  200: 'OK',
  201: 'CREATED',
  202: 'ACCEPTED',
  204: 'NO_CONTENT',
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE_ENTITY',
  500: 'INTERNAL_SERVER_ERROR'
};

function walk(dir) {
  const res = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      res.push(...walk(full));
    } else if (file.endsWith('.js')) {
      res.push(full);
    }
  }
  return res;
}

function ensureRequire(content) {
  // if already has require line, skip
  if (content.match(/require\(['"]http-status-codes['"]\)/)) return content;
  // attempt to insert after the first 'use strict' or after the first require/import block
  const lines = content.split(/\r?\n/);
  let insertAt = 0;
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const l = lines[i];
    if (/^(['"]use strict['"])/.test(l)) { insertAt = i + 1; break; }
    if (/^const .* = require\(/.test(l) || /^var .* = require\(/.test(l) || /^let .* = require\(/.test(l) || /^import /.test(l)) { insertAt = i + 1; continue; }
  }
  lines.splice(insertAt, 0, "const { StatusCodes } = require('http-status-codes');");
  return lines.join('\n');
}

function replaceStatuses(content) {
  // replace patterns like res.status(200) and res.status( 200 ).json or res.status(200).json
  // We'll do a safe regex: res\.status\s*\(\s*NUM\s*\)
  let changed = false;
  for (const numStr of Object.keys(MAP)) {
    const name = MAP[numStr];
    // use regex with word boundaries
    const re = new RegExp(`res\\.status\\s*\\(\\s*${numStr}\\s*\\)`, 'g');
    if (re.test(content)) {
      content = content.replace(re, `res.status(StatusCodes.${name})`);
      changed = true;
    }
  }
  return { content, changed };
}

for (const dir of TARGET_DIRS) {
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) {
    console.log(`[skip] ${dir} not found`);
    continue;
  }
  const files = walk(fullDir);
  console.log(`Found ${files.length} .js files in ${dir}`);
  for (const file of files) {
    let original = fs.readFileSync(file, 'utf8');
    let content = original;
    // ensure require at top if any StatusCodes replacements will be made
    const { content: replaced, changed } = replaceStatuses(content);
    if (!changed) {
      // nothing to change numerically; still ensure imports if you want? skip
      continue;
    }
    // we have numeric changes; ensure the require exists
    let withRequire = ensureRequire(replaced);
    if (withRequire !== original) {
      fs.writeFileSync(file, withRequire, 'utf8');
      console.log(`[updated] ${file}`);
    } else {
      fs.writeFileSync(file, replaced, 'utf8');
      console.log(`[updated] ${file}`);
    }
  }
}

console.log('Done. Please run prettier / format to tidy files.');
