'use client';
import { useId, useState, type CSSProperties } from 'react';
import { blockStyle, formatNumber, labelStyle, tokens } from './lib';

export interface TaxBracket {
  /** Upper edge of the bracket in dollars of taxable income; null marks the top bracket. */
  upTo: number | null;
  /** Marginal rate as a percentage, e.g. 22 for 22%. */
  rate: number;
}

export interface TaxBracketExplorerProps {
  /** Ordered lowest to highest; the last entry should have `upTo: null`. */
  brackets?: TaxBracket[];
  title?: string;
  /** Attribution for the bracket figures. */
  source?: string;
}

/** 2025 single-filer brackets, taxable income (IRS Rev. Proc. 2024-40). */
export const DEFAULT_TAX_BRACKETS: TaxBracket[] = [
  { upTo: 11_925, rate: 10 },
  { upTo: 48_475, rate: 12 },
  { upTo: 103_350, rate: 22 },
  { upTo: 197_300, rate: 24 },
  { upTo: 250_525, rate: 32 },
  { upTo: 626_350, rate: 35 },
  { upTo: null, rate: 37 },
];

export interface TaxBracketSlice {
  from: number;
  upTo: number | null;
  rate: number;
  /** Dollars of the given income that land inside this bracket. */
  amount: number;
  /** Tax owed on that amount. */
  tax: number;
}

/**
 * Pure marginal-bracket math: each slice taxes only the dollars that fall
 * inside it. `(amount * rate) / 100` keeps the per-bracket figures exact for
 * whole-dollar incomes and integer-percent rates.
 */
export function computeBracketTax(
  income: number,
  brackets: readonly TaxBracket[],
): TaxBracketSlice[] {
  let floor = 0;
  return brackets.map((b) => {
    const ceiling = b.upTo ?? Number.POSITIVE_INFINITY;
    const amount = Math.max(0, Math.min(income, ceiling) - floor);
    const slice: TaxBracketSlice = {
      from: floor,
      upTo: b.upTo,
      rate: b.rate,
      amount,
      tax: (amount * b.rate) / 100,
    };
    floor = ceiling;
    return slice;
  });
}

/** Fixed low-opacity tints (token hues) so each empty bucket reads distinctly. */
const TINTS = [
  'rgba(47, 77, 110, 0.12)',
  'rgba(176, 138, 62, 0.16)',
  'rgba(74, 107, 58, 0.14)',
  'rgba(138, 42, 30, 0.10)',
  'rgba(20, 19, 15, 0.10)',
  'rgba(47, 77, 110, 0.22)',
  'rgba(176, 138, 62, 0.30)',
];

const statLabelStyle: CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: tokens.muted,
};

const statValueStyle: CSSProperties = {
  fontSize: '1.45rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: tokens.ink,
  fontVariantNumeric: 'tabular-nums',
};

const cellStyle: CSSProperties = {
  padding: '0.3rem 0.5rem 0.3rem 0',
  borderBottom: `1px solid ${tokens.line}`,
  fontVariantNumeric: 'tabular-nums',
};

function rangeLabel(slice: TaxBracketSlice): string {
  if (slice.upTo === null) return `$${formatNumber(slice.from)}+`;
  return `$${formatNumber(slice.from)} – $${formatNumber(slice.upTo)}`;
}

/**
 * Income slider that fills bracket buckets left to right, then reads out the
 * tax owed and the marginal-vs-effective rate distinction.
 */
