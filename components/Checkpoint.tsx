'use client';
import { useState, type ReactNode } from 'react';
import { blockStyle, buttonStyle, labelStyle, tokens } from './lib';

export interface CheckpointProps {
  /** An application question answerable from what the reader just read. */
  question: string;
  /** Optional nudge available before the reveal. */
  hint?: string;
  /** The answer — always explains *why*, in 1–4 sentences. */
  children: ReactNode;
}

/**
 * Predict-then-reveal checkpoint. The reader commits to an answer mentally
 * (optionally peeking at a hint), then reveals the explanation.
 */
export function Checkpoint({ question, hint, children }: CheckpointProps) {
  const [revealed, setRevealed] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.gold}` }}>
      <div style={labelStyle}>Checkpoint</div>
      <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{question}</p>
      {!revealed && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" style={buttonStyle} onClick={() => setRevealed(true)}>
            Reveal answer
          </button>
          {hint && !hintShown && (
            <button
              type="button"
              style={{ ...buttonStyle, color: tokens.muted }}
              onClick={() => setHintShown(true)}
            >
              Hint
            </button>
          )}
        </div>
      )}
      {hintShown && !revealed && (
        <p style={{ margin: '0.75rem 0 0', color: tokens.muted, fontStyle: 'italic' }}>{hint}</p>
      )}
      {revealed && (
        <div
          style={{
            marginTop: '0.25rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${tokens.line}`,
            color: tokens.ink,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
