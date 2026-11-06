'use client';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { blockStyle, buttonStyle, labelStyle, seededShuffle, tokens } from './lib';

export interface MatchUpPair {
  left: string;
  right: string;
}

export interface MatchUpProps {
  /** 3–6 pairs; right column is displayed shuffled. */
  pairs: MatchUpPair[];
  title?: string;
  /** Defaults to "Tap an item, then its match." */
  instructions?: string;
}

const itemStyle: CSSProperties = {
  ...buttonStyle,
  width: '100%',
  textAlign: 'left',
  fontSize: '0.9rem',
};

/**
 * Pair-matching exercise. Tap an item in either column, then its match in the
 * other: correct pairs lock green, wrong picks flash briefly. Pairs are
 * identified by index so duplicate strings stay unambiguous.
 */
export function MatchUp({
  pairs,
  title,
  instructions = 'Tap an item, then its match.',
}: MatchUpProps) {
  // Original pair indices for the right column, in shuffled display order.
  // The seeded shuffle yields the identity permutation for small n (2–3);
  // rotate by one in that case so the right column is never displayed in
  // left-column order (the contract allows as few as 3 pairs).
  const rightOrder = useMemo(() => {
    const shuffled = seededShuffle(pairs.map((_, i) => i));
    if (shuffled.length > 1 && shuffled.every((v, i) => v === i)) {
      return shuffled.slice(1).concat(shuffled.slice(0, 1));
    }
    return shuffled;
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<ReadonlySet<number>>(() => new Set());
  const [attempts, setAttempts] = useState(0);
  const [errorPair, setErrorPair] = useState<{ left: number; right: number } | null>(null);

  // Clear the wrong-answer flash after ~700ms; cleanup guards against
  // unmount and against a new flash superseding an old timer.
  useEffect(() => {
    if (!errorPair) return;
    const timer = setTimeout(() => setErrorPair(null), 700);
    return () => clearTimeout(timer);
  }, [errorPair]);

  const done = matched.size === pairs.length && pairs.length > 0;

  function evaluate(leftIndex: number, rightIndex: number) {
    setAttempts((a) => a + 1);
    if (leftIndex === rightIndex) {
      setMatched((prev) => new Set(prev).add(leftIndex));
    } else {
      setErrorPair({ left: leftIndex, right: rightIndex });
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  }

  function handleLeft(i: number) {
    if (selectedRight !== null) {
      evaluate(i, selectedRight);
    } else {
      setSelectedLeft((prev) => (prev === i ? null : i));
    }
  }

  function handleRight(i: number) {
    if (selectedLeft !== null) {
      evaluate(selectedLeft, i);
    } else {
      setSelectedRight((prev) => (prev === i ? null : i));
    }
  }

  function reset() {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched(new Set());
    setAttempts(0);
    setErrorPair(null);
  }

  function styleFor(isMatched: boolean, isSelected: boolean, isError: boolean): CSSProperties {
    let border = `1px solid ${tokens.line}`;
    let background: string = tokens.card;
    if (isMatched) {
      border = `1.5px solid ${tokens.green}`;
      background = 'rgba(74, 107, 58, 0.08)';
    } else if (isError) {
      border = `1.5px solid ${tokens.accent}`;
    } else if (isSelected) {
      border = `1.5px solid ${tokens.blue}`;
    }
    return { ...itemStyle, border, background, cursor: isMatched ? 'default' : 'pointer' };
  }

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      <div style={labelStyle}>Match up</div>
      {title && <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: tokens.ink }}>{title}</p>}
      <p style={{ margin: '0 0 0.75rem', color: tokens.muted, fontSize: '0.85rem' }}>
        {instructions}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {pairs.map((pair, row) => {
          const rightIndex = rightOrder[row]!;
          const leftMatched = matched.has(row);
          const rightMatched = matched.has(rightIndex);
          return [
            <button
              key={`l-${row}`}
              type="button"
              disabled={leftMatched}
              aria-pressed={selectedLeft === row}
              onClick={() => handleLeft(row)}
              style={styleFor(leftMatched, selectedLeft === row, errorPair?.left === row)}
            >
              {pair.left}
              {leftMatched && <strong> ✓</strong>}
            </button>,
            <button
              key={`r-${rightIndex}`}
              type="button"
              disabled={rightMatched}
              aria-pressed={selectedRight === rightIndex}
              onClick={() => handleRight(rightIndex)}
              style={styleFor(
                rightMatched,
                selectedRight === rightIndex,
                errorPair?.right === rightIndex,
              )}
            >
              {pairs[rightIndex]!.right}
              {rightMatched && <strong> ✓</strong>}
            </button>,
          ];
        })}
      </div>
      {done && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${tokens.line}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <p role="status" style={{ margin: 0, color: tokens.ink }}>
            <strong style={{ color: tokens.green }}>
              All {pairs.length} matched in {attempts} attempts.
            </strong>
          </p>
          <button type="button" style={buttonStyle} onClick={reset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
