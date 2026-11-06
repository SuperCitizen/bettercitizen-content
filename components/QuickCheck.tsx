'use client';
import { useState } from 'react';
import { blockStyle, labelStyle, tokens } from './lib';

export interface QuickCheckChoice {
  id: string;
  text: string;
}

export interface QuickCheckProps {
  question: string;
  /** 3–4 plausible choices; distractors are near-misses, never jokes. */
  choices: QuickCheckChoice[];
  /** The id of the correct choice. */
  answer: string;
  /** Teaches the distinction; shown after any selection. */
  explanation: string;
}

/**
 * One-question multiple choice with instant feedback. Selecting any choice
 * locks the question and shows the explanation — formative, not graded.
 */
export function QuickCheck({ question, choices, answer, explanation }: QuickCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const correct = selected === answer;

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      <div style={labelStyle}>Quick check</div>
      <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{question}</p>
      <div role="group" aria-label={question} style={{ display: 'grid', gap: '0.4rem' }}>
        {choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isAnswer = choice.id === answer;
          let border = `1px solid ${tokens.line}`;
          let background: string = tokens.card;
          if (answered && isAnswer) {
            border = `1.5px solid ${tokens.green}`;
            background = 'rgba(74, 107, 58, 0.08)';
          } else if (answered && isSelected && !isAnswer) {
            border = `1.5px solid ${tokens.accent}`;
            background = 'rgba(138, 42, 30, 0.07)';
          }
          return (
            <button
              key={choice.id}
              type="button"
              disabled={answered}
              aria-pressed={isSelected}
              onClick={() => setSelected(choice.id)}
              style={{
                font: 'inherit',
                fontSize: '0.95rem',
                textAlign: 'left',
                padding: '0.55rem 0.8rem',
                borderRadius: 6,
                border,
                background,
                color: tokens.ink,
                cursor: answered ? 'default' : 'pointer',
              }}
            >
              {choice.text}
              {answered && isAnswer && <strong> ✓</strong>}
              {answered && isSelected && !isAnswer && <strong> ✗</strong>}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          role="status"
          style={{
            margin: '0.85rem 0 0',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${tokens.line}`,
            color: tokens.ink,
          }}
        >
          <strong style={{ color: correct ? tokens.green : tokens.accent }}>
            {correct ? 'Right. ' : 'Not quite. '}
          </strong>
          {explanation}
        </p>
      )}
    </div>
  );
}
