"use client";

import React, { useState, useEffect, useRef } from "react";
import { AgentStep, VerificationResult, PatientFormData } from "@/lib/types";
import { PayerBenefitData } from "@/lib/mockPayerData";
import { generateSourceDocuments, SourceDocument } from "@/lib/mockDocuments";
import DocumentViewer from "@/components/DocumentViewer";

/* ── Step ID mapping (name → stepId for doc lookup) ─────── */
const STEP_NAME_TO_ID: Record<string, string> = {
  "Patient Intake": "intake",
  "Eligibility Check": "eligibility",
  "Benefits Extraction": "benefits",
  "Coverage Analysis": "coverage",
  "Risk Assessment": "risk",
  "Booking Decision": "booking",
  "Audit & Compliance": "audit",
};

interface AgentTimelineProps {
  steps: AgentStep[];
  isRunning: boolean;
  result: VerificationResult | null;
  formData: PatientFormData;
  payerData: PayerBenefitData | null;
  verificationId: string;
}

function StepIcon({ status }: { status: AgentStep["status"] }) {
  if (status === "running") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--color-primary-tint)",
          border: "1.5px solid var(--color-primary)",
          boxShadow: "0 0 10px oklch(40% 0.16 158 / 0.18)",
        }}
      >
        <svg className="animate-spin h-3.5 w-3.5" style={{ color: "var(--color-primary)" }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--color-success-tint)",
          border: "1.5px solid var(--color-success)",
          boxShadow: "0 0 8px oklch(52% 0.18 142 / 0.12)",
        }}
      >
        <svg className="w-3.5 h-3.5" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === "flagged") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--color-danger-tint)",
          border: "1.5px solid var(--color-danger)",
        }}
      >
        <svg className="w-3.5 h-3.5" style={{ color: "var(--color-danger)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "var(--color-surface-raised)", border: "1.5px solid var(--color-border)" }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-text-faint)" }} />
    </div>
  );
}

interface StepRowProps {
  step: AgentStep;
  isLast: boolean;
  index: number;
  doc: SourceDocument | undefined;
  onViewSource: () => void;
}

