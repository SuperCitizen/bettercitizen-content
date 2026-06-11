'use client';
import { useMemo, useState } from 'react';
import { blockStyle, buttonStyle, formatNumber, labelStyle, primaryButtonStyle, tokens } from './lib';

export interface RankedChoiceBallot {
  /** Candidate names from most- to least-preferred. May be partial. */
  ranking: string[];
  count: number;
}

export interface RankedChoiceSimProps {
  candidates?: string[];
  ballots?: RankedChoiceBallot[];
  title?: string;
}

const DEFAULT_CANDIDATES = ['Avila', 'Brooks', 'Chen', 'Dimas'];

const DEFAULT_BALLOTS: RankedChoiceBallot[] = [
  { ranking: ['Brooks'], count: 38 },
  { ranking: ['Avila', 'Chen', 'Brooks'], count: 32 },
  { ranking: ['Chen', 'Avila', 'Brooks'], count: 18 },
  { ranking: ['Dimas', 'Chen', 'Avila'], count: 12 },
];

interface Round {
  /** Votes per still-standing candidate this round. */
  tallies: Record<string, number>;
  /** Non-exhausted ballots this round. */
  active: number;
  exhausted: number;
  /** floor(active / 2) + 1 */
  threshold: number;
  /** Candidates eliminated entering this round. */
  eliminated: string[];
  /** Highest tally among still-standing candidates. */
  leader: string;
  /** What happened entering this round. */
  narration: string;
  /** Non-null only on the final round. */
  winner: string | null;
  /** Whether the winner actually met the majority threshold. */
  wonByMajority: boolean;
}

/**
 * Pure instant-runoff engine: every round, each ballot counts for its
 * highest-ranked non-eliminated candidate; ballots with none left are
 * exhausted. Majority threshold is floor(active / 2) + 1. If the leader meets
 * it (or only one candidate remains), the race ends; otherwise the lowest
 * tally is eliminated and its ballots transfer.
 */
function computeRounds(candidates: string[], ballots: RankedChoiceBallot[]): Round[] {
  const inRace = new Set(candidates);
  const total = ballots.reduce((sum, b) => sum + b.count, 0);
  const eliminated = new Set<string>();
  const rounds: Round[] = [];
  let narration = '';

  // Terminates: every iteration either ends the race or eliminates a candidate.
  while (true) {
    const tallies: Record<string, number> = {};
    for (const c of candidates) if (!eliminated.has(c)) tallies[c] = 0;
    let exhausted = 0;
    for (const b of ballots) {
      const top = b.ranking.find((n) => inRace.has(n) && !eliminated.has(n));
      if (top === undefined) exhausted += b.count;
      else tallies[top] += b.count;
    }
    const active = total - exhausted;
    const threshold = Math.floor(active / 2) + 1;
    const remaining = candidates.filter((c) => !eliminated.has(c));
    if (remaining.length === 0) break;

    let leader = remaining[0];
    for (const c of remaining) if (tallies[c] > tallies[leader]) leader = c;
    if (rounds.length === 0) {
      narration =
        exhausted > 0
          ? `First preferences counted; ${formatNumber(exhausted)} ballots ranked no candidate and are exhausted.`
          : 'First preferences counted.';
    }
    const wonByMajority = tallies[leader] >= threshold;
    const winner = wonByMajority || remaining.length === 1 ? leader : null;
    rounds.push({
      tallies,
      active,
      exhausted,
      threshold,
      eliminated: [...eliminated],
      leader,
      narration,
      winner,
      wonByMajority,
    });
    if (winner !== null) break;

    // Tie-break: when candidates tie for the lowest tally, eliminate the one
    // latest in the candidates array. `remaining` preserves candidates-array
    // order, so `<=` lets a later equal entry win the elimination.
    let lowest = remaining[0];
    for (const c of remaining) if (tallies[c] <= tallies[lowest]) lowest = c;

    const before = new Set(eliminated);
    eliminated.add(lowest);

    // Trace where the eliminated candidate's ballots go, for the narration.
    const transfers = new Map<string, number>();
    let newlyExhausted = 0;
    for (const b of ballots) {
      const top = b.ranking.find((n) => inRace.has(n) && !before.has(n));
      if (top !== lowest) continue;
      const next = b.ranking.find((n) => inRace.has(n) && !eliminated.has(n));
      if (next === undefined) newlyExhausted += b.count;
      else transfers.set(next, (transfers.get(next) ?? 0) + b.count);
    }
    const parts = [...transfers.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, n], i) =>
        i === 0 ? `${formatNumber(n)} ballots transfer to ${name}` : `${formatNumber(n)} to ${name}`,
      );
    narration = `${lowest} eliminated`;
    if (parts.length > 0) narration += ` — ${parts.join(', ')}`;
    if (newlyExhausted > 0) {
      narration += parts.length > 0
        ? `; ${formatNumber(newlyExhausted)} ballots exhausted`
        : ` — ${formatNumber(newlyExhausted)} ballots exhausted`;
    }
  }
  return rounds;
}

