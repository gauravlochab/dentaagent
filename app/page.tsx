"use client";

import React, { useState, useCallback } from "react";
import PatientForm from "@/components/PatientForm";
import AgentTimeline from "@/components/AgentTimeline";
import DecisionConsole from "@/components/DecisionConsole";
import { PatientFormData, AgentStep, VerificationResult, VerificationStatus } from "@/lib/types";
import { buildAgentSteps } from "@/lib/agentSteps";

const STEP_DELAYS = [0, 400, 900, 1600, 2300, 2900, 4500];

const EMPTY_FORM: PatientFormData = {
  patientName: "",
  dateOfBirth: "",
  payerName: "",
  memberId: "",
  groupId: "",
  requestedTreatment: "",
  appointmentDate: "",
};

export default function Home() {
  const [formData, setFormData] = useState<PatientFormData>(EMPTY_FORM);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const runVerification = useCallback(async () => {
    if (status === "running") return;

    setStatus("running");
    setResult(null);
    setError(null);

    const verificationId = `VER-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
    const formRecord: Record<string, string> = { ...formData };

    const initialSteps = buildAgentSteps(formData.memberId, verificationId, formRecord);
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" })));

    const apiPromise = fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise<void>((resolve) => {
        const delay = i === 0 ? 0 : STEP_DELAYS[i] - STEP_DELAYS[i - 1];
        setTimeout(resolve, delay);
      });

      const now = new Date();
      const ts = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

      if (i > 0) {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i - 1 ? { ...s, status: "completed", timestamp: ts } : s
          )
        );
      }

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "running", timestamp: ts } : s
        )
      );
    }

    try {
      const response = await apiPromise;
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      const finalTs = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === prev.length - 1 ? { ...s, status: "completed", timestamp: finalTs } : s
        )
      );

      await new Promise((r) => setTimeout(r, 400));
      setResult(data);
      setStatus("completed");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setStatus("error");
      const errTs = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setSteps((prev) =>
        prev.map((s) => s.status === "running" ? { ...s, status: "flagged", timestamp: errTs } : s)
      );
    }
  }, [formData, status]);

  const isRunning = status === "running";

  const statusLabel = isRunning
    ? "Agent running"
    : status === "completed"
    ? "Verification complete"
    : status === "error"
    ? "Error occurred"
    : "Ready";

  return (
    <div className="flex flex-col h-screen bg-[#080c18] grid-bg overflow-hidden" style={{ position: "relative", zIndex: 1 }}>

      {/* ── Top Navigation ─────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 border-b border-[#ffffff08] bg-[#080c18]/90 backdrop-blur-md z-20 nav-top-border"
        style={{ height: "44px" }}
      >
        {/* Left: Logo + breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", boxShadow: "0 0 12px rgba(99,102,241,0.35)" }}
            >
              <svg className="w-3.5 h-3.5 text-white" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-[#e2e8f0] tracking-tight">StafGo</span>
          </div>

          {/* Breadcrumb divider */}
          <div className="flex items-center gap-1.5 text-[#1e293b]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#334155] font-medium">Dental RCM</span>
            <svg className="w-3 h-3 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[12px] text-[#64748b] font-medium">Insurance Verification</span>
          </div>
        </div>

        {/* Right: status + nav + avatar */}
        <div className="flex items-center gap-1">
          {/* Live status pill */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border mr-3 transition-all duration-500 ${
            isRunning
              ? "bg-[#0f0a1e] border-[#312e81]"
              : status === "completed"
              ? "bg-[#031a0e] border-[#14532d]"
              : status === "error"
              ? "bg-[#1a0505] border-[#7f1d1d]"
              : "bg-[#0d0d0d] border-[#1e1e1e]"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              isRunning
                ? "bg-[#6366f1] animate-pulse"
                : status === "completed"
                ? "bg-[#22c55e]"
                : status === "error"
                ? "bg-[#ef4444]"
                : "bg-[#1e293b]"
            }`} />
            <span className={`text-[11px] font-medium tracking-tight ${
              isRunning ? "text-[#818cf8]" : status === "completed" ? "text-[#4ade80]" : status === "error" ? "text-[#f87171]" : "text-[#334155]"
            }`}>
              {statusLabel}
            </span>
          </div>

          <div className="h-3.5 w-px bg-[#ffffff06] mx-1" />

          {/* Nav items */}
          {[
            { label: "Verifications", hint: "⌘V" },
            { label: "History", hint: "⌘H" },
            { label: "Analytics", hint: "" },
            { label: "Settings", hint: "⌘," },
          ].map((item) => (
            <button
              key={item.label}
              className="nav-item relative flex items-center gap-1.5 px-3 h-[44px] text-[12px] font-medium"
            >
              {item.label}
              {item.hint && (
                <span className="text-[10px] text-[#1e293b] font-mono hidden group-hover:inline">{item.hint}</span>
              )}
            </button>
          ))}

          <div className="h-3.5 w-px bg-[#ffffff06] mx-1" />

          {/* User avatar */}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 8px rgba(99,102,241,0.3)" }}
          >
            <span className="text-[9px] font-bold text-white tracking-tight">SG</span>
          </div>
        </div>
      </header>

      {/* ── Error Banner ───────────────────────────────── */}
      {error && (
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 bg-[#130000] border-b border-[#7f1d1d]/40 text-[#f87171] text-[12px] z-10">
          <div className="w-4 h-4 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/30 flex items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-[#fca5a5]/80">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── 3-Panel Layout ─────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ position: "relative", zIndex: 1 }}>

        {/* LEFT: Patient Intake (320px) */}
        <div className="w-80 flex-shrink-0 border-r border-[#ffffff05] bg-[#0a0e1a] flex flex-col overflow-hidden">
          <PatientForm
            formData={formData}
            onChange={setFormData}
            onSubmit={runVerification}
            isRunning={isRunning}
          />
        </div>

        {/* MIDDLE: Agent Timeline */}
        <div className="flex-1 border-r border-[#ffffff05] bg-[#080c18] flex flex-col overflow-hidden">
          <AgentTimeline
            steps={steps}
            isRunning={isRunning}
            result={result}
          />
        </div>

        {/* RIGHT: Decision Console (380px) */}
        <div className="w-96 flex-shrink-0 bg-[#0a0e1a] flex flex-col overflow-hidden">
          <DecisionConsole
            result={result}
            isRunning={isRunning}
            patientName={formData.patientName}
          />
        </div>
      </div>
    </div>
  );
}
