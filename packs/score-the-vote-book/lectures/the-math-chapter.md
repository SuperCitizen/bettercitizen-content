---
schema: bettercitizen.lecture/v1
lesson: the-math-chapter
---

In 2012, a podcast host put a question to Kenneth Arrow.

Arrow was a Nobel laureate, and the author of the most famous impossibility result in social science. His theorem launched a thousand headlines saying that no voting system is fair. So the host asked him which system he would actually recommend.

His answer was hedged, the way real mathematicians hedge. He said: "I'm a little inclined to think that score systems where you categorize in maybe three or four classes... is probably the best."

[pause]

This is a chapter of Score the Vote. It is an argument for score voting, and the "I" in it is the book's author. The last chapter weighed STAR voting, the hybrid, and named a trade between two guarantees. This chapter is the math underneath that trade.

You don't need a PhD to follow it. You need four results, two worked elections, and a tolerance for hearing the strongest case against my side. I will be making that case personally, with arithmetic you can check.

We will take it in four steps. First, two theorems: Arrow's, and Gibbard's. Second, a scorecard that neither side sweeps. Third, an election that score voting gets right. And last, an election I built to make score voting look wrong.

## Two theorems

Start with Arrow, in 1951. His book was called Social Choice and Individual Values. It looked at every method for converting individual rankings into a group ranking. And it proved that, with three or more candidates, no such method can satisfy a short list of innocent-sounding fairness conditions all at once.

Something always gives.

That is the theorem people compress into "all voting systems are flawed." But the fine print changes everything. The theorem's inputs are orderings: first, second, third. Arrow's framework speaks ordinal, and it is silent about ballots that carry more.

A score ballot carries more. Take one voter who scores three candidates 5, 4, and 0. Take another who scores the same three 5, 1, and 0. Those are different ballots. A ranking flattens both into the same order.

> Arrow's theorem is about rankings. A score ballot is a different input.

Score voting is a cardinal method: its ballots say how much. And cardinal methods don't solve Arrow's puzzle. They decline to enter it, by changing what voters are asked.

[pause]

One caution. Advocates, my people, routinely oversell this. They say "score voting escapes the impossibility theorem," as though escaping Arrow meant escaping criticism. It doesn't, because of what came next.

In 1973, the philosopher Allan Gibbard published a result with none of Arrow's escape hatches. Take every voting scheme in which chance plays no role, no individual is a dictator, and more than two outcomes are possible. Gibbard proved that every one of them can be manipulated. Situations exist where some voter gets a better result by misrepresenting her preferences.

The proof doesn't care whether the ballots are rankings, scores, or approvals.

> Every voting method can be manipulated. Scores and approvals included.

Strategy is universal. Forever. By theorem.

Let's test what we have. An advocate tells you: "Score voting escapes Arrow's impossibility theorem." What is the precise truth of that claim? Take a moment.

[long pause]

Both halves matter. Arrow's result is about rankings, so score ballots really do sit outside its premises. But Gibbard's theorem covers every such scheme, whatever the ballot type. So "escapes Arrow" must never be inflated into "immune to strategy."

So the honest comparison between systems was never "which one is strategy-proof?" That set is empty. The honest question is what each system's strategy looks like, and how badly it degrades. Hold that question.

## The scorecard

Those are the theorems. Now the scorecard.

Voting theorists evaluate methods against named criteria: bright-line tests, which a method passes or fails by mathematical proof, not by opinion. Four of them decide the argument between score voting and ranked choice voting. I will call the ranked count by its technical name, instant runoff, or IRV.

Here are the four, concessions first.

The first is called later-no-harm. It demands that expressing a backup choice can never hurt your favorite. IRV passes. Score voting and approval voting fail.

Later-no-harm is ranked choice voting's best card, and it is genuine. Under instant runoff, your second choice is consulted only after your first is eliminated, so it can never help defeat your first. Under score voting, the 3 you give a compromise candidate genuinely can help him edge out your 5.

I concede the failure. But look at what the criterion forbids. A method can guarantee later-no-harm only by refusing to count compromise information while your favorite lives. That is how IRV ends up blind to consensus candidates. As I see it, you cannot buy later-no-harm and also buy the candidate everyone can accept. You pick one.

[pause]

The second criterion is the mirror image. It is called favorite betrayal, and it demands that you never do better by demoting your true favorite. Score and approval pass: giving your true favorite the maximum can never backfire. Plurality, the pick-one count, lacks that property most catastrophically of all. And IRV fails it, not just on paper.

Take Alaska's special election of August 2022, and an analysis of its ballot data by Graham-Squire and McCune. Sarah Palin's voters helped elect Mary Peltola, their least preferred candidate, by ranking Palin first. The ballots show a different Republican, Nick Begich, beating everyone head to head. Had enough Palin voters insincerely ranked Begich on top, they would have got an outcome they preferred.

Top-ranking their favorite was, mathematically, the blunder.

> IRV passes later-no-harm. Score voting passes favorite betrayal. Neither passes both.

Two more fill out the picture. Monotonicity demands that gaining support can never hurt a candidate. Score voting passes: more points can never hurt. IRV fails, because its elimination order can turn extra support into defeat, as Alaska showed in the wild.

And the last is the Condorcet criterion: always elect the candidate who beats all the others head to head. Here both methods fail. IRV failed in Burlington in 2009. It elected Bob Kiss, while the ballots showed that 54 percent preferred Andy Montroll head to head. Score voting fails too, under some honest ballots. That failure I will construct myself, before this chapter ends.

So neither side sweeps the scorecard. Every method buys its virtues with named, provable failures.

## One election, three counts

Now the arithmetic, slowly.

