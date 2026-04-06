# Sovereign AI Agent — Architecture Proposal for StafGo

> Technical architecture for an AI agent layer on top of StafGo's existing dental RCM operations
> Designed to be: private, auditable, human-supervised, and incrementally deployable

---

## The Core Idea

StafGo today is a services company where skilled humans execute dental billing workflows. The agent layer does not replace those humans — it transforms what they spend their time on.

```
TODAY:
  100 verifications × 15 min each = 25 hours of human work

WITH AGENTS:
  100 verifications × 30 seconds automated = 0.8 hours
  + 5 exceptions flagged for human review = 25 minutes

Result: Same output. 95% less human time on routine work.
         Humans now focus on exceptions, relationships, and complex cases.
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLINIC / DSO LAYER                     │
│   Dentrix  |  Eaglesoft  |  OpenDental  |  CareStack     │
└──────────────────────┬──────────────────────────────────┘
                       │ secure sync / API / browser agent
┌──────────────────────▼──────────────────────────────────┐
│                AGENT ORCHESTRATION LAYER                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Verification│  │   Claims     │  │  Denial Mgmt  │ │
│  │    Agent     │  │   Agent      │  │    Agent      │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  Prior Auth  │  │  A/R Follow  │  │ Credentialing │ │
│  │    Agent     │  │   up Agent   │  │    Agent      │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
│                                                          │
│              ┌─────────────────────┐                    │
│              │   Rules Engine      │                    │
│              │  (deterministic)    │                    │
│              └─────────┬───────────┘                    │
│                        │                                │
│              ┌─────────▼───────────┐                    │
│              │   Private LLM       │                    │
│              │  (language + reason)│                    │
│              └─────────────────────┘                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│               HUMAN REVIEW LAYER                         │
│   Exception queue  |  Escalations  |  Override console  │
│   StafGo ops team sees only what needs human judgment    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 AUDIT & COMPLIANCE                        │
│   Every agent decision logged with evidence + timestamp  │
│   HIPAA-compliant storage  |  Reviewable by payer/client │
└─────────────────────────────────────────────────────────┘
```

---

## The Two-Engine Design

This is the most important architectural principle. The demo already implements it.

### Engine 1 — Rules Engine (Deterministic)

Handles all the yes/no checks that never need AI:

```
Is the plan active?                    → Boolean check on effective dates
Is the annual maximum exceeded?        → annualMaxUsed >= annualMaximum
Is the deductible met?                 → deductibleRemaining === 0
Is there a waiting period active?      → enrollmentDate + waitingDays > today
Is treatment excluded?                 → treatmentCode in exclusionList[]
Is pre-auth required?                  → preAuthThreshold check vs. estimated fee
Is the frequency limit hit?            → last claim date + frequency days > today
```

These checks never need an LLM. They are fast, deterministic, and 100% auditable.

### Engine 2 — LLM (Language + Reasoning)

Handles everything that requires language, judgment, or synthesis:

```
Generate patient-facing explanation of coverage
Draft internal billing note for ops team
Identify nuanced risk from benefit language
Compute booking recommendation from combined risk signals
Write prior auth narrative for payer submission
Classify denial reason from payer remittance text
Draft appeal letter from clinical notes + payer policy
```

**The rule:** LLM for language. Rules for truth. Never use LLM where a deterministic check works.

---

## Phase Roadmap

### Phase 1 — Insurance Verification Copilot (Built — Demo Live)

**What it does:**
- Takes patient + insurance data
- Queries payer benefit database (or EDI 271 transaction)
- Extracts full benefit breakdown
- Runs 8+ deterministic rule checks
- Generates booking recommendation (Safe / Caution / Escalate)
- Produces front-desk script and billing note
- Logs to audit trail
- Routes to human reviewer

**Who benefits:** Front desk staff, insurance coordinators, scheduling team

**StafGo service line it automates:** Insurance Verification & Benefits Checks

**Time saved per verification:** 15-20 minutes → 30-60 seconds

---

### Phase 2 — Claims Submission Agent

**What it does:**
- Watches for completed appointments in PMS
- Pulls procedure codes, tooth numbers, clinical notes
- Validates codes against payer fee schedules
- Attaches required documentation (X-rays, periodontal charts)
- Submits clean claim to clearinghouse
- Tracks acknowledgment and payer receipt

