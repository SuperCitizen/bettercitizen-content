'use client';
import { useState } from 'react';
import { blockStyle, buttonStyle, labelStyle, primaryButtonStyle, tokens } from './lib';

export interface GerrymanderLabProps {
  title?: string;
}

const COLS = 10;
const ROWS = 5;
const CELL = 34; // cell size in SVG units
const PITCH = CELL + 1; // 1px white gap between cells
const W = COLS * PITCH - 1;
const H = ROWS * PITCH - 1;

/**
 * Fixed synthetic electorate, row-major: rows 0/2/4 have A in cols 0-5,
 * rows 1/3 have A in cols 1-6. Every row is 6A/4B; total 30A/20B (60/40).
 * Grid and all three plans verified by script: 5 districts per plan, 10 cells
 * each, 4-neighbor contiguous, no 5-5 ties, seat outcomes as labeled.
 */
const GRID =
  'AAAAAABBBB' + 'BAAAAAABBB' + 'AAAAAABBBB' + 'BAAAAAABBB' + 'AAAAAABBBB';

interface Plan {
  id: string;
  name: string;
  /** District index (0-4) per cell, row-major. */
  districts: string;
  takeaway: string;
}

const PLANS: readonly Plan[] = [
  {
    id: 'prop',
    name: 'Proportional-ish',
    districts:
      '0011223344' + '0011223344' + '0011223344' + '0011223344' + '0011223344',
    takeaway: 'Compact districts roughly track the vote: A turns 60% of votes into 3 of 5 seats.',
  },
  {
    id: 'crack',
    name: 'Crack B',
    districts:
      '0000000000' + '1111111111' + '2222222222' + '3333333333' + '4444444444',
    takeaway: 'B’s voters are cracked — spread so every district splits 6–4. Forty percent of the votes, zero seats.',
  },
  {
    id: 'pack',
    name: 'Pack A',
    districts:
      '0011222222' + '0011224224' + '0011444444' + '0011334334' + '0011333333',
    takeaway: 'Same voters. B now wins a majority of seats with 40% of the votes.',
  },
];

/** Winner per district (index 0-4) for a plan. Never ties — verified offline. */
function districtWinners(districts: string): Array<'A' | 'B'> {
  const aCount = [0, 0, 0, 0, 0];
  for (let i = 0; i < districts.length; i++) {
    const d = Number(districts[i]);
    if (GRID[i] === 'A') aCount[d] = (aCount[d] ?? 0) + 1;
  }
  return aCount.map((a) => (a > 5 ? 'A' : 'B'));
}

/** SVG path tracing 3px boundaries between cells of different districts. */
function boundaryPath(districts: string): string {
  const parts: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      // vertical edge between (r,c) and (r,c+1), centered in the 1px gap
      if (c < COLS - 1 && districts[i] !== districts[i + 1]) {
        const x = c * PITCH + CELL + 0.5;
        parts.push(`M${x} ${r * PITCH - 0.5}V${r * PITCH + CELL + 0.5}`);
      }
      // horizontal edge between (r,c) and (r+1,c)
      if (r < ROWS - 1 && districts[i] !== districts[i + COLS]) {
        const y = r * PITCH + CELL + 0.5;
        parts.push(`M${c * PITCH - 0.5} ${y}H${c * PITCH + CELL + 0.5}`);
      }
    }
  }
  return parts.join('');
}

const WINNERS = PLANS.map((p) => districtWinners(p.districts));
const PATHS = PLANS.map((p) => boundaryPath(p.districts));

/**
 * One fixed electorate (60% A, 40% B), districted three ways. Toggling plans
 * redraws only the district lines — the voters never move — while the seat
 * count swings from 3-2 to 5-0 to 2-3.
 */
export function GerrymanderLab({ title }: GerrymanderLabProps) {
  const [planIndex, setPlanIndex] = useState(0);
  const plan = PLANS[planIndex]!;
  const winners = WINNERS[planIndex]!;
  const seatsA = winners.filter((w) => w === 'A').length;
  const seatsB = 5 - seatsA;

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      <div style={labelStyle}>One electorate, three maps</div>
      {title && (
        <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{title}</p>
      )}

      <div
        role="group"
        aria-label="Districting plan"
        style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}
      >
        {PLANS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={i === planIndex}
            onClick={() => setPlanIndex(i)}
            style={i === planIndex ? primaryButtonStyle : buttonStyle}
          >
            {p.name}
          </button>
        ))}
      </div>

      <svg
        viewBox={`-3 -3 ${W + 6} ${H + 6}`}
        width="100%"
        role="img"
        aria-label={`Map of 50 voters under the ${plan.name} plan: party A wins ${seatsA} districts, party B wins ${seatsB}.`}
        style={{ maxWidth: 430, height: 'auto', display: 'block' }}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS);
          const c = i % COLS;
          const isA = GRID[i] === 'A';
          return (
            <g key={i}>
              <rect
                x={c * PITCH}
                y={r * PITCH}
                width={CELL}
                height={CELL}
                fill={isA ? tokens.blue : tokens.gold}
              />
              {/* a letter so party reads without color; the surface color keeps its contrast on both palettes */}
              <text
                x={c * PITCH + CELL / 2}
                y={r * PITCH + CELL / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={700}
                fill={tokens.card}
                fontFamily="inherit"
              >
                {isA ? 'A' : 'B'}
              </text>
            </g>
          );
        })}
        <path d={PATHS[planIndex]} stroke={tokens.ink} strokeWidth={3} fill="none" />
        <rect
          x={-1.5}
          y={-1.5}
          width={W + 3}
          height={H + 3}
          fill="none"
          stroke={tokens.ink}
          strokeWidth={3}
        />
      </svg>

      <div role="status" style={{ marginTop: '0.85rem' }}>
        <p style={{ margin: 0, color: tokens.ink, fontSize: '0.95rem' }}>
          Votes: A 60% / B 40% (never changes) — Seats:{' '}
          <strong>
            A {seatsA} / B {seatsB}
          </strong>
        </p>
        <div
          aria-hidden="true"
          style={{ display: 'flex', gap: 4, margin: '0.45rem 0 0' }}
        >
          {winners.map((w, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                background: w === 'A' ? tokens.blue : tokens.gold,
              }}
            />
          ))}
        </div>
        <p style={{ margin: '0.6rem 0 0', color: tokens.ink }}>{plan.takeaway}</p>
      </div>

      <p style={{ margin: '0.75rem 0 0', color: tokens.muted, fontSize: '0.8rem' }}>
        Synthetic, illustrative electorate.
      </p>
    </div>
  );
}
