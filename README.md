# DentaAgent — Dental Insurance Verification Copilot

An AI-powered agent workspace that automates dental insurance verification, coverage analysis, and booking recommendations.

Built as a pitch demo for the **Sovereign AI Agent** concept — turning dental RCM operations into an agentic product layer.

## What it does

- Verifies patient insurance eligibility against a payer database
- Extracts benefit breakdowns (annual max, deductible, coverage %, waiting periods)
- Detects risk flags (pre-auth required, low remaining benefit, exclusions)
- Generates a booking recommendation: Safe / Caution / Escalate
- Produces a front-desk patient script and internal billing note
- Shows a live agent reasoning trace with 7 orchestrated steps
- Human-in-the-loop reviewer actions (Approve / Edit / Escalate)

## Setup

```bash
git clone https://github.com/gauravlochab/dentaagent
cd dentaagent
npm install
cp .env.local.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo patients

| Patient | Payer | Treatment | Expected Outcome |
|---------|-------|-----------|-----------------|
| Sarah Johnson | Delta Dental | Composite Filling | Safe to Book |
| Michael Torres | Cigna Dental | Dental Crown | Book with Caution |
| Patricia Chen | Aetna Dental | Dental Implant | Escalate |

Click **Load Sample** in the left panel to cycle through them.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Claude Haiku (via Anthropic SDK) for coverage reasoning
- Rules engine for deterministic benefit checks
- Mock payer EDI database (7 major dental insurers)

## Architecture

```
Patient Form → Agent Steps → Claude API → Rules Engine → Decision Output
                ↓
          7-step trace:
          1. Intake Parser
          2. Eligibility Checker
          3. Benefits Parser
          4. Coverage Analyzer
          5. Risk Detector
          6. Booking Advisor
          7. Audit Logger
```

## Roadmap

- Phase 1: Insurance verification copilot (this demo)
- Phase 2: Booking + patient communication agent
- Phase 3: Claims status / denial follow-up agent
- Phase 4: Full dental ops workspace

---

Built by [Gaurav Lochab](https://github.com/gauravlochab)
