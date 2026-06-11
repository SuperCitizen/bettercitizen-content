'use client';
import { useEffect, useState } from 'react';
import { barColor, blockStyle, formatNumber, labelStyle, tokens, type TokenColor } from './lib';

export interface DataBarsBar {
  label: string;
  value: number;
  color?: TokenColor;
  note?: string;
}

export interface DataBarsMarker {
  value: number;
  label: string;
}

export interface DataBarsProps {
  bars: DataBarsBar[];
  title?: string;
  /** Shown after values, e.g. "electors". */
  unit?: string;
  /** Scale max; defaults to the largest bar value (rows) or the bars' sum (stacked). */
  max?: number;
  /** Dashed threshold line across the bars. */
  marker?: DataBarsMarker;
  /** Render one proportional stacked bar instead of one row per bar. */
  stacked?: boolean;
}

const LABEL_COL = 140;
const COL_GAP = 12;
const TRACK_BG = 'rgba(0, 0, 0, 0.04)';
const MARKER_SPACE = '1.3rem';

/**
 * Animated horizontal bar comparison. Static display — no interaction.
 * Bars animate in on mount (width transition from 0), which is SSR-safe:
 * the server renders 0-width fills and the client animates to the real value.
 */
export function DataBars({ bars, title, unit, max, marker, stacked = false }: DataBarsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const largest = bars.reduce((m, b) => Math.max(m, b.value), 0);
  const total = bars.reduce((s, b) => s + b.value, 0);
  // Guard against an all-zero dataset; a 0 denominator would yield NaN widths.
  const scaleMax = Math.max(max ?? (stacked ? total : largest), 0) || 1;
  const markerFrac = marker ? Math.min(Math.max(marker.value / scaleMax, 0), 1) : 0;

  const valueText = (value: number) => `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;

  const markerOverlay = marker && (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: `${markerFrac * 100}%`,
          transform: 'translateX(-50%)',
          fontSize: '0.72rem',
          color: tokens.muted,
          whiteSpace: 'nowrap',
        }}
      >
        {marker.label}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: MARKER_SPACE,
          bottom: 0,
          left: `${markerFrac * 100}%`,
          borderLeft: `2px dashed ${tokens.ink}`,
        }}
      />
    </div>
  );

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      <div style={labelStyle}>By the numbers</div>
      {title && <p style={{ margin: '0 0 0.85rem', fontWeight: 600, color: tokens.ink }}>{title}</p>}

      {!stacked && (
        <div style={{ position: 'relative', paddingTop: marker ? MARKER_SPACE : 0 }}>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {bars.map((bar, i) => {
              const frac = Math.min(Math.max(bar.value / scaleMax, 0), 1);
              // Near-full bars print the value inside the fill so it never
              // overflows the track; the 0.82 cutoff is a deterministic stand-in
              // for "wide enough" (no client-side text measurement).
              const inside = frac > 0.82;
              return (
                <div key={i} style={{ display: 'flex', gap: COL_GAP, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      flex: `0 0 ${LABEL_COL}px`,
                      minWidth: LABEL_COL,
                      fontSize: '0.85rem',
                      color: tokens.ink,
                      paddingTop: 3,
                      lineHeight: 1.25,
                    }}
                  >
                    <div>{bar.label}</div>
                    {bar.note && (
                      <div style={{ fontSize: '0.75rem', color: tokens.muted, marginTop: 2 }}>{bar.note}</div>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: TRACK_BG,
                      borderRadius: 4,
                      height: 22,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: mounted ? `${frac * 100}%` : '0%',
                        height: '100%',
                        background: barColor(bar.color),
                        borderRadius: 4,
                        transition: 'width 700ms ease',
                        position: 'relative',
                      }}
                    >
                      {inside && (
                        <span
                          style={{
                            position: 'absolute',
                            right: 6,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {valueText(bar.value)}
                        </span>
                      )}
                    </div>
                    {!inside && (
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: '0.75rem',
                          color: tokens.ink,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {valueText(bar.value)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Marker spans only the track column, so the overlay starts past the label column. */}
          {marker && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: LABEL_COL + COL_GAP,
                right: 0,
                pointerEvents: 'none',
              }}
            >
              {markerOverlay}
            </div>
          )}
        </div>
      )}

      {stacked && (
        <div>
          <div style={{ position: 'relative', paddingTop: marker ? MARKER_SPACE : 0 }}>
            <div
              style={{
                display: 'flex',
                height: 36,
                background: TRACK_BG,
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              {bars.map((bar, i) => {
                const frac = Math.min(Math.max(bar.value / scaleMax, 0), 1);
                return (
                  <div
                    key={i}
                    style={{
                      width: mounted ? `${frac * 100}%` : '0%',
                      transition: 'width 700ms ease',
                      background: barColor(bar.color),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {/* Segment label only when the segment is plausibly wide enough. */}
                    {frac >= 0.14 && (
                      <span aria-hidden="true" style={{ color: '#ffffff', fontSize: '0.75rem' }}>
                        {bar.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {marker && (
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none' }}>
                {markerOverlay}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.1rem', marginTop: '0.7rem' }}>
            {bars.map((bar, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: barColor(bar.color),
                    flex: '0 0 auto',
                  }}
                />
                <span style={{ color: tokens.ink }}>{bar.label}</span>
                <span style={{ color: tokens.muted }}>{valueText(bar.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
