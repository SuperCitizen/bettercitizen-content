---
schema: bettercitizen.lesson/v1
slug: how-it-works
kind: reading
title: How banking and the federal money system actually work
objectives:
  - Describe what a bank does (maturity transformation) and why that makes banks fragile
  - Explain how banks create money when they lend, and what actually constrains that creation today
  - Identify the structure and tools of the Federal Reserve and its dual mandate
  - Name the major federal bank regulators (Fed, OCC, FDIC, NCUA, CFPB, Treasury/FinCEN) and what each one does
concepts:
  - federal-reserve
  - monetary-policy
  - money-creation
  - deposit-insurance
  - bank-regulation
  - lender-of-last-resort
sources:
  - type: statute
    citation: 'Federal Reserve Act of 1913, ch. 6, 38 Stat. 251 (codified at 12 U.S.C. ch. 3).'
    url: https://www.federalreserve.gov/aboutthefed/fract.htm
  - type: website
    citation: 'Board of Governors of the Federal Reserve System, "The Fed Explained: What the Central Bank Does" (11th ed., 2021).'
    url: https://www.federalreserve.gov/aboutthefed/the-fed-explained.htm
  - type: statute
    citation: 'Federal Deposit Insurance Act, 12 U.S.C. § 1811 et seq.; deposit insurance limit set at $250,000 per depositor, per insured bank, per ownership category.'
    url: https://www.fdic.gov/resources/deposit-insurance/
  - type: paper
    citation: 'McLeay, M., Radia, A., & Thomas, R. (2014), "Money creation in the modern economy," Bank of England Quarterly Bulletin Q1.'
    url: https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy
  - type: website
    citation: 'Office of the Comptroller of the Currency, "About the OCC" — charters and supervises national banks and federal savings associations.'
    url: https://www.occ.treas.gov/about/index-about.html
  - type: website
    citation: 'Consumer Financial Protection Bureau, "The Bureau" — created by Title X of the Dodd-Frank Act.'
    url: https://www.consumerfinance.gov/about-us/the-bureau/
perspectives:
  - name: Financial-stability advocate
  - name: Market-discipline advocate
  - name: Monetary-reform advocate
duration_min: 13
---

# How banking and the federal money system actually work

Most political argument about banks confuses three different questions: *what a bank is and why it's fragile*, *who creates money and how it's controlled*, and *who watches the banks*. This lesson untangles the plumbing. The next two turn to the fights.

## What a bank actually does

A bank's core business is **maturity transformation**: it borrows short and lends long. Your checking deposit is money you can withdraw *today*; the 30-year mortgage the bank funded with it cannot be called back today. The bank earns the spread between what it pays depositors and what it charges borrowers.

This is genuinely useful — it channels savings into long-term investment — but it has a structural vulnerability baked in. If enough depositors ask for their money at once, no bank can satisfy them, because the money isn't sitting in a vault; it's lent out. That is a **bank run**, and the *fear* of one can cause one: if you think the bank might fail, withdrawing first is rational, which makes failure more likely. This self-fulfilling fragility is why banking is regulated differently from almost any other business. Two of the central tools of the federal system — **deposit insurance** and a **lender of last resort** — exist specifically to break the run dynamic. (Both are also at the heart of the regulation debate, because a backstop that calms depositors can also encourage banks to take more risk. Hold that thought for Lesson 2.)

## How money is actually created

The most-misunderstood part of the system. The popular picture — banks take in deposits, keep a fraction in reserve, and lend out the rest — is backwards in an important way.

In a modern economy, **commercial banks create money when they make loans.** When a bank approves your loan, it does not hand over someone else's deposit; it credits your account with a new deposit, created with a keystroke. That deposit is new money in circulation. When the loan is repaid, that money is destroyed. The Bank of England's 2014 study *Money creation in the modern economy* states it plainly: "Whenever a bank makes a loan, it simultaneously creates a matching deposit in the borrower's bank account, thereby creating new money."

So what stops banks from creating infinite money? Not, in practice, a reserve requirement. The Fed cut **reserve requirements to zero in March 2020**, and they remain there. The real constraints are:

- **Capital requirements** — banks must fund a minimum share of their assets with the owners' own money (equity), not borrowed money, so that losses fall on shareholders before depositors. This is the single most important prudential rule.
- **Liquidity requirements** — banks must hold enough cash-like assets to survive a stretch of heavy withdrawals.
- **Profitability and credit risk** — a bank that lends recklessly takes losses and fails.
- **Monetary policy** — by setting interest rates, the Fed changes the price of credit and therefore how much borrowing (and money creation) happens.

The point that matters for the rest of the pack: money is mostly created by *private* banks making loans, while the *Federal Reserve* sets the conditions under which they do it. Control over the money supply is shared between a public central bank and thousands of private institutions — which is exactly why both bank regulation *and* monetary policy are contested.

## The Federal Reserve

