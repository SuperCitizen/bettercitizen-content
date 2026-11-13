'use client';
import { useState } from 'react';
import { barColor, blockStyle, buttonStyle, formatNumber, labelStyle, listReset, tokens, trackFill, type TokenColor } from './lib';

export interface ScaleZone {
  /** Last value in this zone. Zones run in ascending order; the last one ends at `max`. */
  upTo: number;
  label: string;
  /** What being in this zone means, one sentence. */
  detail?: string;
  tone?: TokenColor;
}

export interface ScaleExample {
  value: number;
  label: string;
}

export interface ScaleProps {
  zones: ScaleZone[];
  /** Highest value on the scale. */
  max: number;
  /** Lowest value on the scale; defaults to 0. */
  min?: number;
  title?: string;
  /** What the number counts, e.g. "senators in favor". */
  unit?: string;
  /** Where the slider starts. */
  start?: number;
  /** Named values the reader can jump to. */
  examples?: ScaleExample[];
}

/**
 * A number line cut into zones by thresholds, with a slider: the reader moves
 * the count and reads what it can and cannot do. The zone list underneath
 * states every zone whether or not anyone touches the slider, so the content
 * is complete on the server and without script.
 */
export function Scale({ zones, max, min = 0, title, unit, start, examples = [] }: ScaleProps) {
  const [value, setValue] = useState(start ?? min);
  const [focused, setFocused] = useState(false);
  const span = max - min || 1;
  const from = (i: number) => (i === 0 ? min : (zones[i - 1]?.upTo ?? min) + 1);
  const zoneIndex = Math.max(
    zones.findIndex((z) => value <= z.upTo),
    0,
  );
  const zone = zones[zoneIndex];
  const range = (i: number) => {
    const a = from(i);
    const b = zones[i]?.upTo ?? max;
    return a === b ? formatNumber(a) : i === zones.length - 1 && b === max ? `${formatNumber(a)}+` : `${formatNumber(a)}–${formatNumber(b)}`;
  };
  // Each whole number is a cell one unit wide; the pin sits in the middle of its cell.
  const pin = Math.min(Math.max((value - 0.5 - min) / span, 0), 1);
  /** The first value of each zone after the first, set at its boundary. `row` 0 sits below the band, 1 above. */
  const thresholds = (row: 0 | 1) =>
    zones.slice(1).map((_, i) =>
      i % 2 === row ? (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            ...(row === 0 ? { top: '0.25rem' } : { bottom: '0.2rem' }),
            left: `${(((zones[i]?.upTo ?? min) - min) / span) * 100}%`,
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            lineHeight: 1,
            color: tokens.ink,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatNumber((zones[i]?.upTo ?? min) + 1)}
        </span>
      ) : null,
    );
  const count = `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;
  const reading = zone ? `${count}: ${zone.label}.${zone.detail ? ` ${zone.detail}` : ''}` : count;

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      <div style={labelStyle}>Try it</div>
      {title && <p style={{ margin: '0 0 0.6rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}

      <p aria-live="polite" style={{ margin: '0 0 0.9rem', lineHeight: 1.45, color: tokens.ink, minHeight: '4.35em' }}>
        <span style={{ fontSize: '1.5em', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatNumber(value)}</span>
        {unit && <span style={{ fontSize: '0.88rem' }}> {unit}</span>}
        {zone && (
          <span style={{ display: 'block', fontSize: '0.92rem' }}>
            <strong>{zone.label}.</strong> {zone.detail}
          </span>
        )}
      </p>

      {/* Threshold numbers alternate above and below the band, so close thresholds never run together. */}
      {zones.length > 2 && <div style={{ position: 'relative', height: '1.3rem' }}>{thresholds(1)}</div>}
      <div style={{ position: 'relative', height: '1.75rem', borderRadius: 4, outline: focused ? `2px solid ${tokens.accent}` : 'none', outlineOffset: 3 }}>
        <div aria-hidden="true" style={{ display: 'flex', height: '100%', borderRadius: 4, overflow: 'hidden', background: trackFill }}>
          {zones.map((z, i) => (
            <div
              key={i}
              style={{
                width: `${((z.upTo - (i === 0 ? min : (zones[i - 1]?.upTo ?? min))) / span) * 100}%`,
                background: z.tone ? barColor(z.tone) : 'transparent',
                opacity: i === zoneIndex ? 1 : 0.55,
                boxSizing: 'border-box',
                borderRight: i < zones.length - 1 ? `2px solid ${tokens.card}` : undefined,
              }}
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -5,
            bottom: -5,
            left: `${pin * 100}%`,
            width: 4,
            marginLeft: -2,
            borderRadius: 2,
            background: tokens.ink,
            boxShadow: `0 0 0 2px ${tokens.card}`,
            pointerEvents: 'none',
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={unit ?? title ?? 'Value'}
          aria-valuetext={reading}
          style={{ position: 'absolute', top: -6, left: 0, width: '100%', height: 'calc(100% + 12px)', margin: 0, opacity: 0, cursor: 'ew-resize' }}
        />
      </div>
      <div style={{ position: 'relative', height: '1.5rem' }}>{thresholds(0)}</div>

      {examples.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.2rem 0 0.8rem' }}>
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={value === ex.value}
              onClick={() => setValue(ex.value)}
              style={{
                ...buttonStyle,
                fontSize: '0.82rem',
                padding: '0.3rem 0.7rem',
                borderRadius: 999,
                background: value === ex.value ? tokens.ink : tokens.card,
                color: value === ex.value ? tokens.card : tokens.ink,
                borderColor: value === ex.value ? tokens.ink : tokens.line,
              }}
            >
              <strong>{formatNumber(ex.value)}</strong> · {ex.label}
            </button>
          ))}
        </div>
      )}

      <ul style={{ ...listReset, display: 'grid', gap: '0.3rem', borderTop: `1px solid ${tokens.line}`, paddingTop: '0.7rem' }}>
        {zones.map((z, i) => (
          <li key={i} style={{ margin: 0, display: 'flex', gap: '0.55em', alignItems: 'baseline', fontSize: '0.85rem', lineHeight: 1.4, color: tokens.ink }}>
            <span
              aria-hidden="true"
              style={{
                flex: '0 0 auto',
                width: 11,
                height: 11,
                borderRadius: 3,
                alignSelf: 'center',
                background: z.tone ? barColor(z.tone) : trackFill,
                border: z.tone ? undefined : `1px solid ${tokens.muted}`,
                boxSizing: 'border-box',
              }}
            />
            <span style={{ flex: '0 0 auto', minWidth: '3.4em', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{range(i)}</span>
            <span>
              <span style={{ fontWeight: i === zoneIndex ? 700 : 400 }}>{z.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
