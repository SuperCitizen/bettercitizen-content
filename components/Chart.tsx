'use client';
import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { barColor, blockStyle, formatNumber, labelStyle, listReset, tokens, type TokenColor } from './lib';

/** `[x, y]`, or `[x, y, name]` when the x value needs words ("early 2025"). */
export type ChartPoint = [number, number] | [number, number, string];

export interface ChartSeries {
  label: string;
  /** Points in x order. */
  points: ChartPoint[];
  color?: TokenColor;
  /** Dashed line: an estimate, a projection, a reference. */
  dashed?: boolean;
  /** Draw a line (default), dots only, or both. */
  show?: 'line' | 'points' | 'both';
}

export interface ChartMark {
  x: number;
  y: number;
  /** Short label set beside the point. */
  label: string;
  place?: 'above' | 'below' | 'left' | 'right';
}

/** A dashed reference line: vertical at `x`, or horizontal at `y`. */
export interface ChartRule {
  x?: number;
  y?: number;
  label: string;
}

/** A shaded range of x, named in the key beneath the chart. */
export interface ChartBand {
  from: number;
  to: number;
  label: string;
  color?: TokenColor;
}

export interface ChartProps {
  series: ChartSeries[];
  title?: string;
  /** Unit for y values, e.g. "ppm". A unit that starts with "%" attaches without a space. */
  unit?: string;
  /** Unit for x values, e.g. "%". Years need none. */
  xUnit?: string;
  xLabel?: string;
  yLabel?: string;
  xTicks?: number[];
  /** Pass an empty list for a schematic chart with no numbers on the y axis. */
  yTicks?: number[];
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  /** A few labeled points. Keep them far enough apart to read on a phone. */
  marks?: ChartMark[];
  rules?: ChartRule[];
  bands?: ChartBand[];
  /**
   * A concept curve rather than measured data: no numbers on the y axis, no
   * point readout and no data table, since the points mean nothing by themselves.
   */
  schematic?: boolean;
  /** Drop the frame and label: for a small chart set inside a `Panel`. */
  plain?: boolean;
}

const SERIES_COLORS: TokenColor[] = ['accent', 'blue', 'green', 'gold', 'ink'];
const small: CSSProperties = { fontSize: '0.75rem', lineHeight: 1.2, color: tokens.ink };

const isYear = (x: number) => Number.isInteger(x) && x >= 1000 && x <= 2999;
const pct = (f: number) => `${Math.min(Math.max(f, 0), 1) * 100}%`;

/**
 * A line or point chart drawn for the width it is given. The plot stretches;
 * every label is real text laid over it, so text stays the reader's size on a
 * phone and on a desk. Dragging across the plot, or focusing it and using the
 * arrow keys, reads out one point at a time; the full data sits in a table
 * underneath. Renders completely on the server.
 */
