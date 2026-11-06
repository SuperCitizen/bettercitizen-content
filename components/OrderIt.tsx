'use client';
import { useState, type CSSProperties } from 'react';
import { blockStyle, buttonStyle, labelStyle, primaryButtonStyle, seededShuffle, tokens } from './lib';

export interface OrderItProps {
  /** The steps in CORRECT order; the component displays them shuffled. */
  items: string[];
  prompt: string;
  /** Shown after a correct check. */
  explanation?: string;
  title?: string;
}

/** Shuffled display order (indexes into items). Seeded shuffle keeps SSR and
 * client markup identical; if it happens to land on the correct order, rotate
 * by one so the reader always has work to do. */
function initialOrder(count: number): number[] {
  const shuffled = seededShuffle(Array.from({ length: count }, (_, i) => i));
  if (count > 1 && shuffled.every((v, i) => v === i)) {
    return shuffled.slice(1).concat(shuffled.slice(0, 1));
  }
  return shuffled;
}

const moveButtonStyle: CSSProperties = {
  ...buttonStyle,
  padding: '0.15rem 0.55rem',
  lineHeight: 1.4,
};

/**
 * Put-the-steps-in-order exercise. The reader reorders a shuffled list with
 * up/down buttons, then checks; rows are marked in place until the next move.
 */
export function OrderIt({ items, prompt, explanation, title }: OrderItProps) {
  const [order, setOrder] = useState<number[]>(() => initialOrder(items.length));
  const [checked, setChecked] = useState(false);

  const inPlace = order.filter((itemIndex, pos) => itemIndex === pos).length;
  const solved = checked && inPlace === order.length;

  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = prev.slice();
      [next[from], next[to]] = [next[to]!, next[from]!];
      return next;
    });
    setChecked(false); // any move clears the per-row marks
  };

  const reset = () => {
    setOrder(initialOrder(items.length));
    setChecked(false);
  };

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.green}` }}>
      <div style={labelStyle}>Put it in order</div>
      {title && <p style={{ margin: '0 0 0.35rem', fontWeight: 700, color: tokens.ink }}>{title}</p>}
      <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{prompt}</p>
      <ol
        aria-label={prompt}
        style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.4rem' }}
      >
        {order.map((itemIndex, pos) => {
          const correct = itemIndex === pos;
          let border = `1px solid ${tokens.line}`;
          let background: string = tokens.card;
          if (checked && correct) {
            border = `1.5px solid ${tokens.green}`;
            background = 'rgba(74, 107, 58, 0.08)';
          } else if (checked && !correct) {
            border = `1.5px solid ${tokens.accent}`;
            background = 'rgba(138, 42, 30, 0.07)';
          }
          const upDisabled = pos === 0 || solved;
          const downDisabled = pos === order.length - 1 || solved;
          return (
            <li
              key={itemIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 0.6rem',
                borderRadius: 6,
                border,
                background,
              }}
            >
              <span
                style={{
                  minWidth: '1.3rem',
                  textAlign: 'right',
                  fontSize: '0.85rem',
                  fontVariantNumeric: 'tabular-nums',
                  color: tokens.muted,
                }}
              >
                {pos + 1}.
              </span>
              <span style={{ flex: 1, fontSize: '0.95rem', color: tokens.ink }}>
                {items[itemIndex]}
              </span>
              {checked && (
                <strong aria-hidden="true" style={{ color: correct ? tokens.green : tokens.accent }}>
                  {correct ? '✓' : '✗'}
                </strong>
              )}
              <button
                type="button"
                aria-label="Move up"
                disabled={upDisabled}
                onClick={() => move(pos, pos - 1)}
                style={{
                  ...moveButtonStyle,
                  cursor: upDisabled ? 'default' : 'pointer',
                  opacity: upDisabled ? 0.4 : 1,
                }}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={downDisabled}
                onClick={() => move(pos, pos + 1)}
                style={{
                  ...moveButtonStyle,
                  cursor: downDisabled ? 'default' : 'pointer',
                  opacity: downDisabled ? 0.4 : 1,
                }}
              >
                ↓
              </button>
            </li>
          );
        })}
      </ol>
      {!solved && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '0.85rem',
          }}
        >
          <button type="button" style={primaryButtonStyle} onClick={() => setChecked(true)}>
            Check order
          </button>
          {checked && (
            <span role="status" style={{ color: tokens.muted, fontSize: '0.95rem' }}>
              {inPlace} of {order.length} in place — keep going.
            </span>
          )}
        </div>
      )}
      {solved && (
        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: `1px solid ${tokens.line}` }}>
          <p role="status" style={{ margin: 0, color: tokens.ink }}>
            <strong style={{ color: tokens.green }}>Correct — that&rsquo;s the order. </strong>
            {explanation}
          </p>
          <button type="button" style={{ ...buttonStyle, marginTop: '0.75rem' }} onClick={reset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
