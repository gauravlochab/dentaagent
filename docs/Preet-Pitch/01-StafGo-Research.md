# StafGo Health — Deep Research Brief

> Prepared for the conversation with Preet Sandhu, Founder & CEO, StafGo Health
> Research date: April 2026

---

## Who They Are

StafGo Health is a US-based healthcare Revenue Cycle Management (RCM) company founded by Preet Sandhu (MBA, Brunel University London — 18+ years in financial leadership) and Dr. Jasmine Gill (physician co-founder). They operate a hybrid on-shore / off-shore model with US operations and an India delivery centre.

Their public tagline: **"Your Partner in Medical and Dental Billing."**

Their own words on technology: *"cutting-edge solutions that harness AI-driven Robotic Process Automation (RPA) and sophisticated Business Intelligence (BI) Analytics."*

This is not a small billing shop. They have case studies showing:
- 30%+ collection improvement for an acute care group within months
- $150,000+ in aged claims recovered for an orthopedic practice in 90 days
- Credentialing and payer enrollment completed "in record time" for dental clients

---

## What StafGo Sells Today

Every service line below is a workflow we can automate with agents:

| Service | What humans do today | Agent opportunity |
|---|---|---|
| **Insurance Verification & Benefits Checks** | Call payer, verify eligibility, extract deductible/co-pay/frequency, update PMS | Agent calls/queries payer, extracts structured benefit breakdown, writes to system |
| **Prior Authorization Management** | Identify procedures needing auth, submit requests, track approvals, follow up | Agent monitors auth status, submits requests, escalates blockers |
| **Dental Billing & RCM** | Code procedures, submit claims, track, post payments | Agent handles claim packet creation, submission, status tracking |
| **Denial Management** | Analyse denial codes, correct, resubmit, appeal | Agent classifies denials, applies correction rules, drafts appeals |
| **Credentialing & Payer Enrollment** | Submit provider applications, track approval pipelines | Agent monitors enrollment status, follows up, flags delays |
| **PPO Negotiations** | Negotiate reimbursement rates with payers | Data agent compiles rate benchmarks and evidence |
| **Medical Coding** | Assign CDT/ICD-10 codes accurately | AI coding assistance layer |
| **Patient Billing Management** | Send statements, handle inquiries, collect balances | Automated outreach + escalation |
| **Reporting & Analytics** | Build KPI dashboards (Days in A/R, Clean Claim ratio, Denial trends) | Real-time AI-generated insights |

---

## What Preet Said on LinkedIn

> **"We are developing a Sovereign AI Agent for the legacy USA dental market."**

Three words matter here:

**"Sovereign"** — Private deployment. Data stays in-house. HIPAA-compliant architecture. No dependency on third-party SaaS black boxes. This is how a services company that already holds patient data would frame their AI approach. He is not talking about a wrapper around OpenAI. He is talking about an owned, controlled intelligence layer.

**"AI Agent"** — Not a chatbot. Not a dashboard. An agent that takes actions: logs into portals, verifies coverage, submits claims, calls payers, updates practice management systems. Software that does work, not just displays it.

**"Legacy Dental Market"** — The US dental industry runs on Dentrix, Eaglesoft, OpenDental, CareStack, Curve. These are 20-year-old systems with no APIs, manual workflows, and staff copy-pasting data between portals. The word "legacy" is a signal that he sees the friction clearly and wants to build on top of it, not around it.

---

## The Strategic Transition He Is Making

StafGo today is a **services company** — skilled humans do the work, clients pay per service.

What Preet wants to build is a **tech-enabled operator** — agents do the routine work at scale, humans handle exceptions and relationships, the same team handles 10x the volume.

This is the classic B2B SaaS transformation play:
```
Human services → AI-augmented services → Agent-first product
```

The difference is that StafGo has something most AI startups don't: **15 years of dental billing SOPs, payer relationships, denial patterns, and operational knowledge.** That is the training data and the domain expertise the agent layer needs to be trusted.

---

## Why This Moment Is Right

The market validated the category in the last 18 months:
- PatientDesk AI — YC W26, $1M, real-time insurance verification on live calls
- Toothy AI — YC W25, voice AI calling payers for the full RCM loop
- Ventus AI — backed by a16z and Samsung, browser agents navigating payer portals autonomously
- DentalRobot — 5+ years, 300+ portal integrations, $99/month, already profitable
- Zentist — $31.4M raised, 11.2M claims processed, $2.1B in claim value

**The wedge everyone is attacking first: insurance verification and claims.** That is exactly what StafGo already sells as a human service.

The company that will win is not the one with the best model. It is the one with the best domain knowledge operationalised into agent workflows. StafGo already has the domain knowledge. They need the agent layer.

---

## Key People

| Name | Role | Background |
|---|---|---|
| **Preet Sandhu** | Founder & CEO | MBA Finance/Marketing, Brunel. 18+ years financial leadership. Runs dental RCM and marketing strategy. |
| **Dr. Jasmine Gill** | Co-Founder | Physician background. Senior administrative roles. Brings clinical credibility to the operations side. |
| **Anshuli Kaushik** | Operations Manager | Leads day-to-day RCM operations. |

---

## What This Means for Our Pitch

1. We understand his **exact service lines** — insurance verification, billing, denials, credentialing, PPO. We built the demo around the most painful of these.

2. We understand the **"sovereign" framing** — our architecture uses Claude Haiku via a private API call, rules engine for deterministic checks, and a human review queue. This can be made fully private/on-premise.

3. We understand the **legacy market reality** — our demo uses mock payer EDI data, but the real integration would be Dentrix/Eaglesoft connectors and payer portal browser agents.

4. We are not pitching a toy. We are pitching a **productised version of his existing operations**, starting with the highest-volume, highest-friction workflow and expanding from there.