export function Chart({
  series,
  title,
  unit,
  xUnit,
  xLabel,
  yLabel,
  xTicks,
  yTicks,
  xMin,
  xMax,
  yMin,
  yMax,
  marks = [],
  rules = [],
  bands = [],
  schematic = false,
  plain = false,
}: ChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);

  // Every point of every series, in reading order.
  const flat = series
    .flatMap((s, si) => s.points.map((p) => ({ si, x: p[0], y: p[1], name: p[2] })))
    .sort((a, b) => a.x - b.x || a.si - b.si);
  const xs = [...flat.map((p) => p.x), ...(xTicks ?? []), ...bands.flatMap((b) => [b.from, b.to])];
  const ys = [...flat.map((p) => p.y), ...(yTicks ?? []), ...rules.flatMap((r) => (r.y === undefined ? [] : [r.y]))];
  const x0 = xMin ?? Math.min(...xs);
  const x1 = xMax ?? Math.max(...xs);
  const y0 = yMin ?? Math.min(0, ...ys);
  const y1 = yMax ?? Math.max(...ys);
  const fx = (x: number) => (x1 === x0 ? 0.5 : (x - x0) / (x1 - x0));
  const fy = (y: number) => (y1 === y0 ? 0.5 : 1 - (y - y0) / (y1 - y0));

  const allYears = flat.every((p) => isYear(p.x));
  const xText = (x: number, name?: string) => name ?? (isYear(x) && !xUnit ? String(x) : `${formatNumber(x)}${xUnit ?? ''}`);
  const yText = (y: number) => `${formatNumber(y)}${unit ? (unit.startsWith('%') ? unit : ` ${unit}`) : ''}`;
  const colorOf = (si: number) => barColor(series[si]?.color ?? SERIES_COLORS[si % SERIES_COLORS.length]);

  const xt = xTicks ?? [x0, x1];
  const yt = yTicks ?? (schematic ? [] : [y0, (y0 + y1) / 2, y1]);
  const yTickText = (y: number) => `${formatNumber(y)}${unit?.startsWith('%') ? '%' : ''}`;
  const gutter = yt.length ? `${Math.max(...yt.map((y) => yTickText(y).length)) * 0.58 + 0.9}em` : '0.4em';

  const current = active === null ? undefined : flat[active];
  const readout = current
    ? `${series.length > 1 ? `${series[current.si]?.label}, ` : ''}${xText(current.x, current.name)}: ${yText(current.y)}`
    : null;

  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    if (!box.width || !flat.length) return;
    const px = (e.clientX - box.left) / box.width;
    const py = (e.clientY - box.top) / box.height;
    let best = 0;
    let bestD = Infinity;
    flat.forEach((p, i) => {
      // Horizontal distance decides; vertical only separates series that share an x.
      const d = (fx(p.x) - px) ** 2 + ((fy(p.y) - py) * 0.3) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = flat.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = active === null ? 0 : Math.min(active + 1, last);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = active === null ? last : Math.max(active - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
  };

  const dot = (x: number, y: number, color: string, size: number, key: string, ring = false) => (
    <span
      key={key}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: pct(fx(x)),
        top: pct(fy(y)),
        width: size,
        height: size,
        boxSizing: 'border-box',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: ring ? tokens.card : color,
        border: ring ? `3px solid ${color}` : undefined,
        pointerEvents: 'none',
      }}
    />
  );

  /**
   * Keeps a label inside the plot at any width: the label shifts left by the
   * same fraction of its own width as its point sits across the plot, so it
   * meets the left edge at 0 and the right edge at 1.
   */
  const anchorX = (f: number) => `${(-Math.min(Math.max(f, 0), 1) * 100).toFixed(1)}%`;
  /** A label keeps its natural width until it is as wide as the room it has, then wraps instead of sticking out. */
  const fitted = (maxWidth: string): CSSProperties => ({ width: 'max-content', maxWidth, whiteSpace: 'normal' });
  const markLabel = (m: ChartMark, i: number) => {
    const px = fx(m.x);
    const py = fy(m.y);
    const place = m.place ?? (py < 0.2 ? 'below' : 'above');
    const transform =
      place === 'above'
        ? `translate(${anchorX(px)}, calc(-100% - 8px))`
        : place === 'below'
          ? `translate(${anchorX(px)}, 8px)`
          : place === 'left'
            ? 'translate(calc(-100% - 9px), -50%)'
            : 'translate(9px, -50%)';
    return (
      <span
        key={`ml${i}`}
        style={{
          ...small,
          position: 'absolute',
          left: pct(px),
          top: pct(py),
          transform,
          ...fitted(place === 'left' ? `calc(${pct(px)} - 9px)` : place === 'right' ? `calc(${pct(1 - px)} - 9px)` : '100%'),
          textAlign: place === 'left' ? 'right' : place === 'right' ? 'left' : px < 0.34 ? 'left' : px > 0.66 ? 'right' : 'center',
          fontWeight: 600,
          background: tokens.card,
          borderRadius: 3,
          padding: '0 0.25em',
          pointerEvents: 'none',
        }}
      >
        {m.label}
      </span>
    );
  };

  const keyItems = [
    ...(series.length > 1
      ? series.map((s, si) => ({
          label: s.label,
          // The key shows what the plot shows: a dot for a series drawn as points, a line otherwise.
          swatch:
            s.show === 'points' ? (
              <span style={{ display: 'inline-block', width: '1.5em', textAlign: 'center', verticalAlign: 'middle', lineHeight: 0 }}>
                <span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: colorOf(si) }} />
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-block',
                  width: '1.5em',
                  borderTop: `3px ${s.dashed ? 'dashed' : 'solid'} ${colorOf(si)}`,
                  verticalAlign: 'middle',
                }}
              />
            ),
        }))
      : []),
    ...bands.map((b) => ({
      label: b.label,
      swatch: (
        <span
          style={{
            display: 'inline-block',
            width: '0.95em',
            height: '0.95em',
            background: barColor(b.color ?? 'gold'),
            opacity: 0.35,
            borderRadius: 2,
            verticalAlign: '-0.12em',
          }}
        />
      ),
    })),
  ];

  const cell: CSSProperties = { padding: '0.2rem 0.6rem', fontSize: '0.8rem', lineHeight: 1.35, textAlign: 'left' };

  return (
    <div style={plain ? { margin: '0 0 0.6rem' } : { ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      {!plain && <div style={labelStyle}>By the numbers</div>}
      {title && <p style={{ margin: '0 0 0.4rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}
      {!schematic && (
        <p aria-live="polite" style={{ ...small, margin: '0 0 0.6rem', minHeight: '1.2em', fontSize: '0.82rem' }}>
          {readout ? <strong>{readout}</strong> : <span style={{ color: tokens.muted }}>Drag across the chart to read each point.</span>}
        </p>
      )}
      {yLabel && <div style={{ ...small, marginBottom: '0.45rem' }}>{yLabel}</div>}

      <div
        style={{
          position: 'relative',
          height: plain ? '10rem' : '13rem',
          // Room above the plot for the labels of vertical rules.
          marginTop: rules.some((r) => r.x !== undefined) ? '1.5rem' : '0.4rem',
          marginLeft: gutter,
          marginRight: '0.4em',
          marginBottom: xLabel ? '2.9rem' : '1.7rem',
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          {bands.map((b, i) => (
            <rect key={`b${i}`} x={fx(b.from) * 100} y={0} width={(fx(b.to) - fx(b.from)) * 100} height={100} fill={barColor(b.color ?? 'gold')} opacity={0.18} />
          ))}
          {yt.map((y, i) => (
            <line key={`g${i}`} x1={0} x2={100} y1={fy(y) * 100} y2={fy(y) * 100} stroke={tokens.line} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={0} x2={100} y1={100} y2={100} stroke={tokens.muted} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          <line x1={0} x2={0} y1={0} y2={100} stroke={tokens.muted} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          {rules.map((r, i) =>
            r.x !== undefined ? (
              <line key={`r${i}`} x1={fx(r.x) * 100} x2={fx(r.x) * 100} y1={0} y2={100} stroke={tokens.ink} strokeWidth={1.5} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
            ) : r.y !== undefined ? (
              <line key={`r${i}`} x1={0} x2={100} y1={fy(r.y) * 100} y2={fy(r.y) * 100} stroke={tokens.ink} strokeWidth={1.5} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
            ) : null,
          )}
          {series.map((s, si) =>
            (s.show ?? 'line') === 'points' ? null : (
              <polyline
                key={`s${si}`}
                points={s.points.map((p) => `${fx(p[0]) * 100},${fy(p[1]) * 100}`).join(' ')}
                fill="none"
                stroke={colorOf(si)}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray={s.dashed ? '6 5' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ),
          )}
          {current && (
            <line x1={fx(current.x) * 100} x2={fx(current.x) * 100} y1={0} y2={100} stroke={tokens.muted} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          )}
        </svg>

        {yt.map((y, i) => (
          <span key={`yt${i}`} aria-hidden="true" style={{ ...small, position: 'absolute', right: '100%', top: pct(fy(y)), transform: 'translateY(-50%)', paddingRight: '0.45em', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {yTickText(y)}
          </span>
        ))}
        {xt.map((x, i) => (
          <span key={`xt${i}`} aria-hidden="true" style={{ ...small, position: 'absolute', top: '100%', left: pct(fx(x)), transform: `translateX(${fx(x) < 0.04 ? '0%' : fx(x) > 0.96 ? '-100%' : '-50%'})`, paddingTop: '0.4em', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
            {xText(x)}
          </span>
        ))}
        {xLabel && (
          <span style={{ ...small, position: 'absolute', top: '100%', left: 0, right: 0, paddingTop: '1.75rem', textAlign: 'center' }}>{xLabel}</span>
        )}
        {rules.map((r, i) =>
          r.x !== undefined ? (
            <span key={`rl${i}`} style={{ ...small, position: 'absolute', left: pct(fx(r.x)), top: 0, transform: `translate(${anchorX(fx(r.x))}, -115%)`, ...fitted('100%') }}>
              {r.label}
            </span>
          ) : r.y !== undefined ? (
            <span key={`rl${i}`} style={{ ...small, position: 'absolute', left: 4, top: pct(fy(r.y)), transform: 'translateY(-115%)', ...fitted('calc(100% - 8px)'), background: tokens.card, borderRadius: 3, padding: '0 0.25em' }}>
              {r.label}
            </span>
          ) : null,
        )}
        {/* Marks first: a mark that names a plotted point must not cover that point's color. */}
        {marks.map((m, i) => dot(m.x, m.y, tokens.ink, 9, `m${i}`))}
        {series.flatMap((s, si) =>
          (s.show ?? 'line') === 'line' ? [] : s.points.map((p, pi) => dot(p[0], p[1], colorOf(si), 9, `d${si}-${pi}`)),
        )}
        {marks.map(markLabel)}
        {current && dot(current.x, current.y, colorOf(current.si), 15, 'active', true)}

        {!schematic && (
        <div
          role="slider"
          tabIndex={0}
          aria-label={`${title ?? 'Chart'}: step through the points`}
          aria-valuemin={0}
          aria-valuemax={Math.max(flat.length - 1, 0)}
          aria-valuenow={active ?? 0}
          aria-valuetext={readout ?? 'No point selected'}
          onPointerDown={pick}
          onPointerMove={pick}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            borderRadius: 2,
            cursor: 'crosshair',
            touchAction: 'pan-y',
            outline: focused ? `2px solid ${tokens.accent}` : 'none',
            outlineOffset: 1,
          }}
        />
        )}
      </div>

      {keyItems.length > 0 && (
        <ul style={{ ...listReset, display: 'flex', flexWrap: 'wrap', gap: '0.3rem 1.1rem', marginBottom: '0.5rem' }}>
          {keyItems.map((k, i) => (
            <li key={i} style={{ ...small, margin: 0, fontSize: '0.8rem', lineHeight: 1.4 }}>
              <span aria-hidden="true" style={{ marginRight: '0.45em' }}>
                {k.swatch}
              </span>
              {k.label}
            </li>
          ))}
        </ul>
      )}

      {!schematic && (
      <details>
        <summary style={{ ...small, fontSize: '0.8rem', cursor: 'pointer' }}>Show the data</summary>
        {series.map((s, si) => (
          <table key={si} style={{ width: 'auto', margin: '0.5rem 0 0', borderCollapse: 'collapse' }}>
            {series.length > 1 && <caption style={{ ...cell, fontWeight: 700, captionSide: 'top', padding: '0.2rem 0' }}>{s.label}</caption>}
            <thead>
              <tr>
                <th scope="col" style={cell}>
                  {allYears ? 'Year' : (xLabel ?? 'Value')}
                </th>
                <th scope="col" style={cell}>
                  {yLabel ?? (unit && !unit.startsWith('%') ? unit : 'Value')}
                </th>
              </tr>
            </thead>
            <tbody>
              {s.points.map((p, pi) => (
                <tr key={pi}>
                  <td style={cell}>{xText(p[0], p[2])}</td>
                  <td style={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{yText(p[1])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </details>
      )}
    </div>
  );
}
