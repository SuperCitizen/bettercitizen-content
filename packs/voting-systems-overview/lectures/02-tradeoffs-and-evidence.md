---
schema: bettercitizen.lecture/v1
lesson: tradeoffs-and-evidence
---

The year is 1948. At the RAND Corporation, a young economist is handed a Cold War problem.

Game theory needed a way to talk about what the Soviet Union prefers, or what the United States prefers. But a country is millions of people. So someone had to define how millions of individual preferences combine into a collective one.

The economist was Kenneth Arrow. He went looking for a rule that would do the combining, a rule that met a short list of reasonable-sounding conditions.

[beat]

Instead, he proved that no such rule exists.

[pause]

His book, Social Choice and Individual Values, appeared in 1951. It turned a staffing memo into one of the most consequential theorems in social science, and eventually into a Nobel Prize.

It also fixed the terms of every argument you will ever have about voting systems.

> The argument cannot be about finding the flawless voting system. There isn't one.

It has to be about which flaws you can live with.

[pause]

Last time, we learned how five systems work: plurality, ranked-choice voting, approval, score, and STAR. This lecture is about how to judge them. By the end, you should be able to name the properties a voting system is graded on, and to say what each system gains and what it gives up.

Three honest claims frame everything that follows.

One. No voting system is best at every property at once. That is a theorem, not an opinion.

Two. The American record on the alternatives is real, but short.

Three. "Best" depends on which property you weight most. So the job here is to make you able to name the properties before you pick a side.

We will take it in four steps. First, what Arrow proved, and what he did not. Second, a theorem about strategy. Third, two more properties, and a diagnosis of what went wrong in Burlington. And last, what real elections have shown so far.

## What Arrow proved, and what he didn't

The theorem has to be stated carefully, because it is overclaimed constantly.

Arrow considered one kind of system. It takes the voters' rankings of three or more candidates, and it turns them into a collective ranking. He asked for four conditions. Each one, taken alone, is hard to argue with.

First, voters may rank the candidates in any order they like. That condition is called unrestricted domain.

Second, if literally everyone prefers A to B, the outcome must not put B above A. That is unanimity.

Third, whether the group ranks A above B should depend only on how voters compare A and B. It should not depend on where some third candidate, C, happens to sit. That one has a long name: independence of irrelevant alternatives.

Fourth, no single voter's ballot decides everything, regardless of the rest. That is non-dictatorship.

[pause]

Any order. Unanimity. No interference from a third candidate. No dictator. Four modest requests. And here is the theorem.

> No ranked voting system can satisfy all four of Arrow's conditions at once.

Every ranked system you will ever meet violates at least one of them. Usually it is the third, independence of irrelevant alternatives. And you already know that failure by a plainer name. [beat] It is the formal name for the spoiler problem.

Now the honest boundaries. There are three things the theorem does not say.

It does not say that all voting systems are equally flawed. Systems fail different conditions, at different frequencies, in scenarios of very different plausibility.

It does not say that elections are meaningless. The proof exploits pathological cycles of preference, and most real electorates do not generate them.

And it does not directly cover systems that collect more than rankings. Approval, score and STAR are of that kind. They are called cardinal systems, and they escape Arrow's exact framing, a point their advocates press hard. [beat] Though they walk straight into the next theorem instead.

What might all this mean for democracy itself? The strongest statement came in 1982, in William Riker's book Liberalism Against Populism. Riker built an entire theory of democracy on Arrow's result. On his account, elections are a veto on tyranny, rather than the revelation of a coherent popular will. And that reading is itself contested.

Let's test this. A friend tells you: "Arrow proved every voting system is equally broken, so reform is pointless."

There are two distinct errors in that sentence. Can you name them both?

[long pause]

The first error is scope. Arrow's theorem covers ranked systems, sorting three or more candidates. Cardinal systems, like approval and score, are outside its exact framing.

The second error is the word "equally." The theorem says that every ranked system fails some condition, somewhere. It says nothing about how often each one fails, or how plausibly. And that is precisely where the systems differ, and where the real argument is.

## The strategy theorem

Arrow left a loophole. Maybe some system, ranked or not, at least never rewards lying about your preferences?

Two scholars shut that loophole: Allan Gibbard, in 1973, and Mark Satterthwaite, in 1975. Their result carries both names. It is the Gibbard-Satterthwaite theorem.

It says this. Take any deterministic voting rule that can elect three or more possible winners, and that is not a dictatorship. That rule is manipulable.

