# DentaAgent — Demo Walkthrough Guide

> Step-by-step script for the live demo with Preet
> URL: http://localhost:3002
> GitHub: https://github.com/gauravlochab/dentaagent

---

## Before You Start

- Open http://localhost:3002 in Chrome, full screen
- Have the terminal running: `cd ~/Downloads/dentaagent && npm run dev -- -p 3002`
- API key is already in `.env.local` — no setup needed
- Keep this guide open on a second screen or phone

---

## The One-Line Pitch Before You Show Anything

> "I built a working dental insurance verification agent that does what your ops team does manually — in 8 seconds, with full auditability and a human review layer. Let me show you three real scenarios."

Then open the app.

---

## The Interface — What Preet Will See

Three panels side by side, like a professional ops workspace:

**Left panel — Patient Intake**
Form where you enter patient + insurance details. Three demo patient buttons at the bottom (colour-coded Safe / Caution / Escalate).

**Middle panel — Agent Reasoning Trace**
A live timeline of 7 agent steps animating as the verification runs. Each step shows what the agent is doing, how long it took, and expandable evidence.

**Right panel — Decision Console**
The structured output: eligibility status, benefit breakdown, treatment coverage, risk flags, booking recommendation, patient-facing script, and reviewer actions.

---

## Scenario 1 — Simple Case (SAFE TO BOOK)

**Patient:** Sarah Johnson | Delta Dental PPO | Composite Filling

**What to say:**
> "Let's start with a simple one. A patient calls asking for a filling. The front desk needs to verify coverage before booking."

1. Click the **Sarah Johnson** card in the left panel (green "Safe" badge) — form auto-fills
2. Click **Run Verification Agent**
3. Watch the middle panel animate — point out each step as it runs:
   - *"Intake Agent is parsing the patient demographics"*
   - *"Eligibility Checker is querying the Delta Dental payer database"*
   - *"Benefits Parser is extracting the benefit breakdown"*
   - *"Coverage Analyzer is running 8 rule checks"*
   - *"Risk Detector is scanning for waiting periods and exclusions"*
   - *"Booking Advisor is computing the recommendation"*
   - *"Audit Logger is writing this to the compliance trail"*
4. Results appear in the right panel

**What to point out in the results:**
- Green **SAFE TO BOOK** banner — clear recommendation
- Annual max: $2,000, only $320 used, $1,680 remaining
- Deductible already met — no surprises
- Coverage: 80% — patient pays ~$50
- Three LOW risk flags only (frequency limit, in-network confirmation)
- Click **View evidence** on any step — shows exactly what data was used
- Scroll to **Patient-Facing Script** — click to expand
  > *"This is what the front desk reads to Sarah word for word. The agent wrote it."*
- Hit **Approve & Schedule** — confirmation state

**The point to make:**
> "This took 8 seconds. Your team spends 15-20 minutes per verification calling insurers and updating the PMS. This is one verification. Scale that to 50 a day."

---

## Scenario 2 — Risky Case (BOOK WITH CAUTION)

**Patient:** Michael Torres | Cigna Dental | Crown

**What to say:**
> "Now a harder case. Crown on Cigna. This is the kind of case where your team misses something and the claim gets denied."

1. Click the **Michael Torres** card (amber "Caution" badge) — form auto-fills
2. Click **Run Verification Agent**
3. Let it run — point out the Risk Detector step specifically
4. Results appear

**What to point out:**
- Amber **BOOK WITH CAUTION** banner
- Two HIGH risk flags:
  - *"Annual maximum benefit exhaustion imminent"* — only $400 remaining out of $1,500
  - *"Pre-authorization NOT yet obtained"* — must be secured before scheduling
- Two MEDIUM flags — deductible unmet ($25 remaining), patient responsibility significantly higher than usual
- The action steps are sequential and specific:
  > *"BEFORE CONFIRMING APPOINTMENT: Obtain pre-authorization from Cigna..."*
- Patient script is different — prepares the front desk for a harder conversation
- The reviewer can **Edit & Approve** — doesn't just approve blindly

