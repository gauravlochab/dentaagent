"use client";

import React from "react";
import { PatientFormData } from "@/lib/types";

const SAMPLE_PATIENTS: PatientFormData[] = [
  {
    patientName: "Sarah Johnson",
    dateOfBirth: "1985-03-15",
    payerName: "Delta Dental",
    memberId: "DD8847291",
    groupId: "GRP-45892",
    requestedTreatment: "Composite Filling",
    appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    patientName: "Michael Torres",
    dateOfBirth: "1972-09-28",
    payerName: "Cigna Dental",
    memberId: "CIG-3847291",
    groupId: "CIG-GRP-9923",
    requestedTreatment: "Dental Crown",
    appointmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
  {
    patientName: "Patricia Chen",
    dateOfBirth: "1990-11-04",
    payerName: "Aetna Dental",
    memberId: "AET-5523891",
    groupId: "AET-77443",
    requestedTreatment: "Dental Implant",
    appointmentDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  },
];

const PAYERS = [
  "Delta Dental",
  "Cigna Dental",
  "Aetna Dental",
  "MetLife Dental",
  "Guardian Dental",
  "Humana Dental",
  "United Concordia",
];

const TREATMENTS = [
  "Dental Crown",
  "Root Canal",
  "Dental Implant",
  "Composite Filling",
  "Periodontal Scaling",
  "Orthodontics",
  "Teeth Whitening",
  "Tooth Extraction",
];

/* Risk level per treatment */
const TREATMENT_RISK: Record<string, { dot: string; label: string }> = {
  "Dental Crown":        { dot: "#f59e0b", label: "Medium" },
  "Root Canal":          { dot: "#f59e0b", label: "Medium" },
  "Dental Implant":      { dot: "#ef4444", label: "High" },
  "Composite Filling":   { dot: "#22c55e", label: "Low" },
  "Periodontal Scaling": { dot: "#f59e0b", label: "Medium" },
  "Orthodontics":        { dot: "#ef4444", label: "High" },
  "Teeth Whitening":     { dot: "#22c55e", label: "Low" },
  "Tooth Extraction":    { dot: "#f59e0b", label: "Medium" },
};

/* Patient avatar initials color mapping */
const AVATAR_COLORS = [
  { bg: "rgba(99,102,241,0.2)", border: "rgba(99,102,241,0.4)", text: "#818cf8" },
  { bg: "rgba(14,165,233,0.2)", border: "rgba(14,165,233,0.4)", text: "#38bdf8" },
  { bg: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.4)", text: "#c084fc" },
];

const OUTCOME_CONFIG = [
  { label: "Safe", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", text: "#4ade80" },
  { label: "Caution", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#fbbf24" },
  { label: "Escalate", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#f87171" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface PatientFormProps {
  formData: PatientFormData;
  onChange: (data: PatientFormData) => void;
  onSubmit: () => void;
  isRunning: boolean;
}

export default function PatientForm({
  formData,
  onChange,
  onSubmit,
  isRunning,
}: PatientFormProps) {

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ ...formData, [e.target.name]: e.target.value });
  };

  /* Form completion count */
  const fields = [
    formData.patientName,
    formData.dateOfBirth,
    formData.payerName,
    formData.memberId,
    formData.groupId,
    formData.requestedTreatment,
    formData.appointmentDate,
  ];
  const filledCount = fields.filter(Boolean).length;
  const totalFields = fields.length;
  const completionPct = Math.round((filledCount / totalFields) * 100);

  const inputClass =
    "w-full bg-[#070a14] border rounded-lg px-3 py-2.5 text-[13px] text-[#e2e8f0] placeholder-[#1e293b] focus:outline-none transition-all duration-200";
  const inputStyle = {
    borderColor: "rgba(255,255,255,0.08)",
  };
  const inputFocusClass =
    "focus:border-[#6366f1]/60 focus:ring-0 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1),0_0_12px_rgba(99,102,241,0.06)]";

  const labelClass =
    "block text-[10px] font-semibold text-[#1e293b] mb-1.5 uppercase tracking-[0.08em]";

  const selectedRisk = formData.requestedTreatment
    ? TREATMENT_RISK[formData.requestedTreatment]
    : null;

  const canSubmit =
    !isRunning &&
    Boolean(formData.patientName) &&
    Boolean(formData.dateOfBirth) &&
    Boolean(formData.payerName) &&
    Boolean(formData.memberId) &&
    Boolean(formData.requestedTreatment) &&
    Boolean(formData.appointmentDate);

  return (
    <div className="flex flex-col h-full">
      {/* ── Panel header ──────────────────────────── */}
      <div
        className="px-5 py-3.5 border-b flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#6366f1", boxShadow: "0 0 6px rgba(99,102,241,0.5)" }}
            />
            <h2 className="text-[13px] font-semibold text-[#e2e8f0] tracking-tight">
              New Verification
            </h2>
          </div>
          {/* Completion counter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tabular-nums" style={{ color: filledCount === totalFields ? "#22c55e" : "#334155" }}>
              {filledCount}/{totalFields}
            </span>
            <div
              className="w-16 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-400"
                style={{
                  width: `${completionPct}%`,
                  background:
                    completionPct === 100
                      ? "linear-gradient(90deg, #22c55e, #16a34a)"
                      : "linear-gradient(90deg, #6366f1, #818cf8)",
                  transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-[11px] mt-0.5 ml-3.5" style={{ color: "#475569" }}>
          Patient &amp; insurance intake
        </p>
      </div>

      {/* ── Form fields ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">

        <div>
          <label htmlFor="patientName" className={labelClass}>Patient Name</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Full name"
            className={`${inputClass} ${inputFocusClass}`}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`${inputClass} ${inputFocusClass}`}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="payerName" className={labelClass}>Payer / Insurance</label>
          <select
            id="payerName"
            name="payerName"
            value={formData.payerName}
            onChange={handleChange}
            className={`${inputClass} ${inputFocusClass}`}
            style={inputStyle}
          >
            <option value="">Select payer...</option>
            {PAYERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="memberId" className={labelClass}>Member ID</label>
          <input
            id="memberId"
            type="text"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            placeholder="e.g. DD8847291"
            className={`${inputClass} ${inputFocusClass} font-mono`}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="groupId" className={labelClass}>Group ID</label>
          <input
            id="groupId"
            type="text"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            placeholder="e.g. GRP-45892"
            className={`${inputClass} ${inputFocusClass} font-mono`}
            style={inputStyle}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="requestedTreatment" className={labelClass} style={{ marginBottom: 0 }}>Requested Treatment</label>
            {selectedRisk && (
              <div className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: selectedRisk.dot }}
                />
                <span className="text-[9px] font-medium" style={{ color: selectedRisk.dot }}>
                  {selectedRisk.label} risk
                </span>
              </div>
            )}
          </div>
          <select
            id="requestedTreatment"
            name="requestedTreatment"
            value={formData.requestedTreatment}
            onChange={handleChange}
            className={`${inputClass} ${inputFocusClass}`}
            style={inputStyle}
          >
            <option value="">Select treatment...</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentDate" className={labelClass}>Appointment Date</label>
          <input
            id="appointmentDate"
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className={`${inputClass} ${inputFocusClass}`}
            style={inputStyle}
          />
        </div>

        {/* ── Demo patient cards ──────────────────── */}
        <div className="pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2.5" style={{ color: "#1e293b" }}>
            Demo Patients
          </p>
          <div className="flex flex-col gap-2">
            {SAMPLE_PATIENTS.map((p, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const outcome = OUTCOME_CONFIG[i];
              return (
                <button
                  key={i}
                  onClick={() => { onChange(p); }}
                  className="text-left rounded-lg patient-card"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    padding: "10px 12px",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                      style={{
                        background: avatarColor.bg,
                        border: `1px solid ${avatarColor.border}`,
                        color: avatarColor.text,
                      }}
                    >
                      {getInitials(p.patientName)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold truncate" style={{ color: "#94a3b8" }}>
                          {p.patientName}
                        </span>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1"
                          style={{
                            background: outcome.bg,
                            border: `1px solid ${outcome.border}`,
                            color: outcome.text,
                          }}
                        >
                          {outcome.label}
                        </span>
                      </div>
                      <span className="text-[10px] block mt-0.5 truncate" style={{ color: "#1e293b" }}>
                        {p.requestedTreatment} · {p.payerName}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CTA button ────────────────────────────── */}
      <div
        className="px-5 py-4 border-t flex-shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-[13px] text-white btn-shimmer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={{
            background: isRunning
              ? "linear-gradient(135deg, #4338ca, #3730a3)"
              : "linear-gradient(135deg, #6366f1, #4f46e5)",
            boxShadow: canSubmit && !isRunning
              ? "0 0 24px rgba(99,102,241,0.3), 0 1px 3px rgba(0,0,0,0.4)"
              : "none",
          }}
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Agent Running...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run Verification Agent
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
