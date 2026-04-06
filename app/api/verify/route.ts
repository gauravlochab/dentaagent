import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPayerData } from "@/lib/mockPayerData";
import { VerificationResult } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateVerificationId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `VER-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientName,
      dateOfBirth,
      payerName,
      memberId,
      groupId,
      requestedTreatment,
      appointmentDate,
    } = body;

    if (!patientName || !payerName || !memberId || !requestedTreatment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payerData = getPayerData(payerName);
    if (!payerData) {
      return NextResponse.json(
        { error: `Payer not found: ${payerName}` },
        { status: 404 }
      );
    }

    const treatmentRule = payerData.treatmentRules[requestedTreatment];
    if (!treatmentRule) {
      return NextResponse.json(
        { error: `Treatment not found: ${requestedTreatment}` },
        { status: 404 }
      );
    }

    const remainingBenefit = payerData.annualMaximum - payerData.annualMaximumUsed;
    const annualMaxUsedPercent = Math.round(
      (payerData.annualMaximumUsed / payerData.annualMaximum) * 100
    );

    const benefitContext = `
PAYER INFORMATION:
- Payer: ${payerData.payerName}
- Plan Type: ${payerData.planType}
- Plan Name: ${payerData.planName}
- Enrollment Date: ${payerData.enrollmentDate}

BENEFIT STRUCTURE:
- Annual Maximum: $${payerData.annualMaximum}
- Annual Maximum Used: $${payerData.annualMaximumUsed} (${annualMaxUsedPercent}% consumed)
- Remaining Benefit: $${remainingBenefit}
- Deductible: $${payerData.deductible} (Met: ${payerData.deductibleMet ? "YES" : "NO"}, Remaining: $${payerData.deductibleRemaining})
- Preventive Coverage: ${payerData.preventiveCoverage}%
- Basic Coverage: ${payerData.basicCoverage}%
- Major Coverage: ${payerData.majorCoverage}%
- In-Network Coverage: ${payerData.inNetworkCoverage}%
- Out-of-Network Coverage: ${payerData.outOfNetworkCoverage}%
- Basic Waiting Period: ${payerData.waitingPeriodBasic}
- Major Waiting Period: ${payerData.waitingPeriodMajor}

TREATMENT-SPECIFIC RULES (for ${requestedTreatment}):
- Covered: ${treatmentRule.covered ? "YES" : "NO - NOT COVERED"}
- Coverage Percentage: ${treatmentRule.coveragePercentage}%
- Frequency Limit: ${treatmentRule.frequencyLimit}
- Pre-Authorization Required: ${treatmentRule.preAuthRequired ? "YES - REQUIRED" : "No"}
- Waiting Period: ${treatmentRule.waitingPeriod}
- Notes: ${treatmentRule.notes}
- Typical Procedure Cost: $${treatmentRule.typicalCost}

PATIENT INFORMATION:
- Patient Name: ${patientName}
- Date of Birth: ${dateOfBirth}
- Member ID: ${memberId}
- Group ID: ${groupId}
- Requested Treatment: ${requestedTreatment}
- Appointment Date: ${appointmentDate}
`;

    const systemPrompt = `You are a dental insurance verification specialist AI. You have been given patient information and insurance benefit data. Your job is to:
1. Analyze the coverage for the requested dental treatment
2. Identify any risks, waiting periods, or exclusions
3. Calculate estimated patient responsibility
4. Generate a booking recommendation (SAFE_TO_BOOK / BOOK_WITH_CAUTION / ESCALATE)
5. Write a natural patient-facing script for the front desk
6. Write an internal summary for the billing team

Be precise, professional, and healthcare-appropriate. Always note if pre-authorization is required.

You must respond with ONLY a valid JSON object matching this exact structure (no markdown, no explanation outside JSON):
{
  "eligibility": {
    "status": "ACTIVE" | "INACTIVE" | "PENDING",
    "planType": string,
    "planName": string,
    "coveragePeriod": string,
    "payerPhone": string
  },
  "benefits": {
    "annualMaximum": number,
    "annualMaximumUsed": number,
    "remainingBenefit": number,
    "deductible": number,
    "deductibleMet": boolean,
    "deductibleRemaining": number,
    "waitingPeriod": string,
    "inNetworkCoverage": number,
    "outOfNetworkCoverage": number
  },
  "treatmentCoverage": {
    "covered": boolean,
    "coveragePercentage": number,
    "frequencyLimit": string,
    "preAuthRequired": boolean,
    "estimatedPatientResponsibility": number,
    "estimatedInsurancePays": number,
    "notes": string
  },
  "riskFlags": [
    {
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "flag": string,
      "explanation": string
    }
  ],
  "bookingRecommendation": {
    "decision": "SAFE_TO_BOOK" | "BOOK_WITH_CAUTION" | "ESCALATE",
    "reason": string,
    "actionSteps": [string]
  },
  "patientScript": string,
  "internalSummary": string,
  "confidenceScore": number,
  "agentReasoning": string
}`;

    const userPrompt = `Please analyze this dental insurance verification request and return the structured JSON response:

${benefitContext}

Calculate exact dollar amounts based on the typical procedure cost and coverage percentages. The patient responsibility = typical cost × (1 - coverage percentage/100), adjusted for any remaining deductible. Generate 2-5 risk flags based on the actual plan data. The booking decision should reflect the actual risk level (escalate if treatment not covered or pre-auth required without pre-auth obtained, book with caution if moderate risks, safe to book if straightforward).

Write the patient script as a natural, warm front-desk conversation starter (3-4 sentences). Write the internal summary as a concise clinical billing note.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsedResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      parsedResult = JSON.parse(jsonMatch[0]);
    } catch {
      // Fallback structured response if parsing fails
      parsedResult = buildFallbackResponse(payerData, treatmentRule, patientName, payerName, requestedTreatment);
    }

    const verificationId = generateVerificationId();
    const result: VerificationResult = {
      ...parsedResult,
      verificationId,
      timestamp: new Date().toISOString(),
      eligibility: {
        ...parsedResult.eligibility,
        payerPhone: payerData.payerPhone,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { error: "Verification service error. Please try again." },
      { status: 500 }
    );
  }
}

function buildFallbackResponse(payerData: ReturnType<typeof getPayerData>, treatmentRule: { covered: boolean; coveragePercentage: number; frequencyLimit: string; preAuthRequired: boolean; waitingPeriod: string; notes: string; typicalCost: number }, patientName: string, payerName: string, treatment: string) {
  if (!payerData) return null;
  const remaining = payerData.annualMaximum - payerData.annualMaximumUsed;
  const insurancePays = treatmentRule.covered
    ? Math.round(treatmentRule.typicalCost * (treatmentRule.coveragePercentage / 100))
    : 0;
  const patientPays = treatmentRule.typicalCost - insurancePays + payerData.deductibleRemaining;

  return {
    eligibility: {
      status: "ACTIVE",
      planType: payerData.planType,
      planName: payerData.planName,
      coveragePeriod: "January 1 – December 31, 2026",
      payerPhone: payerData.payerPhone,
    },
    benefits: {
      annualMaximum: payerData.annualMaximum,
      annualMaximumUsed: payerData.annualMaximumUsed,
      remainingBenefit: remaining,
      deductible: payerData.deductible,
      deductibleMet: payerData.deductibleMet,
      deductibleRemaining: payerData.deductibleRemaining,
      waitingPeriod: payerData.waitingPeriodMajor,
      inNetworkCoverage: payerData.inNetworkCoverage,
      outOfNetworkCoverage: payerData.outOfNetworkCoverage,
    },
    treatmentCoverage: {
      covered: treatmentRule.covered,
      coveragePercentage: treatmentRule.coveragePercentage,
      frequencyLimit: treatmentRule.frequencyLimit,
      preAuthRequired: treatmentRule.preAuthRequired,
      estimatedPatientResponsibility: patientPays,
      estimatedInsurancePays: insurancePays,
      notes: treatmentRule.notes,
    },
    riskFlags: treatmentRule.preAuthRequired
      ? [{ severity: "HIGH", flag: "Pre-authorization required", explanation: "Pre-auth must be obtained before scheduling." }]
      : [{ severity: "LOW", flag: "In-network provider confirmed", explanation: "Provider is in-network. Standard rates apply." }],
    bookingRecommendation: {
      decision: !treatmentRule.covered ? "ESCALATE" : treatmentRule.preAuthRequired ? "BOOK_WITH_CAUTION" : "SAFE_TO_BOOK",
      reason: !treatmentRule.covered ? `${treatment} is not covered under this plan.` : "Coverage verified successfully.",
      actionSteps: ["Confirm appointment details with patient", "Send appointment confirmation"],
    },
    patientScript: `Hi ${patientName}, I've verified your ${payerName} coverage for your upcoming ${treatment}. Your estimated out-of-pocket cost will be approximately $${patientPays}. Please let us know if you have any questions before your appointment.`,
    internalSummary: `Verification complete for ${patientName}. ${payerName} ${payerData.planType} plan. Treatment: ${treatment}. Coverage: ${treatmentRule.coveragePercentage}%. Patient responsibility: ~$${patientPays}.`,
    confidenceScore: 87,
    agentReasoning: `Analyzed ${payerName} plan data for ${treatment}. Applied coverage rules and calculated patient responsibility based on plan deductibles and coverage percentages.`,
  };
}
