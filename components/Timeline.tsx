'use client';
import { useState, type CSSProperties } from 'react';
import { barColor, blockStyle, labelStyle, tokens, type TokenColor } from './lib';

export interface TimelineEvent {
  /** Display string, not parsed — "1804", "Dec 2024". */
  date: string;
  title: string;
  /** Optional: an event with no detail is a plain row. */
  detail?: string;
  /** A word that sorts the event into a kind or a track, e.g. "Election". Shown as text beside the date. */
  tag?: string;
  /** Color of the event's dot. Pair it with a `tag`: color never carries the meaning by itself. */
  tone?: TokenColor;
}

export interface TimelineProps {
  /** 3–10 events, in the order they should be read. */
  events: TimelineEvent[];
  /** Optional heading above the rail. */
  title?: string;
  /** Show every detail at once, with nothing to open. For a timeline read as a figure. */
  expanded?: boolean;
}

// Rail geometry in px so the dots, rail, and detail indent stay aligned
// regardless of root font size.
const DOT = 12;
const GAP = 10;

const rowStyle: CSSProperties = {
  font: 'inherit',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `4px ${GAP}px`,
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',
  padding: '0.45rem 0.25rem 0.45rem 0',
  border: 'none',
  background: 'transparent',
  color: tokens.ink,
};

/**
 * Event sequence on a vertical rail. By default an event with a detail
 * expands on click, one open at a time; `expanded` shows every detail at
 * once, as a figure. An event's `tag` names its kind or track in words.
 */
export function Timeline({ events, title, expanded = false }: TimelineProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ ...blockStyle, borderLeft: `3px solid ${tokens.green}` }}>
      <div style={labelStyle}>Timeline</div>
      {title && (
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>
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
          const interactive = !expanded && !!event.detail;
          const open = expanded || openIndex === i;
          const row = (
            <>
              <span
                aria-hidden="true"
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: DOT,
                  height: DOT,
                  borderRadius: '50%',
                  background: event.tone ? barColor(event.tone) : open && interactive ? tokens.accent : tokens.muted,
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
              {event.tag && (
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: tokens.ink,
                  }}
                >
                  {event.tag}
                </span>
              )}
              {/* Takes the rest of the line, or drops to its own line when little is left. */}
              <span style={{ fontWeight: 600, flex: '1 1 9em', minWidth: 0 }}>{event.title}</span>
            </>
          );
          return (
            <div key={i}>
              {interactive ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                  style={{ ...rowStyle, cursor: 'pointer' }}
                >
                  {row}
                </button>
              ) : (
                <div style={rowStyle}>{row}</div>
              )}
              {open && event.detail && (
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
