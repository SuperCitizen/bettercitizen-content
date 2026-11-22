---
schema: bettercitizen.lecture/v1
lesson: what-is-score-voting
---

Think of the last time you rated a restaurant. Or tipped a driver. Or argued about whether a movie deserved four stars or five.

[beat]

You already know how to do this. Humans evaluate things on scales constantly, casually, and well. The only place we are forbidden to do it is the one place it matters most.

[pause]

This is a chapter of Score the Vote. It is an argument, and the "I" in it is the book's author. The last chapter was the diagnosis: the pick-one ballot. In this chapter I write my prescription.

It is called score voting. Researchers often call it range voting. And it is exactly what it sounds like.

> Give every candidate a score on a fixed scale. Highest total wins.

That is the whole system. No rounds. No eliminations. No transfers. One ballot, one count, one winner.

We will take it in four steps. First, the ballot, and a count small enough to follow by ear. Second, the one property that does the most work. Third, the scale. And last, two warnings, which you should hear from me first.

## The ballot and the count

Picture four candidates for mayor. Next to each name sits a row of bubbles, 0 through 5. You fill in one bubble for each candidate. Every candidate, including the ones you oppose, because a 0 is information too.

Say your favorite is Ana Gutierrez. She gets your 5. James Park is a strong second, someone you would gladly accept, so he gets a 4. Maria Thompson is a tolerable fallback: a 2. And the fourth candidate is a hard no: a 0.

[beat]

You have just expressed more political information than a lifetime of pick-one ballots could carry. Not just the order of your choices. The sizes of the gaps between them.

And suppose the city elects Park, your second choice. Your ballot still counted at full strength for that outcome, because your 4 for Park weighed in at exactly the value you assigned. Nothing was wasted, transferred, or eliminated.

[pause]

So how is a winner found? Tallying is addition. Here is a complete election, small enough to check in your head.

Five voters. Four candidates: Avila, Brooks, Chen, and Dimas. The scale runs from 0 to 5.

Start with Avila. Two voters give Avila a 5. One gives a 1. Two give a 0. [beat] Avila's total is 11.

Chen looks much the same. Two voters give Chen a 5. The other three give a 2, a 1, and a 0. [beat] Chen's total is 13.

Dimas has one devotee, who gives a 5. The other four give a 2, a 1, and two zeros. [beat] Dimas's total is 8.

So far: 11, 13, and 8.

And then Brooks. Nobody gives Brooks a 5. His five scores are 4, 3, 4, 3, and 4. [beat] Add them up: 18.

[pause]

Brooks wins, with 18 points. And notice the shape of that win. Brooks is nobody's favorite. Avila and Chen each have two passionate supporters, and detractors who scored them at or near the floor. Brooks is the candidate every single voter scored a 3 or a 4: the one the whole town can live with, and govern under.

Plurality, the pick-one rule, literally cannot see this candidate. Score voting finds him with arithmetic a fourth-grader can audit.

Let's test that. Hand the same five voters a pick-one ballot, and assume each marks the candidate they scored highest: the one who got their 5. Who wins? And what does that count never see? Work it out.

[pause 5s]

Avila gets two votes. Chen gets two. Dimas gets one. Brooks gets none. [beat] So Avila and Chen tie, and the office goes to a coin flip, a lawsuit, or a runoff between the town's two most polarizing candidates.

And the count never saw that all five voters rated Brooks a 3 or better. The consensus simply vanished at the ballot box.

> Same voters, same opinions, different ballot: different town.

## No vote splitting, by construction

Now the property that does the most work. I will state it carefully.

> Every candidate's score is independent.

Go back to your ballot for mayor. Your 5 for Gutierrez does not draw down some account that your 4 for Park also draws on. Each row of the ballot is its own question, answered on its own merits.

That single design choice dissolves the pathologies of the last chapter. The spoiler effect runs on forced choices: supporting your favorite instead of your fallback. Score voting un-forces the choice. You support both, at the levels you actually feel.

Take a third-party candidate polling at 2 percent. She can collect every honest point her supporters want to give her, without electing anyone's nightmare, because those same supporters are scoring the major candidates too.

"Don't waste your vote" stops making sense. [beat] There is nothing to waste.

## What scale?

Score voting comes in scales. 0 to 5. 0 to 10. And a minimalist version, with only two levels: score everyone either "approve" or "don't." The world knows that version as approval voting.

