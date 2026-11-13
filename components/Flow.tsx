import type { CSSProperties } from 'react';
import { allOrNothingBasis, barColor, blockStyle, labelStyle, listReset, tokens, visuallyHidden, type TokenColor } from './lib';

export interface FlowNode {
  title: string;
  detail?: string;
  /** Color of the node's left rule. Decoration only. */
  tone?: TokenColor;
  /** Label on the path into this node, e.g. "$5,000 per year". On a row of nodes, use it only when the row has two. */
  via?: string;
}

export interface FlowStep extends Partial<FlowNode> {
  /** Several nodes side by side: a fork, a merge, or parallel lanes. Use instead of `title`. */
  nodes?: FlowNode[];
  /** A short heading above the stage, e.g. "1 · Proposal". */
  label?: string;
  /** Names the relation between the two nodes of a row, on a dashed bracket beneath them. */
  between?: string;
  /** Read after the step: where the path can divert, or a caveat. */
  note?: string;
}

export interface FlowProps {
  /** The stages, in order. Each is one node or a row of nodes. */
  steps: FlowStep[];
  title?: string;
  /** Number the steps. Use when the order is itself the content. */
  numbered?: boolean;
  /** Drop the frame and label: for a small flow set inside a `Panel`. */
  plain?: boolean;
}

/** Narrowest a node may get before its row stacks, in em of the reader's text size. */
const NODE_MIN_EM = 7.5;
/** A pair stays side by side longer than a wider row: a fork or two lanes read wrongly once stacked. */
const PAIR_MIN_EM = 6.5;
const GAP_EM = 0.6;

const viaStyle: CSSProperties = { fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.3, color: tokens.ink };

function Arrow({ via, branch = false }: { via?: string; branch?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: branch ? 'flex-start' : 'center', gap: '0.4em', padding: '0.3rem 0.1rem' }}>
      <span aria-hidden="true" style={{ color: tokens.muted, fontSize: '1.05em', lineHeight: 1 }}>
        {branch ? '↳' : '↓'}
      </span>
      {via && <span style={viaStyle}>{via}</span>}
    </div>
  );
}

function NodeCard({ node }: { node: FlowNode }) {
  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        background: tokens.card,
        border: `1px solid ${tokens.line}`,
        borderLeft: `3px solid ${node.tone ? barColor(node.tone) : tokens.muted}`,
        borderRadius: 6,
        padding: '0.5rem 0.7rem',
        lineHeight: 1.35,
        overflowWrap: 'anywhere',
      }}
    >
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: tokens.ink }}>{node.title}</div>
      {node.detail && <div style={{ marginTop: 2, fontSize: '0.84rem', color: tokens.ink }}>{node.detail}</div>}
    </div>
  );
}

/**
 * A flow drawn as real text: stages top to bottom, each one node or a row of
 * nodes, joined by arrows that can carry a label. A row of nodes sits side by
 * side when every node fits and stacks when it doesn't, so a fork, a merge or
 * two parallel lanes reads at any width. Static, and safe on the server.
 */
export function Flow({ steps, title, numbered = false, plain = false }: FlowProps) {
  const nodesOf = (step: FlowStep | undefined): FlowNode[] =>
    step ? (step.nodes ?? (step.title ? [{ title: step.title, detail: step.detail, tone: step.tone }] : [])) : [];

  return (
    <div style={plain ? { margin: '0 0 0.6rem' } : { ...blockStyle, borderLeft: `3px solid ${tokens.blue}` }}>
      {!plain && <div style={labelStyle}>{numbered ? 'Step by step' : 'How it connects'}</div>}
      {title && <p style={{ margin: '0 0 0.75rem', fontWeight: 600, lineHeight: 1.35, color: tokens.ink }}>{title}</p>}
      <ol style={listReset}>
        {steps.map((step, i) => {
          const nodes = nodesOf(step);
          // When the nodes carry their own path labels, each gets its own arrow: straight down
          // for parallel lanes (as many nodes as the stage above), a branch arrow for a fork.
          const lanes = nodes.length > 1 && nodesOf(steps[i - 1]).length === nodes.length;
          const perNodeArrows = i > 0 && !!step.nodes && (lanes || step.nodes.some((n) => n.via));
          const min = nodes.length === 2 ? PAIR_MIN_EM : NODE_MIN_EM;
          const threshold = nodes.length * min + (nodes.length - 1) * GAP_EM;
          return (
            <li key={i} style={{ margin: 0 }}>
              {i > 0 && !perNodeArrows && !numbered && <Arrow via={step.via} />}
              {i > 0 && numbered && <div style={{ height: '0.55rem' }} />}
              {i > 0 && <span style={visuallyHidden}>Then:</span>}
              <div style={{ display: 'flex', gap: '0.6em', alignItems: 'flex-start' }}>
                {numbered && (
                  <span
                    aria-hidden="true"
                    style={{
                      flex: '0 0 auto',
                      width: '1.6em',
                      height: '1.6em',
                      marginTop: '0.35rem',
                      borderRadius: '50%',
                      background: tokens.ink,
                      color: tokens.card,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {numbered && <span style={visuallyHidden}>Step {i + 1}.</span>}
                  {numbered && step.via && <div style={{ ...viaStyle, paddingBottom: '0.2rem' }}>{step.via}</div>}
                  {step.label && (
                    <div
                      style={{
                        margin: '0 0 0.3rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: tokens.ink,
                      }}
                    >
                      {step.label}
                    </div>
                  )}
                  <ul style={{ ...listReset, display: 'flex', flexWrap: 'wrap', gap: `0 ${GAP_EM}em` }}>
                    {nodes.map((node, n) => (
                      <li
                        key={n}
                        style={{
                          margin: 0,
                          flexGrow: 1,
                          flexBasis: allOrNothingBasis(threshold),
                          minWidth: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          // Stacked nodes need the gap a row would have given them; arrows supply it otherwise.
                          marginBottom: nodes.length > 1 && !perNodeArrows ? `${GAP_EM}em` : 0,
                        }}
                      >
                        {perNodeArrows && <Arrow via={node.via} branch={!lanes} />}
                        <div style={{ flex: 1 }}>
                          <NodeCard node={node} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  {step.between && nodes.length === 2 && (
                    <div style={{ textAlign: 'center' }}>
                      <div
                        aria-hidden="true"
                        style={{
                          margin: '0.25rem 25% 0',
                          height: '0.5rem',
                          border: `2px dashed ${tokens.muted}`,
                          borderTop: 'none',
                          borderRadius: '0 0 4px 4px',
                        }}
                      />
                      <span style={{ ...viaStyle, display: 'inline-block', paddingTop: '0.2rem' }}>{step.between}</span>
                    </div>
                  )}
                  {step.note && (
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', lineHeight: 1.45, color: tokens.ink }}>{step.note}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
