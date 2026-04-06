"use client";

import React, { useState } from "react";
import { AgentStep, VerificationResult } from "@/lib/types";

interface AgentTimelineProps {
  steps: AgentStep[];
  isRunning: boolean;
  result: VerificationResult | null;
}

function StepIcon({ status }: { status: AgentStep["status"] }) {
  if (status === "running") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-[#6366f1] flex items-center justify-center bg-[#1a1a2e] flex-shrink-0">
        <svg className="animate-spin h-3.5 w-3.5 text-[#6366f1]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-[#22c55e] flex items-center justify-center bg-[#052e16] flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (status === "flagged") {
    return (
      <div className="w-7 h-7 rounded-full border-2 border-[#ef4444] flex items-center justify-center bg-[#1f0000] flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-[#222] flex items-center justify-center bg-[#111] flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-[#333]" />
    </div>
  );
}

function StepRow({ step, isLast }: { step: AgentStep; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isActive = step.status !== "pending";

  return (
    <div className="flex gap-3">
      {/* Timeline line + icon */}
      <div className="flex flex-col items-center">
        <StepIcon status={step.status} />
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 transition-colors duration-500"
            style={{
              background: step.status === "completed" || step.status === "flagged"
                ? "linear-gradient(to bottom, #22c55e33, #22222244)"
                : "#1e1e1e",
              minHeight: "20px",
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className={`flex-1 pb-4 transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-30"
        }`}
      >
        <div className="flex items-start justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#e2e8f0]">{step.name}</span>
            {step.status === "running" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a2e] text-[#818cf8] border border-[#312e81] font-medium animate-pulse">
                RUNNING
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {step.timestamp && (
              <span className="text-[10px] text-[#475569] font-mono">{step.timestamp}</span>
            )}
            {step.duration && step.status === "completed" && (
              <span className="text-[10px] text-[#334155] font-mono bg-[#0f172a] px-1.5 py-0.5 rounded border border-[#1e293b]">
                {step.duration}ms
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[#64748b] leading-relaxed">{step.description}</p>

        {step.evidence && step.status !== "pending" && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1.5 text-[11px] text-[#475569] hover:text-[#6366f1] flex items-center gap-1 transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {expanded ? "Hide" : "View"} evidence
          </button>
        )}

        {expanded && step.evidence && (
          <div className="mt-2 p-2.5 rounded-lg bg-[#0a0f1e] border border-[#1e2a3a] text-[11px] text-[#4a6385] font-mono leading-relaxed">
            {step.evidence}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentTimeline({
  steps,
  isRunning,
  result,
}: AgentTimelineProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);

  const completedCount = steps.filter((s) => s.status === "completed" || s.status === "flagged").length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-[#6366f1] animate-pulse" : result ? "bg-[#22c55e]" : "bg-[#333]"}`} />
            <h2 className="text-sm font-semibold text-[#f1f5f9]">Agent Reasoning Trace</h2>
          </div>
          {isRunning && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0f0f0f] border border-[#1e1e1e]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-400 tracking-widest">LIVE</span>
            </div>
          )}
          {result && !isRunning && (
            <span className="text-[10px] text-[#22c55e] bg-[#052e16] border border-[#14532d] px-2 py-0.5 rounded font-medium">
              COMPLETE
            </span>
          )}
        </div>
        <p className="text-xs text-[#64748b] ml-4">
          {isRunning
            ? `Processing... ${completedCount}/${steps.length} steps`
            : result
            ? `${steps.length} steps completed`
            : "Awaiting verification request"}
        </p>
        {(isRunning || result) && steps.length > 0 && (
          <div className="mt-2 ml-4 h-0.5 bg-[#1e1e1e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366f1] to-[#22c55e] transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {steps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-[#111] border border-[#1e1e1e] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[#333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-[#334155] font-medium">No active verification</p>
            <p className="text-xs text-[#1e293b] mt-1">Fill in patient data and run the agent</p>
          </div>
        ) : (
          <div>
            {steps.map((step, i) => (
              <StepRow key={step.id} step={step} isLast={i === steps.length - 1} />
            ))}
          </div>
        )}

        {/* Raw JSON output */}
        {result && (
          <div className="mt-4 rounded-xl border border-[#1e1e1e] overflow-hidden">
            <button
              onClick={() => setJsonExpanded(!jsonExpanded)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0f0f0f] hover:bg-[#111] transition-colors"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-xs font-medium text-[#64748b]">Raw Agent Output</span>
              </div>
              <svg
                className={`w-4 h-4 text-[#475569] transition-transform ${jsonExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {jsonExpanded && (
              <div className="p-4 bg-[#050505] overflow-x-auto">
                <pre className="text-[11px] text-[#3b5068] font-mono leading-relaxed whitespace-pre-wrap">
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
