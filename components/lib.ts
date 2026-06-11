/**
 * Shared design tokens and helpers for SuperCitizen lesson components.
 *
 * Constraints (see COMPONENTS.md):
 * - zero dependencies beyond React
 * - all colors via the app's CSS variables with fallbacks
 * - inline styles only (components must work with no stylesheet shipped)
 * - SSR-safe: nothing here touches window/document
 */
import type { CSSProperties } from 'react';

export const tokens = {
  ink: 'var(--ink, #14130f)',
  muted: 'var(--muted, #6b6457)',
  accent: 'var(--accent, #8a2a1e)',
  gold: 'var(--gold, #b08a3e)',
  blue: 'var(--blue, #2f4d6e)',
  green: 'var(--green, #4a6b3a)',
  line: 'var(--line, #d9d5c9)',
  card: 'var(--card, #ffffff)',
} as const;

export type TokenColor = 'blue' | 'accent' | 'gold' | 'green' | 'ink';

export function barColor(name: TokenColor | undefined): string {
  switch (name) {
    case 'accent':
      return tokens.accent;
    case 'gold':
      return tokens.gold;
    case 'green':
      return tokens.green;
    case 'ink':
      return tokens.ink;
    case 'blue':
    default:
      return tokens.blue;
  }
}

export const serif = 'Georgia, "Times New Roman", serif';

/** Outer wrapper shared by every interactive block. */
export const blockStyle: CSSProperties = {
  border: `1px solid ${tokens.line}`,
  borderRadius: 8,
  background: tokens.card,
  padding: '1rem 1.25rem',
  margin: '1.75rem 0',
};

/** Small uppercase label that titles an interactive block. */
export const labelStyle: CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: tokens.muted,
  marginBottom: '0.5rem',
};

export const buttonStyle: CSSProperties = {
  font: 'inherit',
  fontSize: '0.9rem',
  padding: '0.4rem 0.9rem',
  borderRadius: 6,
  border: `1px solid ${tokens.line}`,
  background: tokens.card,
  color: tokens.ink,
  cursor: 'pointer',
};

export const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: tokens.accent,
  borderColor: tokens.accent,
  color: '#ffffff',
};

/**
 * Deterministic shuffle (mulberry32). Components must not reorder teaching
 * content randomly between server and client renders — a fixed seed keeps
 * SSR markup and the client identical.
 */
export function seededShuffle<T>(items: readonly T[], seed = 0x5c17): T[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}
