'use client';
import { useState } from 'react';
import { blockStyle, buttonStyle, labelStyle, tokens } from './lib';

export interface ProcessFlowStep {
  title: string;
  detail: string;
  /** Where the path can divert or die at this stage. */
  branch?: string;
}

export interface ProcessFlowProps {
  /** 3–8 stages of the mechanism, in order. */
  steps: ProcessFlowStep[];
  title?: string;
}

/**
 * Click-through stages of a mechanism. Numbered chips select a stage; the
 * panel below shows its detail and, if present, the branch where the path
 * can divert or die. Prev/Next walk the sequence.
 */
export function ProcessFlow({ steps, title }: ProcessFlowProps) {
  const [selected, setSelected] = useState(0);
  const step = steps[selected];

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      <div style={labelStyle}>How it works, step by step</div>
      {title && (
        <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: tokens.ink }}>{title}</p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.35rem' }}>
        {steps.map((s, i) => {
          const isSelected = i === selected;
          return (
            // Fragment keyed on index: chips never reorder, so index keys are stable.
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {i > 0 && <span aria-hidden="true" style={{ color: tokens.muted }}>→</span>}
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(i)}
                style={{
                  font: 'inherit',
                  fontSize: '0.85rem',
                  padding: '0.3rem 0.7rem',
                  borderRadius: 999,
                  border: `1px solid ${isSelected ? tokens.blue : tokens.line}`,
                  background: isSelected ? tokens.blue : tokens.card,
                  color: isSelected ? '#ffffff' : tokens.ink,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontWeight: 700, marginRight: '0.35em' }}>{i + 1}</span>
                {s.title}
              </button>
            </span>
          );
        })}
      </div>
      {step && (
        <div
          role="status"
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: `1px solid ${tokens.line}`,
            color: tokens.ink,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>
              {selected + 1}. {step.title}.
            </strong>{' '}
            {step.detail}
          </p>
          {step.branch && (
            <p style={{ margin: '0.5rem 0 0', color: tokens.accent }}>
              — <strong>Branch:</strong> {step.branch}
            </p>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
        <button
          type="button"
          style={{
            ...buttonStyle,
            cursor: selected === 0 ? 'default' : 'pointer',
            opacity: selected === 0 ? 0.5 : 1,
          }}
          disabled={selected === 0}
          onClick={() => setSelected((i) => Math.max(0, i - 1))}
        >
          ← Prev
        </button>
        <button
          type="button"
          style={{
            ...buttonStyle,
            cursor: selected >= steps.length - 1 ? 'default' : 'pointer',
            opacity: selected >= steps.length - 1 ? 0.5 : 1,
          }}
          disabled={selected >= steps.length - 1}
          onClick={() => setSelected((i) => Math.min(steps.length - 1, i + 1))}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
