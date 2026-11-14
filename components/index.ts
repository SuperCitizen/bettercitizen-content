/**
 * BetterCitizen lesson component library.
 *
 * The app imports `mdxComponents` and passes it to its MDX renderer.
 * Lesson files never import anything — every JSX tag they use must be a key
 * of `mdxComponents` (the content validator enforces this).
 */
export { Checkpoint } from './Checkpoint';
export { QuickCheck } from './QuickCheck';
export { Figure } from './Figure';
export { Panels, Panel } from './Panels';
export { Flow } from './Flow';
export { Chart } from './Chart';
export { Scale } from './Scale';
export { PositionMap } from './PositionMap';
export { Ballot } from './Ballot';
export { Callout } from './Callout';
export { Timeline } from './Timeline';
export { ProcessFlow } from './ProcessFlow';
export { PerspectiveTabs, Perspective } from './PerspectiveTabs';
export { DataBars } from './DataBars';
export { Flashcards } from './Flashcards';
export { MatchUp } from './MatchUp';
export { OrderIt } from './OrderIt';
export { GuessTheShare } from './GuessTheShare';
export { RankedChoiceSim } from './RankedChoiceSim';
export { GerrymanderLab } from './GerrymanderLab';
export { TaxBracketExplorer } from './TaxBracketExplorer';
export { Path270 } from './Path270';

import { Checkpoint } from './Checkpoint';
import { QuickCheck } from './QuickCheck';
import { Figure } from './Figure';
import { Panels, Panel } from './Panels';
import { Flow } from './Flow';
import { Chart } from './Chart';
import { Scale } from './Scale';
import { PositionMap } from './PositionMap';
import { Ballot } from './Ballot';
import { Callout } from './Callout';
import { Timeline } from './Timeline';
import { ProcessFlow } from './ProcessFlow';
import { PerspectiveTabs, Perspective } from './PerspectiveTabs';
import { DataBars } from './DataBars';
import { Flashcards } from './Flashcards';
import { MatchUp } from './MatchUp';
import { OrderIt } from './OrderIt';
import { GuessTheShare } from './GuessTheShare';
import { RankedChoiceSim } from './RankedChoiceSim';
import { GerrymanderLab } from './GerrymanderLab';
import { TaxBracketExplorer } from './TaxBracketExplorer';
import { Path270 } from './Path270';

/** The complete map of components available to lesson MDX. */
export const mdxComponents = {
  Checkpoint,
  QuickCheck,
  Figure,
  Panels,
  Panel,
  Flow,
  Chart,
  Scale,
  PositionMap,
  Ballot,
  Callout,
  Timeline,
  ProcessFlow,
  PerspectiveTabs,
  Perspective,
  DataBars,
  Flashcards,
  MatchUp,
  OrderIt,
  GuessTheShare,
  RankedChoiceSim,
  GerrymanderLab,
  TaxBracketExplorer,
  Path270,
} as const;

export type LessonComponentName = keyof typeof mdxComponents;
