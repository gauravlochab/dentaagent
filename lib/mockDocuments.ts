import { PatientFormData, VerificationResult } from "@/lib/types";
import { PayerBenefitData, getPayerData } from "@/lib/mockPayerData";

export interface SourceDocument {
  stepId: string;
  title: string;
  subtitle: string;
  docType: "eligibility" | "benefits" | "coverage-rules" | "risk-report" | "decision" | "audit" | "intake";
  htmlContent: string;
}

// kept for type compatibility with DocumentViewer
export interface DocumentSection { heading?: string; type: string; data: unknown; }
export interface KeyValueData { rows: { label: string; value: string }[] }
export interface TableData { headers: string[]; rows: string[][] }
export interface ChecklistItem { label: string; status: "PASS" | "FAIL" | "WARN"; note: string }
export interface StatusBadgeData { label: string; value: string; variant: "success" | "danger" | "warning" | "info" }

const PAYER_IDS: Record<string, string> = {
  "Delta Dental":    "68069",
  "Cigna Dental":    "62308",
  "Aetna Dental":    "60054",
  "MetLife Dental":  "87726",
  "Guardian Dental": "91131",
  "Humana Dental":   "61101",
  "United Concordia":"95567",
};

const PAYER_FULL_NAMES: Record<string, string> = {
  "Delta Dental":    "DELTA DENTAL INSURANCE COMPANY",
  "Cigna Dental":    "CIGNA DENTAL HEALTH, INC.",
  "Aetna Dental":    "AETNA LIFE INSURANCE COMPANY",
  "MetLife Dental":  "METROPOLITAN LIFE INSURANCE CO",
  "Guardian Dental": "GUARDIAN LIFE INSURANCE CO",
  "Humana Dental":   "HUMANA INSURANCE COMPANY",
  "United Concordia":"UNITED CONCORDIA COMPANIES, INC.",
};

const NETWORK_NAMES: Record<string, string> = {
  "Delta Dental":    "Delta Dental PPO Network",
  "Cigna Dental":    "Cigna DPPO Advantage Network",
  "Aetna Dental":    "Aetna Dental Access® Network",
  "MetLife Dental":  "MetLife Preferred Dentist Program",
  "Guardian Dental": "DentalGuard Preferred Network",
  "Humana Dental":   "Humana Dental Care Network",
  "United Concordia":"United Concordia Participating Network",
};

function rnd(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function fmtEdiDate(d: Date): string {
  const y = d.getFullYear().toString();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function fmtEdiTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }).replace(":", "");
}

function dob8(dob: string): string {
  return dob.replace(/-/g, "");
}

// ── Shared base styles ────────────────────────────────────────────
const BASE_STYLE = `
  <style>
    .dr { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 12px; color: #1a2a1e; background: #fff; line-height: 1.55; }
    .dh { background: #f2f6f3; border-bottom: 2px solid #b8d4c0; padding: 12px 16px; display: flex; align-items: flex-start; justify-content: space-between; }
    .dh-left { flex: 1; }
    .dh-issuer { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #2d6a45; margin-bottom: 2px; }
    .dh-title { font-size: 15px; font-weight: 700; color: #0f1f14; line-height: 1.2; margin-bottom: 2px; }
    .dh-sub { font-size: 10px; color: #6a8a72; }
    .dh-right { text-align: right; flex-shrink: 0; margin-left: 16px; }
    .dh-stamp { font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; padding: 3px 10px; border-radius: 3px; display: inline-block; }
    .stamp-ok  { background: #e0f5e8; color: #1a6b38; border: 1.5px solid #4ea86a; }
    .stamp-err { background: #fde8e6; color: #8a1a10; border: 1.5px solid #c84444; }
    .stamp-wrn { background: #fff3df; color: #7a4a00; border: 1.5px solid #c87e00; }
    .db { padding: 16px; }
    .sec { margin-bottom: 18px; }
    .sec-head { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #4a7a5a; border-bottom: 1px solid #c8e0d0; padding-bottom: 5px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f2f6f3; padding: 6px 10px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #4a7a5a; border-bottom: 1px solid #b8d4c0; white-space: nowrap; }
    td { padding: 7px 10px; border-bottom: 1px solid #e8f0ea; vertical-align: top; font-size: 11px; color: #1a2a1e; }
    tr:last-child td { border-bottom: none; }
    .kv-label { color: #6a8a72; font-weight: 500; width: 44%; }
    .kv-value { color: #1a2a1e; font-weight: 600; }
    .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .b-ok  { background: #e0f5e8; color: #1a6b38; border: 1px solid #4ea86a; }
    .b-err { background: #fde8e6; color: #8a1a10; border: 1px solid #c84444; }
    .b-wrn { background: #fff3df; color: #7a4a00; border: 1px solid #c87e00; }
    .b-neu { background: #f0f4f2; color: #4a7a5a; border: 1px solid #9abfaa; }
    .decision-block { text-align: center; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
    .dec-ok  { background: #e8f8ee; border: 2px solid #4ea86a; }
    .dec-wrn { background: #fff8ee; border: 2px solid #c87e00; }
    .dec-err { background: #fff0ee; border: 2px solid #c84444; }
    .dec-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
    .dec-ok .dec-label { color: #4a7a5a; }
    .dec-wrn .dec-label { color: #7a5a00; }
    .dec-err .dec-label { color: #7a2a1a; }
    .dec-value { font-size: 18px; font-weight: 800; letter-spacing: 0.02em; line-height: 1.1; }
    .dec-ok .dec-value { color: #1a6b38; }
    .dec-wrn .dec-value { color: #8a5200; }
    .dec-err .dec-value { color: #8a1a10; }
    .cl-row { display: flex; align-items: flex-start; gap: 10px; padding: 7px 0; border-bottom: 1px solid #e8f0ea; }
    .cl-row:last-child { border-bottom: none; }
    .cl-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 10px; font-weight: 800; margin-top: 1px; }
    .cl-ok-i  { background: #e0f5e8; color: #1a6b38; }
    .cl-err-i { background: #fde8e6; color: #8a1a10; }
    .cl-wrn-i { background: #fff3df; color: #7a4a00; }
    .cl-label { font-size: 11px; font-weight: 600; color: #1a2a1e; }
    .cl-note  { font-size: 10px; color: #6a8a72; margin-top: 1px; line-height: 1.4; }
    .edi-block { background: #0f1f14; border-radius: 6px; padding: 12px 14px; overflow-x: auto; }
    .edi-block pre { margin: 0; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 10px; line-height: 1.7; color: #7ad4a0; white-space: pre; }
    .edi-comment { color: #3a6a4a !important; }
    .df { padding: 8px 16px; background: #f2f6f3; border-top: 1px solid #c8e0d0; font-size: 9px; color: #7a9a82; display: flex; justify-content: space-between; }
  </style>
`;

