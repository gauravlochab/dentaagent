"use client";

import React, { useEffect, useRef } from "react";
import {
  SourceDocument,
  DocumentSection,
  KeyValueData,
  TableData,
  ChecklistItem,
  StatusBadgeData,
} from "@/lib/mockDocuments";

interface DocumentViewerProps {
  doc: SourceDocument | null;
  onClose: () => void;
}

/* ── Doc type meta ───────────────────────────────────────── */
const DOC_TYPE_META: Record<
  SourceDocument["docType"],
  { label: string; watermark: string; color: string; borderColor: string }
> = {
  intake: {
    label: "Patient Intake Form",
    watermark: "VALIDATED",
    color: "oklch(40% 0.16 158)",
    borderColor: "var(--color-primary)",
  },
  eligibility: {
    label: "EDI 271 Transaction",
    watermark: "VERIFIED",
    color: "oklch(52% 0.18 142)",
    borderColor: "var(--color-success)",
  },
  benefits: {
    label: "Benefit Summary",
    watermark: "EXTRACTED",
    color: "oklch(40% 0.16 158)",
    borderColor: "var(--color-primary)",
  },
  "coverage-rules": {
    label: "Rule Evaluation",
    watermark: "EVALUATED",
    color: "oklch(68% 0.18 75)",
    borderColor: "var(--color-warning)",
  },
  "risk-report": {
    label: "Risk Report",
    watermark: "ASSESSED",
    color: "oklch(58% 0.22 25)",
    borderColor: "var(--color-danger)",
  },
  decision: {
    label: "Decision Record",
    watermark: "DECIDED",
    color: "oklch(40% 0.16 158)",
    borderColor: "var(--color-primary)",
  },
  audit: {
    label: "Audit Log Entry",
    watermark: "IMMUTABLE",
    color: "oklch(52% 0.18 142)",
    borderColor: "var(--color-success)",
  },
};

/* ── Status badge variant colors ────────────────────────── */
function getVariantStyles(variant: StatusBadgeData["variant"]) {
  switch (variant) {
    case "success":
      return {
        bg: "var(--color-success-tint)",
        border: "var(--color-success)",
        text: "var(--color-success)",
      };
    case "danger":
      return {
        bg: "var(--color-danger-tint)",
        border: "var(--color-danger)",
        text: "var(--color-danger)",
      };
    case "warning":
      return {
        bg: "var(--color-warning-tint)",
        border: "var(--color-warning)",
        text: "var(--color-warning)",
      };
    default:
      return {
        bg: "var(--color-primary-tint)",
        border: "var(--color-primary)",
        text: "var(--color-primary)",
      };
  }
}

/* ── Checklist item status colors ───────────────────────── */
function getChecklistColors(status: ChecklistItem["status"]) {
  switch (status) {
    case "PASS":
      return { icon: "✓", color: "var(--color-success)", bg: "var(--color-success-tint)", badge: "PASS" };
    case "FAIL":
      return { icon: "✗", color: "var(--color-danger)", bg: "var(--color-danger-tint)", badge: "FAIL" };
    case "WARN":
      return { icon: "⚠", color: "var(--color-warning)", bg: "var(--color-warning-tint)", badge: "WARN" };
  }
}

/* ── Risk severity colors ───────────────────────────────── */
function getRiskSeverityStyle(severity: string) {
  switch (severity.toUpperCase()) {
    case "HIGH":
      return { color: "var(--color-danger)", bg: "var(--color-danger-tint)" };
    case "MEDIUM":
      return { color: "var(--color-warning)", bg: "var(--color-warning-tint)" };
    default:
      return { color: "var(--color-success)", bg: "var(--color-success-tint)" };
  }
}

