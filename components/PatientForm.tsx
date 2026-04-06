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
  const [sampleIndex, setSampleIndex] = React.useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange({ ...formData, [e.target.name]: e.target.value });
  };

  const loadSample = () => {
    const next = sampleIndex % SAMPLE_PATIENTS.length;
    onChange(SAMPLE_PATIENTS[next]);
    setSampleIndex(next + 1);
  };

  const inputClass =
    "w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#f1f5f9] placeholder-[#3a3a3a] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors";
  const labelClass = "block text-xs font-medium text-[#64748b] mb-1 uppercase tracking-wide";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
          <h2 className="text-sm font-semibold text-[#f1f5f9]">New Verification Request</h2>
        </div>
        <p className="text-xs text-[#64748b] ml-4">Patient &amp; insurance intake</p>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div>
          <label className={labelClass}>Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Full name"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Payer / Insurance</label>
          <select
            name="payerName"
            value={formData.payerName}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select payer...</option>
            {PAYERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Member ID</label>
          <input
            type="text"
            name="memberId"
            value={formData.memberId}
            onChange={handleChange}
            placeholder="e.g. DD8847291"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Group ID</label>
          <input
            type="text"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            placeholder="e.g. GRP-45892"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Requested Treatment</label>
          <select
            name="requestedTreatment"
            value={formData.requestedTreatment}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select treatment...</option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Sample patient tags */}
        <div className="pt-1">
          <p className="text-xs text-[#64748b] mb-2">Quick load demo patient:</p>
          <div className="flex flex-col gap-1.5">
            {SAMPLE_PATIENTS.map((p, i) => (
              <button
                key={i}
                onClick={() => { onChange(p); setSampleIndex(i + 1); }}
                className="text-left px-3 py-2 rounded-lg border border-[#222] bg-[#0f0f0f] hover:border-[#6366f1] hover:bg-[#1a1a2e] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#cbd5e1] group-hover:text-[#a5b4fc]">{p.patientName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    i === 0 ? "bg-[#14532d] text-[#4ade80]" :
                    i === 1 ? "bg-[#713f12] text-[#fbbf24]" :
                    "bg-[#450a0a] text-[#f87171]"
                  }`}>
                    {i === 0 ? "Safe" : i === 1 ? "Caution" : "Escalate"}
                  </span>
                </div>
                <span className="text-[11px] text-[#475569]">{p.requestedTreatment} · {p.payerName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-[#1e1e1e]">
        <button
          onClick={onSubmit}
          disabled={isRunning || !formData.patientName || !formData.payerName || !formData.memberId || !formData.requestedTreatment}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isRunning
              ? "linear-gradient(135deg, #4338ca, #3730a3)"
              : "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#fff",
            boxShadow: isRunning ? "none" : "0 0 20px rgba(99,102,241,0.3)",
          }}
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Agent Running...
            </span>
          ) : (
            "Run Verification Agent"
          )}
        </button>
      </div>
    </div>
  );
}
