# The Pitch — One Page

> For Preet Sandhu, Founder & CEO, StafGo Health
> Re: Building the Sovereign AI Agent Layer

---

## What We Built

A working **Dental Insurance Verification + Booking Copilot** — a 3-panel agent workspace that takes a patient and insurance details, runs a 7-step orchestrated agent workflow, and produces:

- Eligibility status and full benefit breakdown
- Treatment-specific coverage analysis
- Risk flags (pre-auth requirements, annual max, waiting periods, exclusions)
- Booking recommendation: **Safe / Caution / Escalate**
- Patient-facing front-desk script
- Internal billing note
- Complete audit trail

**This is not a demo. It is a working system.** Live at http://localhost:3002. Built with Claude Haiku, a custom rules engine, and a Next.js agent workspace UI.

---

## Why We Built It This Way

We went to StafGo.com before writing a single line of code.

StafGo's published service lines are:
- Insurance verification and benefits checks
- Prior authorization management
- Dental billing and RCM
- Denial management
- Credentialing and payer enrollment
- PPO negotiations
- Patient billing management

The demo automates the first service line — the one with the highest daily volume and the most repetitive manual work. We built around StafGo's existing operations, not around a generic "AI for dental" idea.

---

## The Core Proposition

StafGo today sells **human expertise as a service**. A skilled billing team verifies insurance, submits claims, chases denials, and manages A/R.

The agent layer transforms this into:

```
Human expertise → encoded into agent workflows
Routine work → handled by agents at scale
Exceptions → routed to humans with full context
```

The result: the same StafGo team handles 5-10x the volume. Margins expand. The product becomes stickier. The company transforms from a services business into a tech-enabled operator.

---

## What "Sovereign AI Agent" Means in Practice

Preet's LinkedIn post: *"We are developing a Sovereign AI Agent for the legacy USA dental market."*

**Sovereign** = private deployment, owned data, HIPAA-safe, no black-box SaaS dependency

**AI Agent** = software that takes actions — verifies coverage, submits claims, calls payers, updates PMS — not just answers questions

**Legacy Dental Market** = the 200,000+ dental practices running on Dentrix, Eaglesoft, OpenDental — 20-year-old systems with no APIs, manual workflows, staff copy-pasting between portals

The demo is built to be sovereign-deployable. The LLM call can be replaced with a private model. Every decision is logged with evidence. Human review is built into every workflow.

---

## The Market Moment

The category has been validated by serious investors:
- PatientDesk AI: YC W26
- Toothy AI: YC W25
- Ventus AI: a16z + Samsung NEXT
- DentalRobot: Profitable, 5+ years, 300+ portal integrations
- Overjet: $160M raised, $550M valuation

Every one of these companies is building domain knowledge from scratch.

**StafGo already has the domain knowledge. What's missing is the agent layer.**

---

## The Build Roadmap

| Phase | What | StafGo Service Line |
|---|---|---|
| **Phase 1** (Built) | Insurance Verification Copilot | Insurance verification & benefits |
| **Phase 2** | Claims Submission Agent | Dental billing & RCM |
| **Phase 3** | Denial Detection & Appeal Agent | Denial management |
| **Phase 4** | Prior Auth Agent | Prior authorization management |
| **Phase 5** | A/R Follow-Up Agent | Reporting & collections |
| **Phase 6** | Full Dental Ops Workspace | All service lines unified |

---

## The Technical Architecture

Two-engine design:

**Rules Engine** — deterministic, fast, auditable
Handles: deductible checks, annual max caps, waiting period dates, frequency limits, exclusion lists, pre-auth thresholds

**LLM Engine** — language, synthesis, judgment
Handles: benefit explanations, patient scripts, denial appeal letters, risk summaries, complex payer reasoning

Rules for truth. LLM for language. Humans for exceptions.

---

## What We Bring

- **AI agent engineering** — LLM orchestration, multi-step workflows, structured output extraction, human-in-the-loop patterns
- **Healthcare context** — HIPAA-aware architecture, dental-specific rules engine, payer data modelling
- **Product thinking** — built around StafGo's actual service lines, not a generic demo
- **Speed** — Phase 1 built and working before the first conversation

---

## The Ask

A conversation about:
1. Is the demo directionally right — is this the workflow you had in mind?
2. Which Phase 2 workflow creates the most value for your clients right now?
3. What does "sovereign" deployment look like for your infrastructure?
4. How do we work together to build this?

---

## One-Sentence Summary

> We built a working AI agent that automates StafGo's highest-volume service — dental insurance verification — and we can extend it to every workflow your ops team runs today.
