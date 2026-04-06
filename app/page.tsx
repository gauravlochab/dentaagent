"use client";

import React, { useState, useCallback } from "react";
import PatientForm from "@/components/PatientForm";
import AgentTimeline from "@/components/AgentTimeline";
import DecisionConsole from "@/components/DecisionConsole";
import NavPanel from "@/components/NavPanel";
import { PatientFormData, AgentStep, VerificationResult, VerificationStatus } from "@/lib/types";
import { buildAgentSteps } from "@/lib/agentSteps";
import { PayerBenefitData, getPayerData } from "@/lib/mockPayerData";

type NavTab = "Verifications" | "History" | "Analytics" | "Settings" | "Profile" | null;

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
  const [verificationId, setVerificationId] = useState<string>("");
  const [payerData, setPayerData] = useState<PayerBenefitData | null>(null);
  const [activeNav, setActiveNav] = useState<NavTab>(null);

  const runVerification = useCallback(async () => {
    if (status === "running") return;

    setStatus("running");
    setResult(null);
    setError(null);

    const placeholderId = `VER-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;
    setVerificationId(placeholderId);

    // Pre-load payer data for document generation during animation
    const pd = getPayerData(formData.payerName);
    setPayerData(pd);

    const formRecord: Record<string, string> = { ...formData };

    const initialSteps = buildAgentSteps(formData.memberId, placeholderId, formRecord);
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
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--color-bg)", position: "relative", zIndex: 1 }}
    >

      {/* ── Top Navigation ─────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 z-20 nav-top-border"
        style={{
          height: "44px",
          background: "oklch(98.5% 0.008 80 / 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Left: Logo + breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* Logo mark — emerald gradient */}
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, oklch(52% 0.18 142) 0%, oklch(40% 0.16 158) 100%)",
                boxShadow: "0 0 10px oklch(40% 0.16 158 / 0.20)",
              }}
            >
              <svg className="w-3.5 h-3.5 text-white" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span
              className="text-[14px] font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              StafGo
            </span>
          </div>

          {/* Breadcrumb divider */}
          <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-faint)" }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium" style={{ color: "var(--color-text-muted)" }}>Dental RCM</span>
            <svg className="w-3 h-3" style={{ color: "var(--color-text-faint)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[12px] font-medium" style={{ color: "var(--color-text-secondary)" }}>Insurance Verification</span>
          </div>
        </div>

        {/* Right: status + nav + avatar */}
        <div className="flex items-center gap-1">
          {/* Live status pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border mr-3 transition-all duration-500"
            style={
              isRunning
                ? { background: "var(--color-primary-tint)", borderColor: "var(--color-primary)" }
                : status === "completed"
                ? { background: "var(--color-success-tint)", borderColor: "var(--color-success)" }
                : status === "error"
                ? { background: "var(--color-danger-tint)", borderColor: "var(--color-danger)" }
                : { background: "var(--color-surface-raised)", borderColor: "var(--color-border)" }
            }
          >
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                background: isRunning
                  ? "var(--color-primary)"
                  : status === "completed"
                  ? "var(--color-success)"
                  : status === "error"
                  ? "var(--color-danger)"
                  : "var(--color-text-faint)",
                ...(isRunning ? { animation: "livePulse 1.4s ease-in-out infinite" } : {}),
              }}
            />
            <span
              className="text-[11px] font-medium tracking-tight"
              style={{
                color: isRunning
                  ? "var(--color-primary)"
                  : status === "completed"
                  ? "var(--color-success)"
                  : status === "error"
                  ? "var(--color-danger)"
                  : "var(--color-text-muted)",
              }}
            >
              {statusLabel}
            </span>
          </div>

          <div className="h-3.5 w-px mx-1" style={{ background: "var(--color-border)" }} />

          {/* Nav items */}
          {[
            { label: "Verifications", hint: "⌘V" },
            { label: "History",       hint: "⌘H" },
            { label: "Analytics",     hint: "" },
            { label: "Settings",      hint: "⌘," },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(activeNav === item.label as NavTab ? null : item.label as NavTab)}
              className="group nav-item relative flex items-center gap-1.5 px-3 h-[44px] text-[12px] font-medium"
              style={activeNav === item.label ? { color: "var(--color-primary)" } : {}}
            >
              {item.label}
              {item.hint && (
                <span className="text-[10px] font-mono hidden group-hover:inline" style={{ color: "var(--color-text-faint)" }}>
                  {item.hint}
                </span>
              )}
            </button>
          ))}

          <div className="h-3.5 w-px mx-1" style={{ background: "var(--color-border)" }} />

          {/* User avatar */}
          <button
            onClick={() => setActiveNav(activeNav === "Profile" ? null : "Profile")}
            className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
            style={{
              background: "linear-gradient(135deg, oklch(52% 0.18 142) 0%, oklch(40% 0.16 158) 100%)",
              boxShadow: activeNav === "Profile" ? "0 0 12px oklch(40% 0.16 158 / 0.4)" : "0 0 6px oklch(40% 0.16 158 / 0.20)",
              border: "none", cursor: "pointer",
            }}
          >
            <span className="text-[9px] font-bold text-white tracking-tight">SG</span>
          </button>
        </div>
      </header>

      {/* ── Nav Panels ─────────────────────────────────── */}
      <NavPanel open={activeNav} onClose={() => setActiveNav(null)} />

      {/* ── Error Banner ───────────────────────────────── */}
      {error && (
        <div
          className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 text-[12px] z-10"
          style={{
            background: "var(--color-danger-tint)",
            borderBottom: "1px solid var(--color-danger)",
            color: "var(--color-danger)",
          }}
        >
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "var(--color-danger-tint)",
              border: "1px solid var(--color-danger)",
            }}
          >
            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span style={{ color: "var(--color-danger)" }}>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto transition-colors"
            style={{ color: "var(--color-text-muted)" }}
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
        <div
          className="w-80 flex-shrink-0 flex flex-col overflow-hidden"
          style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}
        >
          <PatientForm
            formData={formData}
            onChange={setFormData}
            onSubmit={runVerification}
            isRunning={isRunning}
          />
        </div>

        {/* MIDDLE: Agent Timeline */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ background: "var(--color-bg)", borderRight: "1px solid var(--color-border)" }}
        >
          <AgentTimeline
            steps={steps}
            isRunning={isRunning}
            result={result}
            formData={formData}
            payerData={payerData}
            verificationId={verificationId}
          />
        </div>

        {/* RIGHT: Decision Console (380px) */}
        <div
          className="w-96 flex-shrink-0 flex flex-col overflow-hidden"
          style={{ background: "var(--color-surface)" }}
        >
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