export function TaxBracketExplorer({
  brackets = DEFAULT_TAX_BRACKETS,
  title,
  source = 'IRS Rev. Proc. 2024-40 (2025 single-filer brackets, taxable income)',
}: TaxBracketExplorerProps) {
  const [income, setIncome] = useState(85_000);
  const sliderId = useId();

  // 700k fits the default top bracket; stretch only if custom brackets exceed it.
  const lastThreshold = brackets.reduce(
    (max, b) => (b.upTo !== null && b.upTo > max ? b.upTo : max),
    0,
  );
  const sliderMax = Math.max(700_000, Math.ceil((lastThreshold * 1.1) / 1000) * 1000);

  const slices = computeBracketTax(income, brackets);
  const tax = slices.reduce((sum, s) => sum + s.tax, 0);
  const effective = income > 0 ? (tax / income) * 100 : 0;
  // The bracket your NEXT dollar lands in: strict `<` so a threshold income
  // (e.g. exactly $48,475) reports the rate above the line, not below it.
  const marginal = brackets.find((b) => b.upTo === null || income < b.upTo)?.rate ?? 0;

  const totalSpan = slices.reduce((sum, s) => sum + ((s.upTo ?? sliderMax) - s.from), 0) || 1;
  const touched = slices.filter((s) => s.amount > 0);

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.green}` }}>
      <div style={labelStyle}>Marginal vs. effective</div>
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{title}</p>}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '0.75rem',
          marginBottom: '0.2rem',
        }}
      >
        <label htmlFor={sliderId} style={{ color: tokens.ink, fontSize: '0.95rem' }}>
          Taxable income
        </label>
        <span style={{ color: tokens.blue, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          ${formatNumber(income)}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={sliderMax}
        step={1000}
        value={income}
        onChange={(e) => setIncome(Number(e.target.value))}
        style={{ width: '100%', accentColor: tokens.blue, margin: 0 }}
      />

      {/* Buckets filling left to right; the table below carries the same data accessibly. */}
      <div aria-hidden="true" style={{ display: 'flex', gap: 2, marginTop: '0.9rem' }}>
        {slices.map((slice, i) => {
          const span = (slice.upTo ?? sliderMax) - slice.from;
          const filled = span > 0 ? Math.min(1, Math.max(0, (income - slice.from) / span)) : 0;
          return (
            <div key={i} style={{ width: `${(span / totalSpan) * 100}%`, minWidth: 0 }}>
              <div
                style={{
                  position: 'relative',
                  height: 34,
                  borderRadius: 3,
                  background: TINTS[i % TINTS.length],
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${filled * 100}%`,
                    background: tokens.blue,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: '0.62rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  color: tokens.muted,
                }}
              >
                {slice.rate}%
              </div>
            </div>
          );
        })}
      </div>

      <div
        role="status"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', marginTop: '1rem' }}
      >
        <div>
          <div style={statLabelStyle}>Tax</div>
          <div style={statValueStyle}>${formatNumber(Math.round(tax))}</div>
        </div>
        <div>
          <div style={statLabelStyle}>Effective rate</div>
          <div style={statValueStyle}>{effective.toFixed(1)}%</div>
        </div>
        <div>
          <div style={statLabelStyle}>Marginal rate</div>
          <div style={{ ...statValueStyle, color: tokens.accent }}>{marginal}%</div>
          <div style={{ fontSize: '0.78rem', color: tokens.muted }}>
            only your NEXT dollar is taxed at this rate
          </div>
        </div>
      </div>

      {touched.length > 0 && (
        <table
          style={{
            width: '100%',
            marginTop: '1rem',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            color: tokens.ink,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...cellStyle, ...statLabelStyle, textAlign: 'left' }}>Bracket</th>
              <th style={{ ...cellStyle, ...statLabelStyle, textAlign: 'right' }}>Rate</th>
              <th style={{ ...cellStyle, ...statLabelStyle, textAlign: 'right' }}>
                Tax in this bracket
              </th>
            </tr>
          </thead>
          <tbody>
            {touched.map((slice, i) => (
              <tr key={i}>
                <td style={cellStyle}>{rangeLabel(slice)}</td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>{slice.rate}%</td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  ${formatNumber(Math.round(slice.tax))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ margin: '0.9rem 0 0', fontSize: '0.78rem', color: tokens.muted }}>
        Source: {source}. Taxable income = income after deductions.
      </p>
    </div>
  );
}
