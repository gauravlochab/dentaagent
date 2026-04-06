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

    // Generate verification ID early for audit step
    const verificationId = `VER-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
    const formRecord: Record<string, string> = { ...formData };

    const initialSteps = buildAgentSteps(formData.memberId, verificationId, formRecord);
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" })));

    // Start API call in parallel with animation
    const apiPromise = fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    // Animate steps
    for (let i = 0; i < initialSteps.length; i++) {
      await new Promise<void>((resolve) => {
        const delay = i === 0 ? 0 : STEP_DELAYS[i] - STEP_DELAYS[i - 1];
        setTimeout(resolve, delay);
      });

      const now = new Date();
      const ts = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

      // Mark previous as completed
      if (i > 0) {
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i - 1 ? { ...s, status: "completed", timestamp: ts } : s
          )
        );
      }

      // Mark current as running
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "running", timestamp: ts } : s
        )
      );
    }

    // Wait for API response
    try {
      const response = await apiPromise;
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Complete last step
      const finalTs = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === prev.length - 1 ? { ...s, status: "completed", timestamp: finalTs } : s
        )
      );

      // Short delay then show results
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

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] grid-bg overflow-hidden">
      {/* Top Nav */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-[#161616] bg-[#0a0a0a] z-10">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
          >
            <svg className="w-4.5 h-4.5 text-white" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#f1f5f9] tracking-tight">DentaAgent</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a2e] text-[#818cf8] border border-[#312e81] font-medium">BETA</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-none mt-0.5">Dental Insurance Verification Copilot</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-[#6366f1] animate-pulse" : status === "completed" ? "bg-[#22c55e]" : "bg-[#334155]"}`} />
            <span className="text-[11px] text-[#475569]">
              {isRunning ? "Agent running" : status === "completed" ? "Verification complete" : status === "error" ? "Error occurred" : "Ready"}
            </span>
          </div>

          <div className="h-4 w-px bg-[#1e1e1e]" />

          {/* Nav items */}
          {["Verifications", "History", "Analytics", "Settings"].map((item) => (
            <button key={item} className="text-xs text-[#475569] hover:text-[#94a3b8] transition-colors">
              {item}
            </button>
          ))}

          <div className="h-4 w-px bg-[#1e1e1e]" />

          {/* User avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">SG</span>
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="flex-shrink-0 flex items-center gap-3 px-6 py-2.5 bg-[#1f0000] border-b border-[#7f1d1d] text-[#f87171] text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-[#f87171] hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Patient Intake (320px) */}
        <div className="w-80 flex-shrink-0 border-r border-[#161616] bg-[#0d0d0d] flex flex-col overflow-hidden">
          <PatientForm
            formData={formData}
            onChange={setFormData}
            onSubmit={runVerification}
            isRunning={isRunning}
          />
        </div>

        {/* MIDDLE: Agent Timeline (flex-1) */}
        <div className="flex-1 border-r border-[#161616] bg-[#0a0a0a] flex flex-col overflow-hidden">
          <AgentTimeline
            steps={steps}
            isRunning={isRunning}
            result={result}
          />
        </div>

        {/* RIGHT: Decision Console (380px) */}
        <div className="w-96 flex-shrink-0 bg-[#0d0d0d] flex flex-col overflow-hidden">
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
