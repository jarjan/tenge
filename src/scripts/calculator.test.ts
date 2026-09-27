import { describe, expect, it } from "vitest";
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
  TAX_RULES_2026,
  calculateFromGross,
  calculateFromNet,
  clampAmount,
  formatRate,
  ipnMonthlyThreshold,
} from "./calculator";

describe("calculateFromGross (2026 rules)", () => {
  // Reference example from published 2026 payroll guides (1cbit.kz)
  it("matches the 200 000 ₸ reference example", () => {
    const b = calculateFromGross(200000);
    expect(b.opv).toBe(20000);
    expect(b.vosms).toBe(4000);
    expect(b.standardDeduction).toBe(129750);
    expect(b.taxBase).toBe(46250);
    expect(b.ipn).toBe(4625);
    expect(b.netSalary).toBe(171375);

    expect(b.so).toBe(9000);
    expect(b.sn).toBe(10560);
    expect(b.oosms).toBe(6000);
    expect(b.opvr).toBe(7000);
    expect(b.totalEmployerCost).toBe(232560);
  });

  // Reference example from mybuh.kz
  it("matches the 300 000 ₸ reference example", () => {
    const b = calculateFromGross(300000);
    expect(b.ipn).toBe(13425);
    expect(b.netSalary).toBe(250575);
    expect(b.so).toBe(13500);
    expect(b.sn).toBe(15840);
    expect(b.oosms).toBe(9000);
    expect(b.opvr).toBe(10500);
  });

  it("does not offset social tax by social contributions", () => {
    const b = calculateFromGross(500000);
    expect(b.sn).toBeCloseTo((500000 - 50000 - 10000) * 0.06, 2);
  });

  it("applies the minimum social contribution base of 1 МЗП", () => {
    const b = calculateFromGross(MIN_AMOUNT);
    expect(b.so).toBe(85000 * 0.05);
  });

  it("no longer applies the abolished 90% correction to small salaries", () => {
    const b = calculateFromGross(MIN_AMOUNT);
    // (85 000 − 8 500 − 1 700 − 129 750) < 0 → no tax at minimum wage
    expect(b.ipn).toBe(0);
    const noDeduction = calculateFromGross(MIN_AMOUNT, { useStandardDeduction: false });
    expect(noDeduction.ipn).toBe((85000 - 8500 - 1700) * 0.1);
  });

  it("caps contributions at their МЗП limits", () => {
    const b = calculateFromGross(10_000_000);
    expect(b.opv).toBe(50 * 85000 * 0.1);
    expect(b.vosms).toBe(20 * 85000 * 0.02);
    expect(b.oosms).toBe(40 * 85000 * 0.03);
    expect(b.opvr).toBe(50 * 85000 * 0.035);
    expect(b.so).toBe(7 * 85000 * 0.05);
  });

  it("applies the 15% progressive ИПН rate above 8 500 МРП a year", () => {
    const gross = 5_000_000;
    const b = calculateFromGross(gross);
    const threshold = ipnMonthlyThreshold();
    expect(threshold).toBeCloseTo((8500 * 4325) / 12, 6);

    const taxBase = gross - 425000 - 34000 - 129750;
    const expected = threshold * 0.1 + (taxBase - threshold) * 0.15;
    expect(b.ipnHighRateApplied).toBe(true);
    expect(b.ipn).toBeCloseTo(expected, 1);
    expect(calculateFromGross(1_000_000).ipnHighRateApplied).toBe(false);
  });

  it("returns zeros for empty or invalid input", () => {
    for (const value of [0, -5, Number.NaN]) {
      const b = calculateFromGross(value);
      expect(b.grossSalary).toBe(0);
      expect(b.netSalary).toBe(0);
      expect(b.totalEmployerCost).toBe(0);
    }
  });
});

describe("calculateFromNet", () => {
  it("inverts calculateFromGross across the salary range", () => {
    for (const gross of [85000, 200000, 350000, 1_000_000, 4_000_000, 25_000_000]) {
      for (const useStandardDeduction of [true, false]) {
        const net = calculateFromGross(gross, { useStandardDeduction }).netSalary;
        const b = calculateFromNet(net, { useStandardDeduction });
        expect(b.grossSalary).toBeCloseTo(gross, 0);
      }
    }
  });

  it("finds the reference gross for 171 375 ₸ net", () => {
    expect(calculateFromNet(171375).grossSalary).toBeCloseTo(200000, 0);
  });

  it("does not produce NaN for non-finite input", () => {
    expect(calculateFromNet(Number.POSITIVE_INFINITY).netSalary).toBe(0);
    expect(Number.isNaN(calculateFromNet(MAX_AMOUNT).netSalary)).toBe(false);
  });
});

describe("helpers", () => {
  it("clamps amounts into the supported range", () => {
    expect(clampAmount(1)).toBe(MIN_AMOUNT);
    expect(clampAmount(Number.POSITIVE_INFINITY)).toBe(MIN_AMOUNT);
    expect(clampAmount(1e20)).toBe(MAX_AMOUNT);
    expect(clampAmount(123456.7)).toBe(123457);
  });

  it("formats rates as percentages", () => {
    expect(formatRate(TAX_RULES_2026.soRate)).toBe("5%");
    expect(formatRate(TAX_RULES_2026.opvrRate)).toBe("3.5%");
  });
});