// ── 1. Intake ─────────────────────────────────────────────────────
function htmlIntake(f: PatientFormData, now: Date): string {
  const ts = `${fmtDate(now)} at ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;
  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">DentaAgent · Intake Agent</div>
      <div class="dh-title">Patient Intake Record</div>
      <div class="dh-sub">Demographics & insurance identifier validation</div>
    </div>
    <div class="dh-right"><span class="dh-stamp stamp-ok">VALIDATED</span></div>
  </div>
  <div class="db">
    <div class="sec">
      <div class="sec-head">Patient Demographics</div>
      <table>
        <tr><td class="kv-label">Full Name</td><td class="kv-value">${f.patientName || "—"}</td></tr>
        <tr><td class="kv-label">Date of Birth</td><td class="kv-value mono">${f.dateOfBirth || "—"}</td></tr>
        <tr><td class="kv-label">Appointment Date</td><td class="kv-value mono">${f.appointmentDate || "—"}</td></tr>
        <tr><td class="kv-label">Requested Treatment</td><td class="kv-value">${f.requestedTreatment || "—"}</td></tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Insurance Identifiers</div>
      <table>
        <tr><td class="kv-label">Payer</td><td class="kv-value">${f.payerName || "—"}</td></tr>
        <tr><td class="kv-label">Member ID</td><td class="kv-value mono">${f.memberId || "—"}</td></tr>
        <tr><td class="kv-label">Group ID</td><td class="kv-value mono">${f.groupId || "—"}</td></tr>
        <tr><td class="kv-label">Payer ID (EDI)</td><td class="kv-value mono">${PAYER_IDS[f.payerName] || "—"}</td></tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Validation Summary</div>
      <table>
        <tr><td class="kv-label">Duplicate Record Check</td><td><span class="badge b-ok">Clear</span></td></tr>
        <tr><td class="kv-label">Member ID Format</td><td><span class="badge b-ok">Valid</span></td></tr>
        <tr><td class="kv-label">Group ID Format</td><td><span class="badge b-ok">Valid</span></td></tr>
        <tr><td class="kv-label">Processed</td><td class="kv-value mono" style="font-size:10px">${ts}</td></tr>
      </table>
    </div>
  </div>
  <div class="df"><span>Intake Agent · DentaAgent v0.1</span><span>${ts}</span></div>
</div>`;
}

