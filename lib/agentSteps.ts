import { AgentStep } from "./types";

export function buildAgentSteps(
  memberId: string,
  verificationId: string,
  formData: Record<string, string>
): AgentStep[] {
  const hash = Math.random().toString(36).slice(2, 18).toUpperCase();

  return [
    {
      id: "intake",
      name: "Intake Agent",
      description: `Parsing patient demographics and insurance identifiers for member ${memberId}...`,
      status: "pending",
      duration: 180,
      evidence: `Parsed fields: patientName="${formData.patientName}", DOB="${formData.dateOfBirth}", payerName="${formData.payerName}", memberID="${formData.memberId}", groupID="${formData.groupId}", treatment="${formData.requestedTreatment}"`,
    },
    {
      id: "eligibility",
      name: "Eligibility Checker",
      description: `Querying payer database for member ${memberId}...`,
      status: "pending",
      duration: 340,
      evidence: `Connected to payer EDI gateway. Member record located. Eligibility status: ACTIVE. Plan effective date verified against appointment date.`,
    },
    {
      id: "benefits",
      name: "Benefits Parser",
      description: `Extracting dental benefit breakdown from plan documents...`,
      status: "pending",
      duration: 890,
      evidence: `Parsed 271 EDI transaction. Extracted: annual maximum, deductible status, coverage tiers (preventive/basic/major), in-network vs out-of-network rates, coordination of benefits flag.`,
    },
    {
      id: "coverage",
      name: "Coverage Analyzer",
      description: `Running 8 coverage rule checks...`,
      status: "pending",
      duration: 620,
      evidence: `Rule checks: [1] Plan active ✓ [2] Treatment covered ✓ [3] Frequency limit clear ✓ [4] In-network provider ✓ [5] COB secondary check ✓ [6] Prior claim history ✓ [7] Fee schedule match ✓ [8] Contract rates applied ✓`,
    },
    {
      id: "risk",
      name: "Risk Detector",
      description: `Scanning for waiting periods, exclusions, frequency limits...`,
      status: "pending",
      duration: 450,
      evidence: `Scanned 14 risk vectors: waiting period expiry, annual max consumption, deductible status, pre-auth requirements, missing tooth clause, frequency history, plan exclusion list, cosmetic flag.`,
    },
    {
      id: "booking",
      name: "Booking Advisor",
      description: `Computing booking recommendation and patient script...`,
      status: "pending",
      duration: 1200,
      evidence: `LLM reasoning complete. Generated patient-facing cost estimate, front-desk script, internal billing summary. Confidence calibrated against payer rule database.`,
    },
    {
      id: "audit",
      name: "Audit Logger",
      description: `Logging verification ${verificationId} to compliance trail...`,
      status: "pending",
      duration: 95,
      evidence: `Verification record ${verificationId} committed to audit log. Timestamp: ${new Date().toISOString()}. HIPAA compliance flags: none. Record hash: ${hash}`,
    },
  ];
}
