import { PatientFormData, VerificationResult } from "@/lib/types";
import { PayerBenefitData, getPayerData } from "@/lib/mockPayerData";

export interface SourceDocument {
  stepId: string;
  title: string;
  subtitle: string;
  docType: "eligibility" | "benefits" | "coverage-rules" | "risk-report" | "decision" | "audit" | "intake";
  sections: DocumentSection[];
}

export interface DocumentSection {
  heading?: string;
  type: "table" | "keyvalue" | "checklist" | "text" | "status-badge" | "code";
  data: unknown;
}

export interface KeyValueData {
  rows: { label: string; value: string }[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ChecklistItem {
  label: string;
  status: "PASS" | "FAIL" | "WARN";
  note: string;
}

export interface StatusBadgeData {
  label: string;
  value: string;
  variant: "success" | "danger" | "warning" | "info";
}

const PAYER_IDS: Record<string, string> = {
  "Delta Dental": "68069",
  "Cigna Dental": "62308",
  "Aetna Dental": "60054",
  "MetLife Dental": "87726",
  "Guardian Dental": "91131",
  "Humana Dental": "61101",
  "United Concordia": "95567",
};

function randomDigits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10).toString();
  return s;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function getTreatmentCategory(treatment: string): "preventive" | "basic" | "major" {
  const lower = treatment.toLowerCase();
  if (lower.includes("cleaning") || lower.includes("exam") || lower.includes("xray") || lower.includes("whitening")) return "preventive";
  if (lower.includes("filling") || lower.includes("root canal") || lower.includes("extraction") || lower.includes("scaling") || lower.includes("periodontal")) return "basic";
  return "major";
}

function getNetworkName(payerData: PayerBenefitData | null, payerName: string): string {
  if (!payerData) return `${payerName} Network`;
  const map: Record<string, string> = {
    "Delta Dental": "Delta Dental PPO Network",
    "Cigna Dental": "Cigna DPPO Network",
    "Aetna Dental": "Aetna Dental Access Network",
    "MetLife Dental": "MetLife PDP Network",
    "Guardian Dental": "Guardian DentalGuard Network",
    "Humana Dental": "Humana Dental Care Network",
    "United Concordia": "United Concordia Dental Network",
  };
  return map[payerName] || `${payerName} Network`;
}

function generateIntakeDoc(formData: PatientFormData, now: Date): SourceDocument {
  return {
    stepId: "intake",
    title: "Patient Intake Record",
    subtitle: "Demographics & Insurance Identifier Validation",
    docType: "intake",
    sections: [
      {
        heading: "Patient Demographics",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Patient Name", value: formData.patientName || "—" },
            { label: "Date of Birth", value: formData.dateOfBirth || "—" },
            { label: "Member ID", value: formData.memberId || "—" },
            { label: "Group ID", value: formData.groupId || "—" },
            { label: "Payer", value: formData.payerName || "—" },
            { label: "Treatment Requested", value: formData.requestedTreatment || "—" },
            { label: "Appointment Date", value: formData.appointmentDate || "—" },
            { label: "Verification Timestamp", value: `${formatDate(now)} ${formatTime(now)}` },
          ],
        } as KeyValueData,
      },
      {
        heading: "Record Status",
        type: "status-badge",
        data: {
          label: "Record Status",
          value: "COMPLETE",
          variant: "success",
        } as StatusBadgeData,
      },
      {
        type: "text",
        data: "Patient demographics validated. Insurance identifiers cross-referenced against member registry. No duplicate records found.",
      },
    ],
  };
}

function generateEligibilityDoc(formData: PatientFormData, payerData: PayerBenefitData | null, now: Date): SourceDocument {
  const payerName = formData.payerName || "Unknown Payer";
  const payerId = PAYER_IDS[payerName] || randomDigits(5);
  const isActive = payerData ? true : false;
  const planType = payerData?.planType || "PPO";
  const planName = payerData?.planName || `${payerName} Plan`;
  const enrollDate = payerData?.enrollmentDate || "2023-01-01";
  const enrollDateObj = new Date(enrollDate);
  const termYear = enrollDateObj.getFullYear() + 3;

  return {
    stepId: "eligibility",
    title: "EDI 271 Eligibility Response",
    subtitle: "HIPAA ASC X12 270/271 Transaction Set",
    docType: "eligibility",
    sections: [
      {
        heading: "Transaction Header",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Transaction Set ID", value: "271" },
            { label: "Interchange Control #", value: randomDigits(9) },
            { label: "Date", value: formatDate(now) },
            { label: "Time", value: formatTime(now) },
          ],
        } as KeyValueData,
      },
      {
        heading: "Eligibility Status",
        type: "status-badge",
        data: {
          label: "Eligibility Status",
          value: isActive ? "ACTIVE" : "INACTIVE",
          variant: isActive ? "success" : "danger",
        } as StatusBadgeData,
      },
      {
        heading: "Subscriber Information",
        type: "table",
        data: {
          headers: ["Field", "Value"],
          rows: [
            ["Name", formData.patientName || "—"],
            ["Member ID", formData.memberId || "—"],
            ["Group ID", formData.groupId || "—"],
            ["Plan Type", planType],
            ["Plan Name", planName],
            ["Effective Date", formatDate(enrollDateObj)],
            ["Term Date", `December 31, ${termYear}`],
          ],
        } as TableData,
      },
      {
        heading: "Payer Information",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Payer Name", value: payerName },
            { label: "Payer ID", value: payerId },
            { label: "Phone", value: payerData?.payerPhone || "—" },
            { label: "Provider NPI", value: "1234567890" },
          ],
        } as KeyValueData,
      },
      {
        type: "text",
        data: "271 transaction successfully parsed. Member located in payer registry. Coverage effective and within benefit period.",
      },
    ],
  };
}

