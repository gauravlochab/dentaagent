"use client";

import React, { useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

type NavTab = "Verifications" | "History" | "Analytics" | "Settings" | "Profile" | null;

interface NavPanelProps {
  open: NavTab;
  onClose: () => void;
}

/* ── Mock data ─────────────────────────────────────────── */

const VERIFICATIONS = [
  { id: "VER-2026-88193", patient: "Sarah Johnson",   payer: "Delta Dental",    treatment: "Composite Filling",   decision: "SAFE_TO_BOOK",       confidence: 98, time: "Today, 4:11 PM", dob: "1985-03-15" },
  { id: "VER-2026-74421", patient: "Michael Torres",  payer: "Cigna Dental",    treatment: "Dental Crown",        decision: "BOOK_WITH_CAUTION",  confidence: 94, time: "Today, 3:47 PM", dob: "1972-09-28" },
  { id: "VER-2026-61830", patient: "Patricia Chen",   payer: "Aetna Dental",    treatment: "Dental Implant",      decision: "ESCALATE",           confidence: 98, time: "Today, 2:19 PM", dob: "1990-11-04" },
  { id: "VER-2026-55029", patient: "James Whitfield", payer: "MetLife Dental",  treatment: "Root Canal",          decision: "SAFE_TO_BOOK",       confidence: 96, time: "Today, 1:04 PM", dob: "1968-07-22" },
  { id: "VER-2026-49382", patient: "Priya Nair",      payer: "Guardian Dental", treatment: "Periodontal Scaling", decision: "SAFE_TO_BOOK",       confidence: 91, time: "Today, 11:32 AM", dob: "1995-02-14" },
  { id: "VER-2026-43101", patient: "Robert Okafor",   payer: "Humana Dental",   treatment: "Dental Crown",        decision: "BOOK_WITH_CAUTION",  confidence: 88, time: "Today, 10:18 AM", dob: "1980-05-30" },
  { id: "VER-2026-38774", patient: "Linda Mercado",   payer: "United Concordia",treatment: "Orthodontics",        decision: "SAFE_TO_BOOK",       confidence: 95, time: "Yesterday, 4:52 PM", dob: "2004-09-11" },
  { id: "VER-2026-31209", patient: "David Kim",       payer: "Delta Dental",    treatment: "Tooth Extraction",    decision: "SAFE_TO_BOOK",       confidence: 99, time: "Yesterday, 3:21 PM", dob: "1991-12-03" },
  { id: "VER-2026-27445", patient: "Angela Foster",   payer: "Cigna Dental",    treatment: "Dental Implant",      decision: "ESCALATE",           confidence: 97, time: "Yesterday, 1:07 PM", dob: "1975-08-17" },
  { id: "VER-2026-22318", patient: "Marcus Hill",     payer: "Aetna Dental",    treatment: "Composite Filling",   decision: "BOOK_WITH_CAUTION",  confidence: 85, time: "Yesterday, 10:44 AM", dob: "1988-03-26" },
];

const DECISION_STYLE: Record<string, { label: string; bg: string; border: string; text: string }> = {
  SAFE_TO_BOOK:      { label: "Safe",    bg: "var(--color-success-tint)", border: "var(--color-success)", text: "var(--color-success)" },
  BOOK_WITH_CAUTION: { label: "Caution", bg: "var(--color-warning-tint)", border: "var(--color-warning)", text: "var(--color-warning)" },
  ESCALATE:          { label: "Escalate",bg: "var(--color-danger-tint)",  border: "var(--color-danger)",  text: "var(--color-danger)"  },
};

const HISTORY = [
  { icon: "✓", color: "var(--color-success)", msg: "Verification approved — Sarah Johnson / Composite Filling",     time: "4:13 PM",  meta: "VER-2026-88193" },
  { icon: "⚠", color: "var(--color-warning)", msg: "Pre-auth flag raised — Michael Torres / Crown / Cigna",         time: "3:49 PM",  meta: "VER-2026-74421" },
  { icon: "↑", color: "var(--color-danger)",  msg: "Escalated to senior reviewer — Patricia Chen / Implant / Aetna",time: "2:21 PM",  meta: "VER-2026-61830" },
  { icon: "✓", color: "var(--color-success)", msg: "Verification approved — James Whitfield / Root Canal",           time: "1:06 PM",  meta: "VER-2026-55029" },
  { icon: "✓", color: "var(--color-success)", msg: "Verification approved — Priya Nair / Periodontal Scaling",       time: "11:33 AM", meta: "VER-2026-49382" },
  { icon: "⚠", color: "var(--color-warning)", msg: "Annual max warning — Robert Okafor / Crown / Humana",            time: "10:20 AM", meta: "VER-2026-43101" },
  { icon: "✓", color: "var(--color-success)", msg: "Verification approved — Linda Mercado / Orthodontics",           time: "Yesterday", meta: "VER-2026-38774" },
  { icon: "✓", color: "var(--color-success)", msg: "Verification approved — David Kim / Extraction",                 time: "Yesterday", meta: "VER-2026-31209" },
  { icon: "↑", color: "var(--color-danger)",  msg: "Escalated — Angela Foster / Implant not covered / Cigna",        time: "Yesterday", meta: "VER-2026-27445" },
  { icon: "⚠", color: "var(--color-warning)", msg: "Deductible unmet — Marcus Hill / Filling / Aetna",               time: "Yesterday", meta: "VER-2026-22318" },
  { icon: "⚙", color: "var(--color-primary)", msg: "Agent system updated — RCM-RULES-v2.4.1 deployed",               time: "Apr 5",    meta: "System" },
  { icon: "⚙", color: "var(--color-primary)", msg: "New payer added — United Concordia 2026 fee schedule loaded",    time: "Apr 5",    meta: "System" },
];

const ANALYTICS = {
  kpis: [
    { label: "Verifications This Month", value: "127",     sub: "April 2026 · +14% month-over-month",            color: "var(--color-primary)" },
    { label: "Average Verification Time",value: "34s",     sub: "Down from 15–20 min per manual run",            color: "var(--color-success)" },
    { label: "Clean Claim Rate",         value: "94.2%",   sub: "Up 3.1 points from Q1 2025",                    color: "var(--color-success)" },
    { label: "Denials Prevented",        value: "18",      sub: "Est. $24,300 in recoverable revenue protected",  color: "var(--color-warning)" },
    { label: "Billing Staff Hours Saved",value: "42.3 hrs",sub: "April 2026, across all active practices",        color: "var(--color-primary)" },
    { label: "Pre-Auth Catch Rate",      value: "100%",    sub: "Every pre-auth requirement surfaced before scheduling", color: "var(--color-success)" },
  ],
  breakdown: [
    { label: "Safe to Book",      count: 89, pct: 70 },
    { label: "Book with Caution", count: 28, pct: 22 },
    { label: "Escalated",         count: 10, pct: 8  },
  ],
  dailyVolume: (() => {
    const days = ["Mar 7","Mar 8","Mar 9","Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19","Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 28","Mar 29","Mar 30","Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 6"];
    const vols = [3,4,5,4,6,2,1,5,6,7,5,8,6,7,3,2,6,7,8,9,6,8,10,7,8,9,11,10,12,127];
    return days.map((day, i) => ({ day, verifications: vols[i] }));
  })(),
  topPayers: [
    { payer: "Delta Dental",    count: 41, avgTime: "31s" },
    { payer: "Cigna Dental",    count: 29, avgTime: "38s" },
    { payer: "Aetna Dental",    count: 22, avgTime: "41s" },
    { payer: "MetLife Dental",  count: 18, avgTime: "29s" },
    { payer: "Guardian Dental", count: 17, avgTime: "34s" },
  ],
};

/* ── Sub-panels ─────────────────────────────────────────── */

function VerificationsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--color-text)", margin: 0 }}>
            Verification History
          </h3>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
            {VERIFICATIONS.length} verifications in the last 48 hours
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: "11px", color: "var(--color-text-secondary)", cursor: "default" }}>
            Filter ▾
          </div>
          <div style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: "11px", color: "var(--color-text-secondary)", cursor: "default" }}>
            Export ↓
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 80px 90px", gap: "0", background: "var(--color-surface-raised)", borderBottom: "1px solid var(--color-border)", padding: "8px 16px" }}>
          {["Patient", "Payer", "Treatment", "Decision", "Confidence", "Time"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
          ))}
        </div>

        {VERIFICATIONS.map((v, i) => {
          const ds = DECISION_STYLE[v.decision];
          return (
            <div
              key={v.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 80px 90px",
                gap: "0",
                padding: "11px 16px",
                borderBottom: i < VERIFICATIONS.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                background: "var(--color-surface)",
                alignItems: "center",
                cursor: "default",
              }}
            >
              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text)" }}>{v.patient}</div>
                <div style={{ fontSize: "10px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}>{v.id}</div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{v.payer}</span>
              <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{v.treatment}</span>
              <span style={{
                display: "inline-block", fontSize: "9px", fontWeight: 700,
                padding: "2px 7px", borderRadius: "4px",
                background: ds.bg, border: `1px solid ${ds.border}`, color: ds.text,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                {ds.label}
              </span>
              <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{v.confidence}%</span>
              <span style={{ fontSize: "11px", color: "var(--color-text-faint)" }}>{v.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HistoryPanel() {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>
        Activity Log
      </h3>
      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        All agent actions, approvals, and escalations
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {HISTORY.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 12px", borderRadius: "8px", background: "var(--color-surface)" }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: h.color === "var(--color-success)" ? "var(--color-success-tint)"
                        : h.color === "var(--color-warning)" ? "var(--color-warning-tint)"
                        : h.color === "var(--color-danger)"  ? "var(--color-danger-tint)"
                        : "var(--color-primary-tint)",
              border: `1px solid ${h.color}`,
              fontSize: "11px",
            }}>
              <span style={{ color: h.color }}>{h.icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "12px", color: "var(--color-text)", margin: 0, lineHeight: 1.4 }}>{h.msg}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "3px" }}>
                <span style={{ fontSize: "10px", color: "var(--color-text-faint)" }}>{h.time}</span>
                <span style={{ fontSize: "10px", color: "var(--color-text-faint)", fontFamily: "var(--font-mono)" }}>{h.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPanel() {
  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>
        Performance
      </h3>
      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        April 2026 · Dental RCM Agent · StafGo Health
      </p>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {ANALYTICS.kpis.map((k, i) => (
          <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "16px", boxShadow: "var(--shadow-sm)" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px 0" }}>{k.label}</p>
            <p style={{ fontSize: "24px", fontWeight: 700, color: k.color, fontFamily: "var(--font-display)", margin: "0 0 4px 0", lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "11px", color: "var(--color-text-faint)", margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Verification volume area chart */}
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 16px 0" }}>Verification Volume — Last 30 Days</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={ANALYTICS.dailyVolume} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="oklch(40% 0.16 158)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="oklch(40% 0.16 158)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(94.5% 0.008 158)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(62% 0.010 158)", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "oklch(62% 0.010 158)", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "oklch(99.5% 0.004 80)", border: "1px solid oklch(91% 0.012 158)", borderRadius: "8px", fontSize: "11px", fontFamily: "var(--font-sans)" }}
              labelStyle={{ color: "oklch(40% 0.018 158)", fontWeight: 600 }}
              itemStyle={{ color: "oklch(40% 0.16 158)" }}
            />
            <Area type="monotone" dataKey="verifications" stroke="oklch(40% 0.16 158)" strokeWidth={2} fill="url(#volGrad)" dot={false} activeDot={{ r: 4, fill: "oklch(40% 0.16 158)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Decision breakdown pie */}
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px 0" }}>Decision Breakdown</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={ANALYTICS.breakdown} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="count">
                {ANALYTICS.breakdown.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "oklch(52% 0.18 142)" : i === 1 ? "oklch(68% 0.18 75)" : "oklch(58% 0.22 25)"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(99.5% 0.004 80)", border: "1px solid oklch(91% 0.012 158)", borderRadius: "8px", fontSize: "11px", fontFamily: "var(--font-sans)" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "oklch(40% 0.018 158)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top payers */}
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px 0" }}>Top Payers</p>
          {ANALYTICS.topPayers.map((p, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{p.payer}</span>
                <span style={{ fontSize: "10px", color: "var(--color-primary)", fontFamily: "var(--font-mono)" }}>{p.count}</span>
              </div>
              <div style={{ height: "4px", background: "var(--color-border)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "2px", width: `${Math.round((p.count / 45) * 100)}%`, background: "oklch(40% 0.16 158)", transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: "24px" }}>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>{title}</p>
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value, badge }: { label: string; value: string; badge?: string }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--color-border-subtle)" }}>
      <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {badge && (
          <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "var(--color-success-tint)", border: "1px solid var(--color-success)", color: "var(--color-success)", textTransform: "uppercase" }}>
            {badge}
          </span>
        )}
        <span style={{ fontSize: "12px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}>{value}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--color-text)", marginBottom: "4px" }}>
        Configuration
      </h3>
      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
        Integrations · Agent · Payer Connections · Compliance
      </p>

      <Section title="Practice Management">
        <Row label="Primary PMS" value="Dentrix G7.4" badge="Connected" />
        <Row label="Secondary PMS" value="OpenDental 22.1" badge="Connected" />
        <Row label="Clearinghouse" value="Change Healthcare" badge="Active" />
        <Row label="Last Sync" value="Today, 4:08 PM" />
      </Section>

      <Section title="Agent">
        <Row label="Version" value="DentaAgent-v0.1" />
        <Row label="Language Model" value="DentaAgent AI v1.0" badge="Active" />
        <Row label="Rules Engine" value="RCM-RULES-v2.4.1" />
        <Row label="Auto-Approve Threshold" value="≥ 80% confidence" />
        <Row label="Human Review Threshold" value="< 65% confidence" />
      </Section>

      <Section title="Payer Connections">
        <Row label="Delta Dental" value="EDI 270/271" badge="Active" />
        <Row label="Cigna Dental" value="EDI 270/271" badge="Active" />
        <Row label="Aetna Dental" value="Portal + EDI" badge="Active" />
        <Row label="MetLife Dental" value="EDI 270/271" badge="Active" />
        <Row label="Guardian Dental" value="Portal scrape" badge="Active" />
      </Section>

      <Section title="Compliance">
        <Row label="HIPAA" value="Enabled · BAA on file" badge="Compliant" />
        <Row label="Audit Retention" value="7 years · 45 CFR §164.530(j)" />
        <Row label="Data Residency" value="AWS us-east-1" />
        <Row label="Last Security Review" value="April 5, 2026" badge="Passed" />
      </Section>
    </div>
  );
}

function ProfilePanel() {
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "linear-gradient(135deg, oklch(52% 0.18 142) 0%, oklch(40% 0.16 158) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px oklch(40% 0.16 158 / 0.20)",
        }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>SG</span>
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--color-text)", margin: 0 }}>StafGo Health</h3>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: "2px 0 0 0" }}>Dental RCM Operations · Admin Account</p>
        </div>
      </div>

      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
        {[
          { label: "Organisation",   value: "StafGo Health" },
          { label: "Plan",           value: "Enterprise" },
          { label: "Agent Seats",    value: "Unlimited" },
          { label: "Verifications",  value: "127 / unlimited this month" },
          { label: "Member Since",   value: "January 2026" },
          { label: "Last Login",     value: "Today, 4:00 PM" },
        ].map((r, i, arr) => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--color-border-subtle)" : "none" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{r.label}</span>
            <span style={{ fontSize: "12px", color: "var(--color-text)", fontWeight: 500 }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button style={{ flex: 1, padding: "9px 0", borderRadius: "8px", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)", cursor: "default" }}>
          Edit Profile
        </button>
        <button style={{ flex: 1, padding: "9px 0", borderRadius: "8px", border: "1px solid var(--color-danger)", background: "var(--color-danger-tint)", fontSize: "12px", fontWeight: 600, color: "var(--color-danger)", cursor: "default" }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */

export default function NavPanel({ open, onClose }: NavPanelProps) {
  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const TITLES: Record<string, string> = {
    Verifications: "Verifications",
    History: "History",
    Analytics: "Analytics",
    Settings: "Settings",
    Profile: "Account",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "oklch(13% 0.022 158 / 0.18)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          animation: "fadeIn 0.18s ease-out",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed", top: "44px", left: 0, right: 0, zIndex: 50,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          animation: "slideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "calc(100vh - 44px)",
          overflowY: "auto",
        }}
      >
        {/* Panel header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface-raised)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-primary)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "var(--color-text)" }}>
              {open ? TITLES[open] : ""}
            </span>
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: "var(--color-primary-tint)", border: "1px solid var(--color-primary-mid)", color: "var(--color-primary)", fontWeight: 600 }}>
              StafGo RCM
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "28px", height: "28px", borderRadius: "6px",
              border: "1px solid var(--color-border)", background: "var(--color-surface)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--color-text-muted)", fontSize: "14px",
            }}
          >
            ×
          </button>
        </div>

        {/* Panel content */}
        <div style={{ padding: "24px 32px", maxWidth: "1100px", margin: "0 auto" }}>
          {open === "Verifications" && <VerificationsPanel />}
          {open === "History"       && <HistoryPanel />}
          {open === "Analytics"     && <AnalyticsPanel />}
          {open === "Settings"      && <SettingsPanel />}
          {open === "Profile"       && <ProfilePanel />}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