**The point to make:**
> "Without this, the front desk books the appointment, the crown gets done, the claim gets submitted, Cigna denies it — missing pre-auth, or the annual max was already blown. You chase that denial for 90 days. This agent caught it before the appointment was booked."

---

## Scenario 3 — Escalation Case (ESCALATE)

**Patient:** Patricia Chen | Aetna Dental DHMO | Dental Implant

**What to say:**
> "The third case is what your team dreads. A patient wants an implant on an Aetna DHMO plan."

1. Click the **Patricia Chen** card (red "Escalate" badge) — form auto-fills
2. Click **Run Verification Agent**
3. Let it run

**What to point out:**
- Red **ESCALATE TO HUMAN** banner — prominent, urgent
- First action step: *"DO NOT book appointment until patient and clinical team acknowledge non-coverage status in writing"*
- TWO HIGH flags: Treatment Not Covered + Missing Tooth Clause
- Patient pays: $3,500 — full out-of-pocket
- The agent identified the missing tooth clause exclusion automatically
- Patient script handles the difficult conversation gracefully
- **Escalate to Senior** button — routes to human reviewer

**The point to make:**
> "This is the most valuable case. If your team books this without catching the exclusion, you've wasted a chair, the patient is angry, and you've damaged the practice's relationship with that clinic. The agent caught it in 8 seconds."

---

## After the Three Scenarios — What to Say

> "What you're looking at is Phase 1. Insurance verification. This is one workflow — the highest volume, most painful one in your service line.
>
> The same agent architecture extends to:
> - Phase 2: Claims submission and denial detection
> - Phase 3: Prior auth tracking and follow-up
> - Phase 4: A/R aging and collections follow-up
> - Phase 5: Full dental operations workspace
>
> Every workflow your team does manually today becomes an agent step with human review on the exceptions."

---

## The Architecture Slide (If Asked)

```
Dental PMS / EHR
(Dentrix, Eaglesoft, OpenDental)
        ↓
Agent Orchestration Layer
 ┌─────────────────────────────┐
 │  Intake Agent               │
 │  Eligibility Agent          │
 │  Benefits Parser Agent      │
 │  Coverage Rules Engine      │
 │  Risk Detection Agent       │
 │  Recommendation Agent       │
 │  Audit Logger               │
 └─────────────────────────────┘
        ↓
Private LLM (Claude / sovereign deployment)
+ Rules Engine (deterministic checks)
        ↓
Human Review Queue
(exceptions, edge cases, complex payers)
        ↓
Action: Book / Hold / Escalate
```

**Key message:** The LLM handles language and reasoning. The rules engine handles the deterministic stuff (is deductible met? is annual max exceeded?). Humans only see the cases that need them.

---

## What This Is NOT

Make sure to say this clearly:

> "This is not a chatbot. It's not a FAQ bot on your website. It's an operations agent — it takes actions, produces structured outputs, and routes exceptions to humans. That's exactly what 'Sovereign AI Agent' means — an intelligence layer that owns a workflow end-to-end."

---

## Handling Tough Questions

**"How does this integrate with our existing PMS systems?"**
> "The demo uses a mock payer database to show the intelligence layer cleanly. In production, the agent connects to Dentrix/Eaglesoft via their APIs or secure data sync — the same way DentalRobot and Ventus do it today. We build the connector for whichever PMS your clients use."

**"What about HIPAA?"**
> "The demo runs Claude Haiku via a secure API. In a sovereign deployment, the LLM runs on your own infrastructure — no patient data ever leaves your environment. That's what 'sovereign' means in practice."

**"Why should we build this instead of buying DentalRobot or Ventus?"**
> "Because neither of them has your 15 years of dental billing SOPs, your payer relationships, and your understanding of denial patterns. The agent is only as good as the domain knowledge behind it. You have that. They're building from scratch."

**"What's the cost to build this?"**
> Save this for a follow-up conversation. In the demo, focus on what's possible, not the price.
