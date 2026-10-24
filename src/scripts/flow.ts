import type { SalaryBreakdown } from "./calculator";

/** Who ends up with a slice of the employer's spend */
export type FlowKind = "total" | "yours" | "pension" | "state";

export interface FlowBar {
  id: string;
  kind: FlowKind;
  value: number;
  /** Bar start, as % of the full employer cost */
  left: number;
  /** Bar length, as % of the full employer cost */
  width: number;
}

/**
 * Waterfall from what the employer spends down to take-home pay. Each
 * deduction is drawn where it is cut from the running total.
 */
export function flowBars(b: SalaryBreakdown): FlowBar[] {
  const cost = b.totalEmployerCost;
  const pct = (v: number) => (cost > 0 ? Math.max(0, (v / cost) * 100) : 0);

  let level = cost;
  const step = (id: string, value: number, kind: FlowKind): FlowBar => {
    level -= value;
    return { id, kind, value, left: pct(level), width: pct(value) };
  };
  const total = (id: string, value: number, kind: FlowKind): FlowBar => {
    level = value;
    return { id, kind, value, left: 0, width: pct(value) };
  };

  return [
    total("total-employer-cost", cost, "total"),
    step("sn", b.sn, "state"),
    step("so", b.so, "state"),
    step("oosms", b.oosms, "state"),
    step("opvr", b.opvr, "pension"),
    total("gross", b.grossSalary, "total"),
    step("opv", b.opv, "pension"),
    step("vosms", b.vosms, "state"),
    step("ipn", b.ipn, "state"),
    total("net", b.netSalary, "yours"),
  ];
}

/** Take-home and pension share of every 100 ₸ the employer spends */
export function flowShares(b: SalaryBreakdown): { net: number; pension: number } {
  const cost = b.totalEmployerCost;
  if (cost <= 0) return { net: 0, pension: 0 };
  return {
    net: (b.netSalary / cost) * 100,
    pension: ((b.opv + b.opvr) / cost) * 100,
  };
}

/** Formats a share like 70.7 with the locale's decimal separator */
export function formatShare(value: number, locale: "kk" | "ru" | "en"): string {
  return value.toLocaleString(locale === "en" ? "en-US" : "ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
