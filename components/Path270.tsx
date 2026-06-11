'use client';
import { useState } from 'react';
import { blockStyle, buttonStyle, labelStyle, primaryButtonStyle, tokens } from './lib';

export interface Path270Props {
  title?: string;
  /** Framing challenge, e.g. "Win without Texas, Florida, or California." */
  prompt?: string;
}

interface Jurisdiction {
  abbr: string;
  name: string;
  ev: number;
}

/** 2020-census apportionment, as used in the 2024 election. Sums to 538. */
const JURISDICTIONS: readonly Jurisdiction[] = [
  { abbr: 'AL', name: 'Alabama', ev: 9 },
  { abbr: 'AK', name: 'Alaska', ev: 3 },
  { abbr: 'AZ', name: 'Arizona', ev: 11 },
  { abbr: 'AR', name: 'Arkansas', ev: 6 },
  { abbr: 'CA', name: 'California', ev: 54 },
  { abbr: 'CO', name: 'Colorado', ev: 10 },
  { abbr: 'CT', name: 'Connecticut', ev: 7 },
  { abbr: 'DE', name: 'Delaware', ev: 3 },
  { abbr: 'DC', name: 'District of Columbia', ev: 3 },
  { abbr: 'FL', name: 'Florida', ev: 30 },
  { abbr: 'GA', name: 'Georgia', ev: 16 },
  { abbr: 'HI', name: 'Hawaii', ev: 4 },
  { abbr: 'ID', name: 'Idaho', ev: 4 },
  { abbr: 'IL', name: 'Illinois', ev: 19 },
  { abbr: 'IN', name: 'Indiana', ev: 11 },
  { abbr: 'IA', name: 'Iowa', ev: 6 },
  { abbr: 'KS', name: 'Kansas', ev: 6 },
  { abbr: 'KY', name: 'Kentucky', ev: 8 },
  { abbr: 'LA', name: 'Louisiana', ev: 8 },
  { abbr: 'ME', name: 'Maine', ev: 4 },
  { abbr: 'MD', name: 'Maryland', ev: 10 },
  { abbr: 'MA', name: 'Massachusetts', ev: 11 },
  { abbr: 'MI', name: 'Michigan', ev: 15 },
  { abbr: 'MN', name: 'Minnesota', ev: 10 },
  { abbr: 'MS', name: 'Mississippi', ev: 6 },
  { abbr: 'MO', name: 'Missouri', ev: 10 },
  { abbr: 'MT', name: 'Montana', ev: 4 },
  { abbr: 'NE', name: 'Nebraska', ev: 5 },
  { abbr: 'NV', name: 'Nevada', ev: 6 },
  { abbr: 'NH', name: 'New Hampshire', ev: 4 },
  { abbr: 'NJ', name: 'New Jersey', ev: 14 },
  { abbr: 'NM', name: 'New Mexico', ev: 5 },
  { abbr: 'NY', name: 'New York', ev: 28 },
  { abbr: 'NC', name: 'North Carolina', ev: 16 },
  { abbr: 'ND', name: 'North Dakota', ev: 3 },
  { abbr: 'OH', name: 'Ohio', ev: 17 },
  { abbr: 'OK', name: 'Oklahoma', ev: 7 },
  { abbr: 'OR', name: 'Oregon', ev: 8 },
  { abbr: 'PA', name: 'Pennsylvania', ev: 19 },
  { abbr: 'RI', name: 'Rhode Island', ev: 4 },
  { abbr: 'SC', name: 'South Carolina', ev: 9 },
  { abbr: 'SD', name: 'South Dakota', ev: 3 },
  { abbr: 'TN', name: 'Tennessee', ev: 11 },
  { abbr: 'TX', name: 'Texas', ev: 40 },
  { abbr: 'UT', name: 'Utah', ev: 6 },
  { abbr: 'VT', name: 'Vermont', ev: 3 },
  { abbr: 'VA', name: 'Virginia', ev: 13 },
  { abbr: 'WA', name: 'Washington', ev: 12 },
  { abbr: 'WV', name: 'West Virginia', ev: 4 },
  { abbr: 'WI', name: 'Wisconsin', ev: 10 },
  { abbr: 'WY', name: 'Wyoming', ev: 3 },
];

const TOTAL_EV = JURISDICTIONS.reduce((sum, j) => sum + j.ev, 0); // 538
const TO_WIN = 270;
const BATTLEGROUNDS_2024 = new Set(['AZ', 'GA', 'MI', 'NV', 'NC', 'PA', 'WI']);

/** Display order: EV descending, ties alphabetical (by full name). */
const SORTED: readonly Jurisdiction[] = [...JURISDICTIONS].sort(
  (a, b) => b.ev - a.ev || a.name.localeCompare(b.name),
);