/* ── Section renderers ──────────────────────────────────── */
function KeyValueSection({ data }: { data: KeyValueData }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        {data.rows.map((row, i) => (
          <tr
            key={i}
            style={{
              background: i % 2 === 0 ? "transparent" : "oklch(99% 0.003 158 / 0.5)",
            }}
          >
            <td
              style={{
                padding: "6px 10px 6px 0",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "var(--color-text-muted)",
                fontWeight: 500,
                width: "42%",
                verticalAlign: "top",
                lineHeight: 1.5,
              }}
            >
              {row.label}
            </td>
            <td
              style={{
                padding: "6px 0",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "var(--color-text)",
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableSection({ data }: { data: TableData }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
        <thead>
          <tr
            style={{
              background: "var(--color-surface-raised)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            {data.headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "7px 10px",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  fontSize: "10px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                borderBottom: ri < data.rows.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
              }}
            >
              {row.map((cell, ci) => {
                // Detect severity labels in risk matrix (second column)
                const isSeverity = data.headers[ci]?.toLowerCase() === "severity";
                const sevStyle = isSeverity ? getRiskSeverityStyle(cell) : null;
                return (
                  <td
                    key={ci}
                    style={{
                      padding: "7px 10px",
                      fontFamily: "var(--font-sans)",
                      color: "var(--color-text)",
                      verticalAlign: "top",
                      lineHeight: 1.5,
                    }}
                  >
                    {isSeverity && sevStyle ? (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          background: sevStyle.bg,
                          color: sevStyle.color,
                        }}
                      >
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChecklistSection({ data }: { data: ChecklistItem[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {data.map((item, i) => {
        const { icon, color, bg, badge } = getChecklistColors(item.status);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "8px 0",
              borderBottom: i < data.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
            }}
          >
            {/* Status icon */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "10px",
                color,
                fontWeight: 700,
                marginTop: "1px",
              }}
            >
              {icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-text)",
                    lineHeight: 1.4,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "1px 7px",
                    borderRadius: "10px",
                    background: bg,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {badge}
                </span>
              </div>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "10px",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {item.note}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadgeSection({ data }: { data: StatusBadgeData }) {
  const styles = getVariantStyles(data.variant);
  // Human-readable label for decision values
  const displayValue = data.value.replace(/_/g, " ");
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          padding: "14px 28px",
          borderRadius: "12px",
          background: styles.bg,
          border: `1.5px solid ${styles.border}`,
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {data.label}
        </span>
        <span
          style={{
            fontSize: "18px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: styles.text,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {displayValue}
        </span>
      </div>
    </div>
  );
}

function TextSection({ data }: { data: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        fontSize: "11px",
        color: "var(--color-text-secondary)",
        lineHeight: 1.7,
        fontStyle: "italic",
      }}
    >
      {data}
    </p>
  );
}

function CodeSection({ data }: { data: string }) {
  return (
    <div
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: "8px",
        padding: "12px",
        overflowX: "auto",
      }}
    >
      <pre
        style={{
          margin: 0,
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
        }}
      >
        {data}
      </pre>
    </div>
  );
}

function SectionRenderer({ section }: { section: DocumentSection }) {
  return (
    <div>
      {section.heading && (
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-secondary)",
            marginBottom: "8px",
          }}
        >
          {section.heading}
        </div>
      )}
      {section.type === "keyvalue" && <KeyValueSection data={section.data as KeyValueData} />}
      {section.type === "table" && <TableSection data={section.data as TableData} />}
      {section.type === "checklist" && <ChecklistSection data={section.data as ChecklistItem[]} />}
      {section.type === "status-badge" && <StatusBadgeSection data={section.data as StatusBadgeData} />}
      {section.type === "text" && <TextSection data={section.data as string} />}
      {section.type === "code" && <CodeSection data={section.data as string} />}
    </div>
  );
}

/* ── Main DocumentViewer ─────────────────────────────────── */
export default function DocumentViewer({ doc, onClose }: DocumentViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const isOpen = !!doc;
  const meta = doc ? DOC_TYPE_META[doc.docType] : null;
  const now = new Date();
  const footerTimestamp = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
    " · " + now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.15)",
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          maxWidth: "100%",
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          borderLeft: "1px solid var(--color-border)",
          overflow: "hidden",
        }}
      >
        {doc && meta && (
          <>
            {/* Colored top border */}
            <div
              style={{
                height: "3px",
                background: `linear-gradient(90deg, ${meta.color} 0%, transparent 100%)`,
                flexShrink: 0,
              }}
            />

            {/* Panel header */}
            <div
              style={{
                padding: "14px 16px 12px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-surface-raised)",
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Watermark */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "48px",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: meta.color,
                  opacity: 0.25,
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                }}
              >
                {meta.watermark}
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Issuer */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: meta.color,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: "3px",
                    }}
                  >
                    DentaAgent
                  </div>

                  {/* Document title */}
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--color-text)",
                      lineHeight: 1.25,
                    }}
                  >
                    {doc.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontFamily: "var(--font-sans)",
                      fontSize: "10px",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {doc.subtitle}
                  </p>

                  {/* Doc type chip */}
                  <div style={{ marginTop: "8px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 9px",
                        borderRadius: "10px",
                        background: "var(--color-primary-tint)",
                        border: "1px solid var(--color-primary-mid)",
                        color: "var(--color-primary)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close document viewer"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: "background var(--duration-fast), color var(--duration-fast)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--color-danger-tint)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-danger)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-danger)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {doc.sections.map((section, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    background: "var(--color-surface-raised)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <SectionRenderer section={section} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid var(--color-border)",
                background: "var(--color-surface-raised)",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "9px",
                  color: "var(--color-text-faint)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Source document retrieved by DentaAgent · {footerTimestamp}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