function generateBenefitsDoc(formData: PatientFormData, payerData: PayerBenefitData | null, now: Date): SourceDocument {
  const payerName = formData.payerName || "Unknown Payer";
  const pd = payerData;
  const annualMax = pd?.annualMaximum ?? 1500;
  const used = pd?.annualMaximumUsed ?? 0;
  const remaining = annualMax - used;
  const deductible = pd?.deductible ?? 50;
  const deductibleMet = pd?.deductibleMet ?? false;
  const waitingPeriod = pd?.waitingPeriodMajor || "None";
  const networkName = getNetworkName(pd, payerName);
  const inNet = pd?.inNetworkCoverage ?? 80;
  const outNet = pd?.outOfNetworkCoverage ?? 50;

  return {
    stepId: "benefits",
    title: "Member Benefit Summary",
    subtitle: "Extracted from EDI 271 Transaction — In-Network Benefits",
    docType: "benefits",
    sections: [
      {
        heading: "Benefit Overview",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Plan Name", value: pd?.planName || `${payerName} Plan` },
            { label: "Plan Type", value: pd?.planType || "PPO" },
            { label: "Benefit Period", value: `January 1, ${now.getFullYear()} — December 31, ${now.getFullYear()}` },
            { label: "Annual Maximum", value: `$${annualMax.toLocaleString()}` },
            { label: "Annual Maximum Used", value: `$${used.toLocaleString()}` },
            { label: "Remaining Benefit", value: `$${remaining.toLocaleString()}` },
            { label: "Individual Deductible", value: `$${deductible}` },
            { label: "Deductible Met", value: deductibleMet ? "Yes — Cleared" : `No — $${pd?.deductibleRemaining ?? deductible} remaining` },
            { label: "Waiting Period (Major)", value: waitingPeriod },
          ],
        } as KeyValueData,
      },
      {
        heading: "Coverage Tiers",
        type: "table",
        data: {
          headers: ["Service Category", "Coverage %", "Patient Responsibility"],
          rows: [
            ["Preventive (exams, cleanings, x-rays)", `${pd?.preventiveCoverage ?? 100}%`, `${100 - (pd?.preventiveCoverage ?? 100)}%`],
            ["Basic (fillings, extractions, root canals)", `${pd?.basicCoverage ?? 80}%`, `${100 - (pd?.basicCoverage ?? 80)}%`],
            ["Major (crowns, bridges, implants)", `${pd?.majorCoverage ?? 50}%`, `${100 - (pd?.majorCoverage ?? 50)}%`],
          ],
        } as TableData,
      },
      {
        heading: "Network Information",
        type: "table",
        data: {
          headers: ["Network Type", "Coverage %", "Network Name"],
          rows: [
            ["In-Network", `${inNet}%`, networkName],
            ["Out-of-Network", `${outNet}%`, "Non-participating providers"],
          ],
        } as TableData,
      },
      {
        type: "text",
        data: "Benefits extracted from 271 EDI transaction. Coverage percentages reflect contracted rates for in-network providers.",
      },
    ],
  };
}

