import { useState } from "react";

const DOCTORS = [
  { id: "P001", name: "Dr. Sarah Chen", title: "Medical Oncologist", hospital: "Northwestern Memorial", specialty: "Breast & Lung", vendor: "Foundation Medicine", patientVol: 420, concern: "Frustrated by dual-ordering for RNA fusions in NSCLC. Wants Tempus Next in Epic. HER2-low flagging is a key interest. Needs CMO buy-in for system-wide change.", primaryConcernType: "workflow" },
  { id: "P002", name: "Dr. Marcus Williams", title: "Oncologist", hospital: "U of Chicago Medicine", specialty: "GI & Colorectal", vendor: "In-house lab", patientVol: 310, concern: "Skeptical of outsourcing bioinformatics quality. In-house lab has 3+ week TAT. KRAS G12C testing volume increasing post-Krazati approval. Wants validation data.", primaryConcernType: "accuracy" },
  { id: "P003", name: "Dr. Priya Patel", title: "Hematologist-Oncologist", hospital: "Rush University Medical Center", specialty: "AML & MDS", vendor: "Quest Diagnostics", patientVol: 280, concern: "Quest TAT is too slow — up to 3 weeks. Needs MRD testing for AML patients post-Revumenib approval. Concerned about Medicaid reimbursement and MRD subtype validation.", primaryConcernType: "turnaround" },
  { id: "P004", name: "Dr. James Okafor", title: "Oncologist", hospital: "Advocate Christ Medical Center", specialty: "Prostate & GU", vendor: "None", patientVol: 390, concern: "No genomic testing partner. Not aware of companion diagnostic requirements for Olaparib. PA Renee handles ordering. Needs admin/procurement approval.", primaryConcernType: "education" },
  { id: "P005", name: "Dr. Elena Vasquez", title: "Oncologist", hospital: "Loyola University Medical Center", specialty: "Breast & Ovarian", vendor: "Foundation Medicine", patientVol: 350, concern: "FM contract ends April 2026. Wants combined somatic + germline testing for BRCA patients. Requesting 20-patient pilot before full commit. Billing team retraining concern.", primaryConcernType: "switching" },
  { id: "P006", name: "Dr. Kevin Park", title: "Neuro-Oncologist", hospital: "Northwestern Memorial", specialty: "Neuro-Oncology", vendor: "None", patientVol: 180, concern: "Urgent need for IDH1/2 testing post-Vorasidenib approval. No current vendor. Early-stage conversation — no major objections raised yet.", primaryConcernType: "urgency" },
  { id: "P007", name: "Dr. Aisha Thompson", title: "Oncologist", hospital: "Cook County Health", specialty: "Lung & Thoracic", vendor: "Caris Life Sciences", patientVol: 260, concern: "Cost and Medicaid reimbursement is #1 concern. Loyal to existing Caris rep. Skeptical of AI tools for underserved populations.", primaryConcernType: "reimbursement" },
  { id: "P008", name: "Dr. Robert Nguyen", title: "Medical Oncologist", hospital: "NorthShore University Health", specialty: "Mixed Solid Tumors", vendor: "Foundation Medicine", patientVol: 300, concern: "Very AI-forward, attended Tempus webinar. Wants Tempus One and Next. Requesting written data privacy documentation before committing.", primaryConcernType: "data_privacy" },
  { id: "P009", name: "Dr. Linda Foster", title: "Oncologist", hospital: "Silver Cross Hospital", specialty: "Community Oncology", vendor: "None", patientVol: 210, concern: "Solo community practice, limited staff. No current genomic testing partner. Open to Tempus Next as entry point. Needs simplest possible ordering workflow.", primaryConcernType: "simplicity" },
  { id: "P010", name: "Dr. David Kim", title: "Oncologist", hospital: "U of Illinois Health", specialty: "Sarcoma & Rare Tumors", vendor: "None", patientVol: 150, concern: "Rare tumor specialist — wants near-whole-exome coverage. Concerned 648-gene panel misses rare variants. Academic rigor expected. Interested in Lens data access.", primaryConcernType: "panel_breadth" }
];

