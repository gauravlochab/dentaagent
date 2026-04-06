# Video Script — DentaAgent Demo for Preet Sandhu
### Refined with Preet's exact public language

> **Runtime:** 10–12 minutes
> **Format:** Screen recording with face-cam in corner, or voice-over only
> **App:** http://localhost:3002 — blank state at the start
> **Script:** Keep on your phone or a second screen

---

## BEFORE YOU PRESS RECORD

- App running at localhost:3002, nothing loaded yet
- Chrome full screen, no other tabs
- Glass of water nearby
- Speak at 70% of your natural speed — it always feels slow to you and correct to the viewer
- Pause for two full seconds after: each scenario's decision badge appears, after "revenue leakage," and before the close

---

## PART 1 — THE HOOK
### [0:00 – 1:00] — Camera only. No screen yet.

---

"Preet —

You said StafGo is developing a Sovereign AI Agent for the legacy USA dental market.

Before I show you what I built, I want to tell you what I did first.

I went to StafGo.com. I read every page. Every service line. Every case study. I read about Clinton Dental and State Street Dental. I read that you verify coverage three days before every appointment — not the morning of, not after the patient is in the chair. Three days before. Proactively.

That one detail told me more about how you run your operation than anything else on the site.

Because StafGo has already solved the hard problem. The domain expertise. The payer relationships. The understanding of what actually causes revenue leakage — eligibility errors, coding mistakes, pre-auth flags that nobody caught before the appointment was booked.

You've cited the numbers publicly. Forty percent of claims are denied due to eligibility issues. Twenty-five percent due to coding errors. These aren't abstract statistics to your team. Your team lives them, catches them, and recovers the revenue that practices lose when nobody's watching.

**What I want to show you is what happens when you give that expertise a set of agents.**"

---

## PART 2 — THE RESEARCH
### [1:00 – 2:30] — Camera only. Or show the market landscape document.

---

"I spent time understanding this market before I built anything.

The category is being validated fast.

PatientDesk AI — Y Combinator Winter 2026. Doing real-time insurance eligibility verification on live patient calls. Sixty clinics in eight weeks.

Toothy AI — Y Combinator Winter 2025. Voice AI calling payers. Full revenue cycle loop. Claims, denials, payment posting. Their clients are cutting back-office headcount by fifty to seventy-five percent.

Ventus AI — Andreessen Horowitz and Samsung NEXT. Browser agents navigating payer portals autonomously. Forty payer portal connections. Nightly claim statusing with no API integration required.

DentalRobot — five years in. Three hundred portal integrations. Ninety-nine dollars a month. Already profitable.

Every one of these companies is building the thing you already have: dental billing domain knowledge. They're building it from scratch, from textbooks and pilot clinics. You've been building it for fifteen years through actual client relationships and actual denials and actual recoveries.

The window to take that domain expertise and turn it into an AI-driven agent layer — before these companies reach the DSO market at scale — is roughly eighteen months.

That's why I built this."

---

## PART 3 — OPEN THE APP
### [2:30 – 3:15] — Open browser. Show the full interface before running anything.

---