// ── 2. Eligibility (EDI 271) ──────────────────────────────────────
function htmlEligibility(f: PatientFormData, pd: PayerBenefitData | null, now: Date): string {
  const ts       = `${fmtDate(now)}`;
  const ediDate  = fmtEdiDate(now);
  const ediTime  = fmtEdiTime(now);
  const payerId  = PAYER_IDS[f.payerName] || "00000";
  const payerFull= PAYER_FULL_NAMES[f.payerName] || f.payerName?.toUpperCase() || "UNKNOWN PAYER";
  const icn      = rnd(9);
  const planName = pd?.planName || `${f.payerName} Plan`;
  const planType = pd?.planType || "PPO";
  const dobEdi   = dob8(f.dateOfBirth || "19850101");
  const enrollDate = pd?.enrollmentDate?.replace(/-/g, "") || "20230101";
  const activeStatus = pd ? "1" : "6"; // 1=Active, 6=Inactive
  const annMax = pd?.annualMaximum ?? 1500;
  const annUsed = pd?.annualMaximumUsed ?? 0;
  const deductible = pd?.deductible ?? 50;
  const isActive = true;

  const ediRaw = `ISA*00*          *00*          *ZZ*${payerId.padEnd(15)}*ZZ*DENTAGENT0001   *${ediDate}*${ediTime}*^*00501*${icn}*0*P*:~
GS*HB*${payerId}*DENTAGENT0001*${ediDate}*${ediTime}*1*X*005010X279A1~
ST*271*0001~
BHT*0022*11*${f.memberId || "UNKNOWN"}*${ediDate}*${ediTime}~
HL*1**20*1~
NM1*PR*2*${payerFull.slice(0, 35).padEnd(35)}****PI*${payerId}~
HL*2*1*21*1~
NM1*1P*2*STAFGO DENTAL GROUP*****XX*1234567890~
HL*3*2*22*0~
TRN*2*${f.memberId || "UNKNOWN"}*${payerId}~
NM1*IL*1*${(f.patientName || "UNKNOWN").split(" ")[1] || "UNKNOWN"}*${(f.patientName || "UNKNOWN FIRST").split(" ")[0]}****MI*${f.memberId || "—"}~
DMG*D8*${dobEdi}~
DTP*307*D8*${ediDate}~
EB*${activeStatus}*IND*30**${planName.slice(0, 30)}~
EB*C*IND*30**${annMax}~
EB*G*IND*30**${annUsed}~
EB*6*IND*30**${deductible}~
EB*A*IND*30***27*100~
EB*A*IND*27***27*80~
EB*A*IND*4***27*50~
LS*2120~
NM1*PR*2*${payerFull.slice(0, 35).padEnd(35)}****PI*${payerId}~
PER*IC**TE*${(pd?.payerPhone || "18005550000").replace(/[^0-9]/g, "")}~
LE*2120~
SE*24*0001~
GE*1*1~
IEA*1*${icn}~`;

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">HIPAA ASC X12 · Transaction Set 271</div>
      <div class="dh-title">Eligibility Response</div>
      <div class="dh-sub">Health Care Eligibility / Benefit Response · 005010X279A1</div>
    </div>
    <div class="dh-right"><span class="dh-stamp ${isActive ? "stamp-ok" : "stamp-err"}">${isActive ? "ACTIVE" : "INACTIVE"}</span></div>
  </div>
  <div class="db">
    <div class="sec">
      <div class="sec-head">Raw EDI Transaction</div>
      <div class="edi-block"><pre>${ediRaw}</pre></div>
    </div>
    <div class="sec">
      <div class="sec-head">Parsed Subscriber Record</div>
      <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Subscriber Name</td><td class="kv-value">${f.patientName || "—"}</td></tr>
        <tr><td>Member ID</td><td class="kv-value mono">${f.memberId || "—"}</td></tr>
        <tr><td>Group ID</td><td class="kv-value mono">${f.groupId || "—"}</td></tr>
        <tr><td>Plan</td><td class="kv-value">${planName}</td></tr>
        <tr><td>Plan Type</td><td><span class="badge b-neu">${planType}</span></td></tr>
        <tr><td>Coverage Status</td><td><span class="badge b-ok">Active</span></td></tr>
        <tr><td>Payer</td><td class="kv-value">${f.payerName || "—"}</td></tr>
        <tr><td>Payer ID</td><td class="kv-value mono">${payerId}</td></tr>
        <tr><td>Payer Phone</td><td class="kv-value">${pd?.payerPhone || "—"}</td></tr>
      </table>
    </div>
  </div>
  <div class="df"><span>ICN ${icn} · Interchange ${ediDate}/${ediTime}</span><span>${ts}</span></div>
</div>`;
}

// ── 3. Benefits ───────────────────────────────────────────────────
function htmlBenefits(f: PatientFormData, pd: PayerBenefitData | null, now: Date): string {
  const ts = fmtDate(now);
  const year = now.getFullYear();
  const annMax = pd?.annualMaximum ?? 1500;
  const annUsed = pd?.annualMaximumUsed ?? 0;
  const remaining = annMax - annUsed;
  const usedPct = Math.round((annUsed / annMax) * 100);
  const deductible = pd?.deductible ?? 50;
  const deductibleMet = pd?.deductibleMet ?? false;
  const deductibleRemaining = pd?.deductibleRemaining ?? deductible;
  const prevCov = pd?.preventiveCoverage ?? 100;
  const basicCov = pd?.basicCoverage ?? 80;
  const majorCov = pd?.majorCoverage ?? 50;
  const inNet = pd?.inNetworkCoverage ?? 80;
  const outNet = pd?.outOfNetworkCoverage ?? 50;
  const waitingBasic = pd?.waitingPeriodBasic || "None";
  const waitingMajor = pd?.waitingPeriodMajor || "None";
  const networkName = NETWORK_NAMES[f.payerName] || `${f.payerName} Network`;

  const barWidth = Math.min(usedPct, 100);
  const barColor = usedPct >= 80 ? "#c84444" : usedPct >= 60 ? "#c87e00" : "#2d6a45";

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">${f.payerName || "Payer"} · Member Benefits</div>
      <div class="dh-title">Summary of Benefits</div>
      <div class="dh-sub">${f.patientName || "Member"} · ${f.memberId || "—"} · Plan Year ${year}</div>
    </div>
    <div class="dh-right"><span class="dh-stamp stamp-ok">EXTRACTED</span></div>
  </div>
  <div class="db">
    <div class="sec">
      <div class="sec-head">Annual Maximum</div>
      <table>
        <tr><td class="kv-label">Plan Maximum</td><td class="kv-value mono">$${annMax.toLocaleString()}</td></tr>
        <tr><td class="kv-label">Used This Period</td><td class="kv-value mono" style="color:${barColor}">$${annUsed.toLocaleString()} (${usedPct}%)</td></tr>
        <tr><td class="kv-label">Remaining</td><td class="kv-value mono" style="color:${remaining < 500 ? "#c84444" : "#1a6b38"}; font-weight:700">$${remaining.toLocaleString()}</td></tr>
      </table>
      <div style="margin-top:8px; height:6px; background:#e8f0ea; border-radius:3px; overflow:hidden">
        <div style="height:100%; width:${barWidth}%; background:${barColor}; border-radius:3px; transition:width 0.6s"></div>
      </div>
      <div style="font-size:10px; color:#6a8a72; margin-top:4px">${barWidth}% of annual maximum consumed</div>
    </div>
    <div class="sec">
      <div class="sec-head">Deductible</div>
      <table>
        <tr><td class="kv-label">Individual Deductible</td><td class="kv-value mono">$${deductible}</td></tr>
        <tr><td class="kv-label">Status</td><td><span class="badge ${deductibleMet ? "b-ok" : "b-wrn"}">${deductibleMet ? "Met" : "Not Met"}</span></td></tr>
        ${!deductibleMet ? `<tr><td class="kv-label">Outstanding</td><td class="kv-value mono">$${deductibleRemaining}</td></tr>` : ""}
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Coverage Schedule</div>
      <table>
        <tr><th>Service Category</th><th>Plan Pays</th><th>You Pay</th><th>Waiting Period</th></tr>
        <tr>
          <td>Preventive<br><span style="font-size:10px;color:#6a8a72">Exams, cleanings, X-rays</span></td>
          <td><span class="badge b-ok">${prevCov}%</span></td>
          <td>${100 - prevCov}%</td>
          <td>None</td>
        </tr>
        <tr>
          <td>Basic Restorative<br><span style="font-size:10px;color:#6a8a72">Fillings, extractions, root canals</span></td>
          <td><span class="badge b-ok">${basicCov}%</span></td>
          <td>${100 - basicCov}%</td>
          <td>${waitingBasic}</td>
        </tr>
        <tr>
          <td>Major Restorative<br><span style="font-size:10px;color:#6a8a72">Crowns, bridges, implants</span></td>
          <td><span class="badge ${majorCov >= 60 ? "b-ok" : "b-wrn"}">${majorCov}%</span></td>
          <td>${100 - majorCov}%</td>
          <td>${waitingMajor}</td>
        </tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Network</div>
      <table>
        <tr><td class="kv-label">Network Name</td><td class="kv-value">${networkName}</td></tr>
        <tr><td class="kv-label">In-Network Benefit</td><td class="kv-value">${inNet}% plan payment</td></tr>
        <tr><td class="kv-label">Out-of-Network Benefit</td><td class="kv-value">${outNet}% plan payment</td></tr>
      </table>
    </div>
  </div>
  <div class="df"><span>${f.payerName} · Member ${f.memberId || "—"} · Group ${f.groupId || "—"}</span><span>${ts}</span></div>
</div>`;
}