> Approval voting is score voting on the coarsest possible scale.

It is not a rival system. It belongs to the same family, and it carries the family's signature. When St. Louis ran its first approval primary, in March 2021, the candidates' percentages summed past 100. They can, because every voter judged every candidate.

Partisans of particular scales overstate their case, and I have corrected my own draft on this point. So here is the evidence as it stands.

It comes from Jameson Quinn's voter-satisfaction simulations, the standard reference, which get a chapter of their own. A two-level approval ballot already reaches roughly 89 to 95 percent of ideal voter satisfaction. Widen it to eleven levels, 0 to 10, and you get about 96 percent, with honest voters.

[pause]

Let me say that again. Going from two levels to eleven moves the needle a few points. The structure does almost all the work: judge everyone, independently. The granularity is a tuning knob.

Listen to Kenneth Arrow, whose impossibility theorem we will meet properly in the math chapter. In 2012, he told an interviewer that he was "a little inclined to think that score systems where you categorize in maybe three or four classes... is probably the best."

[beat]

Three or four classes.

So my practical advice runs against scale maximalism. A scale of 0 to 5 fits a ballot row, matches the star-rating idiom every adult already speaks, and gives voters room to tell "strongest support" from "acceptable" from "no." A scale of 0 to 10 is fine too.

What I would insist on is the zero. The scale must start at 0, not at 1, because voters deserve a mark that means opposition, not merely faint praise.

And one bookkeeping rule is worth knowing. In the simplest version, a blank row counts as a 0, and the highest total wins.

## Two warnings

Before the warnings, a test. A few minutes ago I stated one property carefully. Here is a pundit who has not heard it.

"If you score your compromise candidate a 4," the pundit warns, "you're splitting your vote and hurting your favorite, whom you scored 5."

What was that property? And what actually happens under score voting? Think it through.

[long pause]

Every candidate's score is independent, so nothing is split. A score is a judgment, not a share of a fixed budget.

Suppose the race comes down to your favorite against your compromise. Your ballot contributes 5 against 4. It is still a vote for your favorite, by exactly the one-point gap you chose. The pundit has carried plurality's zero-sum logic into a system built to eliminate it.

[pause]

Might voters still inflate or deflate their scores, strategically? That is a real question, and I won't dodge it. It is the first of my two warnings, and both get full chapters.

Gibbard's theorem, from the introduction, applies here: voters can play tactics on a score ballot too. And a tactical voter's optimal play is usually to push scores to the endpoints. All fives and zeros.

> Under tactics, score voting compresses toward approval voting.

I will show you that math, and why a system whose worst case is approval voting is a system I can live with.

The second warning. Score voting elects the candidate with the broadest, deepest support. That is not always the candidate a bare majority would pick, in a head-to-head fight.

> Score voting's winner is not always the candidate a bare majority would pick.

There is a worked example with my name on it in the math chapter. You should see the strongest case against score voting written by someone who wants it to win.

Until then, try the question yourself. Which should an election find: the candidate with the broadest, deepest support, or the candidate a bare majority would pick? Take the answer you find less convincing, and make the best case for it.

[pause 5s]

Hold on to your answer. That question is contested, and this chapter does not settle it.

## What to keep

Let's gather it up. Five things to keep.

One. Give every candidate a score on a fixed scale, and the highest total wins. Tallying is addition.

[beat]

Two. Brooks won with 18 points as nobody's favorite, because every voter scored him a 3 or a 4. Same voters, same opinions, different ballot: different town.

[beat]

Three. Every candidate's score is independent. So nothing is split, and there is nothing to waste.

[beat]

Four. The scale is a detail, not a doctrine. Approval voting is score voting on the coarsest possible scale: the same machine, with two settings. Whatever the scale, it must start at zero.

[beat]

And five. The two warnings. Under tactics, score voting compresses toward approval voting. And score voting's winner is not always the candidate a bare majority would pick.

[pause]

That much is settled: the mechanics. Here is what this chapter has not settled. Three things.

Whether "broadest, deepest support" is the right target for an election. How the system behaves when voters scheme. And how it stacks up, head to head, against ranked-choice voting and STAR voting.

The next chapter lays out the reform landscape: who the rivals are, and what each one promises. Only then do we start keeping score.

[pause]

For now, go back to the restaurant, the driver, the movie. You rated each of them without a second thought.

[beat]

The ballot is still the one place where you are not allowed to.
