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
    bg: "var(--color-danger-tint)",
    borderLeft: "var(--color-danger)",
    borderColor: "oklch(58% 0.22 25 / 0.20)",
    textColor: "var(--color-danger)",
    descColor: "var(--color-text-secondary)",
    badgeBg: "var(--color-danger-tint)",
    badgeBorder: "var(--color-danger)",
    badgeText: "var(--color-danger)",
    glowClass: "risk-high-card",
    Icon: DangerIcon,
    iconColor: "var(--color-danger)",
  },
  MEDIUM: {
    bg: "var(--color-warning-tint)",
    borderLeft: "var(--color-warning)",
    borderColor: "oklch(68% 0.18 75 / 0.20)",
    textColor: "var(--color-warning)",
    descColor: "var(--color-text-secondary)",
    badgeBg: "var(--color-warning-tint)",
    badgeBorder: "var(--color-warning)",
    badgeText: "var(--color-warning)",
    glowClass: "",
    Icon: WarningIcon,
    iconColor: "var(--color-warning)",
  },
  LOW: {
    bg: "var(--color-success-tint)",
    borderLeft: "var(--color-success)",
    borderColor: "oklch(52% 0.18 142 / 0.20)",
    textColor: "var(--color-success)",
    descColor: "var(--color-text-secondary)",
    badgeBg: "var(--color-success-tint)",
    badgeBorder: "var(--color-success)",
    badgeText: "var(--color-success)",
    glowClass: "",
    Icon: ShieldIcon,
    iconColor: "var(--color-success)",
  },
};

export default function RiskFlags({ flags }: RiskFlagsProps) {
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
              background: "var(--color-danger-tint)",
              border: "1px solid var(--color-danger)",
              color: "var(--color-danger)",
            }}
          >
            <DangerIcon color="var(--color-danger)" />
            {highCount} High
          </span>
        )}
        {medCount > 0 && (
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold"
            style={{
              background: "var(--color-warning-tint)",
              border: "1px solid var(--color-warning)",
              color: "var(--color-warning)",
            }}
          >
            <WarningIcon color="var(--color-warning)" />
            {medCount} Med
          </span>
        )}
        {lowCount > 0 && (
          <span
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold"
            style={{
              background: "var(--color-success-tint)",
              border: "1px solid var(--color-success)",
              color: "var(--color-success)",
            }}
          >
            <ShieldIcon color="var(--color-success)" />
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
                background: cfg.bg,
                borderLeft: `3px solid ${cfg.borderLeft}`,
                border: `1px solid ${cfg.borderColor}`,
                borderLeftWidth: "3px",
                borderLeftColor: cfg.borderLeft,
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
                  <span
                    className="text-[11px] font-medium truncate"
                    style={{ color: cfg.textColor }}
                  >
                    {flag.flag}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
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
                    style={{ color: "var(--color-text-muted)" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-3">
                  <div className="h-px mb-2" style={{ background: "var(--color-border)" }} />
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: cfg.descColor }}
                  >
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
