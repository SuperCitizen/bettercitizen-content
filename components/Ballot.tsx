'use client';
import { useId, useState, type CSSProperties } from 'react';
import { blockStyle, buttonStyle, formatNumber, labelStyle, tokens } from './lib';

export type BallotMethod = 'pick' | 'rank' | 'score';

export interface BallotProps {
  candidates: string[];
  /** Which ballots to show, in order. */
  methods: BallotMethod[];
  title?: string;
  /** Marks already on the ballots, so they read before anyone touches them. */
  pick?: string;
  /** Preset ranking, first choice first. */
  rank?: string[];
  /** Preset scores by candidate. */
  score?: Record<string, number>;
  /** Top score on the score ballot; defaults to 5. */
  maxScore?: number;
  /** How many choices the ranked ballot offers; defaults to 3, or fewer when there are fewer candidates. */
  ranks?: number;
  /** Replaces a ballot's heading ("Pick one", "Rank them", "Score them"). */
  headings?: Partial<Record<BallotMethod, string>>;
  /** One line under each ballot saying what it records. */
  notes?: Partial<Record<BallotMethod, string>>;
  /** Everyone's average score per candidate, shown beside the reader's own; the highest wins. */
  averages?: Record<string, number>;
  /** What the averages are called, e.g. "city average". */
  averagesLabel?: string;
}

const HEADINGS: Record<BallotMethod, string> = { pick: 'Pick one', rank: 'Rank them', score: 'Score them' };
const NOTES: Record<BallotMethod, string> = {
  pick: 'Records your favorite, and nothing else.',
  rank: 'Records your order, but not how far apart your choices are.',
  score: 'Records how much you support each candidate.',
};
// Narrowest each ballot may get before the ballots wrap. A score ballot only has to hold its row of bubbles: the names sit above them.
const MIN_EM: Record<BallotMethod, number> = { pick: 9, rank: 11.5, score: 13.5 };
const ORDINALS = ['1st', '2nd', '3rd', '4th', '5th', '6th'];

const radio: CSSProperties = { width: '1.15rem', height: '1.15rem', margin: 0, accentColor: tokens.accent, cursor: 'pointer' };
const colHead: CSSProperties = { fontSize: '0.72rem', fontWeight: 700, textAlign: 'center', color: tokens.ink };
const nameCell: CSSProperties = { fontSize: '0.9rem', lineHeight: 1.3, color: tokens.ink, minWidth: 0 };

/**
 * Sample ballots the reader can mark: pick one, rank, or score the same
 * candidates. Each ballot says underneath what it just recorded, which is the
 * point: the ballots differ in how much of a voter's mind they can carry.
 * Preset marks make the ballots read complete before anyone touches them.
 */