const CONCERN_LABELS = {
  turnaround: "TAT / speed concern",
  accuracy: "Bioinformatics accuracy concern",
  reimbursement: "Cost / reimbursement concern",
  workflow: "Workflow integration concern",
  switching: "Switching / contract concern",
  education: "Education / awareness gap",
  urgency: "Urgent unmet need",
  data_privacy: "Data privacy concern",
  simplicity: "Workflow complexity concern",
  panel_breadth: "Panel breadth concern",
};

const PRODUCT_KB = `TEMPUS PRODUCTS — sourced from tempus.com:

xT CDx: FDA-approved 648-gene solid tumor + normal match DNA sequencing panel. Detects SNVs, MNVs, INDELs, MSI status. CDx indications for CRC and other therapies. Professional services report includes OncoKB and NCCN Guidelines. Auto-converts to xF/xF+ if tissue insufficient.

xR: Whole-transcriptome RNA sequencing. FDA 510(k) cleared Sept 2025. Detects fusions and altered splicing (MET exon 14, EGFRvIII). STAT: 21% more patients with driver fusions eligible for FDA-approved targeted therapies identified with DNA+RNA vs DNA alone (Cancer Res Commun, 2025, n=67,278).

xF / xF+: Liquid biopsy ctDNA. xF = 105 genes, xF+ = 523 genes. STAT: 9% of patients had unique actionable alterations in liquid biopsy not found in solid tumor alone (JAMA Network Open, n=1,448). xF TAT: typically 7 days from specimen retrieval.

xE: Whole exome (19,000+ genes). Best for rare tumors where standard panels may miss variants.

xM: MRD portfolio. Tumor-naive assay for colorectal cancer residual disease. NeXT Personal Dx (tumor-informed, by Personalis) for residual disease + IO monitoring. New Medicare coverage for select indications.

Hereditary testing (Ambry Genetics): CancerNext (40-gene), CancerNext-Expanded (77-gene), +RNAinsight, BRCAplus. Only platform with somatic + germline in a single workflow.

Tempus One: GenAI clinical assistant integrated into EHR (June 2025). Pre-appointment summaries, real-time transcription, post-appointment documentation, prior auth, clinical trial matching, ASCO guidelines, Agent Builder.

Tempus Next: AI care gap alert platform in EHR. Near real-time alerts when patients fall off guidelines or need testing. Confirmed in lung and breast cancer.

Tempus Lens: Research platform. 8M+ de-identified research records. 95% of top 20 pharma oncology companies use it.

KEY STATS:
- 28% reduction in false-positive calls: tumor+normal match vs tumor-only (Nature Biotechnology)
- 21% more actionable fusions with RNA seq (Cancer Res Commun, 2025)
- 9% unique alterations found only in liquid biopsy (JAMA Network Open)
- 96% clinical trial match rate when clinical + molecular data combined
- xF TAT: typically 7 days from specimen retrieval
- Financial assistance: all US patients eligible regardless of insurance. Apply at access.tempus.com, immediate decision on max out-of-pocket.`;

function Tag({ type, children }) {
  const styles = {
    priority: { bg: "#E6F1FB", color: "#185FA5" },
    objection: { bg: "#FAEEDA", color: "#854F0B" },
    pitch: { bg: "#EAF3DE", color: "#3B6D11" },
  };
  const s = styles[type] || styles.priority;
  return (
    <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", padding: "3px 8px", borderRadius: 99, background: s.bg, color: s.color }}>
      {children}
    </span>
  );
}

function Card({ tagType, tagLabel, title, sourceLabel, children }) {
  return (
    <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tag type={tagType}>{tagLabel}</Tag>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{title}</span>
        </div>
        {sourceLabel && <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>{sourceLabel}</span>}
      </div>
      {children}
    </div>
  );
}

// Impact Score Rubric — max 100 pts across three factors:
// 1. Competitive opportunity (35 pts) — how winnable is this account?
// 2. Patient volume opportunity (30 pts) — how big is the addressable patient base?
// 3. Decision urgency (35 pts) — how time-sensitive is the trigger?

const URGENCY_SCORES = {
  urgency: 35,      // active drug approval with no testing solution in place
  turnaround: 25,   // current vendor is actively failing them
  education: 20,    // unaware of CDx requirements — easy win once educated
  switching: 20,    // contract ending or active evaluation in progress
  accuracy: 15,     // quality concern with incumbent — addressable with data
  simplicity: 10,   // workflow friction — solvable with Tempus Hub/EHR integration
  data_privacy: 10, // privacy concern — solvable with written documentation
  reimbursement: 10,// cost concern — solvable with financial assistance program
  workflow: 10,     // integration concern — solvable with Epic/EHR integration
  panel_breadth: 10,// panel coverage concern — addressable with xE whole exome
};