In plainer words: there exist situations where some voter does better by voting insincerely. And Gibbard's version is sweeping enough to cover cardinal ballots too.

So "is this system gameable?" is the wrong question. They all are.

> Every voting system is gameable. The useful questions are how often, and how easily.

There are three productive questions. How often profitable manipulations arise. How much information a voter needs to find them. And whether the strategic move is psychologically natural, or exotic.

Graded on those three questions, the five systems pull apart. Let's take them one at a time.

Plurality is the most manipulated system in practice. And the manipulation is so natural that we barely call it one: abandoning your sincere favorite to block the candidate you like least. Duverger's psychological effect, from last time, is mass tactical voting.

Approval's strategy is setting a threshold. How good is good enough to check? But approving your sincere favorite can never backfire on them.

Ranked-choice voting rewards a sincere first choice in the overwhelming majority of real contests. It does have known failure modes. In rare configurations, called non-monotonic, a favorite ranked first can be hurt by gaining support. But to use them, a campaign would need information that no real campaign has. The practical cost is subtler. A voter who ranks only one candidate risks an exhausted ballot, not a backfire.

Score is the most strategic system on paper. With any information about the front-runners, your best ballot goes to the extremes: top score for your side of the race, zero for the other side, nothing in between. That is called a min-max ballot. And among strategic voters, it collapses score voting into approval voting.

STAR was engineered against exactly that collapse. Its runoff counts only which finalist you scored higher. So if you flatten your ballot to fives and zeros, you throw away your runoff voice among your fives. Honest middle scores stay rational.

One caution about that last claim. It holds in simulations, notably Jameson Quinn's models of "voter satisfaction efficiency." That is the literature STAR's advocates lean on hardest. [beat] No public election has tested it.

## Counting, and the Condorcet question

Two more properties round out the standard scorecard.

The first is counting simplicity. Under plurality, approval and score, each precinct reports its totals, the totals add, and any citizen can check the arithmetic. A count like that is called precinct-summable.

Ranked-choice voting is not precinct-summable. The elimination order depends on every ballot, so the counting must be centralized, or the precincts must report full preference tallies. Recounts are more intricate. And in a tight race, election-night results can wait days.

STAR sits between. Its score totals sum by precinct, and its runoff needs only the pairwise tallies among the top candidates.

Summability sounds like bureaucratic trivia. Then comes a contested recount. [beat] At that point, it becomes a property of public trust.

The second property concerns who wins. Suppose there is a candidate who would beat every rival head-to-head. Does the system always elect that candidate? That test is the Condorcet criterion.

You met the American counterexample last time. Burlington, 2009. The Democrat, Andy Montroll, won every pairwise matchup, and finished third under the instant runoff.

The mechanism has a name: center squeeze. Here is how it works.

Picture three candidates: one on the left, one in the center, one on the right. The candidate on the left has 35 percent of the first choices. The candidate on the right has 37. The candidate in the center has 28.

But the center candidate is the second choice of nearly all the other voters. So the center beats the left head-to-head, and beats the right head-to-head.

Now run the instant runoff. The center has the fewest first choices, so the center is eliminated first. The final round is left against right. [beat] The consensus candidate never gets there.

> In a center squeeze, the consensus candidate is eliminated first.

Put another way: a candidate between two larger blocs is everyone's acceptable second choice, and too few voters' first choice. And the problem is wider than one system. Any system that filters on first-choice strength can eliminate the candidate a majority prefers to every alternative. Plurality can. Runoffs can. The instant runoff can.

Let's test that. A city holds an instant-runoff election, and it elects a candidate we will call K. Afterward, analysts show that an eliminated candidate, M, would have beaten K, and everyone else, one-on-one.

A reform group says: "Switch back to plurality. It wouldn't have done this." Are they right? Think it through.

[long pause]

No. The failure here is a failure of the Condorcet criterion, and plurality fails it at least as badly. In the same center-squeeze configuration, plurality never even consults the second choices that make M the consensus candidate. M has the fewest first choices, and loses immediately.

The honest comparisons are with systems that do weigh consensus support: Condorcet methods, approval, score, or STAR. And each of those buys that property by giving up something else.

What do they give up? One answer has a name: later-no-harm.

Under the instant runoff, ranking a second choice can never hurt your first. Your ballot stays with your favorite until your favorite is eliminated. Under approval, score and STAR, that protection is gone. Supporting a second choice can help that candidate beat your favorite.

