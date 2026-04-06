# Video Script — DentaAgent for Preet Sandhu
### Final edition — all 5 audit findings applied

---

## HOW TO USE THIS SCRIPT

**Do not read this on camera.** Rehearse until you own it. Record with only the Cue Card (Section 10) visible on your phone.

**Notation:**
- `//` = breath — actually inhale here
- `...` = hold silence — do not fill it
- **bold** = stress this word
- *(direction)* = physical instruction
- `[slow]` = slow down noticeably
- `[fast]` = move through it
- `[warm]` = softer, conversational energy
- `[direct]` = straight to camera, confident

**The rule:** Pause more than you think you need to. The pauses are not dead air — they're where it lands.

---

## PART 1 — THE HOOK
### [0:00 – 0:55]
*(Camera only. No screen. Lean slightly forward. Say the name flat — not warm, not theatrical. Like starting a letter.)*

---

*(Say the name once. Drop your pitch on it. Don't smile yet. Then pause.)*

"Preet.

..."

*(Two full seconds. Then:)*

"You wrote something recently — // and I haven't stopped thinking about it.

[slow] You said StafGo is developing // **a Sovereign AI Agent** // for the legacy USA dental market.

..."

*(Let that sit. One second. Then ground it.)*

"My name is Gaurav. // I build AI systems // for revenue cycle problems. // And when I read that — // I didn't write you a message. // I went to StafGo.com.

[warm] Read every page. // Every service line. // The case studies.

And I found one detail // that most people would scroll past.

You verify coverage **three days** before every appointment. // Not the morning of. // Not after the patient's already in the chair. // **Three days before.**

[direct] That told me more about how you run this // than anything else on the site.

// Because that's a proactive model. // You already know where the leakage happens. //

[fast] Forty percent of claim denials — eligibility-related. // Twenty-five percent — coding errors. // Your team doesn't study those numbers. // They **live** them. // They catch them. // They recover the revenue // when nobody else is watching.

..."

*(Pause. Then the pivot — say it simply, don't oversell it.)*

"I want to show you something. // What happens // when you give that expertise // **a set of agents.**"

---

## PART 2 — THE MARKET
### [0:55 – 2:00]
*(Still camera. Lead with Preet's strength — then competitors as evidence.)*

*(Start warm, then shift to matter-of-fact.)*

---

"[warm] Here's what I kept coming back to // while I was building this.

StafGo has something // that companies are spending millions right now // trying to acquire. // Fifteen years of actual dental billing domain knowledge. // Real payer relationships. // Real denial patterns. // Real client trust.

PatientDesk — Y Combinator, this year — // they're building that knowledge from scratch. // They're at sixty clinics. // In eight weeks.

Toothy AI — Y Combinator last year — // voice AI calling payers, full revenue cycle loop. // They're cutting back-office headcount at their clients by fifty to seventy-five percent.

Ventus — Andreessen Horowitz — // browser agents navigating payer portals. // Forty portal connections. // Nightly claim statusing. // Already in the DSO market.

[direct] Every dollar of VC money going into these companies // is the market confirming // what you already know.

// But here's the thing they can't buy.

[slow] You built it // over **fifteen years.** // Through actual client relationships. // Actual denials. // Actual recoveries.

..."

*(One beat. Then the timing point — deliver it as analysis, not pressure.)*

"At PatientDesk's growth rate — // sixty clinics in eight weeks — // they reach the DSO market inside fourteen months. // That's the window.

That's why I built this."

---

## PART 3 — OPEN THE APP
### [2:00 – 2:45]
*(Switch to screen. Open localhost:3002. Don't speak immediately. Let Preet look at it for three full seconds.)*

---

*(Open the app. Look at it yourself. Then:)*

"Three panels.

Left — patient intake. // The same information your coordinators collect // before every verification call.

Middle — the agent reasoning trace. // Every step the agent takes. // Every document it reads. // Every rule it checks. // Visible. Timestamped. Auditable.

[direct] That's the sovereign part. // Nothing happens in a black box.

Right — the decision console. // Eligibility, benefit breakdown, risk flags, booking recommendation, patient script. // Everything in one place.

// One thing before I run this —"

*(Pause. Look at camera. Say this clearly.)*

"[warm] Everything you're about to see // runs on simulated payer data. // Delta, Cigna, Aetna responses // built to spec. // The agent reasoning, the EDI parsing, the rule engine — // **all real.** // The patient names // are not.

// Three scenarios. // A clean case. // A risky one. // And one that should **never** be scheduled."

---

## PART 4 — SARAH JOHNSON (SAFE TO BOOK)
### [2:45 – 4:30]
*(Load Sarah Johnson. Let the form fill before speaking.)*

---

*(Click card. Wait. Then:)*

"[warm] First patient. Sarah Johnson. // Delta Dental PPO. // Composite filling.

Your team runs this dozens of times a day. // Call Delta, navigate the IVR, pull the benefit breakdown, update the PMS, note the patient responsibility. // Fifteen to twenty minutes. // Minimum. // Every time."

*(Click Run Verification Agent. Narrate as steps animate — don't rush. Wait for each step to begin.)*

"Watch the middle panel.

Intake Agent — // parsing her member ID against the payer registry.

Eligibility Checker — // querying Delta Dental."

*(Wait for Eligibility step to complete. Then — don't explain it, just name it.)*

"[direct] Look at this."

*(Click 'View Source' on Eligibility step. Let it open.)*

*(Look at the document yourself for two full seconds — eyes move across it. Then look up at camera.)*

"The raw EDI 271 transaction. // ISA header. // GS transaction set. // HL subscriber segments. // EB benefit loops.

[warm] The X12 format // your team reads every day.

The agent parsed this // and pulled every meaningful field. // Not a clearinghouse summary — // the source document."

*(Close viewer. Let it run.)*

*(When complete — results appear. Take a breath before speaking.)*

"[direct] Safe to book.

Delta Dental PPO. // Active. // Deductible met. // One thousand six hundred and eighty remaining on the annual max. // Eighty percent coverage. // Patient pays fifty dollars.

And here —"

*(Open patient script.)*

"The script // the front desk reads to Sarah // on the call. // The agent wrote it from the coverage data."

*(Close. Short pause.)*

"[slow] No missed flag. // No twenty-minute call. // No revenue leakage."

---

## PART 5 — MICHAEL TORRES (CAUTION)
### [4:30 – 6:15]
*(Load Michael Torres.)*

---

*(Click card. Wait.)*

"[direct] Second patient. Michael Torres. // Cigna Dental. // Crown.

This is the case your team catches on a good day — // and misses on a busy one.

And when it gets missed — // the appointment happens. // The crown goes in. // The claim goes out. //

[slow] And that's where // the revenue leakage starts."

*(Click Run Verification Agent. Wait for results. Don't fill the silence.)*

*(Amber banner. Let it sit one full second.)*

"**Book with Caution.**

Two high flags.

[direct] First — // annual maximum nearly exhausted. // Cigna fifteen hundred plan. // Michael's used eleven hundred. // **Four hundred left.** // The crown costs thirteen hundred. // Insurance would ordinarily pay six-fifty at fifty percent — // but there's only four hundred left on the annual max. // Patient responsibility jumps to nine hundred. // Nobody told them that.

That's a financial surprise // the practice never communicated. // That's a billing complaint. // That's a patient who doesn't come back.

Second — // pre-authorization // **has not been obtained.** // Cigna requires it // for crowns over eight hundred. //

[slow] If your team schedules without it — // the claim goes out, // Cigna denies it, // missing pre-auth — // and now your client is chasing that denial // for sixty, ninety days."

*(Open Risk step source document.)*

"Risk assessment. // Fourteen vectors scanned. // Each flag is specific — // **exact dollar amount, exact requirement, exact consequence.** //

[warm] This is denial prevention. // Not denial management. // Your model. // Catching it // before the appointment is scheduled."

*(Close document. Point to action steps.)*

"The action steps tell the coordinator exactly what to do — // in sequence — // before they confirm anything."

---

## PART 6 — PATRICIA CHEN (ESCALATE)
### [6:15 – 7:30]
*(Load Patricia Chen.)*

---

*(Click card. Wait.)*

"Third patient. Patricia Chen. // Aetna DHMO. // Dental implant.

[slow] I'll let it run."

*(Click Run Verification Agent. **Stay completely silent.** Don't narrate. Don't move. Let the timeline animate.)*

*(Red banner appears. Don't speak immediately. Look at it. Count to three.)*

"..."

*(Then, flat and clear:)*

"[direct] **Escalate.**

Implants // **are not covered** // under this Aetna DHMO plan.

Categorical exclusion. // Missing tooth clause. // Patient responsibility — // the full procedure. // Three thousand five hundred dollars. // Minimum.

Read the first action step."

*(Say it out loud. Slowly. Verbatim. Don't paraphrase.)*

"[slow] *Do not book this appointment — // until the patient and the clinical team // acknowledge non-coverage // in writing.*

..."

*(Three seconds. Let it sit.)*

"[warm] If your client's front desk had scheduled this — // the patient sits in the chair. // The dentist evaluates the site. // The treatment plan is presented. // And then someone calls insurance.

The patient feels misled. // The practice loses the trust. // Your client loses a patient // who might have referred five people.

[direct] Forty percent of claim denials are eligibility-related. // That figure // includes **exactly this.** // Scheduling a treatment // a plan simply doesn't cover."

*(Open Audit step source document.)*

"[warm] And here — the audit record. // Every decision, timestamped, hashed, logged. // HIPAA retention. // Forty-five CFR one-sixty-four. // The compliance trail // exists automatically."

*(Close.)*

---

## PART 7 — THIS IS A PRODUCT
### [7:30 – 8:15]
*(Click through nav quickly. Keep the pace up.)*

---

*(Click Analytics)*

"[fast] April 2026, simulated volume. // A hundred and twenty-seven verifications. // Average time — thirty-four seconds. // Clean claim rate — ninety-four point two percent. // Eighteen denials caught before scheduling. // Pre-auth catch rate — a hundred percent."

*(Click Verifications)*

"The verification log. // Patient, payer, treatment, decision, confidence, timestamp. // A searchable audit trail.

*(Click Settings)*

"PMS integrations — Dentrix, OpenDental. // Clearinghouse — Change Healthcare. // Payer connections on EDI 270/271 // for Delta, Cigna, Aetna, MetLife, Guardian.

[warm] The infrastructure. // The agent runs on top of it."

---

## PART 8 — THE BIGGER PICTURE
### [8:15 – 9:30]
*(Close or move the browser. Camera only. Sit back. This is a conversation now, not a demo.)*

*(Take a real breath. Change your energy completely. Quieter, more personal.)*

---

"[warm] Preet — // what you just watched // is Phase One.

Insurance verification. // The highest-volume workflow // in your service lines.

// But your company does six other things // with exactly the same structure.

[fast — add // after each] Prior authorizations — // claims submission — // denial management — // aged accounts receivable — // credentialing. //

[slow] Every one of them // becomes an agent workflow // with the same architecture you just saw.

..."

*(Pause. Then explain it cleanly.)*

"A rules engine // for the deterministic checks — // the ones with a right answer and a wrong answer.

A language model // for the reasoning and the communication — // the appeal letter, the patient script, the coverage summary.

And your team // for the exceptions. // The complex cases. // The difficult payers. // The situations // that require real judgment.

[direct] The result isn't that your team gets replaced.

StafGo's value // has never been the transaction volume. // It's been knowing // which transactions to flag — // which payers to push back on — // how to recover the revenue // that would otherwise disappear.

The agent // **scales that capability.** // It doesn't replace it.

[slow] Same team. //

**Ten times the volume.**

..."

*(Pause. Then the sovereignty point.)*

"[direct] You used the word sovereign deliberately.

Not a SaaS subscription your clients manage. // Not patient PHI routing to a server // you don't control. //

An intelligence layer // on your infrastructure. // Under your control. //

That makes your existing team // dramatically more capable.

..."

*(The trust point — this is the strongest line. Save energy for it.)*

"[warm] And here's the thing // about the legacy market.

Every practice running on Dentrix or Eaglesoft. // Still manually copy-pasting // from the payer portal // into the PMS. // Because there's no API.

[direct] That's not a limitation. // That's **the asset.**

Because the practices that are already your clients // **trust you.** // They're not giving portal access // to a startup. //

For fifteen years // you've been handling // their most sensitive billing data. //

**They'll give it to StafGo.**

// That's where this starts.

That's what a Sovereign AI Agent // actually is. // Not in theory — // in your practice."

---

## PART 9 — THE CLOSE
### [9:30 – 10:00]
*(Quietest section. Most genuine. Don't rush.)*

---

*(Take a small breath. Slow right down.)*

"[warm] I built this // before our first conversation.

Because showing you // is more useful // than describing it.

// This is a working prototype — // not a production system. // Getting this to production on your infrastructure // is a six-to-eight week build. // That's the conversation I want to have.

..."

*(Pause. Then ONE question. Say it with genuine curiosity.)*

"[direct] One thing I'd love your reaction to: //

Is verification the right entry point — // or is there a workflow // your clients are **bleeding on** right now?

// Happy to set up thirty minutes // and walk through the full system live. // We can talk about what the build actually looks like — // whether that's a contract, a pilot, or something else entirely.

[warm] The GitHub repo is public. // I'll drop the link.

..."

*(Full stop. One last beat. Look directly at camera.)*

"[slow] Looking forward to the conversation, Preet."

*(Stop. Say nothing after this. End the recording.)*

---

---
---

## SECTION 10 — CUE CARD
### This is what you look at during the actual recording. Print it or put it on your phone.

```
HOOK
• "Preet." — flat, like starting a letter. Pause.
• "I build AI systems for revenue cycle problems"
• "Went to StafGo.com" — 3-day verification detail
• 40% eligibility / 25% coding — his stats, his team lives them
• "What happens when you give that expertise a set of agents"

MARKET (gain frame FIRST, then urgency)
• "StafGo has what they're spending millions to acquire"
• "15 years of actual knowledge, actual relationships"
• PatientDesk YC this year — 60 clinics 8 weeks
• Toothy YC last year — 50-75% headcount at clients
• Ventus a16z — already in DSO market
• "Every VC dollar is confirming what you already know"
• "They can't buy what you built over 15 years"
• "PatientDesk's rate → DSO in 14 months. That's the window."

APP OPEN
• 3 panels: intake / trace / decision
• "That's the sovereign part. Nothing in a black box."
• ⚑ SIMULATED DATA DISCLOSURE — say it before running anything

SARAH (clean — cut to 90 seconds)
• Load card → Run
• Eligibility step: click View Source → look at it yourself first
• "The raw EDI 271. X12 format your team reads every day."
• Result: green, $50, script
• "No missed flag. No twenty-minute call. No revenue leakage."

MICHAEL (caution)
• Load → Run
• "Revenue leakage starts"
• 2 HIGH flags: $400 left, pre-auth missing
• Open risk doc: "14 vectors, exact dollar amounts"
• "Denial prevention — not denial management"

PATRICIA (escalate)
• Load → Run → STAY SILENT WHILE IT RUNS
• Red banner → count to 3 → "Escalate"
• Read action step VERBATIM, slowly
• "40% eligibility denials — exactly this"
• Open audit doc → "Timestamped. 45 CFR §164."

NAV (fast)
• Analytics: 127, 34s, 94.2%, 18 denials — "simulated volume"
• Verifications: audit trail
• Settings: Dentrix / OpenDental / Change Healthcare

BIGGER PICTURE
• "Phase One — verification"
• List 5 workflows fast
• Two engines: rules + LLM + humans for exceptions
• "NOT the transaction volume — it's knowing which ones to flag"
• "Same team. [pause] Ten times the volume."
• Sovereign = your infrastructure, your control
• Legacy = trust is the asset / "They'll give it to StafGo"
• "In your practice" — close on this

CLOSE
• "Working prototype — production is 6-8 week build"
• ONE question: "Is verification the entry point or is there something clients are bleeding on right now?"
• "30 minutes. Contract, pilot, or whatever makes sense."
• "Repo is public."
• "Looking forward to the conversation, Preet."
• STOP.
```

---

## SECTION 11 — THE 5 THINGS TO PRACTISE MOST

*(In this order. Don't practise everything — practise the things that will break you.)*

**1. The EDI terminology run**
"ISA header. GS transaction set. HL subscriber segments. EB benefit loops."
Say these ten times at half-speed before recording. If you stumble on any of them on camera, the technical credibility of the entire demo collapses. Know them cold.

**2. The click-and-narrate timing in all three patient scenarios**
Do one full dry-run with the app actually open. Record it. Watch it back. Note every moment the narration and the screen are out of sync. Fix those moments before the real recording.

**3. The silence during Patricia Chen's scenario**
When you click Run Verification Agent, you say **nothing** for approximately 15 seconds while the steps animate. Practise sitting in that silence without adding nervous talk. It's the strongest moment in the video. Filling it will ruin it.

**4. Part 8 — "Same team. Ten times the volume."**
Record Part 8 three times separately. Listen back. The goal is for "Same team. Ten times the volume." to sound like you just had that thought — not like you're reciting a line. If it sounds like a slogan, do it again.

**5. The close — one question with genuine curiosity**
"Is verification the right entry point — or is there a workflow your clients are bleeding on right now?"
Say this as if you genuinely don't know the answer. Because you don't. If it sounds like a sales setup, Preet will hear it.

---

## SECTION 12 — THE 5 MOST DANGEROUS LINES
*(Know these are coming. They're where most speakers drift into reading.)*

1. **"Do not book this appointment until the patient and the clinical team acknowledge non-coverage in writing."** — Read this off screen. Slowly. Do not paraphrase it.

2. **"Same team. [pause] Ten times the volume."** — Two sentences. Pause between them. Don't combine them.

3. **"That's where this starts. That's what a Sovereign AI Agent actually is. Not in theory — in your practice."** — The final beat of Part 8. If this sounds like a tagline, it will undercut everything before it. Say it quietly.

4. **"Looking forward to the conversation, Preet."** — Quietest line in the whole script. Don't pump energy into it. Just say it.

5. **"Everything you're about to see runs on simulated payer data."** — This line will feel vulnerable to say. Say it anyway. It's the line that makes everything else more credible.

---

## SECTION 13 — THE EMAIL TO SEND WITH THE VIDEO

**Subject:** I built something for StafGo — dental verification agent, working demo

---

Preet —

I went to StafGo.com before I wrote a line of code. Found the three-day advance verification model. Read every service line. Then built what the agent layer looks like on top of the highest-volume one.

Ten-minute recording attached. Three scenarios — clean, risky, and a hard escalation. Every agent step has the source document behind it, including the raw EDI 271 transaction.

Everything runs on simulated payer data built to spec. The architecture is real.

GitHub: https://github.com/gauravlochab/dentaagent

One question worth 30 minutes: is insurance verification the right entry point for your clients, or is there a workflow they're currently bleeding on more? Happy to walk through the full system live and talk about what a production build would look like.

Gaurav
[Your background — one sentence: e.g., "I've spent X years building production AI systems for [relevant domain]."]

---

*(The background sentence in brackets is the most important thing to add to this email. Everything else is strong. That line is what converts Preet from "interesting" to "I need to know who this person is.")*