The [[term:federal-reserve]] is the United States' central bank, created by the Federal Reserve Act of 1913. It is deliberately a hybrid — part public, part private — and structured to be insulated from day-to-day political control.

**Structure:**
- **Board of Governors** — seven members in Washington, nominated by the President and confirmed by the Senate to staggered 14-year terms. The Chair serves a 4-year term (renewable).
- **Twelve regional Reserve Banks** — quasi-private institutions (Boston, New York, ... San Francisco) that carry out operations and supervise banks in their districts.
- **Federal Open Market Committee (FOMC)** — the body that sets monetary policy. Twelve voting members: the seven governors, the president of the New York Fed (permanent), and four of the remaining eleven regional presidents on a rotation.

**The dual mandate.** Congress directs the Fed to pursue **maximum employment** and **stable prices** (a third statutory goal, moderate long-term interest rates, is usually folded in). "Stable prices" has been operationalized since 2012 as a [[term:inflation-target]] of **2% per year**. When the two halves of the mandate conflict — say, inflation is high *and* unemployment is rising — the Fed must make a judgment call, and that judgment is inherently political even when made by unelected officials.

**The tools.** Since the 2008 crisis the Fed operates an "ample reserves" framework, so the classic textbook description (scarce reserves nudged by open-market operations) is outdated. Today the main levers are:
- **Interest on reserve balances (IORB)** — the rate the Fed pays banks on the money they park at the Fed. This is now the primary tool for steering short-term rates.
- **Overnight reverse repurchase agreements (ON RRP)** — a floor under money-market rates for non-banks.
- **Open market operations** — buying and selling Treasury securities, used both to set rates historically and, at large scale, for **quantitative easing/tightening** (expanding or shrinking the Fed's balance sheet).
- **The discount window** — direct lending to banks; the operational form of the **lender-of-last-resort** function.
- **Emergency lending (§13(3))** — broad-based facilities in "unusual and exigent circumstances," used in 2008, in March 2020, and in March 2023; constrained by Dodd-Frank to programs with broad eligibility (no more bailouts of a single named firm).

A crucial limit: the Fed sets *short-term* interest rates and influences financial conditions; it does **not** directly control inflation, employment, mortgage rates, or the money supply. It operates on them at a distance, with long and variable lags. Much of the public anger directed at "the Fed" assumes a level of control it does not have — and much of the case *for* Fed reform (Lesson 2) is precisely that discretionary control at a distance is the wrong model.

## Who watches the banks: the federal regulators

The U.S. has a famously fragmented, overlapping regulatory structure — a **dual banking system** in which a bank can be chartered by a state *or* by the federal government, with different supervisors attached to each path. The main federal players:

- **Federal Reserve** — supervises bank holding companies, state-chartered "member" banks, and the largest systemically important firms; runs the stress tests for big banks.
- **Office of the Comptroller of the Currency (OCC)** — a bureau of the Treasury that **charters and supervises national banks** and federal savings associations.
- **Federal Deposit Insurance Corporation (FDIC)** — insures deposits up to **$250,000 per depositor, per insured bank, per ownership category**; supervises state non-member banks; and, critically, **resolves failed banks** (it is the receiver that winds them down). The [[term:fdic]] was created by the Banking Act of 1933 to stop the bank runs of the Great Depression, and it is funded by premiums paid by the banks, not by taxpayers.
- **National Credit Union Administration (NCUA)** — the FDIC's counterpart for credit unions, which it both regulates and insures (through the NCUSIF).
- **Consumer Financial Protection Bureau (CFPB)** — created by the Dodd-Frank Act in 2010 to police consumer financial products (mortgages, credit cards, payday loans, debt collection). Its structure and funding have been the subject of repeated political and legal fights — covered in Lesson 3.
- **Treasury / FinCEN** — the Financial Crimes Enforcement Network enforces anti-money-laundering and Bank Secrecy Act rules; Treasury also chairs the **Financial Stability Oversight Council (FSOC)**, the inter-agency body Dodd-Frank created to spot systemic risk.

Two things follow from this map. First, **no single agency is "the bank regulator."** Responsibility is split by charter type, by institution size, and by function (safety-and-soundness vs. consumer protection vs. anti-money-laundering). Critics call this fragmentation a source of gaps and turf wars; defenders call it a check against any one regulator being captured or wrong. Second, the structure is the product of a century of crisis-and-response: the Fed after the Panic of 1907, the FDIC and Glass-Steagall after 1933, the CFPB and FSOC after 2008. Each layer was added to fix the *last* failure, which is part of why the system looks like an attic rather than a blueprint.

## What this lesson does NOT settle

This lesson is the plumbing: what a bank is, where money comes from, what the Fed does, and who regulates whom. It does not take a position on the live questions — *how much* banks should be regulated, *whether* deposit insurance and the lender of last resort do more good than harm, and *who* should control the money supply. Those are genuinely contested, and Lesson 2 builds the strongest version of each major camp before Lesson 3 turns to the policy fights actually on the table.