One hundred voters. Three candidates: Left, Center, and Right. Each voter scores each candidate from 0 to 5.

Thirty-five voters are Left partisans. They give Left a 5, Center a 3, and Right a 0.

Thirty-three are Right partisans, and they are the mirror image. Right a 5, Center a 3, Left a 0.

The remaining 32 are centrists, and every one of them gives Center a 5. Sixteen lean left, and give Left a 3. The other 16 lean right, and give Right a 3.

[pause]

Now run those same hundred ballots through three counting rules.

Plurality first. Left has 35 first choices. Right has 33. Center has 32. [beat] Left wins, and Center finishes dead last.

Instant runoff next. Center has the fewest first choices, so Center is eliminated first. His 32 ballots transfer, 16 to each side. The final round is Left 51, Right 49. [beat] Left wins again.

But ask who beats whom, head to head. Center beats Left, 65 to 35. Center beats Right, 67 to 33. Two-thirds of the city prefers Center to either alternative.

And then the score count, which is addition. The 32 centrists each give Center a 5. The other 68 voters, the partisans on both sides, each give Center a 3. [beat] Center's total is 364.

Count Left the same way, and the total is 223. Right's total is 213.

Center wins.

> Plurality never sees Center. Instant runoff eliminates him first. Score voting finds him.

It finds him because breadth plus depth is exactly what a sum measures. This is the center squeeze, which the last chapter named as the price of IRV's choice.

Let's stress-test it. Move 4 of the right-leaning centrists into the Right partisan bloc. Each of those four used to give Center a 5, and now gives Center a 3. Each used to give Right a 3, and now gives Right a 5. Left stays at 223. Does Center survive? Work it out.

[pause 5s]

Center loses 8 points, and falls to 356. Right gains 8, and rises to 221. Left is still at 223. So Center still wins comfortably. The score count bends smoothly as opinion shifts.

## The case against score voting, by its advocate

Fairness demands that I build the reverse case with the same care.

One hundred voters again. This time, only two candidates: A and B.

Fifty-five voters are a mild majority. They give A a 5, and B a 4.

Forty-five voters are an intense minority. They give A a 0, and B a 5.

Add it up. A gets 275. [beat] B gets 445.

B wins in a landslide, while 55 percent of the voters prefer A.

[pause]

A two-candidate race, a clear majority favorite, and score voting elects the other one. This is a real, provable property. Theorists call the test the majority criterion.

> Score voting fails the majority criterion.

Any honest advocate must say so in plain English. I just did. Here is why I accept it.

Look at what the ballots say. Fifty-five voters are almost equally happy either way: a one-point preference. For the other 45, the difference is everything they can express. Electing A buys the majority one point of happiness each, and costs the minority five each.

If an election should maximize how satisfied the city actually is, then B is the right answer, and the failure is the system working.

But suppose you hold majority rule as axiomatic: the majority must prevail, however mild its preference. Then you are making a value choice, not finding a math error. And score voting is honestly not your system.

> Majority rule against total satisfaction is a value choice, not a math error.

That is the philosophical core of this whole debate. I would rather hand it to you than have a critic pretend I hid it.

So take it. One of those two answers probably convinces you less: the majority must always prevail, or the election should maximize satisfaction. What is the best case you can make for that one?

[pause 5s]

Keep that case.

The example has a second act. Suppose the majority wises up and exaggerates. All 55 mark A a 5, and B a 0. Now A totals 275, and B totals 225. [beat] A wins.

Earlier in this chapter, a theorem predicted that move. Whose theorem, and what did it say? Take a moment.

[long pause]

Gibbard's, from 1973. Every voting method can be manipulated, scores included. So ask the honest question: what does gaming do to the system?

The majority can always protect itself by exaggerating. So score voting's failures of the majority criterion require a majority too honest to flex.

Tactical scoring pushes every ballot to its endpoints. And a ballot of only 5s and 0s is an approval ballot.

> Strategic score voting degrades into approval voting.

The concession and the comfort are the same fact. Approval voting is the highest strategic floor ever simulated. And the feared "tyranny of the indifferent majority" evaporates under exactly the strategic behavior that critics insist voters will exhibit.

A machine whose failure modes police each other is not a fragile machine.

## What to keep

Let's gather it up. Five things to keep.

One. Arrow, 1951. No method that turns rankings into a group ranking can meet all his fairness conditions at once. Arrow's theorem is about rankings. A score ballot is a different input.

[beat]

Two. Gibbard, 1973. Every voting method can be manipulated, scores and approvals included. The right question is what gaming does to it.

[beat]

Three. The scorecard is a trade. Later-no-harm: a backup choice can never hurt your favorite. Favorite betrayal: honesty about your favorite never backfires. IRV passes later-no-harm. Score voting passes favorite betrayal. Neither passes both.

[beat]

Four. The center squeeze. Plurality never sees Center. Instant runoff eliminates him first. Score voting finds him, with addition.

[beat]

And five. Score voting fails the majority criterion: a mild majority can lose to an intense minority. I accept that. And under tactics, strategic score voting degrades into approval voting.

[pause]

Here is what the math cannot settle. It cannot tell you which trade to value, because that is philosophy wearing a calculator.

So, my cards, face up. A democracy should never punish a voter for telling the truth about her favorite. It should use the intensity information that voters are begging to give. And when it fails, it should fail toward approval voting rather than toward 1992.

The theorems don't compel those values.

The next chapter leaves the blackboard for a machine: the primary election, and what a different ballot does to it.

[pause]

For now, go back to Kenneth Arrow in 2012, a little inclined, and hedging. He proved that something always gives.

[beat]

Whatever you value, you are choosing trade-offs. So choose them with the tables open.
