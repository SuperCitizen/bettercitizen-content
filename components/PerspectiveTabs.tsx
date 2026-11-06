'use client';
import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { blockStyle, labelStyle, tokens } from './lib';

export interface PerspectiveProps {
  /** The position's honest name — shown on the tab by the parent. */
  name: string;
  /** The steel-manned case. */
  children: ReactNode;
}

/** One steel-manned position. Renders only its children; `PerspectiveTabs` reads `name`. */
export function Perspective({ children }: PerspectiveProps) {
  return <div>{children}</div>;
}

export interface PerspectiveTabsProps {
  /** 2–4 `Perspective` children. */
  children: ReactNode;
}

/**
 * Tabbed comparison of contested positions, each presented as its smartest
 * advocate would. Only the selected perspective renders; arrow keys move
 * between tabs (roving tabindex).
 */
export function PerspectiveTabs({ children }: PerspectiveTabsProps) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  // MDX interleaves whitespace text nodes between children; keep only
  // elements that carry a string `name` prop (i.e. <Perspective>).
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<PerspectiveProps> =>
      isValidElement<{ name?: unknown }>(child) && typeof child.props.name === 'string',
  );

  if (panels.length === 0) return null;
  const current = Math.min(selected, panels.length - 1);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? -1 : 1;
    const next = (current + delta + panels.length) % panels.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.accent}` }}>
      <div style={labelStyle}>Perspectives — each steel-manned</div>
      <div
        role="tablist"
        aria-label="Perspectives"
        onKeyDown={onKeyDown}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        {panels.map((panel, i) => {
          const isSelected = i === current;
          return (
            <button
              key={panel.props.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(i)}
              style={{
                font: 'inherit',
                fontSize: '0.9rem',
                fontWeight: isSelected ? 600 : 400,
                padding: '0.45rem 0.75rem',
                border: 'none',
                // 2px reserved on every tab so selection doesn't shift layout
                borderBottom: `2px solid ${isSelected ? tokens.accent : 'transparent'}`,
                marginBottom: -1,
                background: 'transparent',
                color: isSelected ? tokens.ink : tokens.muted,
                cursor: 'pointer',
              }}
            >
              {panel.props.name}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${current}`}
        aria-labelledby={`${baseId}-tab-${current}`}
        style={{ paddingTop: '0.75rem', color: tokens.ink }}
      >
        {panels[current]}
      </div>
      <p style={{ margin: '0.75rem 0 0', color: tokens.muted, fontStyle: 'italic', fontSize: '0.85rem' }}>
        Each tab presents the position as its smartest advocate would.
      </p>
    </div>
  );
}
