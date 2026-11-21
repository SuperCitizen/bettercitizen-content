/**
 * Measuring prose: what `check-reading-level.mjs` grades lessons with, and
 * `check-lectures.mjs` grades lecture scripts with. No side effects.
 *
 * The grade is Flesch-Kincaid: 0.39 x (words per sentence) + 11.8 x
 * (syllables per word) - 15.59. Syllables are counted by rule, not from a
 * dictionary, so treat the number as a gauge accurate to about half a grade.
 */

/** The bands STYLE.md sets. `maxGrade` is a ceiling; `words` is a range. */
export const BANDS = {
  1: { maxGrade: 8.0, words: [600, 1000] },
  2: { maxGrade: 12.0, words: [1200, 1800] },
  3: null,
};

/** Remove every JSX tag (with its props) and every `{…}` expression, keeping children. */
function stripJsx(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '<' && /[A-Za-z/]/.test(src[i + 1] ?? '')) {
      // Scan to the tag's closing `>`, skipping over quoted strings and `{…}` props.
      let depth = 0;
      let quote = '';
      let j = i + 1;
      for (; j < src.length; j++) {
        const d = src[j];
        if (quote) {
          if (d === '\\') j++;
          else if (d === quote) quote = '';
        } else if (d === '"' || d === "'" || d === '`') quote = d;
        else if (d === '{') depth++;
        else if (d === '}') depth--;
        else if (d === '>' && depth === 0) break;
      }
      out += '\n';
      i = j + 1;
    } else if (c === '{') {
      let depth = 0;
      let j = i;
      for (; j < src.length; j++) {
        if (src[j] === '{') depth++;
        else if (src[j] === '}' && --depth === 0) break;
      }
      i = j + 1;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

const ABBREVIATIONS = /\b(No|Nos|U\.S|v|vs|Mr|Mrs|Ms|Dr|St|Art|Sec|Jr|Sr|Sen|Rep|Gov|Gen|Co|Inc|e\.g|i\.e|Amdt|Jan|Feb|Mar|Apr|Aug|Sept|Sep|Oct|Nov|Dec)\./g;

/** Lesson source (frontmatter already removed) to plain sentences, one per line. */
export function proseOf(body) {
  let s = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  s = stripJsx(s);
  const lines = [];
  for (let line of s.split('\n')) {
    line = line.trim();
    if (!line || line.startsWith('|')) continue; // tables are data, not prose
    const block = /^(#{1,6}\s|[-*+]\s|\d+\.\s)/.test(line); // a heading or list item is its own sentence
    line = line
      .replace(/^#{1,6}\s+/, '')
      .replace(/^>\s?/, '')
      .replace(/^([-*+]|\d+\.)\s+/, '')
      .replace(/\[\[[a-z]+:([a-z0-9-]+)\]\]/g, (_, slug) => slug.replace(/-/g, ' '))
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]+/g, '')
      .replace(/&nbsp;/g, ' ');
    if (!line) continue;
    if (block && !/[.!?:]["')\]]*$/.test(line)) line += '.';
    lines.push(line);
  }
  return lines.join('\n');
}

export function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  let n = (w.match(/[aeiouy]+/g) || []).length;
  if (/[^aeiouy]ed$/.test(w) && !/[td]ed$/.test(w)) n--; // "passed", not "voted"
  else if (/[^aeiouy]es$/.test(w) && !/(?:[sxz]|ch|sh|[cg])es$/.test(w)) n--; // "votes", not "judges"
  else if (/[^aeiouyl]e$/.test(w) || /[aeiouy]le$/.test(w)) n--; // silent e: "vote", "rule"; not "table"
  return Math.max(1, n);
}

export function measure(body) {
  const text = proseOf(body).replace(ABBREVIATIONS, '$1');
  const sentences = text
    .split(/(?<=[.!?])["'”’)\]]*\s+|\n+/)
    .map((x) => x.trim())
    .filter((x) => /[A-Za-z0-9]/.test(x));
  let words = 0;
  let syl = 0;
  for (const token of text.match(/[A-Za-z][A-Za-z'’]*|\d[\d,.]*/g) || []) {
    words++;
    syl += /^\d/.test(token) ? 1 : syllables(token);
  }
  if (!words || !sentences.length) return { words: 0, sentences: 0, grade: 0 };
  const grade = 0.39 * (words / sentences.length) + 11.8 * (syl / words) - 15.59;
  return { words, sentences: sentences.length, grade: Math.round(grade * 10) / 10 };
}
