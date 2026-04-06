# Video Script — DentaAgent for Preet Sandhu
### Performance edition — how to say it, not just what to say

---

## HOW TO USE THIS SCRIPT

**Do not read this on camera.** Use this document to rehearse until you own it, then record with only the Cue Card (Section 10) visible on your phone.

**Notation guide:**
- `//` = breath — actually inhale here
- `...` = hold silence — don't rush to fill it
- **bold** = stress this word
- *(direction)* = physical instruction
- `[slow]` = slow down noticeably
- `[fast]` = pick up pace, move through it
- `[warm]` = softer, more conversational energy
- `[direct]` = look straight at camera, confident

**The single most important rule:** Say less than you think you need to. The pauses are part of the communication.

---

## PART 1 — THE HOOK
### [0:00 – 1:00]
*(Camera only. No screen yet. Lean slightly forward. Direct eye contact.)*

---

*(Start with a genuine pause — don't rush into it)*

"Preet. //

You wrote something recently // that I've been thinking about.

[slow] You said StafGo is developing // **a Sovereign AI Agent** // for the legacy USA dental market.

..."

*(Let that land. Two full seconds. Don't explain it yet.)*

"Before I built anything — // I went to StafGo.com.

[warm] Read every page. // Every service line. // The case studies.

And I noticed something // that most people would scroll past.

You verify coverage **three days before** every appointment. // Not the morning of. // Not after the patient's in the chair. **Three days before.**

[direct] That one detail told me more about how you run this // than anything else on the site.

// Because what that means is — // you already **know** where the leakage happens.

You know that forty percent of claim denials are eligibility-related. // You know that twenty-five percent come from coding errors. // These aren't statistics to your team. Your team **lives** them. Catches them. Recovers the revenue // that practices lose when nobody's watching.

..."

*(Another pause. Then shift energy — this is the pivot.)*

"[direct] What I want to show you // is what happens when you give that expertise // **a set of agents.**"

---

## PART 2 — THE MARKET
### [1:00 – 2:30]
*(Still camera. Energy up slightly. This is information delivery, not storytelling.)*

---

"I spent time understanding // what's happening in this market right now.

[fast] PatientDesk AI — Y Combinator, Winter 2026. Real-time insurance verification on live patient calls. // Sixty clinics. Eight weeks.

Toothy AI — Y Combinator, Winter 2025. Voice AI calling payers. Full revenue cycle loop — claims, denials, payment posting. // Their clients are cutting back-office headcount // by fifty to seventy-five percent.

Ventus AI — Andreessen Horowitz. Samsung NEXT. Browser agents navigating payer portals. // Forty portal connections. Nightly claim statusing. No API required.

DentalRobot — five years in. // Three hundred portal integrations. // Ninety-nine dollars a month. Already profitable.

[slow] Every single one of these companies // is building the thing you already have. //

Dental billing domain knowledge.

// They're building it from scratch. From textbooks. From pilot clinics.

[warm] You've been building it for fifteen years // through actual client relationships // and actual denials // and actual recoveries.

..."

*(Pause. Then the key line — say it simply.)*

"[direct] The window to put an agent layer on that expertise — // before these companies reach the DSO market — // is about eighteen months.

That's why I built this."

---

## PART 3 — OPEN THE APP
### [2:30 – 3:15]
*(Switch to screen. Open localhost:3002. Don't start narrating immediately — let them look at it for a moment.)*

---

*(Open the app. Take three seconds. Look at it yourself, then speak.)*

"[warm] So — what you're looking at.

Three panels.

Left — patient intake. // The same information your coordinators collect // before every verification call.

Middle — the agent reasoning trace. // Every step the agent takes. Every document it reads. Every rule it checks. // Visible. Timestamped. Auditable.

[direct] That's the sovereign part. // Nothing happens in a black box.

Right — the decision console. // Eligibility status. // Benefit breakdown. // Risk flags. // Booking recommendation. // Patient script. // Everything in one place.

// Three scenarios.

A clean case. // A risky one. // And one that should **never** be scheduled."

---

## PART 4 — SARAH JOHNSON (SAFE TO BOOK)
### [3:15 – 5:15]
*(Load Sarah Johnson. Let the form auto-fill before speaking.)*

---

*(Click Sarah Johnson card. Wait for form to fill. Then:)*

"[warm] First patient. Sarah Johnson. // Delta Dental PPO. // She's calling to book a composite filling.

Your team runs this verification dozens of times a day. // Call Delta. Navigate the IVR. // Pull the benefit breakdown. // Update the PMS. Note the patient responsibility.

[slow] Fifteen to twenty minutes. // Minimum. // Every time."

*(Click Run Verification Agent. Then narrate as the steps animate — don't talk over them. Wait for each step to START before describing it.)*

"Watch the middle panel. //

Intake Agent — // parsing her member ID // against the payer registry.

Eligibility Checker — // querying Delta Dental."

*(Wait for Eligibility step to complete. Then:)*

"[direct] Hold on. // I want you to see something."

*(Click 'View Source' on Eligibility step. Let the document open. Give it two full seconds before speaking.)*

"This is the EDI 271 transaction. //

[warm] ISA header. GS transaction set. // HL subscriber segments. // EB benefit loops.

[direct] The X12 format // your team reads every day.

The agent parsed the raw transaction // and extracted every meaningful field. // Plan type. Effective date. Annual maximum. Coverage tiers. Network status.

// This isn't a summary. // This is the source document. // The way a clearinghouse produces it."

*(Close document viewer. Let Benefits Parser run.)*

"Benefits Parser now."

*(Open Benefits source document.)*

"Annual maximum — two thousand dollars. // Used — three-twenty. // Remaining — one thousand six-eighty. // Deductible // **met**. // Composite filling // covered at eighty percent.

[warm] This is what your coordinator produces // after that twenty-minute call. // The agent produced it // in the time we've been talking."

*(Close document. Let all steps complete. Results appear in right panel.)*

"[direct] Safe to book.

Delta Dental PPO. // Active coverage. // Sixteen-eighty remaining on the annual max. // Deductible cleared. // No pre-auth required. // Patient pays // fifty dollars.

And at the bottom —"

*(Click to expand patient script.)*

"The patient-facing script. // Word for word — // what the front desk says to Sarah on the call. // The agent wrote it // from the coverage data.

..."

*(Short pause.)*

"[slow] No leakage. // No missed flag. // No twenty-minute call."

---

## PART 5 — MICHAEL TORRES (CAUTION)
### [5:15 – 7:15]
*(Load Michael Torres.)*

---

*(Click card. Wait for form to fill.)*

"Second patient. Michael Torres. // Cigna Dental. // He wants a crown.

[warm] This is the case your team catches on a good day. // And misses // on a busy one.

And when it gets missed — // the appointment happens. The crown goes in. // The claim goes out. //

[slow] And then the revenue leakage starts."

*(Click Run Verification Agent. Wait for Risk Detector step.)*

*(Results appear. Let the amber banner sit for a moment before speaking.)*

"..."

*(Two full seconds of silence.)*

"[direct] Book with Caution.

Two high-severity flags.

First — // the annual maximum // is nearly exhausted. // Cigna fifteen hundred plan. // Michael's used eleven hundred. // Only **four hundred** remaining. // The crown costs thirteen hundred. // Insurance would ordinarily pay six-fifty at fifty percent — // but there's only four hundred left on the annual max. //

[slow] Patient responsibility // jumps significantly. //

That's a financial surprise // the practice never communicated. // That's a dispute. // That's a one-star review // that mentions the word 'billing.'"

*(Beat.)*

"Second flag — // pre-authorization // **has not been obtained.** // Cigna requires it for crowns over eight hundred. //

[direct] If your team schedules without it — // the claim goes out. // Cigna denies it. Missing pre-auth. // And now your client // is chasing that denial // for sixty, ninety days.

[warm] That's not a billing error. // That's a **preventable** denial."

*(Open Risk step source document.)*

"Risk assessment. // Fourteen vectors scanned. // Annual max impact — high. // Pre-auth outstanding — high. // Each finding is specific. Not 'there may be a risk.' // The **exact dollar amount.** // The **exact requirement.** // The **exact consequence.**

[direct] This is denial prevention. // Not denial management. // Your model. Catching it // before the appointment is scheduled."

*(Close document.)*

"The action steps tell the coordinator exactly what to do — // in sequence. // Before they confirm anything."

---

## PART 6 — PATRICIA CHEN (ESCALATE)
### [7:15 – 8:45]
*(Load Patricia Chen.)*

---

*(Click card. Wait for form.)*

"Third patient. Patricia Chen. // Aetna DHMO. // She wants an implant.

[slow] I'll let it run."

*(Click Run Verification Agent. Stay silent while it runs. Don't narrate. Let the silence build.)*

*(Red banner appears. Pause before speaking. Look at it first.)*

"..."

*(Three full seconds.)*

"[direct] Escalate.

Dental implants // **are not covered** // under this Aetna DHMO plan.

Categorical exclusion. // Missing tooth clause enforced. // Patient responsibility — // full procedure. // Three thousand five hundred dollars. // Minimum. // Surgical fees // billed separately."

*(Pause.)*

"Read the first action step with me."

*(Point to screen or say it out loud — read it verbatim, slowly:)*

"[slow] *Do not book this appointment // until the patient and the clinical team // acknowledge non-coverage // in writing.*

..."

*(Pause.)*

"[warm] If your client's front desk had scheduled this — // the patient sits in the chair. // The dentist evaluates the site. // The treatment plan is presented. // And then someone calls insurance.

The patient feels misled. // The practice loses the trust. // Your client // loses a patient // who might have referred five people.

[direct] Forty percent of claim denials are eligibility-related. // That figure includes // **exactly this.** // Scheduling a treatment // a plan simply doesn't cover."

*(Open Audit step source document.)*

"[warm] And here — // the audit record. // Every decision the agent made. // Timestamped. // Hashed. // Logged. // HIPAA retention requirements. // Forty-five CFR one-sixty-four.

The compliance trail // exists automatically. // Not because a coordinator // remembered to document it."

*(Close document.)*

---

## PART 7 — IT'S A PRODUCT
### [8:45 – 9:45]
*(Click through nav panels quickly. This is a fast section — don't dwell.)*

---

*(Click Analytics)*

"[fast] April 2026. // A hundred and twenty-seven verifications. // Average time — thirty-four seconds. // Down from fifteen to twenty minutes manual.

Clean claim rate — ninety-four point two percent. // Eighteen denials prevented. // About twenty-four thousand dollars in revenue // that didn't leak.

Pre-auth catch rate — // a hundred percent. // Every flag surfaced // before an appointment was scheduled."

*(Click Verifications)*

"The last forty-eight hours. // Patient, payer, treatment, decision, confidence, timestamp. // A searchable audit trail // your clients can show payers."

*(Click Settings)*

"Dentrix and OpenDental connected. // Change Healthcare as the clearinghouse. // Payer connections on EDI 270/271 // for Delta, Cigna, Aetna, MetLife, Guardian.

[warm] This is the infrastructure. // The agent runs on top of it."

---

## PART 8 — THE BIGGER PICTURE
### [9:45 – 11:15]
*(Close or push aside the browser. Camera only. This is the most important part. Take a breath before starting.)*

---

*(Sit back slightly. More relaxed energy. This is a conversation, not a presentation.)*

"[warm] Preet — // what you just watched // is Phase One.

Insurance verification. // The highest-volume // highest-frequency workflow // in your service lines.

// But here's the thing.

Your company does six other workflows // with exactly the same structure.

[slow] A repetitive, high-stakes manual process. // A decision that carries real financial consequences // when it's wrong. // A compliance requirement // to document it.

[fast] Prior authorizations — average practice submits forty-three per week. // Claims submission — coding accuracy, documentation, clearinghouse formatting. // Denial management — root cause identification, correction, resubmission. // Aged accounts receivable — payer follow-up, status tracking, escalation. // Credentialing — enrollment timelines, document submissions.

[slow] Every. Single. One. //

Becomes an agent // with the same architecture you just saw.

..."

*(Pause. Then explain the two-engine design simply.)*

"[warm] A rules engine // for the deterministic checks — // the ones where there's a right answer // and a wrong answer. //

A language model // for the reasoning and the communication — // writing the appeal letter. // Generating the patient script. // Summarizing the coverage for the front desk.

And your team // for the exceptions. // The complex cases. // The difficult payers. // The situations // that require real judgment.

[direct] The result isn't that your team gets replaced. //

StafGo's value has never been the labor. //

It's the expertise. // The payer relationships. // The understanding of where revenue leakage happens // and how to stop it before it starts.

The agent // **preserves** that expertise // and multiplies it. //

[slow] Same team. // Ten times the volume. //

..."

*(Pause. Now the sovereignty point — say this clearly and directly.)*

"[direct] You used the word sovereign deliberately.

Not a SaaS product your clients subscribe to. // Not a black box // sending patient data // to a third-party server. //

An intelligence layer // that sits inside your operations. // On your infrastructure. // Under your control. //

That makes your existing team // dramatically more capable.

..."

*(Last beat — the legacy framing and the window.)*

"[warm] You also said // legacy dental market. //

Every practice running on Dentrix or Eaglesoft. // Copy-pasting eligibility information from a payer portal // into a PMS // because there's no API. //

[direct] That's not a limitation. // That's the **opportunity.** //

Because the practices that are already your clients // **trust you.** // They're not going to give portal access // to a startup. // They'll give it to StafGo — // because you've been handling their most sensitive billing data // for years.

PatientDesk, Toothy, Ventus — // they're all building from scratch. // The payer knowledge. // The denial patterns. // The appeal strategies. //

You've been building it // **for fifteen years.**

[slow] The timing is now.

[direct] What StafGo is sitting on // isn't just a services business. //

It's the domain knowledge and the client trust // to build // the operating system // for dental revenue cycle management. //

End-to-end. // Precision meets efficiency. // At scale.

// That's what a Sovereign AI Agent means. // In practice."

---

## PART 9 — THE CLOSE
### [11:15 – 11:45]
*(Short. Direct. Genuine. Don't rush.)*

---

*(Take a small breath. Slow your pace right down.)*

"[warm] I built this // before our first conversation.

Because showing you // is more useful // than describing it.

// Three things I'd love your perspective on.

[direct] Is verification the right place to start — // or is there a workflow // that's more painful for your clients right now?

When you say sovereign deployment — // what does that mean for your infrastructure? // Private cloud, on-premise, or something else?

// And — // how do we work together?

[warm] The GitHub repo is public. // I'll send you the link.

..."

*(Genuine pause. Then:)*

"Looking forward to the conversation, Preet."

*(Stop. Don't add anything after that. Let it end.)*

---

---
---

## SECTION 10 — CUE CARD
### Print this. Have it on your phone. This is what you look at during the recording.

---

```
HOOK
• "Sovereign AI Agent" — his words back to him
• Went to StafGo.com first — 3-day verification detail
• 40% eligibility denials, 25% coding errors — his stats
• "What happens when you give that expertise a set of agents"

MARKET (fast)
• PatientDesk YC W26 — 60 clinics 8 weeks
• Toothy YC W25 — 50-75% headcount cuts
• Ventus a16z — 40 portals, browser agents
• DentalRobot — 5yr, 300 portals, $99/mo
• Key line: "building what you already have, from scratch"
• "18 months"

APP OPEN
• 3 panels — intake / agent trace / decision
• "Sovereign part — nothing in a black box"

SARAH (safe)
• Delta PPO, composite filling
• Open EDI 271 → "X12 format your team reads every day"
• Open Benefits → show annual max bar
• Result: green, $50 patient, script
• "No leakage. No missed flag. No twenty-minute call."

MICHAEL (caution)
• Cigna, crown
• "Revenue leakage starts"
• 2 high flags: only $400 left, pre-auth missing
• Open risk doc → "14 vectors, specific dollar amounts"
• "Denial prevention, not denial management"

PATRICIA (escalate)
• Aetna DHMO, implant
• Let it run in silence
• Read the action step out loud slowly
• "40% eligibility-related — exactly this"
• Open audit → HIPAA, 45 CFR §164

NAV (fast)
• Analytics: 127 verifs, 34s avg, 94.2% clean, 18 denials prevented
• Verifications: audit trail
• Settings: Dentrix, OpenDental, Change Healthcare, EDI

BIGGER PICTURE
• "Phase One — verification"
• 6 other workflows: prior auth / claims / denials / AR / credentialing
• Two engines: rules (deterministic) + LLM (language) + humans (exceptions)
• "Same team, ten times the volume"
• Sovereign = on your infrastructure, your control
• Legacy = Dentrix/Eaglesoft, no APIs, trust is the asset
• "Building from scratch — vs — 15 years"
• "Operating system for dental RCM"
• "Precision meets efficiency at scale"

CLOSE
• 3 questions: right workflow? / sovereign infra? / work together?
• "GitHub repo is public"
• "Looking forward to the conversation, Preet"
• STOP. Don't add anything.
```

---

## SECTION 11 — DELIVERY NOTES

### The one thing that makes the biggest difference
**Pause more than you think you need to.** Every time you want to move on — wait one more second. The pauses are not dead air. They're when the viewer's brain processes what you just said. Fill them and the message doesn't land.

### The five sentences to get exactly right
Memorise these verbatim. Everything else can be paraphrased. These are the anchors.

1. *"What happens when you give that expertise a set of agents."* — End of Part 1. Say it slowly. Drop your energy after it. Let it sit.

2. *"That's the sovereign part. Nothing happens in a black box."* — When you open the middle panel. Direct, short, definitive.

3. *"Do not book this appointment until the patient and the clinical team acknowledge non-coverage in writing."* — Read this from the screen slowly during Patricia's scenario. Don't paraphrase it. Reading it out loud is more powerful than summarising it.

4. *"Same team. Ten times the volume."* — In Part 8. Say these as two separate sentences. Pause between them.

5. *"Looking forward to the conversation, Preet."* — The last line. Full stop. Nothing after.

### If you lose your place
Every section has a landing phrase. If you go blank, find the nearest one and land on it, then pause naturally as if you meant to. Nobody will know.

### Energy arc
- Part 1: Warm, direct, thoughtful
- Part 2: Informational, slightly faster, matter-of-fact
- Part 3: Orienting, calm, let them look
- Parts 4–6: Present-tense narration — describe what's happening, don't over-explain
- Part 7: Quick, confident, factual
- Part 8: The most important — slow down here, more personal energy
- Part 9: Quietest, most genuine

### What to do with your hands
If on camera: one hand relaxed on desk, or both lightly clasped. Don't gesture constantly. Save a forward lean for "That one detail told me more about how you run this than anything else on the site" — it signals genuine interest.

### One day before recording
Read the script out loud twice — full speed, no stopping. Don't perform it. Just read it. You'll hear the sentences that don't sound like you. Change those to your natural words. The script is a framework, not a cage.

### The night before
Read only the Cue Card five times. Then put it away.

### Day of
Read the Cue Card once. Then record.