/**
 * Instant-runoff voting, one round at a time. All rounds are precomputed from
 * the ballot profile; Prev/Next step through eliminations and transfers until
 * a candidate reaches a majority of active ballots.
 */
export function RankedChoiceSim({
  candidates = DEFAULT_CANDIDATES,
  ballots = DEFAULT_BALLOTS,
  title,
}: RankedChoiceSimProps) {
  const rounds = useMemo(() => computeRounds(candidates, ballots), [candidates, ballots]);
  const [roundIndex, setRoundIndex] = useState(0);

  if (rounds.length === 0) {
    return (
      <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.accent}` }}>
        <div style={labelStyle}>Ranked-choice rounds</div>
        <p style={{ margin: 0, color: tokens.muted }}>No candidates to count.</p>
      </div>
    );
  }

  const index = Math.min(roundIndex, rounds.length - 1);
  const round = rounds[index];
  const isFirst = index === 0;
  const isLast = index === rounds.length - 1;
  const totalBallots = round.active + round.exhausted;
  const round1Leader = rounds[0].leader;

  const mutedSmall = { fontSize: '0.78rem', color: tokens.muted } as const;

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.accent}` }}>
      <div style={labelStyle}>Ranked-choice rounds</div>
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{title}</p>}

      <div aria-live="polite">
        <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: tokens.ink }}>
          Round {index + 1} of {rounds.length}
        </p>
        <p style={{ margin: '0 0 0.85rem', color: tokens.ink }}>{round.narration}</p>
      </div>

      <div style={{ display: 'grid', gap: '0.45rem' }}>
        {candidates.map((name) => {
          const isEliminated = round.eliminated.includes(name);
          const votes = isEliminated ? 0 : round.tallies[name] ?? 0;
          const isWinner = round.winner === name;
          const pct = totalBallots > 0 ? (votes / totalBallots) * 100 : 0;
          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  width: '6.5rem',
                  flexShrink: 0,
                  fontSize: '0.9rem',
                  color: isEliminated ? tokens.muted : tokens.ink,
                  textDecoration: isEliminated ? 'line-through' : 'none',
                }}
              >
                {name}
              </span>
              <span
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 14,
                  background: tokens.line,
                  borderRadius: 7,
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    height: '100%',
                    width: `${pct}%`,
                    background: isWinner ? tokens.green : tokens.blue,
                    borderRadius: 7,
                  }}
                />
              </span>
              <span
                style={{
                  width: '2.6rem',
                  flexShrink: 0,
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  fontVariantNumeric: 'tabular-nums',
                  color: isEliminated ? tokens.muted : tokens.ink,
                }}
              >
                {formatNumber(votes)}
              </span>
            </div>
          );
        })}
      </div>

      <p style={{ margin: '0.75rem 0 0', color: tokens.ink, fontSize: '0.9rem' }}>
        Majority needed: {formatNumber(round.threshold)} of {formatNumber(round.active)} active
      </p>

      {round.winner !== null && (
        <p
          role="status"
          style={{
            margin: '0.85rem 0 0',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${tokens.line}`,
            color: tokens.ink,
          }}
        >
          <strong style={{ color: tokens.green }}>{round.winner} wins</strong>
          {round.wonByMajority
            ? ` with a majority: ${formatNumber(round.tallies[round.winner] ?? 0)} of ${formatNumber(round.active)} active ballots`
            : ` as the last candidate standing, with ${formatNumber(round.tallies[round.winner] ?? 0)} of ${formatNumber(round.active)} active ballots`}
          {round1Leader !== round.winner ? ' — note the Round 1 leader lost.' : '.'}
        </p>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
        <button
          type="button"
          style={{ ...buttonStyle, ...(isFirst ? { opacity: 0.5, cursor: 'default' } : {}) }}
          disabled={isFirst}
          onClick={() => setRoundIndex(Math.max(0, index - 1))}
        >
          Prev round
        </button>
        <button
          type="button"
          style={
            isLast
              ? { ...buttonStyle, opacity: 0.5, cursor: 'default' }
              : primaryButtonStyle
          }
          disabled={isLast}
          onClick={() => setRoundIndex(Math.min(rounds.length - 1, index + 1))}
        >
          Next round
        </button>
        <button type="button" style={buttonStyle} onClick={() => setRoundIndex(0)}>
          Reset
        </button>
      </div>

      <p style={{ ...mutedSmall, margin: '0.85rem 0 0' }}>
        If candidates tie for last place, the one listed latest is eliminated. Illustrative
        profile; all rounds are precomputed.
      </p>
    </div>
  );
}
