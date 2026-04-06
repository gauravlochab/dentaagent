"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";

interface ShortcutsOverlayProps {
  onLoadSarah: () => void;
  onLoadMichael: () => void;
  onLoadPatricia: () => void;
}

const SHORTCUT_SECTIONS = [
  {
    title: "NAVIGATION",
    items: [
      { keys: ["⌘", "K"], label: "Open command palette" },
      { keys: ["?"],       label: "This shortcuts panel" },
      { keys: ["Esc"],     label: "Close any panel" },
    ],
  },
  {
    title: "DEMO PATIENTS",
    items: [
      { keys: ["S"], label: "Load Sarah Johnson (Safe)" },
      { keys: ["M"], label: "Load Michael Torres (Caution)" },
      { keys: ["P"], label: "Load Patricia Chen (Escalate)" },
    ],
  },
  {
    title: "ACTIONS",
    items: [
      { keys: ["⌘", "↵"], label: "Run Verification Agent" },
      { keys: ["⌘", "1"], label: "Open Verifications" },
      { keys: ["⌘", "2"], label: "Open Analytics" },
      { keys: ["⌘", "3"], label: "Open History" },
      { keys: ["⌘", "4"], label: "Settings" },
    ],
  },
];

function KbdKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "22px",
        height: "22px",
        padding: "0 5px",
        borderRadius: "5px",
        fontSize: "11px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-secondary)",
        boxShadow: "0 1px 0 var(--color-border)",
        lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  );
}

export function ShortcutsTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Keyboard shortcuts (?)"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 7px",
        borderRadius: "5px",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface-raised)",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--color-text-muted)",
        lineHeight: 1,
        height: "24px",
      }}
    >
      [?]
    </button>
  );
}

export default function ShortcutsOverlay({ onLoadSarah, onLoadMichael, onLoadPatricia }: ShortcutsOverlayProps) {
  const [open, setOpen] = useState(false);

  useHotkeys("shift+/", () => setOpen(true), { preventDefault: true });
  useHotkeys("escape", () => setOpen(false), { enabled: open, preventDefault: true });
  useHotkeys("s", () => { onLoadSarah(); }, { enabled: !open });
  useHotkeys("m", () => { onLoadMichael(); }, { enabled: !open });
  useHotkeys("p", () => { onLoadPatricia(); }, { enabled: !open });

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        title="Keyboard shortcuts (?)"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px 7px",
          borderRadius: "5px",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 600,
          color: "var(--color-text-muted)",
          lineHeight: 1,
          height: "24px",
        }}
      >
        [?]
      </button>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                background: "oklch(13% 0.022 158 / 0.45)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 9999,
                width: "480px",
                maxWidth: "calc(100vw - 32px)",
                borderRadius: "16px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 24px 64px oklch(13% 0.022 158 / 0.18), 0 4px 16px oklch(13% 0.022 158 / 0.1)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px 14px",
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-surface-raised)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-primary-tint)",
                      border: "1px solid var(--color-primary-mid)",
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-text)",
                        fontFamily: "var(--font-display)",
                        lineHeight: 1.2,
                      }}
                    >
                      Keyboard Shortcuts
                    </p>
                    <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "1px" }}>
                      Press Esc to close
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Shortcut sections — two column layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0",
                  padding: "20px",
                  columnGap: "24px",
                }}
              >
                {SHORTCUT_SECTIONS.map((section, si) => (
                  <div
                    key={si}
                    style={{
                      gridColumn: si === 2 ? "1 / -1" : undefined,
                      marginBottom: "20px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        color: "var(--color-text-faint)",
                        fontFamily: "var(--font-sans)",
                        marginBottom: "8px",
                      }}
                    >
                      {section.title}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {section.items.map((item, ii) => (
                        <div
                          key={ii}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            background: "var(--color-surface-raised)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--color-text-secondary)",
                              fontFamily: "var(--font-sans)",
                              flex: 1,
                            }}
                          >
                            {item.label}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0 }}>
                            {item.keys.map((k, ki) => (
                              <KbdKey key={ki}>{k}</KbdKey>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid var(--color-border)",
                  background: "var(--color-surface-raised)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                  }}
                />
                <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>
                  StafGo · DentaAgent keyboard shortcuts
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
