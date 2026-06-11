'use client';
import { useMemo, useState } from 'react';
import { blockStyle, buttonStyle, labelStyle, seededShuffle, tokens } from './lib';

export interface FlashcardsCard {
  front: string;
  back: string;
}

export interface FlashcardsProps {
  /** 4–12 cards of genuinely enumerable material. */
  cards: FlashcardsCard[];
  title?: string;
}

const INITIAL_SEED = 0x5c17;

/**
 * Flip-card review deck. Tap the card to flip, arrows to navigate, shuffle
 * for a deterministic reorder (seed advances per click, so SSR and client
 * markup always agree).
 */
export function Flashcards({ cards, title }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // seed === INITIAL_SEED means "never shuffled"; each click consumes the
  // current seed and increments, so order depends only on click count.
  const [seed, setSeed] = useState(INITIAL_SEED);

  const deck = useMemo(
    () => (seed === INITIAL_SEED ? cards : seededShuffle(cards, seed - 1)),
    [cards, seed],
  );

  const n = deck.length;
  if (n === 0) return null;
  const card = deck[Math.min(index, n - 1)];

  const goTo = (i: number) => {
    setIndex(i);
    setFlipped(false);
  };

  const shuffle = () => {
    setSeed((s) => s + 1);
    setIndex(0);
    setFlipped(false);
  };

  const navStyle = (disabled: boolean) => ({
    ...buttonStyle,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'default' : 'pointer',
  });

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      <div style={labelStyle}>Flashcards</div>
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{title}</p>}
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        style={{
          font: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          minHeight: 130,
          padding: '1rem',
          textAlign: 'center',
          border: `1px solid ${tokens.line}`,
          borderRadius: 8,
          background: tokens.card,
          color: tokens.ink,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: flipped ? 400 : 600 }}>
          {flipped ? card.back : card.front}
        </span>
        <span style={{ fontSize: '0.72rem', color: tokens.muted }}>
          {flipped ? 'tap to flip back' : 'tap to flip'}
        </span>
      </button>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '0.75rem',
        }}
      >
        <button type="button" style={navStyle(index === 0)} disabled={index === 0} onClick={() => goTo(index - 1)}>
          Prev
        </button>
        <span role="status" style={{ fontSize: '0.85rem', color: tokens.muted }}>
          Card {index + 1} of {n}
        </span>
        <button
          type="button"
          style={navStyle(index === n - 1)}
          disabled={index === n - 1}
          onClick={() => goTo(index + 1)}
        >
          Next
        </button>
      </div>
      <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
        <button type="button" style={{ ...buttonStyle, fontSize: '0.8rem', padding: '0.25rem 0.7rem' }} onClick={shuffle}>
          Shuffle
        </button>
      </div>
    </div>
  );
}
