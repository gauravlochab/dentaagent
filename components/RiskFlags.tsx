"use client";

import React, { useState } from "react";
import { RiskFlag } from "@/lib/types";

interface RiskFlagsProps {
  flags: RiskFlag[];
}

/* ── SVG icon components ─────────────────────────────── */
function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.5" />
    </svg>
  );
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  );
}

function DangerIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
    </svg>
  );
}

const SEVERITY_CONFIG = {
  HIGH: {
    gradient: "linear-gradient(135deg, rgba(31,0,0,0.9) 0%, rgba(60,10,10,0.6) 100%)",
    borderLeft: "rgba(239,68,68,0.7)",
    border: "rgba(239,68,68,0.18)",
    textColor: "#fca5a5",
    descColor: "#7f1d1d",
    badgeBg: "rgba(239,68,68,0.12)",
    badgeBorder: "rgba(239,68,68,0.3)",
    badgeText: "#f87171",
    glowClass: "risk-high-card",
    Icon: DangerIcon,
    iconColor: "#ef4444",
  },
  MEDIUM: {
    gradient: "linear-gradient(135deg, rgba(26,16,0,0.85) 0%, rgba(55,32,0,0.5) 100%)",
    borderLeft: "rgba(245,158,11,0.6)",
    border: "rgba(245,158,11,0.15)",
    textColor: "#fcd34d",
    descColor: "#78350f",
    badgeBg: "rgba(245,158,11,0.1)",
    badgeBorder: "rgba(245,158,11,0.3)",
    badgeText: "#fbbf24",
    glowClass: "",
    Icon: WarningIcon,
    iconColor: "#f59e0b",
  },
  LOW: {
    gradient: "linear-gradient(135deg, rgba(0,26,10,0.8) 0%, rgba(5,46,22,0.5) 100%)",
    borderLeft: "rgba(34,197,94,0.5)",
    border: "rgba(34,197,94,0.12)",
    textColor: "#86efac",
    descColor: "#166534",
    badgeBg: "rgba(34,197,94,0.1)",
    badgeBorder: "rgba(34,197,94,0.25)",
    badgeText: "#4ade80",
    glowClass: "",
    Icon: ShieldIcon,
    iconColor: "#22c55e",
  },
};

export default function RiskFlags({ flags }: RiskFlagsProps) {
  // Use stable flag title as expand key, not array index
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...flags].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.severity] - order[b.severity];
  });

  const highCount = flags.filter((f) => f.severity === "HIGH").length;
  const medCount  = flags.filter((f) => f.severity === "MEDIUM").length;
  const lowCount  = flags.filter((f) => f.severity === "LOW").length;

  return (
    <div>
      {/* ── Summary pills ─────────────────────── */}
      <div className="flex items-center gap-1.5 mb-3">
        {highCount > 0 && (
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            <DangerIcon color="#f87171" />
            {highCount} High
          </span>
        )}
        {medCount > 0 && (
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#fbbf24",
            }}
          >
            <WarningIcon color="#fbbf24" />
            {medCount} Med
          </span>
        )}
        {lowCount > 0 && (
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              color: "#4ade80",
            }}
          >
            <ShieldIcon color="#4ade80" />
            {lowCount} Low
          </span>
        )}
      </div>

      {/* ── Flag cards ──────────────────────────── */}
      <div className="space-y-2">
        {sorted.map((flag) => {
          const cfg = SEVERITY_CONFIG[flag.severity];
          const isOpen = expanded === flag.flag;
          const { Icon } = cfg;

          return (
            <div
              key={flag.flag}
              className={`rounded-lg overflow-hidden transition-all duration-200 ${cfg.glowClass}`}
              style={{
                background: cfg.gradient,
                borderLeft: `3px solid ${cfg.borderLeft}`,
                border: `1px solid ${cfg.border}`,
                borderLeftWidth: "3px",
              }}
            >
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                onClick={() => setExpanded(isOpen ? null : flag.flag)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <Icon color={cfg.iconColor} />
                  </div>
                  <span className="text-[11px] font-medium truncate" style={{ color: cfg.textColor }}>
                    {flag.flag}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: cfg.badgeBg,
                      border: `1px solid ${cfg.badgeBorder}`,
                      color: cfg.badgeText,
                    }}
                  >
                    {flag.severity}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "#334155" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3">
                  <div className="h-px mb-2" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: "#475569" }}>
                    {flag.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