/**
 * Largest-first greedy to 270. Because the fewest-states coalition always
 * takes the biggest states available, the shortest prefix of the
 * EV-descending list that reaches 270 is the true minimum (12 under this
 * apportionment — the top 11 sum to 268).
 */
function greedyTo270(): Set<string> {
  const picked = new Set<string>();
  let total = 0;
  for (const j of SORTED) {
    if (total >= TO_WIN) break;
    picked.add(j.abbr);
    total += j.ev;
  }
  return picked;
}

const DEFAULT_PROMPT =
  'Build a coalition to 270. Then try it again without Texas, Florida, or California.';

/**
 * Build-a-coalition explorer: toggle jurisdictions into a coalition and watch
 * the electoral-vote count race toward 270.
 */
export function Path270({ title, prompt }: Path270Props) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [greedyCount, setGreedyCount] = useState<number | null>(null);

  const selectedEV = SORTED.reduce((sum, j) => sum + (selected.has(j.abbr) ? j.ev : 0), 0);
  const won = selectedEV >= TO_WIN;
  const withoutBattlegrounds =
    won && SORTED.every((j) => !selected.has(j.abbr) || !BATTLEGROUNDS_2024.has(j.abbr));

  const toggle = (abbr: string) => {
    setGreedyCount(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(abbr)) next.delete(abbr);
      else next.add(abbr);
      return next;
    });
  };

  const markerLeft = `${(TO_WIN / TOTAL_EV) * 100}%`;

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      <div style={labelStyle}>Path to 270</div>
      {title && (
        <p style={{ margin: '0 0 0.35rem', fontWeight: 700, color: tokens.ink }}>{title}</p>
      )}
      <p style={{ margin: '0 0 0.85rem', color: tokens.ink }}>{prompt ?? DEFAULT_PROMPT}</p>

      {/* Progress track with a dashed 270 marker */}
      <div style={{ position: 'relative', padding: '1.1rem 0 0.25rem' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: markerLeft,
            transform: 'translateX(-50%)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: tokens.accent,
            whiteSpace: 'nowrap',
          }}
        >
          270 to win
        </span>
        <div
          role="progressbar"
          aria-label="Electoral votes in your coalition"
          aria-valuemin={0}
          aria-valuemax={TOTAL_EV}
          aria-valuenow={selectedEV}
          style={{
            height: 14,
            borderRadius: 7,
            border: `1px solid ${tokens.line}`,
            background: 'rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(selectedEV / TOTAL_EV) * 100}%`,
              height: '100%',
              background: won ? tokens.green : tokens.blue,
              transition: 'width 0.25s ease',
            }}
          />
        </div>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 'calc(1.1rem - 3px)',
            bottom: 'calc(0.25rem - 3px)',
            left: markerLeft,
            borderLeft: `2px dashed ${tokens.accent}`,
          }}
        />
      </div>

      <p style={{ margin: '0.5rem 0 0.85rem', color: tokens.ink }}>
        <strong>Your coalition: {selectedEV} electoral votes.</strong>{' '}
        {won ? (
          <span role="status" style={{ color: tokens.green, fontWeight: 600 }}>
            That is a winning coalition — {selectedEV} votes from {selected.size} states
            {withoutBattlegrounds && ' — and without any of the seven 2024 battlegrounds'}.
          </span>
        ) : (
          <span style={{ color: tokens.muted }}>{TO_WIN - selectedEV} to go.</span>
        )}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        <button
          type="button"
          style={primaryButtonStyle}
          onClick={() => {
            const picks = greedyTo270();
            setSelected(picks);
            setGreedyCount(picks.size);
          }}
        >
          Fewest states to 270
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setSelected(new Set());
            setGreedyCount(null);
          }}
        >
          Reset
        </button>
        {greedyCount !== null && (
          <span style={{ alignSelf: 'center', color: tokens.muted, fontSize: '0.9rem' }}>
            Taking the largest states first reaches 270 with {greedyCount} states.
          </span>
        )}
      </div>

      <div
        role="group"
        aria-label="Toggle states into your coalition"
        style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}
      >
        {SORTED.map((j) => {
          const isSelected = selected.has(j.abbr);
          return (
            <button
              key={j.abbr}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${j.name}, ${j.ev} electoral votes`}
              onClick={() => toggle(j.abbr)}
              style={{
                font: 'inherit',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.25rem 0.55rem',
                borderRadius: 6,
                border: `1px solid ${isSelected ? tokens.blue : tokens.line}`,
                background: isSelected ? tokens.blue : tokens.card,
                color: isSelected ? '#ffffff' : tokens.ink,
                cursor: 'pointer',
              }}
            >
              {j.abbr} {j.ev}
            </button>
          );
        })}
      </div>

      <p style={{ margin: '0.85rem 0 0', fontSize: '0.8rem', color: tokens.muted }}>
        Electoral votes per the 2020-census apportionment (2024–2028 elections).
      </p>
    </div>
  );
}