const DRUG_TRIGGERS = {
  "Breast & Lung": "Enhertu (HER2-low) + Keytruda (NSCLC) approvals create immediate testing demand",
  "GI & Colorectal": "Krazati (KRAS G12C) approval driving surge in CGP testing volume",
  "AML & MDS": "Revumenib (KMT2A AML) approval requires molecular subtype confirmation",
  "Prostate & GU": "Olaparib CDx requires HRD+ testing before prescribing — greenfield account",
  "Breast & Ovarian": "Lynparza + Truqap require BRCA/PIK3CA testing; FM contract ending April 2026",
  "Neuro-Oncology": "Vorasidenib approval for IDH1/2 glioma — urgent unmet need, no current vendor",
  "Lung & Thoracic": "Tagrisso + Rybrevant EGFR approvals; coverage pathway needed for Medicaid patients",
  "Mixed Solid Tumors": "Multiple TMB/MSI-relevant approvals; AI-forward physician ready to convert from FM",
  "Community Oncology": "Greenfield community practice — no incumbent to displace, Tempus Next as entry point",
  "Sarcoma & Rare Tumors": "Rare tumor panel gap — xE whole exome (19,000+ genes) directly addresses need",
};

function calcImpact(d) {
  // Factor 1: Competitive opportunity (0–35 pts)
  let competitive = 0;
  if (d.vendor === "None") competitive = 35;
  else if (["Quest Diagnostics", "In-house lab"].includes(d.vendor)) competitive = 20;
  else if (d.primaryConcernType === "switching") competitive = 15;
  else competitive = 5;

  // Factor 2: Patient volume opportunity (0–30 pts)
  let volume = 0;
  if (d.patientVol >= 400) volume = 30;
  else if (d.patientVol >= 350) volume = 25;
  else if (d.patientVol >= 300) volume = 20;
  else if (d.patientVol >= 250) volume = 15;
  else if (d.patientVol >= 200) volume = 10;
  else volume = 5;

  // Factor 3: Decision urgency (0–35 pts)
  const urgency = URGENCY_SCORES[d.primaryConcernType] ?? 5;

  const score = competitive + volume + urgency;
  const rationale = DRUG_TRIGGERS[d.specialty] ?? `${d.vendor === "None" ? "Greenfield" : d.vendor} · ${d.patientVol} pts/yr`;

  return { score, competitive, volume, urgency, rationale };
}