function generateCoverageDoc(formData: PatientFormData, payerData: PayerBenefitData | null, result: VerificationResult | null, now: Date): SourceDocument {
  const payerName = formData.payerName || "Unknown Payer";
  const pd = payerData;
  const treatment = formData.requestedTreatment || "Unknown Treatment";
  const networkName = getNetworkName(pd, payerName);

  // Determine coverage from result or payerData
  const treatmentRule = pd?.treatmentRules[treatment] ?? null;
  const covered = result?.treatmentCoverage?.covered ?? treatmentRule?.covered ?? true;
  const remaining = (pd?.annualMaximum ?? 1500) - (pd?.annualMaximumUsed ?? 0);
  const deductibleMet = pd?.deductibleMet ?? false;
  const waitingPeriod = treatmentRule?.waitingPeriod ?? "None";
  const preAuthRequired = result?.treatmentCoverage?.preAuthRequired ?? treatmentRule?.preAuthRequired ?? false;
  const year = now.getFullYear();

  const items: ChecklistItem[] = [
    { label: "Plan Active", status: "PASS", note: `Coverage effective through Dec 31, ${year}` },
    { label: "Treatment Covered", status: covered ? "PASS" : "FAIL", note: covered ? `${treatment} is a covered benefit under this plan` : `${treatment} is excluded from coverage under this plan` },
    { label: "Frequency Limit Clear", status: "PASS", note: "No prior claim found within limitation window" },
    { label: "In-Network Provider", status: "PASS", note: `Provider confirmed in ${networkName}` },
    { label: "Deductible Status", status: deductibleMet ? "PASS" : "WARN", note: deductibleMet ? "Individual deductible fully satisfied" : `Deductible not fully met — $${pd?.deductibleRemaining ?? 0} outstanding` },
    { label: "Annual Max Remaining", status: remaining > 500 ? "PASS" : "WARN", note: remaining > 500 ? `$${remaining.toLocaleString()} available for this benefit period` : `Only $${remaining.toLocaleString()} remaining — may not cover full treatment cost` },
    { label: "Waiting Period", status: waitingPeriod === "None" || waitingPeriod === "N/A" ? "PASS" : "FAIL", note: waitingPeriod === "None" || waitingPeriod === "N/A" ? "No waiting period applicable for this treatment" : `Waiting period active: ${waitingPeriod}` },
    { label: "Pre-Authorization", status: preAuthRequired ? "WARN" : "PASS", note: preAuthRequired ? "Pre-authorization required before treatment — obtain from payer" : "Pre-authorization not required for this treatment" },
  ];

  return {
    stepId: "coverage",
    title: "Coverage Rule Evaluation",
    subtitle: `Rule Engine Assessment — ${treatment}`,
    docType: "coverage-rules",
    sections: [
      {
        heading: "Coverage Rules Checklist",
        type: "checklist",
        data: items,
      },
      {
        type: "text",
        data: `Rule engine version: RCM-RULES-v2.4.1 | Evaluated at: ${formatDate(now)} ${formatTime(now)}`,
      },
    ],
  };
}

function generateRiskDoc(formData: PatientFormData, result: VerificationResult | null, now: Date): SourceDocument {
  const riskFlags = result?.riskFlags ?? [];

  const riskRows: string[][] = riskFlags.length > 0
    ? riskFlags.map((f) => [f.flag, f.severity, f.explanation])
    : [
        ["Coverage Continuity", "LOW", "Plan has been active for 12+ months with no gaps"],
        ["Annual Maximum Threshold", "LOW", "Remaining benefit exceeds estimated treatment cost"],
        ["Pre-Authorization Compliance", "LOW", "No outstanding pre-auth requirements identified"],
      ];

  const highCount = riskFlags.filter((f) => f.severity === "HIGH").length;
  const medCount = riskFlags.filter((f) => f.severity === "MEDIUM").length;

  return {
    stepId: "risk",
    title: "Risk Assessment Report",
    subtitle: `Patient: ${formData.patientName || "—"} | Payer: ${formData.payerName || "—"}`,
    docType: "risk-report",
    sections: [
      {
        heading: "Risk Matrix",
        type: "table",
        data: {
          headers: ["Risk Factor", "Severity", "Finding"],
          rows: riskRows,
        } as TableData,
      },
      {
        heading: "Scan Summary",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Scan Vectors", value: "14" },
            { label: "Risks Identified", value: String(riskFlags.length || 3) },
            { label: "High Severity", value: String(highCount) },
            { label: "Medium Severity", value: String(medCount) },
            { label: "Policy Version", value: "DENTAL-RISK-v1.8" },
          ],
        } as KeyValueData,
      },
      {
        type: "text",
        data: "Risk assessment complete. All identified risks have been categorised and prioritised. High severity items require immediate attention before scheduling.",
      },
    ],
  };
}