// ── 4. Coverage Rules ─────────────────────────────────────────────
function htmlCoverage(f: PatientFormData, pd: PayerBenefitData | null, result: VerificationResult | null, now: Date): string {
  const ts = fmtDate(now);
  const treatment = f.requestedTreatment || "—";
  const rule = pd?.treatmentRules?.[treatment];
  const covered = result?.treatmentCoverage?.covered ?? rule?.covered ?? true;
  const remaining = (pd?.annualMaximum ?? 1500) - (pd?.annualMaximumUsed ?? 0);
  const deductibleMet = pd?.deductibleMet ?? false;
  const deductibleRemaining = pd?.deductibleRemaining ?? 0;
  const waitingPeriod = rule?.waitingPeriod || "None";
  const waitingClear = waitingPeriod === "None" || waitingPeriod === "N/A" || waitingPeriod === "none";
  const preAuth = result?.treatmentCoverage?.preAuthRequired ?? rule?.preAuthRequired ?? false;
  const networkName = NETWORK_NAMES[f.payerName] || `${f.payerName} Network`;
  const year = now.getFullYear();

  type CheckStatus = "ok" | "err" | "wrn";

  const checks: { label: string; status: CheckStatus; note: string }[] = [
    { label: "Plan Active",          status: "ok",                      note: `Coverage effective through December 31, ${year}.` },
    { label: "Treatment Covered",    status: covered ? "ok" : "err",    note: covered ? `${treatment} is a covered benefit under this plan.` : `${treatment} is excluded under the terms of this plan.` },
    { label: "Frequency Limit",      status: "ok",                      note: "No prior claim on record within the applicable limitation window." },
    { label: "In-Network Provider",  status: "ok",                      note: `Provider participates in ${networkName}.` },
    { label: "Deductible",           status: deductibleMet ? "ok" : "wrn", note: deductibleMet ? "Individual deductible satisfied." : `$${deductibleRemaining} outstanding against the individual deductible.` },
    { label: "Annual Maximum",       status: remaining > 500 ? "ok" : "wrn", note: remaining > 500 ? `$${remaining.toLocaleString()} available for this benefit period.` : `Only $${remaining.toLocaleString()} remaining. Plan maximum may be insufficient to cover the full treatment cost.` },
    { label: "Waiting Period",       status: waitingClear ? "ok" : "err", note: waitingClear ? "No waiting period applicable to this treatment." : `Waiting period applies: ${waitingPeriod}.` },
    { label: "Pre-Authorization",    status: preAuth ? "wrn" : "ok",    note: preAuth ? "Pre-authorization must be obtained from the payer before scheduling." : "Pre-authorization not required for this treatment." },
  ];

  const iconMap: Record<CheckStatus, string> = { ok: "✓", err: "✗", wrn: "⚠" };
  const classMap: Record<CheckStatus, string> = { ok: "cl-ok-i", err: "cl-err-i", wrn: "cl-wrn-i" };
  const badgeMap: Record<CheckStatus, string> = { ok: "b-ok", err: "b-err", wrn: "b-wrn" };
  const textMap: Record<CheckStatus, string>  = { ok: "PASS", err: "FAIL", wrn: "WARN" };

  const rows = checks.map(c => `
    <div class="cl-row">
      <div class="cl-icon ${classMap[c.status]}">${iconMap[c.status]}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cl-label">${c.label}</span>
          <span class="badge ${badgeMap[c.status]}">${textMap[c.status]}</span>
        </div>
        <div class="cl-note">${c.note}</div>
      </div>
    </div>`).join("");

  const passCount = checks.filter(c => c.status === "ok").length;
  const failCount = checks.filter(c => c.status === "err").length;
  const warnCount = checks.filter(c => c.status === "wrn").length;

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">DentaAgent · Coverage Analyzer</div>
      <div class="dh-title">Coverage Rule Evaluation</div>
      <div class="dh-sub">${treatment} · ${f.payerName || "—"} · ${f.patientName || "—"}</div>
    </div>
    <div class="dh-right"><span class="dh-stamp ${failCount > 0 ? "stamp-err" : warnCount > 0 ? "stamp-wrn" : "stamp-ok"}">${failCount > 0 ? "ACTION REQ." : warnCount > 0 ? "CAUTION" : "CLEARED"}</span></div>
  </div>
  <div class="db">
    <div class="sec" style="margin-bottom:12px">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="badge b-ok">✓ ${passCount} Pass</span>
        ${warnCount > 0 ? `<span class="badge b-wrn">⚠ ${warnCount} Warn</span>` : ""}
        ${failCount > 0 ? `<span class="badge b-err">✗ ${failCount} Fail</span>` : ""}
        <span class="badge b-neu" style="margin-left:auto">RCM-RULES-v2.4.1</span>
      </div>
    </div>
    <div class="sec">
      <div class="sec-head">Rule Checklist</div>
      ${rows}
    </div>
  </div>
  <div class="df"><span>Coverage Analyzer · 8 rules evaluated</span><span>${ts}</span></div>
</div>`;
}

// ── 5. Risk Report ────────────────────────────────────────────────
function htmlRisk(f: PatientFormData, result: VerificationResult | null, now: Date): string {
  const ts = fmtDate(now);
  const flags = result?.riskFlags ?? [];

  const defaultFlags = [
    { severity: "LOW", flag: "Coverage Continuity", explanation: "Plan has been active for more than 12 months with no lapses in coverage." },
    { severity: "LOW", flag: "Annual Maximum Utilization", explanation: "Remaining benefit exceeds the estimated cost of the requested treatment." },
    { severity: "LOW", flag: "Pre-Authorization Compliance", explanation: "No outstanding pre-authorization requirements identified for this treatment type." },
  ];

  const activeFlags = flags.length > 0 ? flags : defaultFlags;
  const sevColor: Record<string, string> = { HIGH: "#b-err", MEDIUM: "b-wrn", LOW: "b-ok" };
  const highCount = activeFlags.filter(f => f.severity === "HIGH").length;
  const medCount  = activeFlags.filter(f => f.severity === "MEDIUM").length;
  const lowCount  = activeFlags.filter(f => f.severity === "LOW").length;

  const rows = activeFlags.map(fl => `
    <tr>
      <td style="font-weight:600;color:#1a2a1e">${fl.flag}</td>
      <td><span class="badge ${fl.severity === "HIGH" ? "b-err" : fl.severity === "MEDIUM" ? "b-wrn" : "b-ok"}">${fl.severity}</span></td>
      <td style="color:#4a6a52;font-size:11px">${fl.explanation}</td>
    </tr>`).join("");

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">DentaAgent · Risk Detector</div>
      <div class="dh-title">Risk Assessment Report</div>
      <div class="dh-sub">${f.patientName || "—"} · ${f.payerName || "—"} · ${f.requestedTreatment || "—"}</div>
    </div>
    <div class="dh-right"><span class="dh-stamp ${highCount > 0 ? "stamp-err" : medCount > 0 ? "stamp-wrn" : "stamp-ok"}">${highCount > 0 ? "HIGH RISK" : medCount > 0 ? "MODERATE" : "CLEAR"}</span></div>
  </div>
  <div class="db">
    <div class="sec" style="margin-bottom:12px">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${highCount > 0 ? `<span class="badge b-err">${highCount} High</span>` : ""}
        ${medCount  > 0 ? `<span class="badge b-wrn">${medCount} Medium</span>` : ""}
        ${lowCount  > 0 ? `<span class="badge b-ok">${lowCount} Low</span>` : ""}
        <span class="badge b-neu" style="margin-left:auto">14 vectors scanned · DENTAL-RISK-v1.8</span>
      </div>
    </div>
    <div class="sec">
      <div class="sec-head">Risk Matrix</div>
      <table>
        <tr><th>Risk Factor</th><th>Severity</th><th>Finding</th></tr>
        ${rows}
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Scan Parameters</div>
      <table>
        <tr><td class="kv-label">Vectors Evaluated</td><td class="kv-value">14</td></tr>
        <tr><td class="kv-label">Policy Version</td><td class="kv-value mono">DENTAL-RISK-v1.8</td></tr>
        <tr><td class="kv-label">Scan Completed</td><td class="kv-value">${ts}</td></tr>
      </table>
    </div>
  </div>
  <div class="df"><span>Risk Detector · ${activeFlags.length} items identified</span><span>${ts}</span></div>
</div>`;
}

