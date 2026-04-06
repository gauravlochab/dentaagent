# Smart Questions to Ask Preet

> These questions do two things: they show you understand his business deeply,
> and they give you the information you need to scope the real engagement.

---

## Opening Questions (First 5 Minutes)

**1. "When you say Sovereign AI Agent — what does sovereign mean to you specifically? Is it about data privacy, control over the model, or something else?"**

Why: This tells you whether he wants private/on-prem LLM, a HIPAA BAA with a managed API, or just ownership of the data pipeline. Three very different engineering decisions.

**2. "Which workflow are you most frustrated with right now — the one where you feel the gap between how it's done today and how it should be done is biggest?"**

Why: His answer tells you Phase 2. Insurance verification is Phase 1 (what we built). The next highest-friction workflow is what we build next.

**3. "When you think about the agent, is it a product you sell to your clients, or is it internal infrastructure that makes your team more efficient, or both?"**

Why: This is a fundamental product strategy question. B2B SaaS sold to dental practices vs. internal ops tool are completely different GTM motions. His answer shapes everything.

---

## Questions About Their Current Operations

**4. "How many insurance verifications does your team process per day right now — roughly?"**

Why: This gives you the volume number for the ROI calculation. 50 verifications/day × 15 minutes = 12.5 hours. Agents reduce that to under an hour. That's a concrete number you can put in front of clients.

**5. "What PMS systems do your clients run? Dentrix, Eaglesoft, OpenDental — what's the breakdown?"**

Why: The PMS integration is the hardest part. Knowing the mix tells you where to start. OpenDental has a public API. Dentrix and Eaglesoft require browser automation or their SDK. This scopes Phase 1 integration work.

**6. "When a verification goes wrong — wrong benefit information, missed exclusion, uncaught pre-auth requirement — how does that typically surface? Is it at the claim stage, or earlier?"**

Why: This tells you where the pain is felt most acutely and helps you frame the ROI story around avoided claim denials rather than staff time saved.

**7. "How many payers does your team interact with regularly? Is it the big nationals — Delta, Cigna, Aetna, MetLife — or a lot of regional plans too?"**

Why: The demo covers 7 major payers. Production coverage of regional plans is a scoping question. DentalRobot covers 300+ portals. Understanding their payer mix tells you how deep the integration needs to go.

---

## Questions About What He Has Already Built or Started

**8. "You mentioned developing this — has any engineering work started? Is there a prototype, a vendor conversation, or is this still in the idea stage?"**

Why: You need to know where you're entering. If they have a partial build, you're augmenting. If it's greenfield, you're leading.

**9. "Do you have SOPs documented for your core workflows — verification, billing, denials? Written guides or screen recordings your team follows?"**

Why: Documented SOPs are directly convertible to agent step definitions. DentalRobot literally does this — they convert screen recordings into agent workflows. If StafGo has SOPs, you can turn them into agents fast.

**10. "Have you talked to any AI vendors already — DentalRobot, Ventus, PatientDesk, or others? What was your reaction?"**

Why: This tells you his objections to existing solutions and what gap he sees. If he's looked at Ventus and passed, you know what the bar is for "sovereign."

---

## Questions About the Client Side

**11. "Are your clients primarily solo practices, multi-location groups, or DSOs? Who is the decision-maker — the dentist, the office manager, or a corporate ops team?"**

Why: The product experience is completely different for a solo dentist vs. a DSO corporate ops director. Agent interfaces, approval workflows, reporting dashboards — all different.

**12. "When you imagine deploying this at a client — are they seeing the agent interface, or does it run invisibly in the background and they just see the output?"**

Why: Two valid product philosophies. Our demo shows the agent trace explicitly (good for trust-building). Some clients want the magic to be invisible. Understanding his preference shapes the UX.

---

## Questions to Close the Conversation

**13. "If we get Phase 1 production-ready — real payer integrations, real PMS write-back, running on your infrastructure — what does success look like at 90 days?"**

Why: This anchors the engagement to a specific outcome. It also tells you whether he's thinking about this as a pilot with one clinic, an internal ops upgrade, or a full product launch.

**14. "What would make you confident enough to put this in front of your best client?"**

Why: The answer tells you his trust bar. It might be a reliability metric (95% accuracy), a compliance requirement (SOC 2), or just a reference from someone he knows.

**15. "Is there someone on your team who should be in the next conversation — your ops manager, a billing specialist, a CTO if you have one?"**

Why: Getting the right people in the room for the technical conversation accelerates everything. Also signals you're serious about implementation, not just pitching.

---

## Questions NOT to Ask (Save for Later)

- Do not ask about budget or pricing in the first conversation
- Do not ask about equity or partnership structure until you've shown deep technical competence
- Do not ask "what do you think of the demo?" — let him tell you unprompted

---

## The Single Most Important Thing to Listen For

At some point in the conversation, Preet will describe a specific workflow problem — something like *"the thing that keeps my team up at night is when a patient comes in for a crown and we find out at the claim stage that the pre-auth was never obtained"* or *"we lose 20% of our collections on denials that should have been preventable."*

**That is the thing to build next.**

Write it down verbatim. Build it. Show it to him two weeks later.

That is how you get hired.