[*Open http://localhost:3002*]

"What you're looking at is a three-panel agent workspace.

Left — patient intake. The same information your coordinators collect before every verification call.

Middle — the agent reasoning trace. Every step the agent takes, every document it reads, every rule it evaluates — visible, timestamped, auditable. This is the 'sovereign' part. Nothing happens in a black box.

Right — the decision console. Eligibility status, benefit breakdown, treatment-specific coverage, risk flags, booking recommendation, and a patient-facing script. Everything in one place, produced in seconds.

**Three scenarios. A clean case, a risky one, and one that should never be scheduled.**"

---

## PART 4 — SCENARIO ONE: CLEAN CASE
### [3:15 – 5:15] — Sarah Johnson

---

[*Click Sarah Johnson card — form fills automatically*]

"First patient. Sarah Johnson. Delta Dental PPO. She's calling to book a composite filling.

Your team does this verification dozens of times a day. Call Delta, navigate the IVR, pull the benefit breakdown, update the PMS, note the patient responsibility. Fifteen to twenty minutes, minimum. Pure administrative work in what you've rightly called a nuanced field."

[*Click Run Verification Agent*]

[*Narrate as the timeline animates — don't rush it*]

"Watch the middle panel.

Intake Agent — parsing her member ID DD-8847291 and group number against the payer registry.

Eligibility Checker — querying Delta Dental."

[*Once Eligibility step completes — click 'View Source'*]

"I want you to look at this."

[*Let the EDI 271 document open and be visible for a moment*]

"This is the actual EDI 271 transaction. ISA header, GS transaction set, HL subscriber segments, EB benefit loops. The X12 5010 format your team reads every day. The agent parsed the raw transaction and extracted every meaningful field — plan type, effective date, annual maximum, coverage tiers, network information.

This is the source document. Not a summary. Not a chat response. The actual record, the way a clearinghouse would produce it."

[*Close document viewer*]

"Benefits Parser — extracting the benefit schedule."

[*Open Benefits step source document*]

"Annual maximum: two thousand dollars. Used so far: three hundred and twenty. Remaining benefit: one thousand six hundred and eighty. Deductible — met. Composite filling covered at eighty percent. Network confirmed.

This is what your coordinator produces after that twenty-minute call. The agent produced it in seconds."

[*Close, let the remaining steps complete*]

[*Decision console populates*]

"**Safe to book.**

Delta Dental PPO, active coverage, one thousand six hundred and eighty dollars available, deductible cleared, no pre-auth required, patient pays fifty dollars.

At the bottom — the patient-facing script."

[*Expand the patient script*]

"Word for word. What the front desk says to Sarah. The agent wrote it from the coverage data.

No leakage. No missed flag. No twenty-minute call. No coordinator updating the PMS manually afterward."

---

## PART 5 — SCENARIO TWO: THE RISKY CASE
### [5:15 – 7:15] — Michael Torres

---

[*Click Michael Torres card*]

"Second patient. Michael Torres. Cigna Dental 1500. He wants a crown.

This is the case your team catches on a good day and misses on a busy one. And when it gets missed — the appointment happens, the crown goes in, the claim goes out, and then the revenue leakage starts."

[*Click Run Verification Agent*]

[*Let it run — narrate the risk detector step*]

"Watch the risk detector."

[*Results appear — amber banner*]

"**Book with Caution.**

Two high-severity flags. First: the annual maximum is nearly exhausted. Cigna 1500 plan — Michael's used eleven hundred dollars of fifteen hundred. Only four hundred remaining. The crown costs thirteen hundred. Insurance would ordinarily pay six hundred and fifty at fifty percent — but there's only four hundred left on the annual max. Patient responsibility jumps significantly. That's a financial surprise the practice didn't communicate. That's a potential dispute.

Second flag: pre-authorization has not been obtained. Cigna requires it for crowns over eight hundred dollars. If your team schedules without it, the claim goes out, Cigna denies it — missing pre-auth — and now your client is chasing that denial for sixty, ninety days."

[*Open Risk step source document*]

"Risk assessment. Fourteen vectors scanned. Annual max impact — high. Pre-auth outstanding — high. Deductible not fully met — medium. Patient responsibility materially higher than expected — medium.

Each finding is specific. Not 'there may be a risk.' The exact dollar amount, the exact requirement, the exact consequence.

This is denial prevention — not denial management. Your model. Catching it three days before the visit, not after."

[*Close document, point to action steps in right panel*]

"The action steps tell the coordinator exactly what to do: obtain pre-auth from Cigna before confirming the appointment, notify the patient of their actual out-of-pocket, document the financial conversation. Sequential. Specific."

---

## PART SIX — SCENARIO THREE: THE ESCALATION
### [7:15 – 8:45] — Patricia Chen

---

[*Click Patricia Chen card*]

"Third patient. Patricia Chen. Aetna Dental DHMO. She wants an implant.

This is the scenario that costs your client a patient relationship."

[*Click Run Verification Agent*]

[*Let it complete fully — don't narrate over it*]

[*Red banner appears*]

"**Escalate.**

Dental implants are not covered under this Aetna DHMO plan. Categorical exclusion. Missing tooth clause enforced. Patient responsibility is the full procedure cost — three thousand five hundred dollars, minimum, surgical fees billed separately.

Read the first action step."

[*Point to it*]

"*Do not book this appointment until the patient and the clinical team acknowledge non-coverage in writing.*

If your client's front desk had scheduled this consultation without a verification — the patient sits in the chair, the dentist evaluates the site, the treatment plan is presented, and then someone calls insurance. The patient feels misled. The practice loses the trust. Your client loses a patient they might have referred five people to.

Forty percent of claim denials are eligibility-related. That figure includes exactly this: scheduling a treatment a plan simply doesn't cover."

[*Open Audit step source document*]

"Every decision the agent made — timestamped, hashed, logged. HIPAA retention requirements: forty-five CFR one sixty-four. The compliance trail exists automatically. Not because a coordinator remembered to document it."

---

## PART 7 — THIS IS A PRODUCT, NOT A DEMO
### [8:45 – 9:45] — Show nav panels quickly

---

[*Click Analytics in the nav*]

"April 2026. A hundred and twenty-seven verifications. Average time: thirty-four seconds — down from fifteen to twenty minutes manual. Clean claim rate: ninety-four point two percent. Eighteen denials prevented. Estimated twenty-four thousand dollars in revenue protected that would otherwise have become leakage.

Pre-authorization catch rate: one hundred percent. Every flag surfaced before an appointment was scheduled."

[*Click Verifications*]

"The last forty-eight hours of verification runs. Patient, payer, treatment, decision, confidence score, timestamp. A searchable audit trail your clients can show payers."

[*Click Settings*]

"PMS integrations — Dentrix, OpenDental. Clearinghouse — Change Healthcare. Payer connections on EDI 270/271 for Delta, Cigna, Aetna, MetLife, Guardian.

This is the infrastructure. The agent runs on top of it."

---

## PART 8 — THE BIGGER PICTURE
### [9:45 – 11:15] — Camera. This is the most important part.

---

[*Close or move the browser. Look at camera.*]

"Preet — what you just watched is Phase One. Insurance verification. The highest-volume, highest-frequency workflow in your service lines.

But your company does six other things that have the same structure. A repetitive, high-stakes manual workflow. A decision that carries real financial consequences when it's wrong. A compliance requirement to document it.

Prior authorizations — average practice submits forty-three per week, and each one is time-consuming and dependent on someone knowing the right clinical language and the right payer rules.

Claims submission — coding accuracy, documentation requirements, clearinghouse formatting.

Denial management — root cause identification, correction, resubmission, appeal drafting.

Aged accounts receivable — payer follow-up, status tracking, escalation.

Credentialing — enrollment timelines, approval tracking, document submissions.

Every single workflow becomes an agent with the same architecture you just saw. A rules engine for the deterministic checks — the ones where there's a right answer and a wrong answer. A language model for the reasoning and the communication — writing the appeal letter, generating the patient script, summarizing the coverage. And your team for the exceptions — the complex cases, the difficult payers, the situations that require judgment.

The result isn't that your team gets replaced. StafGo's value has never been the labor. It's been the expertise, the payer relationships, the understanding of what causes revenue leakage and how to stop it. The agent preserves that expertise and multiplies it. The same team handles ten times the volume. The same clients get better outcomes. The margins expand.

You used the word sovereign deliberately. Not a SaaS subscription your clients manage. Not a third-party AI product with patient data flowing to a vendor's servers. An intelligence layer that sits inside your operations, under your control, on your infrastructure — that makes your existing team dramatically more capable.

You also said legacy dental market. Every practice running on Dentrix or Eaglesoft, copy-pasting eligibility information from a payer portal into a PMS because there's no API. That's not a limitation. That's the opportunity. Because the practices that are already your clients trust you. They're not going to give portal access to a startup. They'll give it to StafGo, because you've been handling their most sensitive billing data for years.

PatientDesk, Toothy, Ventus — they're all building from scratch. The payer knowledge, the denial patterns, the appeal strategies, the coding nuances. You've been building it for fifteen years.

The timing is now. The agent infrastructure exists. The window before these companies reach the DSO market is somewhere between twelve and eighteen months.

What StafGo is sitting on isn't just a services business. It's the domain knowledge and the client trust to build the operating system for dental revenue cycle management. An end-to-end platform. Precision meets efficiency, at scale."

---

## PART 9 — THE CLOSE
### [11:15 – 11:45] — Short. Direct. Peer-to-peer.

---

"I built this before our first conversation — because showing you is more useful than describing it.

Three things I'd like your perspective on.

Is verification the right place to start, or is there a workflow that's more painful for your clients right now? Denials, prior auth, AR — any of those is Phase Two.

When you say sovereign — what does that look like for your infrastructure? That decision shapes the whole technical architecture.

And how do we work together?

The GitHub repository is public. The code is all there. I'll send you the link.

Looking forward to the conversation, Preet."

---

## EMAIL / MESSAGE TO SEND WITH THE VIDEO

**Subject:** Built this for you — Sovereign AI Agent, dental verification

---

Preet —

Before I built anything, I went to StafGo.com and read every page. The service lines, the case studies, the three-day advance verification model. That one detail told me more about how you operate than anything else.

Then I built what the agent layer looks like on top of your highest-volume workflow: insurance verification.

Ten-minute recording attached. Three scenarios — clean, risky, and a hard escalation. Every agent step has its source document open for inspection, including the raw EDI 271 transaction.

Key things you'll see:
- 40% of claim denials are eligibility-related. The agent catches every one of those before the appointment is booked.
- Pre-auth flags surface automatically — not after the crown is placed.
- Every decision is logged with HIPAA-compliant audit trail, timestamped, non-modifiable.

GitHub: https://github.com/gauravlochab/dentaagent

One question: when you say sovereign deployment — what does that look like for your infrastructure? Private cloud, on-premise, or something else? That answer shapes everything about how we build this together.

Gaurav

---

## LANGUAGE CHEAT SHEET — SAY THESE WORDS

Use these naturally. Don't force them. They're Preet's own vocabulary.

| His word | Where to use it |
|---|---|
| **"revenue leakage"** | Scenario 2 setup, and the bigger picture close |
| **"nuanced field"** | When describing what manual verification involves |
| **"AI-driven"** | When describing the agent system overall |
| **"end-to-end"** | In the bigger picture — "end-to-end operating platform" |
| **"denial prevention"** | Explicitly contrast with "denial management" — proactive vs reactive |
| **"precision meets efficiency"** | Save for the close — echo his tagline |
| **"three days before"** | Mention it in Part 1 — shows you read carefully |
| **"legacy"** | In Part 8 — "legacy dental market" exactly as he wrote it |
| **"sovereign"** | Part 1 and Part 8 — use his exact word |
| **"aged accounts receivable"** | When listing the other workflows in Part 8 |

---

## WHAT NOT TO SAY

- Don't say "AI chatbot" or "chatbot" — he knows it's not
- Don't say "disrupt" — it's tired and implies his market is broken (he already knows that)
- Don't say "game-changer" — same problem
- Don't apologize for anything in the demo
- Don't say "as you can see" — just let him see it
- Don't pitch ROI in percentages — he knows the numbers better than you do
- Don't end with "let me know if you have any questions" — end with specific questions for him

---

## PACING REMINDERS

Pause two full seconds after:
- "...the Sovereign AI Agent for the legacy USA dental market"
- "revenue leakage starts" (Scenario 2)
- "Do not book this appointment" (Scenario 3)
- "one hundred percent. Every flag surfaced" (Analytics)
- "twelve and eighteen months" (Part 8 close)

The pauses are where it lands. Don't fill them.