export function Ballot({
  candidates,
  methods,
  title,
  pick,
  rank = [],
  score = {},
  maxScore = 5,
  ranks,
  headings = {},
  notes = {},
  averages,
  averagesLabel = 'average of all ballots',
}: BallotProps) {
  const id = useId();
  const rankCount = Math.min(ranks ?? 3, candidates.length);
  const [picked, setPicked] = useState<string | null>(pick ?? null);
  const [rankOf, setRankOf] = useState<Record<string, number>>(() =>
    Object.fromEntries(rank.slice(0, rankCount).map((c, i) => [c, i + 1])),
  );
  const [scoreOf, setScoreOf] = useState<Record<string, number>>(score);

  const setRank = (candidate: string, r: number) =>
    setRankOf((prev) => {
      // One candidate per rank and one rank per candidate, as on a real ranked ballot.
      const next: Record<string, number> = {};
      for (const [c, v] of Object.entries(prev)) if (c !== candidate && v !== r) next[c] = v;
      next[candidate] = r;
      return next;
    });

  const ranked = candidates.filter((c) => rankOf[c] !== undefined).sort((a, b) => (rankOf[a] ?? 0) - (rankOf[b] ?? 0));
  const recorded: Record<BallotMethod, string> = {
    pick: picked ? `${picked}.` : 'nothing yet.',
    // Say the rank each candidate was actually given, so a skipped rank reads as skipped.
    rank: ranked.length ? `${ranked.map((c) => `${ORDINALS[(rankOf[c] ?? 1) - 1] ?? rankOf[c]} ${c}`).join(', ')}.` : 'nothing yet.',
    score: candidates.some((c) => scoreOf[c] !== undefined)
      ? `${candidates
          .filter((c) => scoreOf[c] !== undefined)
          .map((c) => `${c} ${scoreOf[c]}`)
          .join(', ')}.`
      : 'nothing yet.',
  };
  const clear: Record<BallotMethod, () => void> = {
    pick: () => setPicked(null),
    rank: () => setRankOf({}),
    score: () => setScoreOf({}),
  };
  const winner = averages ? candidates.reduce((best, c) => ((averages[c] ?? -1) > (averages[best] ?? -1) ? c : best), candidates[0] ?? '') : null;

  const grid = (columns: number): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `minmax(0, 1fr) repeat(${columns}, minmax(1.7rem, auto))`,
    alignItems: 'center',
    gap: '0.5rem 0.15rem',
  });

  const body = (method: BallotMethod) => {
    if (method === 'pick') {
      return (
        <div role="radiogroup" aria-label={HEADINGS.pick} style={{ display: 'grid', gap: '0.5rem' }}>
          {candidates.map((c) => (
            <label key={c} style={{ ...nameCell, display: 'flex', alignItems: 'center', gap: '0.6em', cursor: 'pointer' }}>
              <input type="radio" name={`${id}-pick`} checked={picked === c} onChange={() => setPicked(c)} style={radio} />
              {c}
            </label>
          ))}
        </div>
      );
    }
    if (method === 'rank') {
      return (
        <div style={grid(rankCount)}>
          <span />
          {Array.from({ length: rankCount }, (_, r) => (
            <span key={r} aria-hidden="true" style={colHead}>
              {ORDINALS[r]}
            </span>
          ))}
          {candidates.map((c) => (
            <div key={c} role="radiogroup" aria-label={`${c}: rank`} style={{ display: 'contents' }}>
              <span style={nameCell}>{c}</span>
              {Array.from({ length: rankCount }, (_, r) => (
                <span key={r} style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="radio"
                    name={`${id}-rank-${c}`}
                    aria-label={`${c}: ${ORDINALS[r]} choice`}
                    checked={rankOf[c] === r + 1}
                    onChange={() => setRank(c, r + 1)}
                    style={radio}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    }
    // Each candidate is a row that wraps: beside the name when there is room, under it on a phone. Every
    // bubble carries its own number, so the scores read the same either way and need no heading row.
    return (
      <div style={{ display: 'grid', gap: '0.7rem' }}>
        {candidates.map((c) => (
          <div
            key={c}
            role="radiogroup"
            aria-label={`${c}: score`}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.25rem 0.6rem' }}
          >
            <span style={{ ...nameCell, flex: '1 1 8.5em', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: '0.5em' }}>
              <span>{c}</span>
              {averages && averages[c] !== undefined && (
                <span style={{ fontSize: '0.76rem', fontWeight: c === winner ? 700 : 400 }}>
                  {averagesLabel} {formatNumber(averages[c] ?? 0)}
                  {c === winner ? ' ★ wins' : ''}
                </span>
              )}
            </span>
            <span style={{ display: 'flex', gap: '0.15rem' }}>
              {Array.from({ length: maxScore + 1 }, (_, s) => (
                <label key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', minWidth: '1.7rem', cursor: 'pointer' }}>
                  <span aria-hidden="true" style={colHead}>
                    {s}
                  </span>
                  <input
                    type="radio"
                    name={`${id}-score-${c}`}
                    aria-label={`${c}: ${s} of ${maxScore}`}
                    checked={scoreOf[c] === s}
                    onChange={() => setScoreOf((prev) => ({ ...prev, [c]: s }))}
                    style={radio}
                  />
                </label>
              ))}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.accent}` }}>
      <div style={labelStyle}>Try it: mark the ballot</div>
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {methods.map((method) => (
          <section
            key={method}
            style={{
              flex: `1 1 ${MIN_EM[method]}em`,
              minWidth: 0,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              border: `1.5px solid ${tokens.ink}`,
              borderRadius: 6,
              background: tokens.card,
              padding: '0.6rem 0.75rem 0.7rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: 0, fontFamily: 'inherit', color: tokens.ink }}>
              {headings[method] ?? HEADINGS[method]}
            </h3>
            {body(method)}
            <p aria-live="polite" style={{ margin: '0.7rem 0 0', paddingTop: '0.5rem', borderTop: `1px dashed ${tokens.line}`, fontSize: '0.8rem', lineHeight: 1.45, color: tokens.ink }}>
              <strong>On this ballot:</strong> {recorded[method]}
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', lineHeight: 1.45, color: tokens.ink, flex: 1 }}>{notes[method] ?? NOTES[method]}</p>
            <div>
              <button type="button" onClick={clear[method]} style={{ ...buttonStyle, marginTop: '0.55rem', fontSize: '0.78rem', padding: '0.2rem 0.6rem' }}>
                Clear
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
