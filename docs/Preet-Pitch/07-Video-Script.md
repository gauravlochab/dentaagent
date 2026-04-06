# Video Script — DentaAgent Demo for Preet Sandhu

> **Runtime target:** 10–12 minutes
> **Setup:** Screen recording with webcam in corner (or voice-over only)
> **What's open:** http://localhost:3002 in full screen, Chrome
> **Keep handy:** This script on your phone

---

## BEFORE YOU HIT RECORD

- App running at http://localhost:3002
- Load nothing yet — start from blank state
- Browser full screen, no tabs visible
- Camera on if you're comfortable — face-to-camera builds trust
- Speak slowly. Pause after key statements. Let silence work.

---

## PART 1 — THE HOOK
### [0:00 – 0:45] — Don't open the app yet. Just speak to camera or black screen.

---

"Preet — you wrote something recently that I've been thinking about.

You said StafGo is developing a **Sovereign AI Agent for the legacy USA dental market.**

Three words stood out: *sovereign*, *agent*, and *legacy*.

You weren't talking about a chatbot. You weren't talking about a dashboard. You were talking about software that actually **does the work** — privately, on your terms, inside a market that's still running on systems built 20 years ago.

So before I built anything, I went to StafGo.com. I read every page. I looked at every service line. And I realised something.

StafGo is already doing what the AI agent needs to do. Your team does it manually, at high quality, every day. Insurance verification. Prior auth. Billing. Denials. Credentialing.

**What I want to show you is what happens when you put an agent layer on top of exactly what your team already does.**"

---

## PART 2 — THE RESEARCH
### [0:45 – 2:15] — Still no screen. Or switch to a slide/doc if you want.

---

"Before I wrote a line of code, I spent time understanding the problem at the level your team lives it.

I looked at what's happening in the market right now.

PatientDesk AI just closed a pre-seed backed by Y Combinator — Winter 2026. They're doing real-time insurance verification on live patient calls. Sixty clinics in eight weeks.

Toothy AI — Y Combinator Winter 2025. Voice AI calling payers to run the full revenue cycle loop. Claims, denials, payment posting. They're claiming customers cut their back-office teams by fifty to seventy-five percent.

Ventus AI — backed by Andreessen Horowitz and Samsung. Browser agents that navigate payer portals, handle MFA and CAPTCHAs, run nightly claim statusing across forty payer portals without any API integration.

DentalRobot — five years in, three hundred payer portal connections, ninety-nine dollars a month. Already profitable.

**Every single one of these companies is attacking your service lines. And every single one of them is building dental domain knowledge from scratch.**

That's the difference. You have fifteen years of it. The payer relationships. The denial patterns. The SOPs. The understanding of what actually goes wrong between the patient booking and the claim getting paid.

They're building from a textbook. You've lived the material.

What you need is the agent layer. That's what I built."

---

## PART 3 — THE DEMO SETUP
### [2:15 – 3:00] — Open the browser. Show the full app before running anything.

---

