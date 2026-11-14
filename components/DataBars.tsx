import { barColor, blockStyle, formatNumber, labelStyle, listReset, tokens, trackFill, type TokenColor } from './lib';

export interface DataBarsBar {
  label: string;
  value: number;
  color?: TokenColor;
  note?: string;
}

export interface DataBarsGroup {
  /** Heading for this set of bars, e.g. a counting rule or a state. */
  label: string;
  bars: DataBarsBar[];
  /** One line read after the group's bars. */
  note?: string;
}

export interface DataBarsMarker {
  value: number;
  label: string;
}

export interface DataBarsProps {
  /** The bars. Required unless `groups` is given. */
  bars?: DataBarsBar[];
  /** Sets of bars under their own headings, all drawn to one scale. */
  groups?: DataBarsGroup[];
  title?: string;
  /**
   * Shown after values, e.g. "electors". A unit that starts with "%" attaches
   * without a space ("51% of receipts"), and one that starts with "$" goes in
   * front ("$" gives "$3,500"; "$ billion" gives "$4,200 billion").
   */
  unit?: string;
  /** Scale max; defaults to the largest bar value (rows) or the bars' sum (stacked). */
  max?: number;
  /** Dashed threshold line across the bars. */
  marker?: DataBarsMarker;
  /** Render one proportional stacked bar instead of one row per bar. */
  stacked?: boolean;
}

/**
 * Horizontal bar comparison. Each row sets the label and its value on one
 * line with the bar beneath, so a row never needs more width than its words
 * and reads the same on a phone as on a desk. Values are always text, never
 * painted inside a fill. Static: nothing moves, and the server renders the
 * final widths.
 */
export function DataBars({ bars = [], groups, title, unit, max, marker, stacked = false }: DataBarsProps) {
  const all = groups ? groups.flatMap((g) => g.bars) : bars;
  const largest = all.reduce((m, b) => Math.max(m, b.value), 0);
  const total = all.reduce((s, b) => s + b.value, 0);
  // Guard against an all-zero dataset; a 0 denominator would yield NaN widths.
  const scaleMax = Math.max(max ?? (stacked ? total : largest), 0) || 1;
  const frac = (v: number) => Math.min(Math.max(v / scaleMax, 0), 1);
  const markerAt = marker ? `${frac(marker.value) * 100}%` : null;
  const valueText = (value: number) => {
    const n = formatNumber(value);
    if (!unit) return n;
    if (unit.startsWith('$')) return `$${n}${unit.length > 1 ? ` ${unit.slice(1).trim()}` : ''}`;
    return unit.startsWith('%') ? `${n}${unit}` : `${n} ${unit}`;
  };

  // The marker is a dashed tick on every track, with its meaning stated once above the bars.
  const tick = markerAt && (
    <span
      aria-hidden="true"
      style={{ position: 'absolute', top: -3, bottom: -3, left: markerAt, borderLeft: `2px dashed ${tokens.ink}` }}
    />
  );
  const markerKey = marker && (
    <p style={{ margin: '0 0 0.6rem', fontSize: '0.8rem', lineHeight: 1.4, color: tokens.muted }}>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          height: '0.9em',
          borderLeft: `2px dashed ${tokens.ink}`,
          marginRight: '0.45em',
          verticalAlign: '-0.1em',
        }}
      />
      {marker.label}
    </p>
  );

  const rows = (items: DataBarsBar[]) => (
    <ul style={{ ...listReset, display: 'grid', gap: '0.65rem' }}>
      {items.map((bar, i) => (
        <li key={i} style={{ margin: 0 }}>
          {/* A value with a long unit drops to its own line, right-aligned, instead of overflowing. */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.1em 0.75em', fontSize: '0.88rem', lineHeight: 1.3 }}>
            <span style={{ flex: '1 1 8em', minWidth: 0, color: tokens.ink }}>
              {bar.label}
              {bar.note && (
                <span style={{ display: 'block', fontSize: '0.78rem', color: tokens.muted, marginTop: 1 }}>
                  {bar.note}
                </span>
              )}
            </span>
            <span
              style={{
                flex: '0 1 auto',
                minWidth: 0,
                marginLeft: 'auto',
                textAlign: 'right',
                fontWeight: 600,
                color: tokens.ink,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {valueText(bar.value)}
            </span>
          </div>
          <div
            aria-hidden="true"
            style={{ position: 'relative', marginTop: 4, height: 12, background: trackFill, borderRadius: 3 }}
          >
            <div
              style={{
                width: `${frac(bar.value) * 100}%`,
                height: '100%',
                background: barColor(bar.color),
                borderRadius: 3,
              }}
            />
            {tick}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      <div style={labelStyle}>By the numbers</div>
      {title && <p style={{ margin: '0 0 0.7rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}
      {markerKey}

      {!stacked && !groups && rows(bars)}

      {!stacked &&
        groups &&
        groups.map((group, g) => (
          <div
            key={g}
            role="group"
            aria-label={group.label}
            style={{
              marginTop: g === 0 ? 0 : '0.9rem',
              paddingTop: g === 0 ? 0 : '0.8rem',
              borderTop: g === 0 ? undefined : `1px solid ${tokens.line}`,
            }}
          >
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3, color: tokens.ink }}>
              {group.label}
            </p>
            {rows(group.bars)}
            {group.note && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', lineHeight: 1.45, color: tokens.muted }}>
                {group.note}
              </p>
            )}
          </div>
        ))}

      {stacked && (
        <div>
          <div aria-hidden="true" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', height: 22, background: trackFill, borderRadius: 4, overflow: 'hidden' }}>
              {all.map((bar, i) => (
                <div
                  key={i}
                  style={{
                    width: `${frac(bar.value) * 100}%`,
                    background: barColor(bar.color),
                    boxSizing: 'border-box',
                    borderRight: i < all.length - 1 ? `2px solid ${tokens.card}` : undefined,
                  }}
                />
              ))}
            </div>
            {tick}
          </div>
          <ul style={{ ...listReset, display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1.1rem', marginTop: '0.7rem' }}>
            {all.map((bar, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: 0, fontSize: '0.85rem', lineHeight: 1.35 }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 3,
                    background: barColor(bar.color),
                    flex: '0 0 auto',
                    alignSelf: 'center',
                  }}
                />
                <span style={{ color: tokens.ink }}>{bar.label}</span>
                <span style={{ color: tokens.muted, fontVariantNumeric: 'tabular-nums' }}>{valueText(bar.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
