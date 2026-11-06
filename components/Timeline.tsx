'use client';
import { useState } from 'react';
import { blockStyle, labelStyle, tokens } from './lib';

export interface TimelineEvent {
  /** Display string, not parsed — "1804", "Dec 2024". */
  date: string;
  title: string;
  detail: string;
}

export interface TimelineProps {
  /** 3–8 events, in the order they should be read. */
  events: TimelineEvent[];
  /** Optional heading above the rail. */
  title?: string;
}

// Rail geometry in px so the dots, rail, and detail indent stay aligned
// regardless of root font size.
const DOT = 12;
const GAP = 10;

/**
 * Expandable event sequence with a vertical rail. Clicking an event expands
 * its detail below the row; one event open at a time, click again to close.
 */
export function Timeline({ events, title }: TimelineProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.green}` }}>
      <div style={labelStyle}>Timeline</div>
      {title && (
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: tokens.ink }}>{title}</p>
      )}
      <div style={{ position: 'relative' }}>
        {/* The rail. Dots are position: relative so they paint over it. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: DOT / 2 - 1,
            top: 6,
            bottom: 6,
            width: 2,
            background: tokens.line,
          }}
        />
        {events.map((event, i) => {
          const open = openIndex === i;
          return (
            <div key={i}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
                style={{
                  font: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: GAP,
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.45rem 0.25rem 0.45rem 0',
                  border: 'none',
                  background: 'transparent',
                  color: tokens.ink,
                  cursor: 'pointer',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'relative',
                    flexShrink: 0,
                    width: DOT,
                    height: DOT,
                    borderRadius: '50%',
                    background: open ? tokens.accent : tokens.line,
                  }}
                />
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.05rem 0.55rem',
                    borderRadius: 999,
                    border: `1px solid ${tokens.gold}`,
                    color: tokens.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.date}
                </span>
                <span style={{ fontWeight: 600 }}>{event.title}</span>
              </button>
              {open && (
                <div
                  style={{
                    padding: `0 0.25rem 0.6rem ${DOT + GAP}px`,
                    fontSize: '0.95rem',
                    color: tokens.ink,
                  }}
                >
                  {event.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