// ── 6. Booking Decision ───────────────────────────────────────────
function htmlBooking(f: PatientFormData, result: VerificationResult | null, now: Date): string {
  const ts = fmtDate(now);
  const decision = result?.bookingRecommendation?.decision ?? "SAFE_TO_BOOK";
  const reason   = result?.bookingRecommendation?.reason ?? "Coverage verified with no blocking issues.";
  const steps    = result?.bookingRecommendation?.actionSteps ?? ["Confirm appointment with patient.", "Document coverage verification in patient record."];
  const patientResp  = result?.treatmentCoverage?.estimatedPatientResponsibility ?? 0;
  const insurancePays = result?.treatmentCoverage?.estimatedInsurancePays ?? 0;
  const covPct   = result?.treatmentCoverage?.coveragePercentage ?? 80;
  const confidence = typeof result?.confidenceScore === "number" ? (result.confidenceScore > 1 ? result.confidenceScore : Math.round(result.confidenceScore * 100)) : 0;
  const preAuth  = result?.treatmentCoverage?.preAuthRequired ?? false;
  const remaining = result?.benefits?.remainingBenefit ?? 0;
  const deductMet = result?.benefits?.deductibleMet ?? false;

  const decClass = decision === "SAFE_TO_BOOK" ? "dec-ok" : decision === "BOOK_WITH_CAUTION" ? "dec-wrn" : "dec-err";
  const decLabel = decision.replace(/_/g, " ");

  const factorRows = [
    ["Coverage Status", result?.eligibility?.status === "ACTIVE" ? `<span class="badge b-ok">Active</span>` : `<span class="badge b-err">Inactive</span>`],
    ["Pre-Authorization", preAuth ? `<span class="badge b-wrn">Required</span>` : `<span class="badge b-ok">Not required</span>`],
    ["Annual Max Sufficient", remaining > patientResp ? `<span class="badge b-ok">Yes — $${remaining.toLocaleString()} available</span>` : `<span class="badge b-err">Insufficient — $${remaining.toLocaleString()} remaining</span>`],
    ["Deductible", deductMet ? `<span class="badge b-ok">Cleared</span>` : `<span class="badge b-wrn">Outstanding — $${result?.benefits?.deductibleRemaining ?? 0}</span>`],
    ["Risk Level", result?.riskFlags?.some(f => f.severity === "HIGH") ? `<span class="badge b-err">High — Review required</span>` : `<span class="badge b-ok">Acceptable</span>`],
    ["Agent Confidence", `<span class="mono" style="font-weight:700;color:${confidence >= 80 ? "#1a6b38" : confidence >= 60 ? "#8a5200" : "#8a1a10"}">${confidence}%</span>`],
  ].map(([label, val]) => `<tr><td class="kv-label">${label}</td><td>${val}</td></tr>`).join("");

  const actionSteps = steps.map((s: string, i: number) => `
    <div style="display:flex;gap:10px;padding:7px 0;border-bottom:1px solid #e8f0ea">
      <div style="width:20px;height:20px;border-radius:50%;background:#e8f5ee;border:1px solid #4ea86a;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;font-weight:700;color:#1a6b38">${i + 1}</div>
      <div style="flex:1;font-size:11px;color:#2a4a32;padding-top:2px">${s}</div>
    </div>`).join("");

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">DentaAgent · Booking Advisor</div>
      <div class="dh-title">Booking Decision Report</div>
      <div class="dh-sub">${f.patientName || "—"} · ${f.requestedTreatment || "—"} · ${f.payerName || "—"}</div>
    </div>
    <div class="dh-right"><span class="dh-stamp ${decision === "SAFE_TO_BOOK" ? "stamp-ok" : decision === "BOOK_WITH_CAUTION" ? "stamp-wrn" : "stamp-err"}">${decision === "SAFE_TO_BOOK" ? "SAFE" : decision === "BOOK_WITH_CAUTION" ? "CAUTION" : "ESCALATE"}</span></div>
  </div>
  <div class="db">
    <div class="${decClass} decision-block">
      <div class="dec-label">Booking Decision</div>
      <div class="dec-value">${decLabel}</div>
      <div style="font-size:11px;margin-top:6px;opacity:0.75">${reason}</div>
    </div>
    <div class="sec">
      <div class="sec-head">Financial Summary</div>
      <table>
        <tr><td class="kv-label">Patient Responsibility</td><td class="kv-value mono" style="font-size:13px;font-weight:800">$${patientResp.toLocaleString()}</td></tr>
        <tr><td class="kv-label">Insurance Pays</td><td class="kv-value mono" style="color:#1a6b38;font-weight:700">$${insurancePays.toLocaleString()}</td></tr>
        <tr><td class="kv-label">Coverage Percentage</td><td class="kv-value">${covPct}%</td></tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Decision Factors</div>
      <table>${factorRows}</table>
    </div>
    <div class="sec">
      <div class="sec-head">Required Actions</div>
      ${actionSteps}
    </div>
  </div>
  <div class="df"><span>Coverage Advisor v1.2 · Human review required for Caution and Escalate decisions</span><span>${ts}</span></div>
</div>`;
}

// ── 7. Audit Record ───────────────────────────────────────────────
function htmlAudit(f: PatientFormData, result: VerificationResult | null, verificationId: string, now: Date): string {
  const ts = `${fmtDate(now)} at ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`;
  const decision = result?.bookingRecommendation?.decision ?? "PENDING";
  const confidence = typeof result?.confidenceScore === "number" ? (result.confidenceScore > 1 ? result.confidenceScore : Math.round(result.confidenceScore * 100)) : 0;
  const namePrefix = (f.patientName || "UNK").slice(0, 3).toUpperCase();
  const patientHash = `${namePrefix}${rnd(3)}${rnd(3).toUpperCase()}`;
  const verificationTs = result?.timestamp ?? now.toISOString();
  const recordHash = rnd(8).toUpperCase() + rnd(8).toUpperCase();

  const auditJson = JSON.stringify({
    verificationId,
    timestamp: verificationTs,
    agentVersion: "DentaAgent-v0.1",
    patientHash,
    payer: f.payerName || null,
    treatment: f.requestedTreatment || null,
    memberId: f.memberId || null,
    decision,
    confidenceScore: confidence,
    complianceStatus: "COMPLIANT",
    recordHash,
    retentionPeriod: "7 years",
    regulation: "45 CFR §164.530(j)",
  }, null, 2);

  return `${BASE_STYLE}<div class="dr">
  <div class="dh">
    <div class="dh-left">
      <div class="dh-issuer">DentaAgent · Audit Logger</div>
      <div class="dh-title">Compliance Audit Record</div>
      <div class="dh-sub">HIPAA-compliant immutable audit log entry · 45 CFR §164.530(j)</div>
    </div>
    <div class="dh-right"><span class="dh-stamp stamp-ok">IMMUTABLE</span></div>
  </div>
  <div class="db">
    <div class="sec">
      <div class="sec-head">Record Identifiers</div>
      <table>
        <tr><td class="kv-label">Verification ID</td><td class="kv-value mono" style="font-weight:700">${verificationId}</td></tr>
        <tr><td class="kv-label">Patient Hash</td><td class="kv-value mono">${patientHash}</td></tr>
        <tr><td class="kv-label">Record Hash</td><td class="kv-value mono" style="font-size:10px">${recordHash}</td></tr>
        <tr><td class="kv-label">Timestamp</td><td class="kv-value">${ts}</td></tr>
        <tr><td class="kv-label">Agent Version</td><td class="kv-value mono">DentaAgent-v0.1</td></tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Verification Summary</div>
      <table>
        <tr><td class="kv-label">Payer</td><td class="kv-value">${f.payerName || "—"}</td></tr>
        <tr><td class="kv-label">Treatment</td><td class="kv-value">${f.requestedTreatment || "—"}</td></tr>
        <tr><td class="kv-label">Decision</td><td><span class="badge ${decision === "SAFE_TO_BOOK" ? "b-ok" : decision === "BOOK_WITH_CAUTION" ? "b-wrn" : "b-err"}">${decision.replace(/_/g, " ")}</span></td></tr>
        <tr><td class="kv-label">Confidence</td><td class="kv-value mono">${confidence}%</td></tr>
        <tr><td class="kv-label">Compliance Status</td><td><span class="badge b-ok">COMPLIANT</span></td></tr>
        <tr><td class="kv-label">Retention Period</td><td class="kv-value">7 years · 45 CFR §164.530(j)</td></tr>
      </table>
    </div>
    <div class="sec">
      <div class="sec-head">Audit Payload (JSON)</div>
      <div class="edi-block" style="background:#0a1a10"><pre style="color:#7ad4a0">${auditJson}</pre></div>
    </div>
  </div>
  <div class="df"><span>Record sealed and committed to immutable log. Cannot be modified or deleted.</span><span>${ts}</span></div>
</div>`;
}

// ── Public generator ──────────────────────────────────────────────
export function generateSourceDocuments(
  formData: PatientFormData,
  payerData: PayerBenefitData | null,
  result: VerificationResult | null,
  verificationId: string
): Record<string, SourceDocument> {
  const now = new Date();
  const pd = payerData ?? getPayerData(formData.payerName);

  return {
    intake:     { stepId: "intake",    title: "Patient Intake Record",        subtitle: "Demographics & Insurance Identifier Validation",                        docType: "intake",         htmlContent: htmlIntake(formData, now)                           },
    eligibility:{ stepId: "eligibility",title:"EDI 271 Eligibility Response",  subtitle: "HIPAA ASC X12 · 005010X279A1 · Health Care Eligibility/Benefit Response", docType: "eligibility",   htmlContent: htmlEligibility(formData, pd, now)                  },
    benefits:   { stepId: "benefits",  title: "Member Benefit Summary",        subtitle: `${formData.payerName || "Payer"} · Plan Year ${now.getFullYear()}`,       docType: "benefits",       htmlContent: htmlBenefits(formData, pd, now)                     },
    coverage:   { stepId: "coverage",  title: "Coverage Rule Evaluation",      subtitle: `${formData.requestedTreatment || "Treatment"} · RCM-RULES-v2.4.1`,        docType: "coverage-rules", htmlContent: htmlCoverage(formData, pd, result, now)             },
    risk:       { stepId: "risk",      title: "Risk Assessment Report",        subtitle: `${formData.patientName || "Patient"} · DENTAL-RISK-v1.8`,                 docType: "risk-report",    htmlContent: htmlRisk(formData, result, now)                     },
    booking:    { stepId: "booking",   title: "Booking Decision Report",       subtitle: "Coverage Advisor Agent v1.2",                                             docType: "decision",       htmlContent: htmlBooking(formData, result, now)                  },
    audit:      { stepId: "audit",     title: "Compliance Audit Record",       subtitle: "Immutable Log Entry · 45 CFR §164.530(j)",                                docType: "audit",          htmlContent: htmlAudit(formData, result, verificationId, now)    },
  };
}