function parseRankedList(text) {
  return text
    .split("\n")
    .filter(l => {
      const t = l.trim();
      if (!t) return false;
      if (/^-+$/.test(t)) return false;
      if (/^#+$/.test(t)) return false;
      if (!/^\d+\./.test(t)) return false;
      return true;
    })
    .map(line => {
      const clean = line.replace(/\*\*/g, "");
      const m = clean.match(/^(\d+)\.\s+(.+?)\s*[—–\-]+\s*(.+)$/);
      if (m) return { num: m[1], name: m[2].trim(), reason: m[3].trim() };
      return { num: clean.match(/^(\d+)/)?.[1] || "·", name: "", reason: clean.replace(/^\d+\.\s*/, "").trim() };
    });
}

function cleanSection(text) {
  return text
    .trim()
    .replace(/[\s\n]*[-#]+\s*$/, "")
    .trim();
}

function parseOutput(text) {
  const r = text.match(/RANKED_PROVIDERS:([\s\S]*?)(?=OBJECTION_HANDLER:|$)/);
  const o = text.match(/OBJECTION_HANDLER:([\s\S]*?)(?=MEETING_SCRIPT:|$)/);
  const p = text.match(/MEETING_SCRIPT:([\s\S]*?)$/);
  return {
    ranked: r ? cleanSection(r[1]) : "",
    objection: o ? cleanSection(o[1]) : "",
    pitch: p ? cleanSection(p[1]) : "",
  };
}

function formatTimestamp(ts) {
  if (!ts) return null;
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function impactBadge(score) {
  if (score >= 70) return { bg: "#EAF3DE", color: "#3B6D11" };
  if (score >= 50) return { bg: "#FAEEDA", color: "#854F0B" };
  return { bg: "#F1EFE8", color: "#5F5E5A" };
}

export default function App() {
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefs, setBriefs] = useState({});
  const [error, setError] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [view, setView] = useState("territory");
  const [showRubric, setShowRubric] = useState(false);

  function copyPitch() {
    if (!result?.pitch) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(result.pitch).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      } else {
        const el = document.createElement("textarea");
        el.value = result.pitch;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      setCopied(false);
    }
  }

  const doctor = DOCTORS.find(d => d.id === selectedId) || null;
  const result = selectedId ? briefs[selectedId] || null : null;
  const sortedDoctors = [...DOCTORS]
    .map(d => ({ ...d, impact: calcImpact(d) }))
    .sort((a, b) => b.impact.score - a.impact.score);

  async function generateBrief() {
    if (!doctor) return;
    const doctorId = doctor.id;
    setLoading(true);
    setError(null);
    setBriefs(prev => ({ ...prev, [doctorId]: { ranked: "", objection: "", pitch: "", generatedAt: Date.now() } }));
    setStreaming(true);
    setView("brief");

    const allSummary = DOCTORS.map(d => {
      const impact = calcImpact(d);
      return `${d.name} | ${d.hospital} | ${d.specialty} | Est. annual patients: ${d.patientVol} | Impact score: ${impact.score} | Vendor: ${d.vendor}`;
    }).join("\n");

    const prompt = `You are a Tempus AI sales intelligence assistant. Generate a sales brief for a rep preparing for a provider meeting.

PRODUCT KNOWLEDGE BASE:
${PRODUCT_KB}

ALL PROVIDERS IN TERRITORY:
${allSummary}

SELECTED PROVIDER — CRM NOTES:
Name: ${doctor.name}, ${doctor.title} at ${doctor.hospital}
Specialty: ${doctor.specialty}
Est. annual oncology patients: ${doctor.patientVol}
Current vendor: ${doctor.vendor}
Impact score: ${calcImpact(doctor).score}/100
Primary concern: ${CONCERN_LABELS[doctor.primaryConcernType]}
CRM context: ${doctor.concern}

Generate exactly two sections using these EXACT headers:

OBJECTION_HANDLER:
Write a 2-3 sentence spoken response to ${doctor.name}'s primary concern (${CONCERN_LABELS[doctor.primaryConcernType]}). You MUST cite at least one specific stat or product capability from the knowledge base, including its source. Write it as something the rep would say out loud in the meeting.

MEETING_SCRIPT:
Write a 30-second elevator pitch for ${doctor.name} in first person as the sales rep. Structure: (1) open with their specific clinical challenge or a relevant recent drug approval, (2) name the gap Tempus closes, (3) cite one concrete Tempus capability or stat relevant to their cancer focus. Make it feel human and specific, not like a brochure.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API error ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              fullText += parsed.delta.text;
              setBriefs(prev => ({ ...prev, [doctorId]: { ...parseOutput(fullText), generatedAt: prev[doctorId]?.generatedAt || Date.now() } }));
            }
          } catch (e) {}
        }
      }

      setBriefs(prev => ({ ...prev, [doctorId]: { ...parseOutput(fullText), generatedAt: prev[doctorId]?.generatedAt || Date.now() } }));
      setStreaming(false);
    } catch (err) {
      setError(err.message || "Failed to generate brief. Please try again.");
      setBriefs(prev => { const n = { ...prev }; delete n[doctorId]; return n; });
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  }

  const ss = {
    app: { fontFamily: "var(--font-sans, system-ui, sans-serif)", display: "flex", minHeight: 640, border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", borderRadius: 12, overflow: "hidden" },
    sidebar: { width: 256, flexShrink: 0, background: "var(--color-background-secondary, #f7f7f5)", borderRight: "0.5px solid var(--color-border-tertiary, #e0e0e0)", display: "flex", flexDirection: "column" },
    content: { flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 },
    label: { fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-tertiary, #999)", marginBottom: 6 },
    tabBtn: (active) => ({ padding: "5px 12px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "0.5px solid", borderColor: active ? "var(--color-border-secondary, #ccc)" : "transparent", background: active ? "var(--color-background-primary, #fff)" : "transparent", color: active ? "var(--color-text-primary, #111)" : "var(--color-text-secondary, #666)", cursor: "pointer", fontFamily: "inherit" }),
  };

  return (
    <div style={ss.app}>
      {/* Sidebar */}
      <div style={ss.sidebar}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "var(--color-text-tertiary, #999)", textTransform: "uppercase", marginBottom: 3 }}>Tempus</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>Sales Copilot</div>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)", marginTop: 3 }}>Greater Chicago · Demo Territory</div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--color-border-tertiary, #e0e0e0)", fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>Jack Denney · Case Study 2026</div>
        </div>

        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)" }}>
          <div style={ss.label}>Select Provider</div>
          <select
            value={selectedId}
            onChange={e => { setSelectedId(e.target.value); setError(null); setView(e.target.value && briefs[e.target.value] ? "brief" : "territory"); }}
            style={{ width: "100%", padding: "7px 10px", fontSize: 12, borderRadius: 8, border: "0.5px solid var(--color-border-secondary, #ccc)", background: "var(--color-background-primary, #fff)", color: "var(--color-text-primary, #111)", fontFamily: "inherit", cursor: "pointer" }}
          >
            <option value="">— choose a provider —</option>
            {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        {doctor && (
          <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)" }}>
            <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{doctor.name}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginTop: 1 }}>{doctor.title} · {doctor.hospital}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginTop: 1 }}>{doctor.specialty} · {doctor.patientVol} pts/yr</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 500, ...impactBadge(calcImpact(doctor).score) }}>Impact {calcImpact(doctor).score}</span>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>{doctor.vendor === "None" ? "No vendor" : doctor.vendor}</span>
              </div>
              <div style={{ marginTop: 8, padding: "7px 9px", background: "var(--color-background-secondary, #f7f7f5)", borderRadius: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary, #999)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>CRM note</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary, #666)", lineHeight: 1.55 }}>
                  {doctor.concern.length > 110 ? doctor.concern.slice(0, 110) + "…" : doctor.concern}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: "0 16px 16px", marginTop: "auto" }}>
          {/* Scoring rubric toggle */}
          <div style={{ marginBottom: 10 }}>
            <button
              onClick={() => setShowRubric(r => !r)}
              style={{ width: "100%", padding: "8px 10px", fontSize: 12, fontWeight: 500, borderRadius: 8, border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", background: showRubric ? "var(--color-background-primary, #fff)" : "transparent", color: "var(--color-text-secondary, #666)", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span>Impact scoring rubric</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary, #999)" }}>{showRubric ? "▲" : "▼"}</span>
            </button>
            {showRubric && (
              <div style={{ marginTop: 6, background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", borderRadius: 8, overflow: "hidden", fontSize: 11 }}>
                {/* Factor 1 */}
                <div style={{ padding: "10px 12px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)" }}>
                  <div style={{ fontWeight: 500, color: "var(--color-text-primary, #111)", marginBottom: 5 }}>Competitive opportunity <span style={{ fontWeight: 400, color: "var(--color-text-tertiary, #999)" }}>/ 35 pts</span></div>
                  {[
                    ["Greenfield (no vendor)", "35"],
                    ["Weak incumbent (Quest / in-house)", "20"],
                    ["Active switching signal", "15"],
                    ["Established competitor", "5"],
                  ].map(([label, pts]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary, #666)", marginTop: 3 }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{pts}</span>
                    </div>
                  ))}
                </div>
                {/* Factor 2 */}
                <div style={{ padding: "10px 12px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)" }}>
                  <div style={{ fontWeight: 500, color: "var(--color-text-primary, #111)", marginBottom: 5 }}>Patient volume <span style={{ fontWeight: 400, color: "var(--color-text-tertiary, #999)" }}>/ 30 pts</span></div>
                  {[
                    ["400+ pts/yr", "30"],
                    ["350–399 pts/yr", "25"],
                    ["300–349 pts/yr", "20"],
                    ["250–299 pts/yr", "15"],
                    ["200–249 pts/yr", "10"],
                    ["< 200 pts/yr", "5"],
                  ].map(([label, pts]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary, #666)", marginTop: 3 }}>
                      <span>{label}</span>
                      <span style={{ fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{pts}</span>
                    </div>
                  ))}
                </div>
                {/* Factor 3 */}
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 500, color: "var(--color-text-primary, #111)", marginBottom: 5 }}>Decision urgency <span style={{ fontWeight: 400, color: "var(--color-text-tertiary, #999)" }}>/ 35 pts</span></div>
                  {[
                    ["Drug approval, no testing solution", "35"],
                    ["Current vendor actively failing", "25"],
                    ["CDx education gap", "20"],
                    ["Contract ending / evaluating", "20"],
                    ["Quality / accuracy concern", "15"],
                    ["Workflow / privacy / cost concern", "10"],
                  ].map(([label, pts]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary, #666)", marginTop: 3 }}>
                      <span style={{ flex: 1, paddingRight: 8 }}>{label}</span>
                      <span style={{ fontWeight: 500, color: "var(--color-text-primary, #111)", flexShrink: 0 }}>{pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={generateBrief}
            disabled={!doctor || loading}
            style={{ width: "100%", padding: "9px", fontSize: 13, fontWeight: 500, borderRadius: 8, border: "0.5px solid var(--color-border-secondary, #ccc)", background: "var(--color-background-primary, #fff)", color: "var(--color-text-primary, #111)", cursor: !doctor || loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: !doctor || loading ? 0.5 : 1 }}
          >
            {loading ? "Generating…" : result ? "Regenerate brief ↗" : "Generate sales brief ↗"}
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ padding: "13px 20px", borderBottom: "0.5px solid var(--color-border-tertiary, #e0e0e0)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button style={ss.tabBtn(view === "territory")} onClick={() => setView("territory")}>Territory view</button>
            <button style={ss.tabBtn(view === "brief")} onClick={() => setView("brief")} disabled={!result && !loading}>
              Doctor brief {doctor && result ? `· ${doctor.name.split(" ").slice(-1)[0]}` : ""}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: loading ? "#BA7517" : result ? "#639922" : "var(--color-border-secondary, #ccc)" }} />
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>{loading ? "Generating…" : result ? `${Object.keys(briefs).length} brief${Object.keys(briefs).length !== 1 ? "s" : ""} saved` : "Idle"}</span>
          </div>
        </div>

        <div style={ss.content}>

          {/* TERRITORY VIEW */}
          {view === "territory" && (
            <>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary, #666)" }}>
                {sortedDoctors.length} providers ranked by impact score. Select a provider and generate a brief for AI-powered insights.
              </div>
              <Card tagType="priority" tagLabel="Priority" title="All providers — ranked by impact" sourceLabel="Source: market intelligence CSV">
                <div>
                  {sortedDoctors.map((d, i) => {
                    const ib = impactBadge(d.impact.score);
                    const isSelected = d.id === selectedId;
                    return (
                      <div
                        key={d.id}
                        onClick={() => { setSelectedId(d.id); setError(null); setView(briefs[d.id] ? "brief" : "territory"); }}
                        style={{ padding: "10px 16px", borderBottom: i < sortedDoctors.length - 1 ? "0.5px solid var(--color-border-tertiary, #e0e0e0)" : "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: isSelected ? "var(--color-background-secondary, #f7f7f5)" : "transparent" }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary, #999)", minWidth: 18 }}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{d.name}</span>
                            <span style={{ padding: "1px 7px", borderRadius: 99, fontSize: 10, fontWeight: 500, ...ib }}>Impact {d.impact.score}</span>
                            {d.vendor === "None" && <span style={{ padding: "1px 7px", borderRadius: 99, fontSize: 10, background: "#E6F1FB", color: "#185FA5" }}>Greenfield</span>}
                            {briefs[d.id] && <span style={{ padding: "1px 7px", borderRadius: 99, fontSize: 10, background: "#EAF3DE", color: "#3B6D11" }}>Brief ready</span>}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginTop: 2 }}>{d.hospital} · {d.specialty} · {d.patientVol} pts/yr</div>
                          <div style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)", marginTop: 2, lineHeight: 1.5 }}>{d.impact.rationale}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}

          {/* BRIEF VIEW */}
          {view === "brief" && (
            <>
              {error && (
                <div style={{ padding: 14, background: "#FCEBEB", border: "0.5px solid #F7C1C1", borderRadius: 8, fontSize: 13, color: "#A32D2D" }}>{error}</div>
              )}

              {!result && !error && !loading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--color-text-tertiary, #999)", fontSize: 13, textAlign: "center", padding: 40, gap: 8 }}>
                  <div style={{ fontSize: 26, marginBottom: 4 }}>⬡</div>
                  <div style={{ fontWeight: 500, color: "var(--color-text-secondary, #666)" }}>No brief generated yet</div>
                  <div>{doctor ? `Click "Generate sales brief" for ${doctor.name}` : "Select a provider first"}</div>
                </div>
              )}

              {(result || loading) && doctor && (
                <>
                  {/* Doctor brief header */}
                  {(() => {
                    const impact = calcImpact(doctor);
                    const ib = impactBadge(impact.score);
                    return (
                      <div style={{ background: "var(--color-background-primary, #fff)", border: "0.5px solid var(--color-border-tertiary, #e0e0e0)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary, #111)" }}>{doctor.name}</div>
                          <div style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", marginTop: 2 }}>{doctor.title} · {doctor.hospital}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                            <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 500, ...ib }}>Impact {impact.score}/100</span>
                            {doctor.vendor === "None"
                              ? <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, background: "#E6F1FB", color: "#185FA5" }}>Greenfield</span>
                              : <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, background: "var(--color-background-secondary, #f7f7f5)", color: "var(--color-text-secondary, #666)" }}>{doctor.vendor}</span>
                            }
                            <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, background: "var(--color-background-secondary, #f7f7f5)", color: "var(--color-text-secondary, #666)" }}>{doctor.patientVol} pts/yr</span>
                            <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, background: "var(--color-background-secondary, #f7f7f5)", color: "var(--color-text-secondary, #666)" }}>{CONCERN_LABELS[doctor.primaryConcernType]}</span>
                            {result?.generatedAt && (
                              <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, background: "var(--color-background-secondary, #f7f7f5)", color: "var(--color-text-tertiary, #999)" }}>
                                Generated {formatTimestamp(result.generatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Objection Handler */}
                  <Card tagType="objection" tagLabel="Objection" title={`Handler — ${CONCERN_LABELS[doctor.primaryConcernType] || "known concern"}`} sourceLabel="Source: CRM notes + product KB">
                    <div style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: 11, color: "var(--color-text-tertiary, #999)", marginBottom: 10, padding: "6px 10px", background: "var(--color-background-secondary, #f7f7f5)", borderRadius: 6, lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 500 }}>Addressing: </span>{doctor.concern.slice(0, 100)}{doctor.concern.length > 100 ? "…" : ""}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--color-text-primary, #111)", opacity: streaming && !result?.objection ? 0.4 : 1 }}>
                        {result?.objection || <span style={{ color: "var(--color-text-tertiary, #999)" }}>Generating…</span>}
                      </div>
                    </div>
                  </Card>

                  {/* Meeting Script */}
                  <Card tagType="pitch" tagLabel="Pitch" title="30-second meeting script" sourceLabel="Source: CRM notes + product KB">
                    <div style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 10, fontSize: 11, color: "var(--color-text-tertiary, #999)" }}>
                        <span><span style={{ fontWeight: 500 }}>Specialty:</span> {doctor.specialty}</span>
                        <span><span style={{ fontWeight: 500 }}>Volume:</span> {doctor.patientVol} pts/yr</span>
                        <span><span style={{ fontWeight: 500 }}>Key concern:</span> {CONCERN_LABELS[doctor.primaryConcernType]}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.7, color: "var(--color-text-primary, #111)", opacity: streaming && !result?.pitch ? 0.4 : 1 }}>
                        {result?.pitch || <span style={{ color: "var(--color-text-tertiary, #999)" }}>Generating…</span>}
                      </div>
                      {result?.pitch && !streaming && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary, #e0e0e0)", display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={copyPitch}
                            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 500, borderRadius: 6, border: "0.5px solid var(--color-border-secondary, #ccc)", background: copied ? "#EAF3DE" : "var(--color-background-primary, #fff)", color: copied ? "#3B6D11" : "var(--color-text-secondary, #666)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                          >
                            {copied ? "Copied!" : "Copy script"}
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