**Trigger:** Appointment marked complete in PMS

**StafGo service line:** Dental Billing & RCM, Medical Coding

---

### Phase 3 — Denial Detection & Appeal Agent

**What it does:**
- Monitors remittance advice (ERA/EOB) daily
- Classifies each denial by root cause (wrong code, missing auth, timely filing, bundling)
- Applies correction rules automatically for routine denials
- Drafts appeal letters for complex denials using clinical documentation
- Tracks appeal status and re-submission
- Escalates to billing specialist for policy-level denials

**StafGo service line:** Denial Management

**Industry stat:** 90% of denied claims are recoverable. Average recovery time with humans: 45 days. With agents: 3-5 days.

---

### Phase 4 — A/R Follow-Up Agent

**What it does:**
- Reviews aging A/R report daily
- Identifies claims > 30/60/90 days with no response
- Calls payer IVR or queries portal for status
- Takes action based on status (resubmit, provide info, escalate)
- Logs all contact attempts with timestamps
- Escalates accounts > 120 days to collections specialist

**StafGo service line:** Reporting & Analytics, A/R follow-up

---

### Phase 5 — Prior Auth Agent

**What it does:**
- Identifies procedures requiring pre-authorization at scheduling
- Submits auth request with supporting clinical documentation
- Monitors approval status (typically 3-14 days)
- Alerts scheduling team when auth is approved
- Handles peer-to-peer requests when auth is denied
- Tracks auth expiry dates

**StafGo service line:** Prior Authorization Management

---

### Phase 6 — Full Dental Operations Workspace

All agents work together as a unified platform. Single dashboard for:
- All pending verifications
- Claims in flight
- Denial queue
- Auth tracker
- A/R aging
- Real-time KPIs (Clean Claim Rate, Days in A/R, Collection Ratio)

**This is the "Sovereign AI Agent" Preet described — the full operating layer.**

---

## What "Sovereign" Means Technically

Preet used the word "sovereign" deliberately. In healthcare AI, this means:

| Requirement | Implementation |
|---|---|
| Patient data never leaves StafGo's environment | Private cloud or on-prem LLM deployment |
| No dependency on third-party AI black boxes | Self-hosted or dedicated LLM instance |
| Full audit trail of every agent decision | Immutable log with evidence + reasoning |
| HIPAA Business Associate Agreement | Required with any external AI vendor |
| Human override at every step | Built-in reviewer queue with edit capability |
| Explainable decisions | Every recommendation shows source evidence |

The demo already implements explainability (View Evidence on each step) and human override (Approve / Edit / Escalate buttons). The sovereign deployment would add private LLM hosting.

---

## Technology Stack Recommendation

| Layer | Technology | Why |
|---|---|---|
| Agent orchestration | LangGraph or custom Python | State machine for multi-step workflows |
| LLM (sovereign option) | Llama 3.3 70B on private cloud | Fully private, strong reasoning, HIPAA-safe |
| LLM (managed option) | Claude via Anthropic API (BAA available) | Best-in-class reasoning, BAA for HIPAA |
| Rules engine | Python + dental-specific rule library | Fast, deterministic, auditable |
| PMS integration | Dentrix/Eaglesoft API + browser automation | Covers both modern and legacy PMS |
| Payer integration | EDI 270/271 + portal browser agents | Covers electronic + legacy payers |
| Frontend | Next.js + React | Fast, modern, deployable anywhere |
| Database | PostgreSQL + audit log table | Relational for structured data + compliance |
| Hosting | AWS GovCloud or Azure Healthcare | HIPAA-eligible infrastructure |

---

## The Moat

What makes this defensible against generic AI tools:

1. **Dental-specific rules engine** — Knows CDT codes, frequency limitations, missing tooth clauses, PPO vs. DHMO vs. DHMO-PPO plan logic. This takes months to build correctly.

2. **StafGo's payer knowledge** — 15 years of which payers are slow payers, which denial codes they use, which templates work for appeals. This is embedded in the agent training and prompt design.

3. **Operational SOPs as agent workflows** — StafGo's existing SOPs become agent step definitions. The institutional knowledge is baked in, not learned from scratch.

4. **Client relationships** — Dental practices already trust StafGo. An agent product from StafGo gets deployed faster than a cold-start startup asking for EHR access.