Advocates on each side treat the other side's gap as the fatal one. Instant-runoff people say later-no-harm is what makes voters comfortable ranking honestly. Approval and score people reply that later-no-harm is precisely why the instant runoff ignores consensus candidates, and why it squeezed the center in Burlington.

That is not a resolvable disagreement.

> Later-no-harm against consensus winners: a values choice wearing a math costume.

So treat the whole scorecard as a menu of tradeoffs, not a ranking. Every "no" on it is the price of some "yes" elsewhere.

## What the record says

Theory tells you what can go wrong. Only adoption tells you what does. So here is the American record, taken cautiously.

Remember how short it is. Most American history with ranked-choice voting, or RCV, comes from the past decade. Alaska's system has run since 2022. Approval voting's record is two cities, and one of those has since been shut down by its state legislature.

> The American record on these alternatives is real, but short.

Start with turnout. Studies of American cities with RCV find effects on turnout that are small, and inconsistent in both directions. Maine and Alaska show no detectable decline after adoption. No serious analyst claims a large turnout effect either way. Be suspicious of anyone who does.

Next, ballot errors. Overvotes and spoiled ballots run modestly higher under RCV than under plurality. They are concentrated where the system is new, and where voter education is weak. Meanwhile, surveys in adopting cities consistently report large majorities describing the ballot as easy to use. The substantive cost to watch is exhausted ballots. They are real, and typically a single-digit share.

Then polarization. The strongest claims here are theoretical: a system that rewards second-choice support should advantage coalition-builders. The cases are few. Alaska in 2022 is suggestive. So is Alaska in 2024, when the same rules elected a Republican to the same seat. That is too few cases, over too little time, for confident claims about cause.

Then cost. RCV costs more, for central tabulation and for education campaigns. Approval costs nearly nothing extra. Score and STAR sit between, untested at public scale.

And the political record is data too. Alaska adopted its system by 3,781 votes in 2020. It kept that system by 743 votes in 2024, and a third vote is coming in November 2026. Nevada's initiative passed in 2022, then died in its required second vote in 2024. Nineteen states have banned RCV outright. And North Dakota's ban, in 2025, erased Fargo's approval voting.

Electoral reform has itself polarized. That is evidence about feasibility, whatever you think of the merits.

## What to keep

Before we gather this up, a test of memory. A while ago, I graded the five systems on strategy. One of them, I said, collapses into approval voting when its voters turn strategic. Which one?

[long pause]

Score. The strategic ballot is top score or zero, with nothing in between.

Now let's gather it up. Five things to keep.

One. There is no flawless system. Arrow proved that no ranked voting system can satisfy all four of his conditions at once. He did not prove that all systems are equally flawed.

[beat]

Two. Every voting system is gameable. That is the Gibbard-Satterthwaite theorem. The useful questions are how often, and how easily.

[beat]

Three. Each system has a signature, the one property that most sharply sets it apart. Plurality has the simplest count of all, but tactical abandonment of favorites is routine. Under approval, checking your sincere favorite can never backfire on them. Under ranked-choice voting, later choices never hurt earlier ones, but the count cannot be summed precinct by precinct. Score collapses into approval when voters min-max. And in STAR, an automatic runoff makes honest middle scores rational.

[beat]

Four. Burlington was a center squeeze: the consensus candidate was eliminated first. That is a failure of the Condorcet criterion, and plurality fails it too.

[beat]

Five. The American record is real, but short. Small, inconsistent effects on turnout. Modestly more ballot errors. And too few cases for confident claims about polarization.

[pause]

Here is what this lecture has not settled. It has not told you which property is most important. It cannot, because that is not a technical question.

A voter who prizes auditability and simplicity can rationally favor plurality, or approval. A voter who prizes sincere ranking without spoilers can favor the instant runoff. A voter who prizes consensus winners can favor a Condorcet method, or STAR. Each of them is making a defensible values choice, not a math error.

So the takeaway is a discipline, in three steps. Name the properties you weight most. Then check which system optimizes them. Then check whether real-world evidence supports the predicted behavior.

> Name the properties. Check the system. Check the evidence.

Where does the argument go from here? This library holds a book on ranked-choice voting and a book on score voting. If one of them pulls you toward its camp, good. The next move is to take up the other book with the same charity, and the academic literature with the same skepticism. The Mirror feature is built for exactly this.

And go back, one last time, to 1948. A young economist went looking for a rule with no flaws. [beat] He came back with a proof that there is none. What is left is a choice among imperfect systems. And now you can name what each one costs.