function StepRow({ step, isLast, index, doc, onViewSource }: StepRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isActive = step.status !== "pending";
  const isRunning = step.status === "running";
  const isCompleted = step.status === "completed";
  const showViewSource = (isRunning || isCompleted) && !!doc;

  return (
    <div
      className="flex gap-3 step-appear"
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0 }}
    >
      {/* Timeline spine + icon */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: "28px" }}>
        <StepIcon status={step.status} />
        {!isLast && (
          <div
            className="mt-1 transition-all duration-700"
            style={{
              width: "1px",
              flexGrow: 1,
              minHeight: "20px",
              background: isCompleted
                ? "linear-gradient(to bottom, var(--color-success), transparent)"
                : isRunning
                ? "linear-gradient(to bottom, var(--color-primary), transparent)"
                : "var(--color-border-subtle)",
            }}
          />
        )}
      </div>

      {/* Step card */}
      <div
        className={`flex-1 pb-4 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-35"}`}
      >
        <div
          className={`rounded-lg px-3 py-2.5 mb-0.5 transition-all duration-300 ${
            isRunning ? "step-running-glow" : ""
          }`}
          style={
            isRunning
              ? {
                  background: "var(--color-primary-tint)",
                  border: "1px solid var(--color-primary-mid)",
                }
              : {}
          }
        >
          {/* Step header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span
                className="text-[13px] font-semibold leading-tight"
                style={{ color: isRunning ? "var(--color-primary)" : isCompleted ? "var(--color-text)" : "var(--color-text-muted)" }}
              >
                {step.name}
              </span>
              {isRunning && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest flex-shrink-0"
                  style={{
                    background: "var(--color-primary-tint)",
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  RUNNING
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {step.timestamp && (
                <span
                  className="text-[10px] tabular-nums"
                  style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}
                >
                  {step.timestamp}
                </span>
              )}
              {step.duration && isCompleted && (
                <span
                  className="text-[10px] tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {step.duration}ms
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p
            className="text-[12px] leading-relaxed mt-0.5"
            style={{ color: "var(--color-text-muted)" }}
          >
            {step.description}
          </p>

          {/* Action row: evidence toggle + view source */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Evidence toggle */}
            {step.evidence && isActive && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 transition-colors group"
                style={{ color: expanded ? "var(--color-primary)" : "var(--color-text-faint)" }}
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-[10px] font-medium" style={{ color: "inherit" }}>
                  {expanded ? "Hide" : "View"} evidence
                </span>
              </button>
            )}

            {/* View Source button */}
            {showViewSource && (
              <button
                onClick={onViewSource}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  background: "var(--color-primary-tint)",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background var(--duration-fast), box-shadow var(--duration-fast)",
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "var(--color-primary-mid)";
                  btn.style.boxShadow = "0 2px 8px oklch(40% 0.16 158 / 0.18)";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "var(--color-primary-tint)";
                  btn.style.boxShadow = "none";
                }}
              >
                <svg
                  style={{ width: "9px", height: "9px", flexShrink: 0 }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Source
                <svg
                  style={{ width: "8px", height: "8px", flexShrink: 0 }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Evidence panel */}
          {expanded && step.evidence && (
            <div
              className="mt-2 rounded-lg overflow-hidden"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Editor header bar */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 border-b"
                style={{
                  borderColor: "var(--color-border-subtle)",
                  background: "var(--color-surface-raised)",
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: "oklch(58% 0.22 25 / 0.5)" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "oklch(68% 0.18 75 / 0.5)" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "oklch(52% 0.18 142 / 0.5)" }} />
                <span
                  className="text-[9px] ml-1"
                  style={{ color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}
                >
                  evidence.json
                </span>
              </div>
              {/* Evidence content */}
              <div className="p-3 overflow-x-auto">
                <pre
                  className="text-[10px] leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
                >
                  {step.evidence}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Progress arc SVG ─────────────────────────────────── */
function ProgressArc({ pct }: { pct: number }) {
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 100 ? "var(--color-success)" : "var(--color-primary)";

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" stroke="var(--color-border)" strokeWidth="2.5" />
      <circle
        cx="20" cy="20" r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.4s" }}
      />
    </svg>
  );
}

/* ── Complete toast ───────────────────────────────────── */
function CompleteToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      className="toast-complete absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full z-50 pointer-events-none"
      style={{
        background: "var(--color-success-tint)",
        border: "1px solid var(--color-success)",
        backdropFilter: "blur(8px)",
      }}
    >
      <svg className="w-3.5 h-3.5" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-[11px] font-semibold" style={{ color: "var(--color-success)" }}>Verification complete</span>
    </div>
  );
}

export default function AgentTimeline({ steps, isRunning, result, formData, payerData, verificationId }: AgentTimelineProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [openDocStep, setOpenDocStep] = useState<string | null>(null);
  const prevResultRef = useRef<VerificationResult | null>(null);

  const completedCount = steps.filter((s) => s.status === "completed" || s.status === "flagged").length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  // Generate source documents (regenerated on each relevant change)
  const sourceDocs = steps.length > 0
    ? generateSourceDocuments(formData, payerData, result, verificationId)
    : {};

  // Find the currently open document
  const openDoc = openDocStep ? sourceDocs[openDocStep] ?? null : null;

  useEffect(() => {
    if (result && !prevResultRef.current) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3200);
      return () => clearTimeout(t);
    }
    prevResultRef.current = result;
  }, [result]);

  return (
    <div className="flex flex-col h-full" style={{ position: "relative" }}>
      <CompleteToast show={showToast} />

      {/* ── Panel header ────────────────────────────── */}
      <div
        className="px-5 py-3.5 flex-shrink-0"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Progress arc */}
            {steps.length > 0 && (
              <div className="relative flex-shrink-0">
                <ProgressArc pct={progressPct} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[9px] font-bold tabular-nums"
                    style={{
                      color: progressPct >= 100 ? "var(--color-success)" : "var(--color-primary)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {progressPct > 0 ? `${progressPct}` : ""}
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-[13px] font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                >
                  Agent Reasoning Trace
                </h2>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {isRunning
                  ? `Processing — ${completedCount} of ${steps.length} steps`
                  : result
                  ? `${steps.length} steps completed`
                  : "Awaiting verification request"}
              </p>
            </div>
          </div>

          {/* LIVE badge */}
          {isRunning && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-danger-tint)",
                border: "1px solid var(--color-danger)",
              }}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-1.5 h-1.5 rounded-full live-dot live-ring"
                  style={{ background: "var(--color-danger)" }}
                />
              </div>
              <span
                className="text-[9px] font-bold tracking-[0.12em]"
                style={{ color: "var(--color-danger)" }}
              >
                LIVE
              </span>
            </div>
          )}
          {result && !isRunning && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-success-tint)",
                border: "1px solid var(--color-success)",
              }}
            >
              <svg className="w-2.5 h-2.5" style={{ color: "var(--color-success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[9px] font-bold tracking-wide" style={{ color: "var(--color-success)" }}>COMPLETE</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {steps.length > 0 && (
          <div
            className="mt-3 h-px rounded-full overflow-hidden"
            style={{ background: "var(--color-border-subtle)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                background: progressPct >= 100
                  ? "var(--color-success)"
                  : "var(--color-primary)",
                transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        )}
      </div>

      {/* ── Steps list ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: "var(--color-surface-raised)",
                border: "1px solid var(--color-border)",
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "var(--color-text-faint)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "var(--color-text-muted)" }}>No active verification</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--color-text-faint)" }}>Fill in patient data and run the agent</p>
          </div>
        ) : (
          <div>
            {steps.map((step, i) => {
              const stepId = STEP_NAME_TO_ID[step.name] ?? step.id;
              return (
                <StepRow
                  key={step.id}
                  step={step}
                  isLast={i === steps.length - 1}
                  index={i}
                  doc={sourceDocs[stepId]}
                  onViewSource={() => setOpenDocStep(stepId)}
                />
              );
            })}
          </div>
        )}

        {/* Raw JSON panel */}
        {result && (
          <div
            className="mt-4 rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            <button
              onClick={() => setJsonExpanded(!jsonExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 transition-colors"
              style={{ background: "var(--color-surface-raised)" }}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--color-primary)" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-[11px] font-medium" style={{ color: "var(--color-text-secondary)" }}>Raw Agent Output</span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--color-primary-tint)",
                    border: "1px solid var(--color-primary-mid)",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  JSON
                </span>
              </div>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${jsonExpanded ? "rotate-180" : ""}`}
                style={{ color: "var(--color-text-faint)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {jsonExpanded && (
              <div className="p-4 overflow-x-auto" style={{ background: "var(--color-surface)" }}>
                <pre
                  className="text-[10px] leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Document Viewer overlay (within middle panel) ── */}
      <DocumentViewer
        doc={openDoc}
        onClose={() => setOpenDocStep(null)}
      />
    </div>
  );
}
