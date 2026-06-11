'use client';
import { useState } from 'react';
import { blockStyle, labelStyle, primaryButtonStyle, buttonStyle, tokens } from './lib';

export interface GuessTheShareItem {
  label: string;
  /** The true value, in the given unit (usually %). */
  actual: number;
  /** Optional muted nudge shown under the slider while guessing. */
  hint?: string;
}

export interface GuessTheShareProps {
  items: GuessTheShareItem[];
  title: string;
  /** Defaults to "%". */
  unit?: string;
  /** Attribution for the actuals — strongly encouraged. */
  source?: string;
}

/** Shows integers bare, everything else with one decimal. */
function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/**
 * Predict-then-reveal proportions. The reader commits to a guess per item
 * with a slider, then reveals the actuals as paired bars on a shared scale.
 * Surprise (the size of the miss) is what makes the numbers stick.
 */
export function GuessTheShare({ items, title, unit = '%', source }: GuessTheShareProps) {
  const [guesses, setGuesses] = useState<number[]>(() => items.map(() => 0));
  const [revealed, setRevealed] = useState(false);

  // One shared scale so bars are visually comparable across items.
  const scaleMax = Math.max(100, Math.ceil(Math.max(0, ...items.map((it) => it.actual))));

  const errors = items.map((it, i) => Math.abs((guesses[i] ?? 0) - it.actual));
  const avgMiss = errors.length > 0 ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;
  const biggestIdx = errors.reduce((best, err, i) => (err > errors[best] ? i : best), 0);

  const setGuess = (index: number, value: number) => {
    setGuesses((prev) => prev.map((g, i) => (i === index ? value : g)));
  };

  const reset = () => {
    setGuesses(items.map(() => 0));
    setRevealed(false);
  };

  const barTrack = (value: number, color: string) => (
    <div style={{ background: 'rgba(0, 0, 0, 0.06)', borderRadius: 3, height: 10 }}>
      <div
        style={{
          width: `${Math.min(100, (value / scaleMax) * 100)}%`,
          height: 10,
          borderRadius: 3,
          background: color,
        }}
      />
    </div>
  );

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.accent}` }}>
      <div style={labelStyle}>Guess, then see</div>
      <p style={{ margin: '0 0 0.25rem', fontWeight: 600, color: tokens.ink }}>{title}</p>
      <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: tokens.muted }}>
        Values in {unit}
      </p>

      {!revealed && (
        <>
          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {items.map((item, i) => {
              const guess = guesses[i] ?? 0;
              return (
                <div key={item.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      marginBottom: '0.2rem',
                    }}
                  >
                    <span style={{ color: tokens.ink, fontSize: '0.95rem' }}>{item.label}</span>
                    <span style={{ color: tokens.blue, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {guess}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={scaleMax}
                    step={1}
                    value={guess}
                    aria-label={`Your guess for ${item.label}`}
                    onChange={(e) => setGuess(i, Number(e.target.value))}
                    style={{ width: '100%', accentColor: tokens.blue, margin: 0 }}
                  />
                  {item.hint && (
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: tokens.muted }}>
                      {item.hint}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="button"
            style={{ ...primaryButtonStyle, marginTop: '1rem' }}
            onClick={() => setRevealed(true)}
          >
            Reveal actuals
          </button>
        </>
      )}

      {revealed && (
        <>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {items.map((item, i) => {
              const guess = guesses[i] ?? 0;
              const miss = Math.abs(guess - item.actual);
              return (
                <div key={item.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      marginBottom: '0.3rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ color: tokens.ink, fontSize: '0.95rem' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', color: tokens.muted, fontVariantNumeric: 'tabular-nums' }}>
                      you said <strong style={{ color: tokens.blue }}>{guess}</strong> — actual{' '}
                      <strong style={{ color: tokens.accent }}>{fmt(item.actual)}</strong> · off by {fmt(miss)}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gap: 3 }}>
                    {barTrack(guess, tokens.blue)}
                    {barTrack(item.actual, tokens.accent)}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              marginTop: '0.85rem',
              fontSize: '0.8rem',
              color: tokens.muted,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: tokens.blue }} />
              you
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: tokens.accent }} />
              actual
            </span>
          </div>

          <p
            role="status"
            style={{
              margin: '0.85rem 0 0',
              paddingTop: '0.75rem',
              borderTop: `1px solid ${tokens.line}`,
              color: tokens.ink,
            }}
          >
            <strong>Average miss: {avgMiss.toFixed(1)} points.</strong> Biggest surprise:{' '}
            {items[biggestIdx]?.label ?? '—'}.
          </p>

          {source && (
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: tokens.muted }}>
              Source: {source}
            </p>
          )}

          <button type="button" style={{ ...buttonStyle, marginTop: '0.85rem' }} onClick={reset}>
            Guess again
          </button>
        </>
      )}
    </div>
  );
}
