'use client';
import { useState, type CSSProperties } from 'react';
import { barColor, blockStyle, labelStyle, listReset, tokens, trackFill, type TokenColor } from './lib';

export interface MapAxis {
  /** What the axis measures. */
  label: string;
  /** Name of the low end (left, or bottom). */
  low: string;
  /** Name of the high end (right, or top). */
  high: string;
}

export interface MapPoint {
  label: string;
  /** Position along the x axis, 0 (low) to 1 (high). */
  x: number;
  /** Position along the y axis, 0 (low) to 1 (high). Omit on a one-axis map. */
  y?: number;
  /** Read in the list under the map. */
  detail?: string;
  tone?: TokenColor;
  /** Dashed ring: a position that is hypothetical, or shown for contrast rather than as a member. */
  dashed?: boolean;
}

/** A labeled stretch of the x axis, e.g. the range a family of positions covers. One-axis maps only. */
export interface MapSpan {
  from: number;
  to: number;
  label: string;
}

export interface PositionMapProps {
  x: MapAxis;
  /** Leave out for a one-axis spectrum. */
  y?: MapAxis;
  points: MapPoint[];
  spans?: MapSpan[];
  title?: string;
}

const small: CSSProperties = { fontSize: '0.75rem', lineHeight: 1.3, color: tokens.ink };
const pct = (f: number) => `${Math.min(Math.max(f, 0), 1) * 100}%`;

/**
 * Positions on one or two axes. Each position is a numbered marker, and the
 * numbered list beneath names and explains it, so labels never collide at any
 * width. Tapping a marker or its name highlights the pair. The list is the
 * whole content: the map adds where each position sits.
 */
export function PositionMap({ x, y, points, spans = [], title }: PositionMapProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const toggle = (i: number) => setSelected((s) => (s === i ? null : i));

  const marker = (p: MapPoint, i: number) => {
    const on = selected === i;
    const color = p.tone ? barColor(p.tone) : tokens.ink;
    return (
      <button
        key={i}
        type="button"
        aria-pressed={on}
        aria-label={`${i + 1}. ${p.label}`}
        onClick={() => toggle(i)}
        style={{
          position: 'absolute',
          left: pct(p.x),
          top: y ? pct(1 - (p.y ?? 0.5)) : '50%',
          transform: 'translate(-50%, -50%)',
          width: '1.7rem',
          height: '1.7rem',
          padding: 0,
          boxSizing: 'border-box',
          borderRadius: '50%',
          border: `2px ${p.dashed ? 'dashed' : 'solid'} ${on ? tokens.ink : color}`,
          background: on ? tokens.ink : tokens.card,
          color: on ? tokens.card : tokens.ink,
          font: 'inherit',
          fontSize: '0.78rem',
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'pointer',
          zIndex: on ? 2 : 1,
        }}
      >
        {i + 1}
      </button>
    );
  };

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.green}` }}>
      <div style={labelStyle}>Where they sit</div>
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}

      {y ? (
        <div>
          <div style={{ ...small, marginBottom: '0.3rem' }}>
            <span aria-hidden="true">↑ </span>
            {y.high}
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <div style={{ ...small, writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center', fontWeight: 600 }}>{y.label}</div>
            <div
              role="group"
              aria-label={`${y.label} against ${x.label}`}
              style={{ position: 'relative', flex: 1, height: '15rem', background: trackFill, borderLeft: `1.5px solid ${tokens.muted}`, borderBottom: `1.5px solid ${tokens.muted}` }}
            >
              {points.map(marker)}
            </div>
          </div>
          <div style={{ ...small, margin: '0.3rem 0 0 1.5rem' }}>
            <span aria-hidden="true">↓ </span>
            {y.low}
          </div>
        </div>
      ) : (
        <div style={{ padding: '0 0.85rem' }}>
          {spans.map((s, i) => (
            <div key={i} style={{ marginLeft: pct(s.from), width: pct(s.to - s.from), paddingBottom: '0.3rem' }}>
              <div style={{ ...small, textAlign: 'center', paddingBottom: 2 }}>{s.label}</div>
              <div aria-hidden="true" style={{ height: 5, borderTop: `2px solid ${tokens.ink}`, borderLeft: `2px solid ${tokens.ink}`, borderRight: `2px solid ${tokens.ink}` }} />
            </div>
          ))}
          <div role="group" aria-label={x.label} style={{ position: 'relative', height: '2.4rem' }}>
            <div aria-hidden="true" style={{ position: 'absolute', left: '-0.85rem', right: '-0.85rem', top: '50%', borderTop: `2px solid ${tokens.muted}` }} />
            {points.map(marker)}
          </div>
        </div>
      )}

      <div style={{ ...small, display: 'flex', justifyContent: 'space-between', gap: '1em', marginTop: '0.35rem', marginLeft: y ? '1.5rem' : 0 }}>
        <span>
          <span aria-hidden="true">← </span>
          {x.low}
        </span>
        <span style={{ textAlign: 'right' }}>
          {x.high}
          <span aria-hidden="true"> →</span>
        </span>
      </div>
      <div style={{ ...small, fontWeight: 600, textAlign: 'center', marginTop: '0.2rem', marginLeft: y ? '1.5rem' : 0 }}>{x.label}</div>

      <ol style={{ ...listReset, display: 'grid', gap: '0.15rem', marginTop: '0.85rem', borderTop: `1px solid ${tokens.line}`, paddingTop: '0.6rem' }}>
        {points.map((p, i) => {
          const on = selected === i;
          return (
            <li key={i} style={{ margin: 0 }}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                style={{
                  display: 'flex',
                  gap: '0.6em',
                  alignItems: 'baseline',
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.3rem 0.45rem',
                  border: 'none',
                  borderRadius: 6,
                  background: on ? trackFill : 'transparent',
                  color: tokens.ink,
                  font: 'inherit',
                  fontSize: '0.86rem',
                  lineHeight: 1.4,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span aria-hidden="true" style={{ flex: '0 0 auto', minWidth: '1.2em', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {i + 1}
                </span>
                <span>
                  <strong>{p.label}</strong>
                  {p.detail && <span style={{ display: 'block' }}>{p.detail}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
