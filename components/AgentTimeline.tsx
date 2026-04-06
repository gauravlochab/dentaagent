"use client";

import React, { useState, useEffect, useRef } from "react";
import { AgentStep, VerificationResult } from "@/lib/types";

interface AgentTimelineProps {
  steps: AgentStep[];
  isRunning: boolean;
  result: VerificationResult | null;
}

function StepIcon({ status }: { status: AgentStep["status"] }) {
  if (status === "running") {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(99,102,241,0.12)",
          border: "1.5px solid rgba(99,102,241,0.6)",
          boxShadow: "0 0 12px rgba(99,102,241,0.25)",
        }}
      >
        <svg className="animate-spin h-3.5 w-3.5 text-[#818cf8]" fill="none" viewBox="0 0 24 24">
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
          background: "rgba(34,197,94,0.1)",
          border: "1.5px solid rgba(34,197,94,0.4)",
          boxShadow: "0 0 8px rgba(34,197,94,0.15)",
        }}
      >
        <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          background: "rgba(239,68,68,0.1)",
          border: "1.5px solid rgba(239,68,68,0.4)",
        }}
      >
        <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.06)" }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]" />
    </div>
  );
}

function StepRow({ step, isLast, index }: { step: AgentStep; isLast: boolean; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = step.status !== "pending";
  const isRunning = step.status === "running";
  const isCompleted = step.status === "completed";

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
                ? "linear-gradient(to bottom, rgba(34,197,94,0.4), rgba(34,197,94,0.05))"
                : isRunning
                ? "linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(99,102,241,0.05))"
                : "rgba(255,255,255,0.04)",
            }}
          />
        )}
      </div>

      {/* Step card */}
      <div
        className={`flex-1 pb-4 transition-all duration-300 ${
          isActive ? "opacity-100" : "opacity-25"
        }`}
      >
        <div
          className={`rounded-lg px-3 py-2.5 mb-0.5 transition-all duration-300 ${
            isRunning
              ? "step-running-glow bg-[#0d1022] border border-[#6366f1]/20"
              : isCompleted
              ? "bg-transparent"
              : "bg-transparent"
          }`}
        >
          {/* Step header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className={`text-[13px] font-semibold leading-tight ${
                isRunning ? "text-[#c7d2fe]" : isCompleted ? "text-[#e2e8f0]" : "text-[#334155]"
              }`}>
                {step.name}
              </span>
              {isRunning && (
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-widest flex-shrink-0"
                  style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }}
                >
                  RUNNING
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {step.timestamp && (
                <span className="text-[10px] text-[#1e293b] font-mono tabular-nums">{step.timestamp}</span>
              )}
              {step.duration && isCompleted && (
                <span
                  className="text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#334155",
                  }}
                >
                  {step.duration}ms
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className={`text-[12px] leading-relaxed mt-0.5 ${
            isRunning ? "text-[#4a5568]" : "text-[#334155]"
          }`}>
            {step.description}
          </p>

          {/* Evidence toggle */}
          {step.evidence && isActive && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center gap-1 transition-colors group"
              style={{ color: expanded ? "#6366f1" : "#1e293b" }}
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[10px] font-medium group-hover:text-[#6366f1] transition-colors">
                {expanded ? "Hide" : "View"} evidence
              </span>
            </button>
          )}

          {/* Evidence panel — code editor aesthetic */}
          {expanded && step.evidence && (
            <div
              className="mt-2 rounded-lg overflow-hidden"
              style={{
                background: "#050810",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Editor header bar */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="w-2 h-2 rounded-full bg-[#ef4444]/40" />
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]/40" />
                <div className="w-2 h-2 rounded-full bg-[#22c55e]/40" />
                <span className="text-[9px] text-[#1e293b] font-mono ml-1">evidence.json</span>
              </div>
              {/* Evidence content */}
              <div className="p-3 overflow-x-auto">
                <pre
                  className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap"
                  style={{ color: "#2d4a6b" }}
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
  const color = pct >= 100 ? "#22c55e" : "#6366f1";

  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      {/* Track */}
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
      {/* Fill */}
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
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.3)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 20px rgba(34,197,94,0.15)",
      }}
    >
      <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-[11px] font-semibold text-[#4ade80]">Verification complete</span>
    </div>
  );
}

export default function AgentTimeline({ steps, isRunning, result }: AgentTimelineProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const prevResultRef = useRef<VerificationResult | null>(null);

  const completedCount = steps.filter((s) => s.status === "completed" || s.status === "flagged").length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  // Show toast when result first arrives
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
        className="px-5 py-3.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Progress arc */}
            {steps.length > 0 && (
              <div className="relative flex-shrink-0">
                <ProgressArc pct={progressPct} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold tabular-nums" style={{ color: progressPct >= 100 ? "#22c55e" : "#6366f1" }}>
                    {progressPct > 0 ? `${progressPct}` : ""}
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[13px] font-semibold text-[#e2e8f0] tracking-tight">Agent Reasoning Trace</h2>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "#2d4a6b" }}>
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
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] live-dot live-ring" />
              </div>
              <span className="text-[9px] font-bold text-[#f87171] tracking-[0.12em]">LIVE</span>
            </div>
          )}
          {result && !isRunning && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <svg className="w-2.5 h-2.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[9px] font-bold text-[#22c55e] tracking-wide">COMPLETE</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {steps.length > 0 && (
          <div
            className="mt-3 h-px rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-600"
              style={{
                width: `${progressPct}%`,
                background: progressPct >= 100
                  ? "linear-gradient(90deg, #22c55e, #16a34a)"
                  : "linear-gradient(90deg, #6366f1, #818cf8)",
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
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <svg className="w-5 h-5" style={{ color: "#1e293b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-[13px] font-medium" style={{ color: "#1e293b" }}>No active verification</p>
            <p className="text-[11px] mt-1" style={{ color: "#0f172a" }}>Fill in patient data and run the agent</p>
          </div>
        ) : (
          <div>
            {steps.map((step, i) => (
              <StepRow key={step.id} step={step} isLast={i === steps.length - 1} index={i} />
            ))}
          </div>
        )}

        {/* Raw JSON panel */}
        {result && (
          <div
            className="mt-4 rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <button
              onClick={() => setJsonExpanded(!jsonExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" style={{ color: "#2d4a6b" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-[11px] font-medium" style={{ color: "#2d4a6b" }}>Raw Agent Output</span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#1e293b" }}
                >
                  JSON
                </span>
              </div>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${jsonExpanded ? "rotate-180" : ""}`}
                style={{ color: "#1e293b" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {jsonExpanded && (
              <div className="p-4 overflow-x-auto" style={{ background: "#04060e" }}>
                <pre className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap" style={{ color: "#1e3a5f" }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
