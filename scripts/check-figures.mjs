#!/usr/bin/env node
// Advisory geometry lint for hand-drawn inline SVGs in MDX lessons.
// Run: npm run check:figures  (reports likely text overflow / label-path
// collisions; estimates use ~0.56em average glyph width, so treat flags as
// strong hints, not proof — see STYLE.md "Hand-drawn SVG layout").
// Flags: (1) text likely overflowing the viewBox, (2) text bbox likely
// intersecting a path/line trajectory, (3) text outside vertical bounds.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const root = process.argv[2] ?? '.';
const files = execSync(`grep -rln "<svg" ${root}/packs --include="*.mdx"`, { encoding: 'utf8' })
  .trim().split('\n');

const CHAR_W = 0.56; // avg em width for Georgia-ish serif

function* svgBlocks(src) {
  const re = /<svg[\s\S]*?<\/svg>/g;
  let m;
  while ((m = re.exec(src))) yield { block: m[0], index: m.index };
}
const lineOf = (src, idx) => src.slice(0, idx).split('\n').length;

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z-:]+)=["']([^"']*)["']/g)) out[m[1]] = m[2];
  return out;
}

let totalFlags = 0;
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let figN = 0;
  const fileFlags = [];
  for (const { block, index } of svgBlocks(src)) {
    figN++;
    const startLine = lineOf(src, index);
    const vb = (attrs(block.slice(0, block.indexOf('>'))).viewBox ?? '0 0 720 400')
      .split(/[ ,]+/).map(Number);
    const [vx, vy, vw, vh] = vb;

    // collect texts with bboxes
    const texts = [];
    for (const m of block.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)) {
      const a = attrs(m[1]);
      const content = m[2].replace(/<[^>]+>/g, '').trim();
      if (!content) continue;
      const fs = parseFloat(a['font-size'] ?? a.fontSize ?? 13);
      const x = parseFloat(a.x ?? 0), y = parseFloat(a.y ?? 0);
      const w = content.length * fs * CHAR_W;
      const anchor = a['text-anchor'] ?? a.textAnchor ?? 'start';
      const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
      texts.push({ content: content.slice(0, 50), x0, x1: x0 + w, y0: y - fs, y1: y + 3, fs, line: startLine + lineOf(block.slice(0, m.index), 0) - 1 });
    }

    // sample path/line trajectories
    const pts = [];
    for (const m of block.matchAll(/<line([^>]*)\/?\s*>/g)) {
      const a = attrs(m[1]);
      const x1 = +a.x1, y1 = +a.y1, x2 = +a.x2, y2 = +a.y2;
      if ([x1, y1, x2, y2].some(Number.isNaN)) continue;
      for (let t = 0; t <= 1; t += 0.05) pts.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
    for (const m of block.matchAll(/<path([^>]*)\/?\s*>/g)) {
      const d = attrs(m[1]).d ?? '';
      const nums = [...d.matchAll(/-?\d+\.?\d*/g)].map(n => +n[0]);
      // crude: treat consecutive number pairs as waypoints, interpolate
      const wp = [];
      for (let i = 0; i + 1 < nums.length; i += 2) wp.push([nums[i], nums[i + 1]]);
      for (let i = 0; i + 1 < wp.length; i++)
        for (let t = 0; t <= 1; t += 0.2)
          pts.push([wp[i][0] + (wp[i + 1][0] - wp[i][0]) * t, wp[i][1] + (wp[i + 1][1] - wp[i][1]) * t]);
    }

    for (const t of texts) {
      if (t.x1 > vx + vw + 2) fileFlags.push(`  fig${figN}@L${startLine} OVERFLOW-RIGHT (${Math.round(t.x1)}>${vx + vw}): "${t.content}"`);
      if (t.x0 < vx - 2) fileFlags.push(`  fig${figN}@L${startLine} OVERFLOW-LEFT: "${t.content}"`);
      if (t.y1 > vy + vh + 2 || t.y0 < vy - 2) fileFlags.push(`  fig${figN}@L${startLine} OUT-OF-BOUNDS-Y: "${t.content}"`);
      const hit = pts.some(([px, py]) => px > t.x0 - 2 && px < t.x1 + 2 && py > t.y0 - 1 && py < t.y1 + 1);
      if (hit) fileFlags.push(`  fig${figN}@L${startLine} PATH-COLLISION: "${t.content}"`);
    }
  }
  if (fileFlags.length) {
    console.log(`${file} — ${fileFlags.length} flag(s)`);
    for (const f of [...new Set(fileFlags)]) console.log(f);
    totalFlags += fileFlags.length;
  }
}
console.log(`\nTOTAL: ${totalFlags} flags across ${files.length} files scanned`);