function generateBookingDoc(formData: PatientFormData, result: VerificationResult | null, now: Date): SourceDocument {
  const decision = result?.bookingRecommendation?.decision ?? "SAFE_TO_BOOK";
  const patientResp = result?.treatmentCoverage?.estimatedPatientResponsibility ?? 0;
  const insurancePays = result?.treatmentCoverage?.estimatedInsurancePays ?? 0;
  const covPct = result?.treatmentCoverage?.coveragePercentage ?? 80;
  const confidence = result?.confidenceScore ?? 0;

  const variantMap: Record<string, "success" | "warning" | "danger"> = {
    SAFE_TO_BOOK: "success",
    BOOK_WITH_CAUTION: "warning",
    ESCALATE: "danger",
  };

  const preAuth = result?.treatmentCoverage?.preAuthRequired ?? false;
  const remaining = result?.benefits?.remainingBenefit ?? 0;

  const decisionFactors: string[][] = [
    ["Coverage Verified", result?.eligibility?.status === "ACTIVE" ? "Yes — Active coverage confirmed" : "No — Coverage inactive"],
    ["Pre-Auth Required", preAuth ? "Yes — Obtain before scheduling" : "No — Not required for this treatment"],
    ["Annual Max Sufficient", remaining > patientResp ? "Yes — Sufficient benefit remaining" : "No — Benefit may be insufficient"],
    ["Deductible Cleared", result?.benefits?.deductibleMet ? "Yes — Deductible satisfied" : "No — Deductible outstanding"],
    ["Risk Level", result?.riskFlags?.some((f) => f.severity === "HIGH") ? "High — Review required" : "Acceptable — Proceed with caution"],
  ];

  return {
    stepId: "booking",
    title: "Booking Decision Report",
    subtitle: `Coverage Advisor Agent v1.2 — ${formatDate(now)}`,
    docType: "decision",
    sections: [
      {
        heading: "Booking Decision",
        type: "status-badge",
        data: {
          label: "Decision",
          value: decision,
          variant: variantMap[decision] ?? "info",
        } as StatusBadgeData,
      },
      {
        heading: "Financial Summary",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Patient Responsibility", value: `$${patientResp.toLocaleString()}` },
            { label: "Insurance Pays", value: `$${insurancePays.toLocaleString()}` },
            { label: "Coverage %", value: `${covPct}%` },
            { label: "Confidence Score", value: `${confidence}%` },
          ],
        } as KeyValueData,
      },
      {
        heading: "Decision Factors",
        type: "table",
        data: {
          headers: ["Factor", "Assessment"],
          rows: decisionFactors,
        } as TableData,
      },
      {
        type: "text",
        data: "Booking recommendation generated by Coverage Advisor Agent v1.2. Human review required for all BOOK_WITH_CAUTION and ESCALATE decisions.",
      },
    ],
  };
}

function generateAuditDoc(formData: PatientFormData, result: VerificationResult | null, verificationId: string, now: Date): SourceDocument {
  const decision = result?.bookingRecommendation?.decision ?? "PENDING";
  const confidence = result?.confidenceScore ?? 0;
  const namePrefix = (formData.patientName || "UNK").slice(0, 3).toUpperCase();
  const patientHash = `${namePrefix}${randomDigits(6).toUpperCase()}`;
  const verificationTimestamp = result?.timestamp ?? now.toISOString();

  const auditJson = JSON.stringify({
    verificationId,
    timestamp: verificationTimestamp,
    decision,
    confidenceScore: confidence,
    patientHash,
    agentVersion: "DentaAgent-v0.1",
    complianceStatus: "COMPLIANT",
  }, null, 2);

  return {
    stepId: "audit",
    title: "Compliance Audit Record",
    subtitle: `HIPAA-compliant Immutable Audit Log Entry`,
    docType: "audit",
    sections: [
      {
        heading: "Audit Record",
        type: "keyvalue",
        data: {
          rows: [
            { label: "Verification ID", value: verificationId },
            { label: "Timestamp", value: `${formatDate(now)} ${formatTime(now)}` },
            { label: "Agent Version", value: "DentaAgent-v0.1" },
            { label: "Patient Hash", value: patientHash },
            { label: "Payer", value: formData.payerName || "—" },
            { label: "Treatment", value: formData.requestedTreatment || "—" },
            { label: "Decision", value: decision },
            { label: "Compliance Status", value: "COMPLIANT" },
          ],
        } as KeyValueData,
      },
      {
        type: "text",
        data: "This verification record has been committed to the immutable audit log. Record cannot be modified. Accessible for payer audit and compliance review for 7 years per HIPAA requirements.",
      },
      {
        heading: "Audit JSON Payload",
        type: "code",
        data: auditJson,
      },
    ],
  };
}

export function generateSourceDocuments(
  formData: PatientFormData,
  payerData: PayerBenefitData | null,
  result: VerificationResult | null,
  verificationId: string
): Record<string, SourceDocument> {
  const now = new Date();
  // Ensure payerData is populated if missing
  const pd = payerData ?? getPayerData(formData.payerName);

  return {
    intake: generateIntakeDoc(formData, now),
    eligibility: generateEligibilityDoc(formData, pd, now),
    benefits: generateBenefitsDoc(formData, pd, now),
    coverage: generateCoverageDoc(formData, pd, result, now),
    risk: generateRiskDoc(formData, result, now),
    booking: generateBookingDoc(formData, result, now),
    audit: generateAuditDoc(formData, result, verificationId, now),
  };
}
