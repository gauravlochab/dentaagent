export interface PatientFormData {
  patientName: string;
  dateOfBirth: string;
  payerName: string;
  memberId: string;
  groupId: string;
  requestedTreatment: string;
  appointmentDate: string;
}

export interface EligibilityData {
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  planType: string;
  planName: string;
  coveragePeriod: string;
  payerPhone: string;
}

export interface BenefitsData {
  annualMaximum: number;
  annualMaximumUsed: number;
  remainingBenefit: number;
  deductible: number;
  deductibleMet: boolean;
  deductibleRemaining: number;
  waitingPeriod: string;
  inNetworkCoverage: number;
  outOfNetworkCoverage: number;
}

export interface TreatmentCoverageData {
  covered: boolean;
  coveragePercentage: number;
  frequencyLimit: string;
  preAuthRequired: boolean;
  estimatedPatientResponsibility: number;
  estimatedInsurancePays: number;
  notes: string;
}

export interface RiskFlag {
  severity: "HIGH" | "MEDIUM" | "LOW";
  flag: string;
  explanation: string;
}

export interface BookingRecommendation {
  decision: "SAFE_TO_BOOK" | "BOOK_WITH_CAUTION" | "ESCALATE";
  reason: string;
  actionSteps: string[];
}

export interface VerificationResult {
  eligibility: EligibilityData;
  benefits: BenefitsData;
  treatmentCoverage: TreatmentCoverageData;
  riskFlags: RiskFlag[];
  bookingRecommendation: BookingRecommendation;
  patientScript: string;
  internalSummary: string;
  confidenceScore: number;
  agentReasoning: string;
  verificationId: string;
  timestamp: string;
}

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "flagged";
  duration?: number;
  timestamp?: string;
  evidence?: string;
}

export type VerificationStatus = "idle" | "running" | "completed" | "error";
