# Tempus Sales Copilot
**GenAI Product Builder Case Study — Jack Denney, 2026**

A prototype AI-powered sales tool that helps Tempus sales reps prioritize providers and prepare for meetings using real-time generative AI.

---

## What It Does

Sales reps managing large territories struggle to synthesize CRM notes, market data, and product knowledge into a coherent "Why Tempus, Why Now?" pitch before each meeting. This tool closes that gap.

**Territory View** — All providers ranked by a calculated impact score derived from three factors: competitive opportunity (greenfield vs. incumbent), patient volume, and decision urgency (recent drug approvals, TAT failures, contract endings). Each row shows the primary reason for that provider's ranking.

**Doctor Brief** — Select any provider and generate an AI-powered brief in real time containing:
- **Objection Handler** — a spoken response to the rep's known concern, citing specific Tempus product stats and sources
- **30-Second Meeting Script** — a tailored elevator pitch built from the doctor's specialty, cancer focus, and CRM signals

Generated briefs are stored for the session so reps can switch between providers without losing work.

---

## Data Sources

The prototype ingests three mock data sources, mirroring what a production system would pull from live systems:

| Source | File | What It Contains |
|---|---|---|
| Market Intelligence | `market_intelligence.csv` | 10 oncologists with specialty, patient volume, current vendor, and relevant drug approvals |
| Product Knowledge Base | `product_knowledge_base.md` | Tempus test capabilities sourced directly from tempus.com |
| CRM Notes | `crm_notes.md` | Mock visit notes per physician including known objections and relationship history |

---

## Impact Scoring Rubric

Providers are ranked by a 100-point impact score calculated from observable data fields:

| Factor | Max | Logic |
|---|---|---|
| Competitive opportunity | 35 pts | Greenfield=35, weak incumbent=20, active switcher=15, established competitor=5 |
| Patient volume | 30 pts | Tiered from 400+ pts/yr (30) down to <200 pts/yr (5) |
| Decision urgency | 35 pts | Drug approval urgency=35, TAT failure=25, CDx education gap=20, switching signal=20, others=5–15 |

In production, this scoring would run as a scheduled pipeline against live Salesforce and market data, not be calculated client-side.

---

## Tech Stack

- **Frontend** — React + Vite
- **AI** — Anthropic Claude Sonnet (claude-sonnet-4-20250514) via streaming API
- **Styling** — Inline styles, no external CSS library

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/YOUR-USERNAME/tempus-copilot.git
cd tempus-copilot
npm install
```

Create a `.env` file in the project root:
```
VITE_ANTHROPIC_KEY=sk-ant-your-key-here
```

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Deployment

Deployed on Vercel. The `VITE_ANTHROPIC_KEY` environment variable is set in the Vercel dashboard and never committed to the repository.

---

## Assumptions

- Mock data stands in for live Salesforce CRM, market intelligence feeds, and the Tempus product catalog API
- Impact scores are calculated client-side from static fields; in production these would be pre-computed by a data pipeline and stored as a field in the CRM
- The product knowledge base was manually sourced from tempus.com in March 2026; in production this would be retrieved from a live knowledge base with regular updates
- Financial assistance and reimbursement details are based on publicly available Tempus website information

---

## Author

Jack Denney — ECE + Business, Worcester Polytechnic Institute, Class of 2026
