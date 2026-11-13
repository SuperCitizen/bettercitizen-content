import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { allOrNothingBasis, barColor, tokens, type TokenColor } from './lib';

export interface PanelProps {
  /** The panel's heading. */
  title: string;
  /** Color of the panel's top rule. Decoration only: it never carries meaning by itself. */
  tone?: TokenColor;
  /** Markdown: short paragraphs and lists. */
  children: ReactNode;
}

/** One panel. Renders its own card; `Panels` decides whether panels sit side by side or stack. */
export function Panel({ title, tone, children }: PanelProps) {
  return (
    <section
      style={{
        height: '100%',
        boxSizing: 'border-box',
        background: tokens.card,
        border: `1px solid ${tokens.line}`,
        borderTop: `4px solid ${tone ? barColor(tone) : tokens.muted}`,
        borderRadius: 8,
        // The last paragraph or list inside brings its own bottom margin.
        padding: '0.7rem 0.85rem 0.15rem',
        fontSize: '0.9em',
        lineHeight: 1.5,
        color: tokens.ink,
      }}
    >
      <h3
        style={{
          margin: '0 0 0.45rem',
          fontSize: '1em',
          fontWeight: 700,
          lineHeight: 1.3,
          letterSpacing: 0,
          fontFamily: 'inherit',
          color: tokens.ink,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export interface PanelsProps {
  /** Optional heading above the panels. */
  title?: string;
  /** 2–4 `Panel` children. */
  children: ReactNode;
}

/**
 * Narrowest a panel may get before the row stacks, in em of the reader's text
 * size. Two panels ask for more each, so a pair stacks on a phone instead of
 * squeezing into two thin columns; three or four only ever fit a wide column.
 */
const panelMinEm = (count: number) => (count <= 2 ? 11.5 : count === 3 ? 9.5 : 8.5);
const GAP_EM = 0.75;

/**
 * Side-by-side panels that stack when the column is too narrow for them. All
 * or nothing: every panel sits in one row when each can be at least its
 * minimum width, otherwise every panel takes the full width, in source
 * order. The breakpoint is in em, so larger text stacks sooner. Static, and
 * safe to render on the server.
 */
export function Panels({ title, children }: PanelsProps) {
  // MDX interleaves whitespace text nodes between children; keep only <Panel> elements.
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<PanelProps> =>
      isValidElement<{ title?: unknown }>(child) && typeof child.props.title === 'string',
  );
  if (panels.length === 0) return null;
  const threshold = panels.length * panelMinEm(panels.length) + (panels.length - 1) * GAP_EM;
  return (
    <div role="group" aria-label={title} style={{ margin: '1.5rem 0' }}>
      {title && <p style={{ margin: '0 0 0.6rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${GAP_EM}em` }}>
        {panels.map((panel, i) => (
          <div key={i} style={{ flexGrow: 1, flexBasis: allOrNothingBasis(threshold), minWidth: 0 }}>
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
