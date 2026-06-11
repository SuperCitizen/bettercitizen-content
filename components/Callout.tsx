import type { ReactNode } from 'react';
import { tokens } from './lib';

export type CalloutType = 'why' | 'misconception' | 'think' | 'scholar' | 'sources';

const LABELS: Record<CalloutType, string> = {
  why: 'Why this matters',
  misconception: 'Common misconception',
  think: 'Think it through',
  scholar: "The scholar's lens",
  sources: 'In the primary sources',
};

const COLORS: Record<CalloutType, string> = {
  why: tokens.accent,
  misconception: tokens.gold,
  think: tokens.blue,
  scholar: tokens.green,
  sources: tokens.muted,
};

export interface CalloutProps {
  type: CalloutType;
  /** Override the house label text. */
  title?: string;
  children: ReactNode;
}

/**
 * Labeled aside — the component form of the house blockquote callouts.
 * Static (no state) — safe to render on the server.
 */
export function Callout({ type, title, children }: CalloutProps) {
  const color = COLORS[type] ?? tokens.accent;
  return (
    <aside
      style={{
        borderLeft: `3px solid ${color}`,
        background: tokens.card,
        padding: '0.75rem 1.1rem',
        margin: '1.5rem 0',
        borderRadius: '0 8px 8px 0',
      }}
    >
      <strong style={{ color }}>{title ?? LABELS[type] ?? 'Note'}:</strong>{' '}
      {/* div (not span): MDX children are usually <p> blocks, and span > p is
          invalid HTML that the parser restructures, breaking SSR hydration.
          display: inline keeps plain-string children flowing after the label. */}
      <div style={{ color: tokens.ink, display: 'inline' }}>{children}</div>
    </aside>
  );
}
