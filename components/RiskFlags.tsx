"use client";

import React, { useState } from "react";
import { RiskFlag } from "@/lib/types";

interface RiskFlagsProps {
  flags: RiskFlag[];
}

const SEVERITY_CONFIG = {
  HIGH: {
    bg: "bg-[#1f0000]",
    border: "border-[#ef4444]",
    borderLeft: "border-l-[#ef4444]",
    text: "text-[#fca5a5]",
    badge: "bg-[#450a0a] text-[#f87171] border border-[#7f1d1d]",
    dot: "bg-[#ef4444]",
    icon: "🔴",
  },
  MEDIUM: {
    bg: "bg-[#1a1000]",
    border: "border-[#f59e0b]",
    borderLeft: "border-l-[#f59e0b]",
    text: "text-[#fcd34d]",
    badge: "bg-[#422006] text-[#fbbf24] border border-[#78350f]",
    dot: "bg-[#f59e0b]",
    icon: "🟡",
  },
  LOW: {
    bg: "bg-[#001a0a]",
    border: "border-[#22c55e]",
    borderLeft: "border-l-[#22c55e]",
    text: "text-[#86efac]",
    badge: "bg-[#052e16] text-[#4ade80] border border-[#14532d]",
    dot: "bg-[#22c55e]",
    icon: "🟢",
  },
};

export default function RiskFlags({ flags }: RiskFlagsProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const sorted = [...flags].sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    return order[a.severity] - order[b.severity];
  });

  const highCount = flags.filter((f) => f.severity === "HIGH").length;
  const medCount = flags.filter((f) => f.severity === "MEDIUM").length;
  const lowCount = flags.filter((f) => f.severity === "LOW").length;

  return (
    <div>
      {/* Summary row */}
      <div className="flex items-center gap-2 mb-3">
        {highCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#450a0a] text-[#f87171] border border-[#7f1d1d]">
            {highCount} High
          </span>
        )}
        {medCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#422006] text-[#fbbf24] border border-[#78350f]">
            {medCount} Medium
          </span>
        )}
        {lowCount > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#052e16] text-[#4ade80] border border-[#14532d]">
            {lowCount} Low
          </span>
        )}
      </div>

      <div className="space-y-2">
        {sorted.map((flag, i) => {
          const cfg = SEVERITY_CONFIG[flag.severity];
          const isOpen = expanded === i;

          return (
            <div
              key={i}
              className={`rounded-lg border-l-4 border border-[#1e1e1e] ${cfg.borderLeft} ${cfg.bg} overflow-hidden transition-all`}
            >
              <button
                className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{cfg.icon}</span>
                  <span className={`text-xs font-medium ${cfg.text}`}>{flag.flag}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.badge}`}>
                    {flag.severity}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#475569] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-0">
                  <div className="w-full h-px bg-[#1e1e1e] mb-2" />
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{flag.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
