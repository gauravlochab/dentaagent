"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { PatientFormData } from "@/lib/types";

const SAMPLE_PATIENTS: (PatientFormData & { label: string; outcome: string; color: string })[] = [
  {
    label: "Sarah Johnson",
    outcome: "Safe",
    color: "var(--color-success)",
    patientName: "Sarah Johnson",
    dateOfBirth: "1985-03-15",
    payerName: "Delta Dental",
    memberId: "DD8847291",
    groupId: "GRP-45892",
    requestedTreatment: "Composite Filling",
    appointmentDate: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
  },
  {
    label: "Michael Torres",
    outcome: "Caution",
    color: "var(--color-warning)",
    patientName: "Michael Torres",
    dateOfBirth: "1972-09-28",
    payerName: "Cigna Dental",
    memberId: "CIG-3847291",
    groupId: "CIG-GRP-9923",
    requestedTreatment: "Dental Crown",
    appointmentDate: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
  },
  {
    label: "Patricia Chen",
    outcome: "Escalate",
    color: "var(--color-danger)",
    patientName: "Patricia Chen",
    dateOfBirth: "1990-11-04",
    payerName: "Aetna Dental",
    memberId: "AET-5523891",
    groupId: "AET-77443",
    requestedTreatment: "Dental Implant",
    appointmentDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  },
];

interface CommandPaletteProps {
  onLoadPatient: (patient: PatientFormData) => void;
  onRunVerification: () => void;
  onOpenNav: (tab: string) => void;
  isRunning: boolean;
}

export default function CommandPalette({ onLoadPatient, onRunVerification, onOpenNav, isRunning }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 80);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 998,
          background: "oklch(13% 0.022 158 / 0.22)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "fadeIn 0.12s ease-out",
        }}
      />

      {/* Command dialog */}
      <div style={{
        position: "fixed",
        top: "18%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        width: "min(560px, 90vw)",
        animation: "cmdSlideIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <Command
          style={{
            background: "oklch(99.5% 0.004 80)",
            border: "1px solid oklch(91% 0.012 158)",
            borderRadius: "14px",
            boxShadow: "0 24px 64px oklch(13% 0.022 158 / 0.18), 0 4px 16px oklch(13% 0.022 158 / 0.08)",
            overflow: "hidden",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {/* Search input */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "14px 16px",
            borderBottom: "1px solid oklch(94.5% 0.008 158)",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="oklch(62% 0.010 158)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <Command.Input
              placeholder="Type a command or search..."
              style={{
                flex: 1, border: "none", outline: "none",
                background: "transparent",
                fontSize: "14px",
                color: "oklch(13% 0.022 158)",
                fontFamily: "inherit",
              }}
            />
            <kbd style={{
              fontSize: "10px", padding: "2px 6px", borderRadius: "4px",
              background: "oklch(94.5% 0.008 158)",
              border: "1px solid oklch(91% 0.012 158)",
              color: "oklch(62% 0.010 158)",
              fontFamily: "var(--font-mono)",
            }}>ESC</kbd>
          </div>

          <Command.List style={{ maxHeight: "360px", overflowY: "auto", padding: "6px" }}>
            <Command.Empty style={{ padding: "24px", textAlign: "center", fontSize: "13px", color: "oklch(62% 0.010 158)" }}>
              No commands found.
            </Command.Empty>

            {/* Demo Patients */}
            <Command.Group heading="Demo Patients" style={{ color: "oklch(62% 0.010 158)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 10px 4px" }}>
              {SAMPLE_PATIENTS.map(p => (
                <Command.Item
                  key={p.label}
                  value={`patient ${p.label} ${p.outcome}`}
                  onSelect={() => run(() => onLoadPatient(p))}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 10px", borderRadius: "8px", cursor: "default",
                    fontSize: "13px", color: "oklch(13% 0.022 158)",
                  }}
                  className="cmd-item"
                >
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, oklch(52% 0.18 142), oklch(40% 0.16 158))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: "white",
                  }}>
                    {p.label.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: "11px", color: "oklch(62% 0.010 158)" }}>{p.payerName} · {p.requestedTreatment}</div>
                  </div>
                  <span style={{
                    fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                    background: p.color === "var(--color-success)" ? "oklch(95% 0.05 142)" : p.color === "var(--color-warning)" ? "oklch(96% 0.06 75)" : "oklch(96% 0.06 25)",
                    color: p.color,
                    border: `1px solid ${p.color}`,
                    textTransform: "uppercase" as const,
                  }}>
                    {p.outcome}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions" style={{ color: "oklch(62% 0.010 158)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 10px 4px" }}>
              <Command.Item
                value="run verification agent"
                onSelect={() => run(onRunVerification)}
                disabled={isRunning}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "default", fontSize: "13px", color: isRunning ? "oklch(78% 0.006 158)" : "oklch(13% 0.022 158)" }}
                className="cmd-item"
              >
                <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "oklch(96% 0.04 158)", border: "1px solid oklch(88% 0.06 158)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="oklch(40% 0.16 158)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Run Verification Agent</div>
                  <div style={{ fontSize: "11px", color: "oklch(62% 0.010 158)" }}>Start the 7-step verification pipeline</div>
                </div>
                <kbd style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "oklch(94.5% 0.008 158)", border: "1px solid oklch(91% 0.012 158)", color: "oklch(62% 0.010 158)", fontFamily: "var(--font-mono)" }}>⏎</kbd>
              </Command.Item>
            </Command.Group>

            {/* Navigate */}
            <Command.Group heading="Navigate" style={{ color: "oklch(62% 0.010 158)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 10px 4px" }}>
              {[
                { label: "Verifications", icon: "☑", sub: "Recent verification history" },
                { label: "Analytics",     icon: "↗", sub: "Performance metrics & trends" },
                { label: "History",       icon: "⏱", sub: "Activity log" },
                { label: "Settings",      icon: "⚙", sub: "Configuration & integrations" },
              ].map(item => (
                <Command.Item
                  key={item.label}
                  value={`navigate ${item.label}`}
                  onSelect={() => run(() => onOpenNav(item.label))}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", cursor: "default", fontSize: "13px", color: "oklch(13% 0.022 158)" }}
                  className="cmd-item"
                >
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "oklch(96% 0.04 158)", border: "1px solid oklch(88% 0.06 158)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: "11px", color: "oklch(62% 0.010 158)" }}>{item.sub}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "8px 14px",
            borderTop: "1px solid oklch(94.5% 0.008 158)",
            background: "oklch(98.5% 0.008 80)",
          }}>
            {[["↑↓", "Navigate"], ["⏎", "Select"], ["ESC", "Close"]].map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <kbd style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "3px", background: "oklch(94.5% 0.008 158)", border: "1px solid oklch(91% 0.012 158)", color: "oklch(62% 0.010 158)", fontFamily: "var(--font-mono)" }}>{key}</kbd>
                <span style={{ fontSize: "10px", color: "oklch(78% 0.006 158)" }}>{label}</span>
              </div>
            ))}
            <div style={{ marginLeft: "auto", fontSize: "10px", color: "oklch(78% 0.006 158)" }}>DentaAgent</div>
          </div>
        </Command>
      </div>

      <style>{`
        @keyframes cmdSlideIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .cmd-item[aria-selected="true"] {
          background: oklch(96% 0.04 158) !important;
        }
        .cmd-item:hover {
          background: oklch(98% 0.006 158);
        }
        [cmdk-group-heading] {
          font-size: 10px !important;
          font-weight: 600 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          color: oklch(62% 0.010 158) !important;
          padding: 8px 10px 4px !important;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        }
      `}</style>
    </>
  );
}
