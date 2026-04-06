"use client";

import React, { useState, useEffect } from "react";
import { VerificationResult } from "@/lib/types";
import RiskFlags from "./RiskFlags";

interface DecisionConsoleProps {
  result: VerificationResult | null;
  isRunning: boolean;
  patientName: string;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden mb-3">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1a1a1a]">
        <span className="text-[#6366f1]">{icon}</span>
        <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function DataRow({ label, value, valueClass }: { label: string; value: string | React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-[#111] last:border-0">
      <span className="text-xs text-[#475569]">{label}</span>
      <span className={`text-xs font-medium ${valueClass || "text-[#e2e8f0]"}`}>{value}</span>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrent(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${current}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

export default function DecisionConsole({ result, isRunning, patientName }: DecisionConsoleProps) {
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  useEffect(() => {
    setActionTaken(null);
    setScriptExpanded(false);
  }, [result?.verificationId]);

  if (!result && !isRunning) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Decision Console</h2>
          </div>
          <p className="text-xs text-[#64748b] ml-4">Verification results &amp; actions</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#2a2a2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#334155]">Awaiting verification</p>
          <p className="text-xs text-[#1e293b] mt-1">Results will appear here after the agent completes</p>
        </div>
      </div>
    );
  }

  if (isRunning && !result) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Decision Console</h2>
          </div>
          <p className="text-xs text-[#64748b] ml-4">Processing verification...</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          {[80, 60, 40, 25].map((w, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-[#111] border border-[#1a1a1a]" style={{ width: `${w}%`, height: "14px" }} />
          ))}
          <p className="text-xs text-[#334155] mt-2">Agent is analyzing coverage...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { eligibility, benefits, treatmentCoverage, riskFlags, bookingRecommendation, patientScript, internalSummary, confidenceScore, verificationId, timestamp } = result;

  const decisionConfig = {
    SAFE_TO_BOOK: { bg: "bg-[#052e16]", border: "border-[#22c55e]", text: "text-[#4ade80]", label: "SAFE TO BOOK", icon: "✓" },
    BOOK_WITH_CAUTION: { bg: "bg-[#1a1000]", border: "border-[#f59e0b]", text: "text-[#fbbf24]", label: "BOOK WITH CAUTION", icon: "⚠" },
    ESCALATE: { bg: "bg-[#1f0000]", border: "border-[#ef4444]", text: "text-[#f87171]", label: "ESCALATE TO HUMAN", icon: "!" },
  };

  const dc = decisionConfig[bookingRecommendation.decision];
  const statusColors = {
    ACTIVE: "text-[#4ade80] bg-[#052e16] border-[#14532d]",
    INACTIVE: "text-[#f87171] bg-[#450a0a] border-[#7f1d1d]",
    PENDING: "text-[#fbbf24] bg-[#422006] border-[#78350f]",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e1e1e] flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Decision Console</h2>
          </div>
          <span className="text-[10px] font-mono text-[#334155]">{verificationId}</span>
        </div>
        <p className="text-xs text-[#64748b] ml-4">
          {new Date(timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">

        {/* Booking Recommendation — most prominent */}
        <div className={`rounded-xl border-2 ${dc.border} ${dc.bg} p-4 mb-3`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 rounded-lg ${dc.bg} border ${dc.border} flex items-center justify-center flex-shrink-0`}>
              <span className={`text-base font-bold ${dc.text}`}>{dc.icon}</span>
            </div>
            <div>
              <div className={`text-sm font-bold tracking-wide ${dc.text}`}>{dc.label}</div>
              <div className="text-xs text-[#64748b] mt-0.5">{bookingRecommendation.reason}</div>
            </div>
          </div>
          <div className="space-y-1 mt-3">
            {bookingRecommendation.actionSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-[11px] font-bold flex-shrink-0 mt-0.5 ${dc.text}`}>{i + 1}.</span>
                <span className="text-[11px] text-[#94a3b8] leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <SectionCard title="Eligibility Summary" icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        }>
          <DataRow
            label="Status"
            value={
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[eligibility.status]}`}>
                {eligibility.status}
              </span>
            }
          />
          <DataRow label="Plan Type" value={eligibility.planType} />
          <DataRow label="Plan Name" value={eligibility.planName} valueClass="text-[#cbd5e1] truncate max-w-[180px]" />
          <DataRow label="Coverage Period" value={eligibility.coveragePeriod} />
          <DataRow label="Payer Phone" value={eligibility.payerPhone} valueClass="text-[#6366f1] font-mono" />
        </SectionCard>

        {/* Benefits */}
        <SectionCard title="Benefit Breakdown" icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        }>
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#475569]">Annual Max Used</span>
              <span className="text-[#94a3b8] font-mono">
                {formatCurrency(benefits.annualMaximumUsed)} / {formatCurrency(benefits.annualMaximum)}
              </span>
            </div>
            <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (benefits.annualMaximumUsed / benefits.annualMaximum) * 100)}%`,
                  background: benefits.annualMaximumUsed / benefits.annualMaximum > 0.75
                    ? "#ef4444"
                    : benefits.annualMaximumUsed / benefits.annualMaximum > 0.5
                    ? "#f59e0b"
                    : "#22c55e",
                }}
              />
            </div>
          </div>
          <DataRow label="Remaining Benefit" value={formatCurrency(benefits.remainingBenefit)} valueClass={benefits.remainingBenefit < 500 ? "text-[#f87171] font-bold" : "text-[#4ade80] font-bold"} />
          <DataRow
            label="Deductible"
            value={`${formatCurrency(benefits.deductible)} — ${benefits.deductibleMet ? "MET" : `$${benefits.deductibleRemaining} remaining`}`}
            valueClass={benefits.deductibleMet ? "text-[#4ade80]" : "text-[#fbbf24]"}
          />
          <DataRow label="Waiting Period" value={benefits.waitingPeriod} valueClass={benefits.waitingPeriod === "None" ? "text-[#4ade80]" : "text-[#fbbf24]"} />
          <DataRow label="In-Network" value={`${benefits.inNetworkCoverage}%`} valueClass="text-[#4ade80]" />
          <DataRow label="Out-of-Network" value={`${benefits.outOfNetworkCoverage}%`} valueClass="text-[#94a3b8]" />
        </SectionCard>

        {/* Treatment Coverage */}
        <SectionCard title="Treatment Coverage" icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        }>
          <DataRow
            label="Covered"
            value={treatmentCoverage.covered ? "Yes" : "NOT COVERED"}
            valueClass={treatmentCoverage.covered ? "text-[#4ade80] font-bold" : "text-[#f87171] font-bold"}
          />
          <DataRow label="Coverage %" value={`${treatmentCoverage.coveragePercentage}%`} />
          <DataRow label="Frequency Limit" value={treatmentCoverage.frequencyLimit} valueClass="text-[#94a3b8] text-right max-w-[160px]" />
          <DataRow
            label="Pre-Auth Required"
            value={treatmentCoverage.preAuthRequired ? "YES — Required" : "No"}
            valueClass={treatmentCoverage.preAuthRequired ? "text-[#f87171] font-bold" : "text-[#4ade80]"}
          />
          <div className="mt-2 pt-2 border-t border-[#111]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[#475569]">Patient Pays</span>
              <span className="text-sm font-bold text-[#f87171]">{formatCurrency(treatmentCoverage.estimatedPatientResponsibility)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#475569]">Insurance Pays</span>
              <span className="text-sm font-bold text-[#4ade80]">{formatCurrency(treatmentCoverage.estimatedInsurancePays)}</span>
            </div>
          </div>
          {treatmentCoverage.notes && (
            <div className="mt-2 pt-2 border-t border-[#111]">
              <p className="text-[11px] text-[#475569] leading-relaxed">{treatmentCoverage.notes}</p>
            </div>
          )}
        </SectionCard>

        {/* Risk Flags */}
        <SectionCard title="Risk Flags" icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
        }>
          <RiskFlags flags={riskFlags} />
        </SectionCard>

        {/* Patient Script */}
        <div className="rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden mb-3">
          <button
            onClick={() => setScriptExpanded(!scriptExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1a] hover:bg-[#111] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#6366f1]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </span>
              <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Patient-Facing Script</h3>
            </div>
            <svg className={`w-4 h-4 text-[#475569] transition-transform ${scriptExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {scriptExpanded && (
            <div className="px-4 py-3">
              <div className="rounded-lg bg-[#0a0f1a] border border-[#1e2a3a] p-3">
                <p className="text-xs text-[#94a3b8] leading-relaxed italic">"{patientScript}"</p>
              </div>
              {internalSummary && (
                <div className="mt-2 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e] p-3">
                  <p className="text-[10px] text-[#475569] font-semibold uppercase tracking-wide mb-1">Internal Billing Note</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{internalSummary}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confidence Score */}
        <div className="rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Agent Confidence</span>
          </div>
          <ConfidenceBar score={confidenceScore} />
          <p className="text-[11px] text-[#475569] mt-1.5">
            {confidenceScore >= 85 ? "High confidence — all coverage rules verified" :
             confidenceScore >= 65 ? "Moderate confidence — some ambiguity in plan rules" :
             "Low confidence — manual review recommended"}
          </p>
        </div>

        {/* Actions */}
        {!actionTaken ? (
          <div className="rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] p-4 mb-3">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Reviewer Actions</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActionTaken("approved")}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 0 15px rgba(34,197,94,0.2)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Approve &amp; Schedule
              </button>
              <button
                onClick={() => setActionTaken("edited")}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #4f46e5, #4338ca)", boxShadow: "0 0 15px rgba(99,102,241,0.2)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit &amp; Approve
              </button>
              <button
                onClick={() => setActionTaken("escalated")}
                className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #b91c1c, #991b1b)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Escalate to Senior
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl border p-4 mb-3 text-center ${
            actionTaken === "approved" ? "border-[#22c55e] bg-[#052e16]" :
            actionTaken === "edited" ? "border-[#6366f1] bg-[#1a1a2e]" :
            "border-[#ef4444] bg-[#1f0000]"
          }`}>
            <div className="text-2xl mb-2">{actionTaken === "approved" ? "✓" : actionTaken === "edited" ? "✎" : "⚠"}</div>
            <p className={`text-sm font-bold ${
              actionTaken === "approved" ? "text-[#4ade80]" :
              actionTaken === "edited" ? "text-[#818cf8]" :
              "text-[#f87171]"
            }`}>
              {actionTaken === "approved" ? "Approved & Scheduled" :
               actionTaken === "edited" ? "Sent for Edit Review" :
               "Escalated to Senior Reviewer"}
            </p>
            <p className="text-xs text-[#475569] mt-1">
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}

        {/* Powered by Claude */}
        <div className="flex items-center justify-center gap-1.5 py-2 opacity-40">
          <svg className="w-3 h-3 text-[#6366f1]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          <span className="text-[10px] text-[#475569]">Powered by Claude</span>
        </div>
      </div>
    </div>
  );
}