[*Open http://localhost:3002 — show the full 3-panel layout, nothing running yet*]

"What you're looking at is a three-panel agent workspace.

Left panel — patient intake. This is where a front-desk coordinator or your billing team enters the patient and insurance details before an appointment.

Middle panel — the agent reasoning trace. Every decision the agent makes, every document it reads, every rule it checks — all of it visible and auditable in real time.

Right panel — the decision console. Eligibility, benefit breakdown, treatment-specific coverage, risk flags, and a booking recommendation. Everything the front desk needs to act, in one place.

**Three scenarios. I want to show you how the agent handles a clean case, a risky case, and a case that should never be booked.**"

---

## PART 4 — SCENARIO 1: THE CLEAN CASE
### [3:00 – 5:00] — Load Sarah Johnson

---

[*Click the Sarah Johnson card in the left panel — form fills*]

"First patient. Sarah Johnson. Delta Dental PPO. She's calling to book a composite filling.

This is the most common verification your team runs. Straightforward, but still fifteen to twenty minutes of manual work per patient — calling Delta, navigating the IVR, pulling the benefit breakdown, updating the PMS."

[*Click Run Verification Agent*]

[*While steps animate — narrate each one*]

"Watch the middle panel.

The Intake Agent is parsing her member ID and group number against the payer registry.

The Eligibility Checker is querying Delta Dental — and this is where I want you to pause —"

[*Click 'View Source' on the Eligibility step once it completes*]

"— this is the actual EDI 271 transaction. This is the X12 format your team reads every day. ISA header, GS transaction set, HL subscriber segments, EB benefit loops. The agent parsed this and extracted every meaningful field.

Not a summary. The source document."

[*Close the document viewer*]

"Benefits Parser now — pulling annual max, deductible, coverage tiers."

[*Click 'View Source' on Benefits step*]

"You can see the annual maximum, what's been used, what's remaining, the full coverage schedule — preventive at a hundred percent, basic at eighty, major at fifty — and the network information. All extracted from the 271 transaction, not typed by a coordinator.

This is what your team produces manually after that twenty-minute call."

[*Close, let it finish*]

[*Results appear in right panel*]

"Delta Dental PPO. Active coverage. Deductible met. One thousand six hundred and eighty dollars remaining on the annual max. Composite filling covered at eighty percent. Patient responsibility — fifty dollars.

**Safe to book.**

Green banner. Zero high-risk flags. Action steps. And at the bottom — a patient-facing script. Word for word, what the front desk says to Sarah on the call."

[*Click to expand patient script*]

"This is not AI doing something new. This is your team's workflow, running in thirty seconds instead of twenty minutes, with every source document attached."

---

## PART 5 — SCENARIO 2: THE RISKY CASE
### [5:00 – 7:00] — Load Michael Torres

---

[*Click Michael Torres card*]

"Second patient. Michael Torres. Cigna. He wants a crown.

This is the case your team catches on a good day — and misses on a busy one."

[*Click Run Verification Agent*]

[*Narrate as it runs*]

"Cigna 1500 plan. Let the risk detector run."

[*Results appear*]

"**Book with Caution.** Amber.

Two high-severity flags: annual maximum nearly exhausted — only four hundred dollars remaining out of fifteen hundred — and pre-authorization has not been obtained. The crown costs thirteen hundred. Insurance would pay about six hundred and fifty under normal circumstances. But there's only four hundred left on the annual max. Patient responsibility is closer to nine hundred dollars.

If your team had booked this without catching it — the appointment happens, the crown goes in, the claim goes out, Cigna processes it and hits the annual max cap, and the patient gets a bill for nine hundred dollars they weren't expecting. That's a complaint. That's a potential chargeback. That's a damaged relationship between the practice and the patient.

The agent caught it before the appointment was scheduled."

[*Click View Source on Risk step*]

"Risk assessment. Fourteen vectors scanned. Two high, two medium. Pre-auth required, annual max impact, deductible outstanding. Each one with a specific finding.

This is the documentation your team would have to produce manually — if they caught the issue at all."

[*Close, point to action steps*]

"The action steps tell the coordinator exactly what to do before confirming: obtain pre-auth from Cigna, notify the patient of the higher out-of-pocket, document the conversation. This isn't a decision. It's a checklist."

---

## PART 6 — SCENARIO 3: THE ESCALATION
### [7:00 – 8:30] — Load Patricia Chen

---

[*Click Patricia Chen card*]

"Third patient. Patricia Chen. Aetna DHMO. She wants a dental implant.

I'll let the agent run."

[*Click Run Verification Agent — let it complete*]

"**Escalate.**

Red. Implants are not covered under this Aetna DHMO plan. Full stop. Missing tooth clause applies. Patient's out-of-pocket is the entire procedure — three thousand five hundred dollars minimum, plus surgical fees billed separately.

The first action step:"

[*Point to it*]

"*Do not book this appointment until the patient and the clinical team acknowledge non-coverage in writing.*

If your team had booked this consultation without catching it — the patient sits in the chair, the dentist evaluates the implant site, the treatment plan is presented, and then someone at the front desk calls insurance and finds out it's not covered. The patient feels misled. The practice loses the trust. Your client loses a patient.

The agent caught it before the phone call ended.

Look at the audit record —"

[*Click View Source on Audit step*]

"Every decision, timestamped, hashed, logged. HIPAA retention requirements cited. Forty-five CFR one-sixty-four. This is the compliance trail your clients need to show payers and regulators. It exists automatically, not because someone remembered to document it."

---

## PART 7 — THE SYSTEM BEHIND THE DEMO
### [8:30 – 9:30] — Show the nav panels

---

"Before I talk about what this becomes — let me show you that this isn't a demo wrapper. It's a working product.

[*Click Analytics in the nav*]

"April 2026. A hundred and twenty-seven verifications this month. Average time per verification — thirty-four seconds. Clean claim rate — ninety-four point two percent. Eighteen denials prevented this month, roughly twenty-four thousand dollars in protected revenue. Pre-authorization catch rate — a hundred percent.

These are the numbers your clients want to see in a QBR.

[*Click Verifications*]

Ten verifications from today and yesterday. Patient, payer, treatment, decision, confidence, timestamp. A full audit trail of every agent run. Searchable. Exportable.

[*Click Settings*]

PMS integrations — Dentrix and OpenDental are connected. Clearinghouse is Change Healthcare. Payer connections for Delta, Cigna, Aetna, MetLife, Guardian. All on EDI 270/271.

This is the infrastructure layer. The agent runs on top of it."

---

## PART 8 — THE BIGGER PICTURE
### [9:30 – 11:00] — Face to camera or voice-over

---

[*Close the browser or move to side*]

"Preet — what you're looking at is Phase One. Insurance verification.

Your company does six other things that have the same structure: a high-volume, repetitive manual workflow with a specific decision at the end, meaningful financial consequences if that decision is wrong, and a compliance requirement to document it.

Prior authorizations. Claims submission. Denial management. A/R follow-up. Credentialing. Patient billing.

Every single one of them becomes an agent workflow with the same architecture you just saw — a rules engine handling the deterministic checks, a language model handling the reasoning and the communication, and your team handling the exceptions.

The result isn't that your team gets replaced. The result is that the same team handles ten times the volume. One coordinator who today processes fifty verifications a day handles five hundred. The exceptions — the complex cases, the difficult payers, the appeals that need clinical judgment — those still get human attention. Everything routine, everything predictable, runs automatically.

That's what *sovereign* means in practice. Not a SaaS product your clients subscribe to. Not a black box sending patient data to a third-party server. An intelligence layer that sits inside your operations, on your infrastructure, under your control — that makes your existing team dramatically more productive.

The market is moving fast. PatientDesk and Toothy are in their third and fourth cohort of clients right now. Ventus has a16z money. They're all building the domain expertise that you already have.

The window to build this is in the next eighteen months, before the well-funded startups reach the DSO market at scale.

You described it exactly right. A Sovereign AI Agent for the legacy USA dental market. Not a chatbot. Not a feature. An operating layer.

That's what this is."

---

## PART 9 — THE CLOSE
### [11:00 – 11:30] — Direct, short, no pitch energy

---

"I built this before our first conversation — because the best way to show you what I mean is to show you the thing itself.

Three questions I'd love your perspective on:

Is the verification workflow the right place to start, or is there a different workflow that's more painful for your clients right now?

When you say sovereign deployment — what does that look like for your infrastructure? Private cloud, on-premise, or something else?

And how do we work together?

The GitHub repo is public. The code is there. I'll send you the link.

Looking forward to the conversation."

---

## RECORDING TIPS

**Pacing:**
- Speak at 70% of your normal speed. It always feels slow to you and right to the viewer.
- Pause for 2 full seconds after: "Sovereign AI Agent", after each scenario's decision badge appears, and before "The window is eighteen months."

**What to have ready:**
- App loaded at localhost:3002, blank state
- This script on your phone or second monitor
- A glass of water

**What NOT to do:**
- Don't say "as you can see" or "basically" or "right?"
- Don't apologize for anything in the demo
- Don't speed through the document viewer — that's the most impressive part
- Don't look at the screen when making the big statements — look at camera

**Opening line alternative** (if the Preet quote feels too forward):
> "I want to show you something I built specifically for your market. Give me ten minutes."

---

## SEND MESSAGE TEMPLATE

Subject line: **Built this for you — Sovereign AI Agent, dental verification**

---

Preet —

I went to StafGo.com before I wrote a line of code. Read every service line. Understood the workflows.

Then I built what the agent layer looks like on top of the highest-volume one: insurance verification.

Ten-minute screen recording attached. Three real scenarios — a clean case, a risky one, and a hard escalation. Every agent step has the source document behind it, including the actual EDI 271 transaction.

GitHub: https://github.com/gauravlochab/dentaagent

One question worth discussing: you described it as a Sovereign AI Agent for the legacy dental market. I want to understand what sovereign means for your infrastructure — because that shapes everything about how we build this together.

Happy to jump on a call whenever works.

---

Gaurav
