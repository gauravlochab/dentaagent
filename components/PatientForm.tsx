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
const TREATMENT_RISK: Record<string, { color: string; label: string }> = {
  "Dental Crown":        { color: "var(--color-warning)", label: "Medium" },
  "Root Canal":          { color: "var(--color-warning)", label: "Medium" },
  "Dental Implant":      { color: "var(--color-danger)",  label: "High" },
  "Composite Filling":   { color: "var(--color-success)", label: "Low" },
  "Periodontal Scaling": { color: "var(--color-warning)", label: "Medium" },
  "Orthodontics":        { color: "var(--color-danger)",  label: "High" },
  "Teeth Whitening":     { color: "var(--color-success)", label: "Low" },
  "Tooth Extraction":    { color: "var(--color-warning)", label: "Medium" },
};

/* Patient avatar gradients — emerald/teal/sage */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, oklch(52% 0.18 142) 0%, oklch(40% 0.16 158) 100%)",
  "linear-gradient(135deg, oklch(60% 0.15 195) 0%, oklch(45% 0.16 210) 100%)",
  "linear-gradient(135deg, oklch(56% 0.12 170) 0%, oklch(42% 0.14 155) 100%)",
];

const OUTCOME_CONFIG = [
  { label: "Safe",    bg: "var(--color-success-tint)", border: "var(--color-success)", text: "var(--color-success)" },
  { label: "Caution", bg: "var(--color-warning-tint)", border: "var(--color-warning)", text: "var(--color-warning)" },
  { label: "Escalate",bg: "var(--color-danger-tint)",  border: "var(--color-danger)",  text: "var(--color-danger)" },
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

  const inputClass = "input-dark";

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11.5px",
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    marginBottom: "6px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    fontFamily: "var(--font-sans)",
  };

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
              style={{ background: "var(--color-primary)" }}
            />
            <h2
              className="text-[13px] font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              New Verification
            </h2>
          </div>
          {/* Completion counter */}
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-mono tabular-nums"
              style={{ color: filledCount === totalFields ? "var(--color-success)" : "var(--color-text-muted)" }}
            >
              {filledCount}/{totalFields}
            </span>
            <div
              className="w-16 h-1 rounded-full overflow-hidden"
              style={{ background: "var(--color-border)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${completionPct}%`,
                  background:
                    completionPct === 100
                      ? "var(--color-success)"
                      : "var(--color-primary)",
                  transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          </div>
        </div>
        <p
          className="text-[11px] mt-0.5 ml-3.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          Patient &amp; insurance intake
        </p>
      </div>

      {/* ── Form fields ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">

        <div>
          <label htmlFor="patientName" style={labelStyle}>Patient Name</label>
          <input
            id="patientName"
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Full name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" style={labelStyle}>Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="payerName" style={labelStyle}>Payer / Insurance</label>
          <select
            id="payerName"
            name="payerName"
            value={formData.payerName}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select payer...</option>
            {PAYERS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="memberId" style={labelStyle}>Member ID</label>
          <input
            id="memberId"
            type="text"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            placeholder="e.g. DD8847291"
            className={`${inputClass} font-mono`}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>

        <div>
          <label htmlFor="groupId" style={labelStyle}>Group ID</label>
          <input
            id="groupId"
            type="text"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            placeholder="e.g. GRP-45892"
            className={`${inputClass} font-mono`}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="requestedTreatment" style={{ ...labelStyle, marginBottom: 0 }}>Requested Treatment</label>
            {selectedRisk && (
              <div className="flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: selectedRisk.color }}
                />
                <span className="text-[9px] font-medium" style={{ color: selectedRisk.color }}>
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
            className={inputClass}
          >
            <option value="">Select treatment...</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentDate" style={labelStyle}>Appointment Date</label>
          <input
            id="appointmentDate"
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* ── Demo patient cards ──────────────────── */}
        <div className="pt-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2.5"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}
          >
            Demo Patients
          </p>
          <div className="flex flex-col gap-2">
            {SAMPLE_PATIENTS.map((p, i) => {
              const outcome = OUTCOME_CONFIG[i];
              return (
                <button
                  key={i}
                  onClick={() => { onChange(p); }}
                  className="text-left rounded-lg patient-card"
                  style={{
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border-subtle)",
                    padding: "10px 12px",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Avatar — emerald gradient */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white"
                      style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
                    >
                      {getInitials(p.patientName)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[12px] font-semibold truncate"
                          style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
                        >
                          {p.patientName}
                        </span>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ml-1 uppercase"
                          style={{
                            background: outcome.bg,
                            border: `1px solid ${outcome.border}`,
                            color: outcome.text,
                          }}
                        >
                          {outcome.label}
                        </span>
                      </div>
                      <span
                        className="text-[10px] block mt-0.5 truncate"
                        style={{ color: "var(--color-text-muted)" }}
                      >
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
        className="px-5 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* Connection status */}
        <div className="flex items-center gap-1.5 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--color-success)" }}
          />
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Connected to verification service
          </span>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-[13px] text-white btn-shimmer transition-all active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={{
            background: isRunning
              ? "var(--color-primary-hover)"
              : "var(--color-primary)",
            fontFamily: "var(--font-sans)",
            borderRadius: "8px",
            transform: canSubmit && !isRunning ? undefined : undefined,
            transition: "background var(--duration-fast), transform var(--duration-fast), box-shadow var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            if (canSubmit && !isRunning) {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--color-primary-hover)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.background = isRunning ? "var(--color-primary-hover)" : "var(--color-primary)";
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
