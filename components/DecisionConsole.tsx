"use client";

import React, { useState, useEffect, useRef } from "react";
import { VerificationResult } from "@/lib/types";
import RiskFlags from "./RiskFlags";

interface DecisionConsoleProps {
  result: VerificationResult | null;
  isRunning: boolean;
  patientName: string;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden mb-3 card-shadow"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{
          background: "var(--color-surface-raised)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
        <h3
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
        >
          {title}
        </h3>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function DataRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string | React.ReactNode;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div
      className="flex items-center justify-between py-1.5 border-b last:border-0"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span
        className="text-[11px] font-medium"
        style={{ color: "var(--color-text)", ...valueStyle }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Circular confidence arc gauge ───────────────────── */
function ConfidenceArc({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);
  const r = 26;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setCurrent(score), 350);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (current / 100) * circumference;
  const color =
    score >= 85 ? "var(--color-success)" : score >= 65 ? "var(--color-warning)" : "var(--color-danger)";
  const trackColor =
    score >= 85 ? "var(--color-success-tint)" : score >= 65 ? "var(--color-warning-tint)" : "var(--color-danger-tint)";
  const label =
    score >= 85
      ? "High confidence — all coverage rules verified"
      : score >= 65
      ? "Moderate confidence — some ambiguity in plan rules"
      : "Low confidence — manual review recommended";

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
          <circle cx="34" cy="34" r={r} fill="none" stroke={trackColor} strokeWidth="4" />
          <circle
            cx="34" cy="34" r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1), stroke 0.4s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-[16px] font-bold tabular-nums leading-none"
            style={{ color, fontFamily: "var(--font-mono)" }}
          >
            {score}
          </span>
          <span className="text-[8px] font-medium" style={{ color: "var(--color-text-muted)" }}>PCT</span>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed flex-1" style={{ color: "var(--color-text-secondary)" }}>
        {label}
      </p>
    </div>
  );
}

