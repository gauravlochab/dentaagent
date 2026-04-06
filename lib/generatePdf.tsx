import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { VerificationResult, PatientFormData } from "./types";

// ─── Color Tokens (rgb only — @react-pdf doesn't support oklch) ──────────────
const C = {
  emerald:      "rgb(45, 106, 79)",
  emeraldDark:  "rgb(28, 70, 50)",
  emeraldLight: "rgb(232, 245, 238)",
  emeraldMid:   "rgb(184, 212, 192)",
  warning:      "rgb(180, 120, 0)",
  warningTint:  "rgb(255, 248, 238)",
  danger:       "rgb(176, 40, 30)",
  dangerTint:   "rgb(255, 240, 238)",
  textDark:     "rgb(26, 42, 30)",
  textMuted:    "rgb(106, 138, 114)",
  textFaint:    "rgb(160, 185, 165)",
  border:       "rgb(184, 212, 192)",
  bg:           "rgb(252, 252, 250)",
  white:        "rgb(255, 255, 255)",
  surface:      "rgb(248, 252, 249)",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.textDark,
    backgroundColor: C.bg,
    paddingTop: 0,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
  },

  // Header
  header: {
    backgroundColor: C.emerald,
    marginLeft: -40,
    marginRight: -40,
    paddingTop: 22,
    paddingBottom: 18,
    paddingLeft: 40,
    paddingRight: 40,
    marginBottom: 24,
  } as any,
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerBrand: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.5,
  },
  headerLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "rgb(198, 230, 210)",
    letterSpacing: 2,
    textTransform: "uppercase" as any,
    marginTop: 4,
  },
  headerSub: {
    fontSize: 9,
    color: "rgb(167, 210, 183)",
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // Section title
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.textMuted,
    textTransform: "uppercase" as any,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 18,
  },

  // Two-column grid
  twoCol: {
    flexDirection: "row",
    marginBottom: 0,
  },
  col: {
    flex: 1,
  },
  colLeft: {
    flex: 1,
    marginRight: 12,
  },

  // Info card
  infoCard: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 12,
  },
  infoCardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
    textTransform: "uppercase" as any,
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.emeraldLight,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.bg,
  },
  infoLabel: {
    fontSize: 8,
    color: C.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.textDark,
    flex: 1.4,
    textAlign: "right" as any,
  },

  // Status badge
  statusSection: {
    marginTop: 18,
    marginBottom: 0,
  },
  statusBadge: {
    borderRadius: 6,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  statusSubText: {
    fontSize: 9,
    marginTop: 3,
  },

  // Table
  table: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    overflow: "hidden",
  } as any,
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.emeraldLight,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopWidth: 1,
    borderTopColor: C.bg,
  },
  tableRowAlt: {
    backgroundColor: C.surface,
  },
  tableCell: {
    fontSize: 8.5,
    color: C.textDark,
    flex: 1,
  },
  tableCellBold: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.textDark,
    flex: 1,
  },

  // Decision block
  decisionBlock: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    marginTop: 0,
  },
  decisionLabel: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  decisionReason: {
    fontSize: 9,
    lineHeight: 1.5,
    color: C.textDark,
  },

  // Risk flags
  flagRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.bg,
  },
  chip: {
    borderRadius: 4,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    marginRight: 10,
    minWidth: 50,
    alignItems: "center",
  },
  chipText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase" as any,
  },
  flagText: {
    fontSize: 8.5,
    color: C.textDark,
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  flagExplanation: {
    fontSize: 8,
    color: C.textMuted,
    flex: 1,
    marginTop: 2,
    lineHeight: 1.4,
  },

  // Action steps
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
  },
  stepNum: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.emeraldLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.emerald,
  },
  stepText: {
    fontSize: 8.5,
    color: C.textDark,
    flex: 1,
    lineHeight: 1.5,
  },

  // Audit block
  auditBlock: {
    marginTop: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
  },
  auditItem: {
    flex: 1,
  },
  auditLabel: {
    fontSize: 7,
    color: C.textFaint,
    textTransform: "uppercase" as any,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  auditValue: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.textMuted,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 16,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: C.textFaint,
  },
  footerPage: {
    fontSize: 7,
    color: C.textFaint,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginTop: 16,
    marginBottom: 0,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function currency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <View style={S.infoCard}>
      <Text style={S.infoCardTitle}>{title}</Text>
      {rows.map((r, i) => (
        <View key={i} style={S.infoRow}>
          <Text style={S.infoLabel}>{r.label}</Text>
          <Text style={S.infoValue}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

function TableRow({
  cells,
  alt,
  bold,
}: {
  cells: string[];
  alt?: boolean;
  bold?: boolean;
}) {
  const rowStyle = alt
    ? [S.tableRow, S.tableRowAlt]
    : [S.tableRow];
  const cellStyle = bold ? S.tableCellBold : S.tableCell;
  return (
    <View style={rowStyle as any}>
      {cells.map((c, i) => (
        <Text key={i} style={cellStyle}>
          {c}
        </Text>
      ))}
    </View>
  );
}

// ─── PDF Document ─────────────────────────────────────────────────────────────
function VerificationPDF({
  result,
  formData,
}: {
  result: VerificationResult;
  formData: PatientFormData;
}) {
  const {
    eligibility,
    benefits,
    treatmentCoverage,
    riskFlags,
    bookingRecommendation,
    verificationId,
    timestamp,
    confidenceScore: rawConf,
  } = result;

  const confidenceScore =
    rawConf <= 1 ? Math.round(rawConf * 100) : Math.round(rawConf);

  // Decision colors
  const decisionMap = {
    SAFE_TO_BOOK: {
      bg: C.emeraldLight,
      border: C.emerald,
      color: C.emerald,
      label: "SAFE TO BOOK",
    },
    BOOK_WITH_CAUTION: {
      bg: C.warningTint,
      border: C.warning,
      color: C.warning,
      label: "BOOK WITH CAUTION",
    },
    ESCALATE: {
      bg: C.dangerTint,
      border: C.danger,
      color: C.danger,
      label: "ESCALATE TO HUMAN",
    },
  };
  const dc = decisionMap[bookingRecommendation.decision];

  // Severity chip colors
  const severityColors: Record<string, { bg: string; text: string }> = {
    HIGH:   { bg: C.dangerTint,   text: C.danger },
    MEDIUM: { bg: C.warningTint,  text: C.warning },
    LOW:    { bg: C.emeraldLight, text: C.emerald },
  };

  const footer = `DentaAgent  ·  Confidential  ·  HIPAA Compliant  ·  ${verificationId}`;

  return (
    <Document
      title="DentaAgent Verification Report"
      author="DentaAgent"
      subject={`Verification Report — ${formData.patientName}`}
    >
      <Page size="A4" style={S.page}>
        {/* ── Header ──────────────────────────────── */}
        <View style={S.header} fixed>
          <View style={S.headerRow}>
            <View>
              <Text style={S.headerBrand}>DentaAgent</Text>
              <Text style={S.headerSub}>StafGo Health  ·  Dental RCM</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={S.headerLabel}>Verification Report</Text>
              <Text style={{ fontSize: 8, color: "rgb(167, 210, 183)", marginTop: 4 }}>
                {new Date(timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* ── 1. Patient & Insurance ───────────────── */}
        <Text style={S.sectionTitle}>Patient &amp; Insurance Information</Text>
        <View style={S.twoCol}>
          <View style={S.colLeft}>
            <InfoCard
              title="Patient Details"
              rows={[
                { label: "Patient Name",      value: formData.patientName },
                { label: "Date of Birth",      value: formData.dateOfBirth },
                { label: "Member ID",          value: formData.memberId },
                { label: "Group ID",           value: formData.groupId || "—" },
                { label: "Treatment",          value: formData.requestedTreatment },
                { label: "Appointment Date",   value: formData.appointmentDate },
              ]}
            />
          </View>
          <View style={S.col}>
            <InfoCard
              title="Payer Details"
              rows={[
                { label: "Payer Name",         value: formData.payerName },
                { label: "Plan Type",          value: eligibility.planType },
                { label: "Plan Name",          value: eligibility.planName },
                { label: "Coverage Period",    value: eligibility.coveragePeriod },
                { label: "Payer Phone",        value: eligibility.payerPhone },
              ]}
            />
          </View>
        </View>

        <View style={S.divider} />

        {/* ── 2. Eligibility Status ────────────────── */}
        <Text style={S.sectionTitle}>Eligibility Status</Text>
        <View
          style={[
            S.statusBadge,
            {
              backgroundColor:
                eligibility.status === "ACTIVE"
                  ? C.emeraldLight
                  : eligibility.status === "INACTIVE"
                  ? C.dangerTint
                  : C.warningTint,
              borderWidth: 1.5,
              borderColor:
                eligibility.status === "ACTIVE"
                  ? C.emerald
                  : eligibility.status === "INACTIVE"
                  ? C.danger
                  : C.warning,
            },
          ] as any}
        >
          <Text
            style={[
              S.statusText,
              {
                color:
                  eligibility.status === "ACTIVE"
                    ? C.emerald
                    : eligibility.status === "INACTIVE"
                    ? C.danger
                    : C.warning,
              },
            ] as any}
          >
            {eligibility.status}
          </Text>
          <Text
            style={[
              S.statusSubText,
              {
                color:
                  eligibility.status === "ACTIVE"
                    ? C.emerald
                    : eligibility.status === "INACTIVE"
                    ? C.danger
                    : C.warning,
              },
            ] as any}
          >
            {eligibility.planType}  ·  {eligibility.coveragePeriod}
          </Text>
        </View>

        <View style={S.divider} />

        {/* ── 3. Benefit Summary ───────────────────── */}
        <Text style={S.sectionTitle}>Benefit Summary</Text>
        <View style={S.table}>
          <View style={S.tableHeader}>
            {["Annual Max", "Used", "Remaining", "Deductible", "In-Network", "Out-of-Network"].map(
              (h) => (
                <Text key={h} style={S.tableHeaderCell}>
                  {h}
                </Text>
              )
            )}
          </View>
          <TableRow
            cells={[
              currency(benefits.annualMaximum),
              currency(benefits.annualMaximumUsed),
              currency(benefits.remainingBenefit),
              benefits.deductibleMet
                ? `${currency(benefits.deductible)} (Met)`
                : `${currency(benefits.deductibleRemaining)} left`,
              `${benefits.inNetworkCoverage}%`,
              `${benefits.outOfNetworkCoverage}%`,
            ]}
          />
        </View>

        <View style={S.divider} />

        {/* ── 4. Treatment Coverage ────────────────── */}
        <Text style={S.sectionTitle}>Treatment Coverage</Text>
        <View style={S.table}>
          <View style={S.tableHeader}>
            {["Covered", "Coverage %", "Pre-Auth Req.", "Patient Resp.", "Insurance Pays", "Frequency Limit"].map(
              (h) => (
                <Text key={h} style={S.tableHeaderCell}>
                  {h}
                </Text>
              )
            )}
          </View>
          <TableRow
            cells={[
              treatmentCoverage.covered ? "Yes" : "No",
              `${treatmentCoverage.coveragePercentage}%`,
              treatmentCoverage.preAuthRequired ? "YES" : "No",
              currency(treatmentCoverage.estimatedPatientResponsibility),
              currency(treatmentCoverage.estimatedInsurancePays),
              treatmentCoverage.frequencyLimit,
            ]}
          />
        </View>

        <View style={S.divider} />

        {/* ── 5. Booking Decision ──────────────────── */}
        <Text style={S.sectionTitle}>Booking Decision</Text>
        <View
          style={[
            S.decisionBlock,
            {
              backgroundColor: dc.bg,
              borderLeftColor: dc.border,
            },
          ] as any}
        >
          <Text style={[S.decisionLabel, { color: dc.color }] as any}>
            {dc.label}
          </Text>
          <Text style={S.decisionReason}>{bookingRecommendation.reason}</Text>
        </View>

        <View style={S.divider} />

        {/* ── 6. Risk Flags ────────────────────────── */}
        {riskFlags.length > 0 && (
          <>
            <Text style={S.sectionTitle}>Risk Flags</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 6,
              }}
            >
              {riskFlags.map((flag, i) => {
                const sc = severityColors[flag.severity] ?? severityColors.LOW;
                return (
                  <View
                    key={i}
                    style={[
                      S.flagRow,
                      {
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: i % 2 === 1 ? C.surface : C.white,
                      },
                    ] as any}
                  >
                    <View
                      style={[S.chip, { backgroundColor: sc.bg }] as any}
                    >
                      <Text style={[S.chipText, { color: sc.text }] as any}>
                        {flag.severity}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.flagText}>{flag.flag}</Text>
                      <Text style={S.flagExplanation}>{flag.explanation}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={S.divider} />
          </>
        )}

        {/* ── 7. Action Steps ──────────────────────── */}
        <Text style={S.sectionTitle}>Action Steps</Text>
        {bookingRecommendation.actionSteps.map((step, i) => (
          <View key={i} style={S.stepRow}>
            <View style={S.stepNum}>
              <Text style={S.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={S.stepText}>{step}</Text>
          </View>
        ))}

        <View style={S.divider} />

        {/* ── 8. Audit Information ─────────────────── */}
        <Text style={S.sectionTitle}>Audit Information</Text>
        <View style={S.auditBlock}>
          <View style={S.auditItem}>
            <Text style={S.auditLabel}>Verification ID</Text>
            <Text style={S.auditValue}>{verificationId}</Text>
          </View>
          <View style={S.auditItem}>
            <Text style={S.auditLabel}>Timestamp</Text>
            <Text style={S.auditValue}>
              {new Date(timestamp).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
          <View style={S.auditItem}>
            <Text style={S.auditLabel}>Confidence Score</Text>
            <Text style={S.auditValue}>{confidenceScore}%</Text>
          </View>
          <View style={S.auditItem}>
            <Text style={S.auditLabel}>Agent Version</Text>
            <Text style={S.auditValue}>DentaAgent v1.0</Text>
          </View>
        </View>

        {/* ── Footer ──────────────────────────────── */}
        <View style={S.footer} fixed>
          <Text style={S.footerText}>{footer}</Text>
          <Text
            style={S.footerPage}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// ─── Export function ──────────────────────────────────────────────────────────
export async function downloadVerificationPdf(
  result: VerificationResult,
  formData: PatientFormData
): Promise<void> {
  const element = <VerificationPDF result={result} formData={formData} />;
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dentaagent-verification-${result.verificationId}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
