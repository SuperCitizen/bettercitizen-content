import type { ReactNode } from 'react';
import { tokens } from './lib';

export interface FigureProps {
  /** Read after the figure — a figure never speaks for itself. */
  caption: string;
  /** Small-print attribution line. */
  source?: string;
  children: ReactNode;
}

/**
 * Captioned figure wrapper for inline SVG and data graphics.
 * Static (no state) — safe to render on the server.
 */
export function Figure({ caption, source, children }: FigureProps) {
  return (
    <figure style={{ margin: '2rem 0' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>{children}</div>
      <figcaption
        style={{
          fontSize: '0.9em',
          color: tokens.muted,
          marginTop: '0.5rem',
          maxWidth: 680,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {caption}
        {source && (
          <span style={{ display: 'block', fontSize: '0.85em', marginTop: '0.2rem' }}>
            Source: {source}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