/* ── Annual max gradient bar ─────────────────────────── */
function BenefitBar({ used, total }: { used: number; total: number }) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, (used / total) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  const gradientColor =
    pct > 75
      ? "linear-gradient(90deg, var(--color-primary), var(--color-warning), var(--color-danger))"
      : pct > 50
      ? "linear-gradient(90deg, var(--color-primary), var(--color-warning))"
      : "var(--color-primary)";

  return (
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ background: "var(--color-border)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: gradientColor,
          transition: "width 1.0s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

/* ── Patient/Insurance split bar ─────────────────────── */
function PaySplitBar({
  patientPays,
  insurancePays,
}: {
  patientPays: number;
  insurancePays: number;
}) {
  const [width, setWidth] = useState(0);
  const total = patientPays + insurancePays;
  const patientPct = total > 0 ? Math.round((patientPays / total) * 100) : 0;

  useEffect(() => {
    const t = setTimeout(() => setWidth(patientPct), 400);
    return () => clearTimeout(t);
  }, [patientPct]);

  return (
    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>Cost Allocation</span>
        <span
          className="text-[10px] tabular-nums"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
        >
          Total: {formatCurrency(total)}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "var(--color-success-tint)" }}>
        <div
          className="h-full rounded-l-full"
          style={{
            width: `${width}%`,
            background: "var(--color-danger)",
            transition: "width 1.0s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm" style={{ background: "var(--color-danger)" }} />
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Patient</span>
          <span className="text-[10px] font-semibold ml-1" style={{ color: "var(--color-danger)" }}>
            {formatCurrency(patientPays)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-semibold" style={{ color: "var(--color-success)" }}>
            {formatCurrency(insurancePays)}
          </span>
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Insurance</span>
          <div className="w-2 h-2 rounded-sm" style={{ background: "var(--color-success)" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Decision banner configs ─────────────────────────── */
const DECISION_CONFIG = {
  SAFE_TO_BOOK: {
    bg: "var(--color-success-tint)",
    border: "var(--color-success)",
    accentColor: "var(--color-success)",
    textColor: "var(--color-success)",
    dimColor: "var(--color-text-secondary)",
    label: "SAFE TO BOOK",
    iconClass: "check-ring",
    iconPath: "M5 13l4 4L19 7",
    iconBg: "var(--color-success-tint)",
    iconBorder: "var(--color-success)",
  },
  BOOK_WITH_CAUTION: {
    bg: "var(--color-warning-tint)",
    border: "var(--color-warning)",
    accentColor: "var(--color-warning)",
    textColor: "var(--color-warning)",
    dimColor: "var(--color-text-secondary)",
    label: "BOOK WITH CAUTION",
    iconClass: "warning-pulse",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    iconBg: "var(--color-warning-tint)",
    iconBorder: "var(--color-warning)",
  },
  ESCALATE: {
    bg: "var(--color-danger-tint)",
    border: "var(--color-danger)",
    accentColor: "var(--color-danger)",
    textColor: "var(--color-danger)",
    dimColor: "var(--color-text-secondary)",
    label: "ESCALATE TO HUMAN",
    iconClass: "urgent-blink",
    iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    iconBg: "var(--color-danger-tint)",
    iconBorder: "var(--color-danger)",
  },
};

/* ── Empty state ─────────────────────────────────────── */
function EmptyState({ isRunning }: { isRunning: boolean }) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="px-5 py-3.5 flex-shrink-0"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isRunning ? "var(--color-primary)" : "var(--color-border)" }}
          />
          <h2
            className="text-[13px] font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
          >
            Decision Console
          </h2>
        </div>
        <p className="text-[11px] mt-0.5 ml-3.5" style={{ color: "var(--color-text-muted)" }}>
          {isRunning ? "Processing verification..." : "Verification results & actions"}
        </p>
      </div>

      {isRunning ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8">
          {[78, 58, 44, 28, 60].map((w, i) => (
            <div
              key={i}
              className="rounded-lg shimmer"
              style={{ width: `${w}%`, height: "12px", animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <p className="text-[11px] mt-3" style={{ color: "var(--color-text-muted)" }}>
            Agent is analyzing coverage...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border)",
            }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: "var(--color-text-faint)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[12px] font-medium" style={{ color: "var(--color-text-muted)" }}>Awaiting verification</p>
          <p className="text-[11px] mt-1" style={{ color: "var(--color-text-faint)" }}>
            Results will appear here after the agent completes
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function DecisionConsole({ result, isRunning, patientName }: DecisionConsoleProps) {
  const [scriptExpanded, setScriptExpanded] = useState(false);
  const [actionTaken, setActionTaken] = useState<string | null>(null);

  useEffect(() => {
    setActionTaken(null);
    setScriptExpanded(false);
  }, [result]);

  if (!result && !isRunning) return <EmptyState isRunning={false} />;
  if (isRunning && !result) return <EmptyState isRunning={true} />;
  if (!result) return null;

  const {
    eligibility,
    benefits,
    treatmentCoverage,
    riskFlags,
    bookingRecommendation,
    patientScript,
    internalSummary,
    confidenceScore,
    verificationId,
    timestamp,
  } = result;

  const dc = DECISION_CONFIG[bookingRecommendation.decision];

  const statusColors: Record<string, React.CSSProperties> = {
    ACTIVE:   { color: "var(--color-success)" },
    INACTIVE: { color: "var(--color-danger)" },
    PENDING:  { color: "var(--color-warning)" },
  };
  const statusBadge: Record<string, React.CSSProperties> = {
    ACTIVE:   { background: "var(--color-success-tint)", border: "1px solid var(--color-success)" },
    INACTIVE: { background: "var(--color-danger-tint)",  border: "1px solid var(--color-danger)" },
    PENDING:  { background: "var(--color-warning-tint)", border: "1px solid var(--color-warning)" },
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Panel header ──────────────────────────── */}
      <div
        className="px-5 py-3.5 flex-shrink-0"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-success)" }}
            />
            <h2
              className="text-[13px] font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              Decision Console
            </h2>
          </div>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{
              color: "var(--color-text-faint)",
              background: "var(--color-surface-raised)",
              border: "1px solid var(--color-border-subtle)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {verificationId}
          </span>
        </div>
        <p className="text-[11px] mt-0.5 ml-3.5" style={{ color: "var(--color-text-muted)" }}>
          {new Date(timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* ── Scrollable content ────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3">

        {/* ── Booking decision banner ─────────────── */}
        <div
          className="rounded-xl p-4 mb-3 fade-in-up"
          style={{
            background: dc.bg,
            border: `1px solid ${dc.border}`,
            borderLeft: `3px solid ${dc.border}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${dc.iconClass}`}
              style={{ background: dc.iconBg, border: `1.5px solid ${dc.iconBorder}` }}
            >
              <svg
                className="w-5 h-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                style={{ color: dc.accentColor }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dc.iconPath} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-[14px] font-bold tracking-wide"
                style={{ color: dc.textColor, fontFamily: "var(--font-display)" }}
              >
                {dc.label}
              </div>
              <div
                className="text-[11px] leading-relaxed mt-0.5"
                style={{ color: dc.dimColor }}
              >
                {bookingRecommendation.reason}
              </div>
            </div>
          </div>

          {/* Action steps */}
          <div
            className="rounded-lg p-3 space-y-1.5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
            }}
          >
            {bookingRecommendation.actionSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold"
                  style={{ background: dc.iconBg, color: dc.accentColor }}
                >
                  {i + 1}
                </div>
                <span className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Eligibility ─────────────────────────── */}
        <SectionCard
          title="Eligibility Summary"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        >
          <DataRow
            label="Status"
            value={
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{ ...statusBadge[eligibility.status], ...statusColors[eligibility.status] }}
              >
                {eligibility.status}
              </span>
            }
          />
          <DataRow label="Plan Type" value={eligibility.planType} />
          <DataRow
            label="Plan Name"
            value={eligibility.planName}
            valueStyle={{ color: "var(--color-text-secondary)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          />
          <DataRow label="Coverage Period" value={eligibility.coveragePeriod} />
          <DataRow
            label="Payer Phone"
            value={eligibility.payerPhone}
            valueStyle={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}
          />
        </SectionCard>

        {/* ── Benefits ────────────────────────────── */}
        <SectionCard
          title="Benefit Breakdown"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        >
          <div className="mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Annual Maximum Used</span>
              <span
                className="text-[10px] tabular-nums"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
              >
                {formatCurrency(benefits.annualMaximumUsed)} / {formatCurrency(benefits.annualMaximum)}
              </span>
            </div>
            <BenefitBar used={benefits.annualMaximumUsed} total={benefits.annualMaximum} />
          </div>
          <DataRow
            label="Remaining Benefit"
            value={formatCurrency(benefits.remainingBenefit)}
            valueStyle={{
              color: benefits.remainingBenefit < 500 ? "var(--color-danger)" : "var(--color-success)",
              fontWeight: 600,
            }}
          />
          <DataRow
            label="Deductible"
            value={
              benefits.deductibleMet
                ? "Met"
                : `${formatCurrency(benefits.deductibleRemaining)} remaining`
            }
            valueStyle={{ color: benefits.deductibleMet ? "var(--color-success)" : "var(--color-warning)" }}
          />
          <DataRow
            label="Waiting Period"
            value={benefits.waitingPeriod}
            valueStyle={{ color: benefits.waitingPeriod === "None" ? "var(--color-success)" : "var(--color-warning)" }}
          />
          <DataRow label="In-Network" value={`${benefits.inNetworkCoverage}%`} valueStyle={{ color: "var(--color-success)" }} />
          <DataRow label="Out-of-Network" value={`${benefits.outOfNetworkCoverage}%`} />
        </SectionCard>

        {/* ── Treatment Coverage ──────────────────── */}
        <SectionCard
          title="Treatment Coverage"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        >
          <DataRow
            label="Covered"
            value={treatmentCoverage.covered ? "Yes" : "NOT COVERED"}
            valueStyle={{
              color: treatmentCoverage.covered ? "var(--color-success)" : "var(--color-danger)",
              fontWeight: 600,
            }}
          />
          <DataRow label="Coverage %" value={`${treatmentCoverage.coveragePercentage}%`} />
          <DataRow
            label="Frequency Limit"
            value={treatmentCoverage.frequencyLimit}
            valueStyle={{ color: "var(--color-text-secondary)", textAlign: "right", maxWidth: "160px" }}
          />
          <DataRow
            label="Pre-Auth Required"
            value={treatmentCoverage.preAuthRequired ? "YES — Required" : "No"}
            valueStyle={{
              color: treatmentCoverage.preAuthRequired ? "var(--color-danger)" : "var(--color-success)",
              fontWeight: treatmentCoverage.preAuthRequired ? 600 : undefined,
            }}
          />
          <PaySplitBar
            patientPays={treatmentCoverage.estimatedPatientResponsibility}
            insurancePays={treatmentCoverage.estimatedInsurancePays}
          />
          {treatmentCoverage.notes && (
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {treatmentCoverage.notes}
              </p>
            </div>
          )}
        </SectionCard>

        {/* ── Risk Flags ──────────────────────────── */}
        <SectionCard
          title="Risk Flags"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          }
        >
          <RiskFlags flags={riskFlags} />
        </SectionCard>

        {/* ── Patient Script ──────────────────────── */}
        <div
          className="rounded-xl overflow-hidden mb-3 card-shadow"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <button
            onClick={() => setScriptExpanded(!scriptExpanded)}
            className="w-full flex items-center justify-between px-4 py-2.5 border-b transition-colors"
            style={{
              borderColor: "var(--color-border-subtle)",
              background: scriptExpanded ? "var(--color-primary-tint)" : "var(--color-surface-raised)",
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: "var(--color-primary)" }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
              <h3
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
              >
                Patient-Facing Script
              </h3>
            </div>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${scriptExpanded ? "rotate-180" : ""}`}
              style={{ color: "var(--color-text-faint)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {scriptExpanded && (
            <div className="px-4 py-3">
              <div
                className="rounded-lg p-3"
                style={{
                  background: "var(--color-primary-tint)",
                  border: "1px solid var(--color-primary-mid)",
                }}
              >
                <p
                  className="text-[11px] leading-relaxed italic"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  &ldquo;{patientScript}&rdquo;
                </p>
              </div>
              {internalSummary && (
                <div
                  className="mt-2 rounded-lg p-3"
                  style={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p
                    className="text-[9px] font-semibold uppercase tracking-widest mb-1.5"
                    style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-sans)" }}
                  >
                    Internal Billing Note
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {internalSummary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Agent Confidence ────────────────────── */}
        <div
          className="rounded-xl p-4 mb-3 card-shadow"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
          >
            Agent Confidence
          </p>
          <ConfidenceArc score={confidenceScore} />
        </div>

        {/* ── Reviewer Actions ────────────────────── */}
        {!actionTaken ? (
          <div
            className="rounded-xl p-4 mb-3 card-shadow"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="text-[10px] font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
            >
              Reviewer Actions
            </p>
            <div className="flex flex-col gap-2">
              {/* Approve button — emerald primary */}
              <button
                onClick={() => setActionTaken("approved")}
                className="w-full py-2.5 px-4 rounded-lg text-[13px] font-semibold text-white flex items-center justify-center gap-2 btn-shimmer transition-all active:scale-[0.98]"
                style={{
                  background: "var(--color-primary)",
                  fontFamily: "var(--font-sans)",
                  borderRadius: "8px",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-hover)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary)"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve &amp; Schedule
              </button>
              {/* Edit button — outlined primary */}
              <button
                onClick={() => setActionTaken("edited")}
                className="w-full py-2.5 px-4 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 btn-shimmer transition-all active:scale-[0.98]"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-sans)",
                  borderRadius: "8px",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit &amp; Approve
              </button>
              {/* Escalate button — danger tint */}
              <button
                onClick={() => setActionTaken("escalated")}
                className="w-full py-2.5 px-4 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-2 btn-shimmer transition-all active:scale-[0.98]"
                style={{
                  background: "var(--color-danger-tint)",
                  border: "1px solid var(--color-danger)",
                  color: "var(--color-danger)",
                  fontFamily: "var(--font-sans)",
                  borderRadius: "8px",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Escalate to Senior
              </button>
            </div>
          </div>
        ) : (
          <div
            className="rounded-xl p-5 mb-3 text-center fade-in-up"
            style={{
              background:
                actionTaken === "approved"
                  ? "var(--color-success-tint)"
                  : actionTaken === "edited"
                  ? "var(--color-primary-tint)"
                  : "var(--color-danger-tint)",
              border: `1px solid ${
                actionTaken === "approved"
                  ? "var(--color-success)"
                  : actionTaken === "edited"
                  ? "var(--color-primary)"
                  : "var(--color-danger)"
              }`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{
                background:
                  actionTaken === "approved"
                    ? "var(--color-success-tint)"
                    : actionTaken === "edited"
                    ? "var(--color-primary-tint)"
                    : "var(--color-danger-tint)",
                border: `1.5px solid ${
                  actionTaken === "approved"
                    ? "var(--color-success)"
                    : actionTaken === "edited"
                    ? "var(--color-primary)"
                    : "var(--color-danger)"
                }`,
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                style={{
                  color:
                    actionTaken === "approved"
                      ? "var(--color-success)"
                      : actionTaken === "edited"
                      ? "var(--color-primary)"
                      : "var(--color-danger)",
                }}
              >
                {actionTaken === "approved" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : actionTaken === "edited" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
            </div>
            <p
              className="text-[13px] font-semibold"
              style={{
                color:
                  actionTaken === "approved"
                    ? "var(--color-success)"
                    : actionTaken === "edited"
                    ? "var(--color-primary)"
                    : "var(--color-danger)",
                fontFamily: "var(--font-display)",
              }}
            >
              {actionTaken === "approved"
                ? "Approved & Scheduled"
                : actionTaken === "edited"
                ? "Sent for Edit Review"
                : "Escalated to Senior Reviewer"}
            </p>
            <p
              className="text-[10px] mt-1 tabular-nums"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}

        {/* ── Powered by Claude ────────────────────── */}
        <div
          className="flex items-center justify-center gap-2 py-3 mb-1 rounded-lg"
          style={{ opacity: 0.40 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-primary)" }}>
            <path
              d="M12 2L22 12L12 22L2 12L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="var(--color-primary-tint)"
            />
            <path d="M12 7L17 12L12 17L7 12L12 7Z" fill="currentColor" opacity="0.6" />
          </svg>
          <span
            className="text-[10px] font-medium tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            Powered by Claude
          </span>
        </div>
      </div>
    </div>
  );
}
