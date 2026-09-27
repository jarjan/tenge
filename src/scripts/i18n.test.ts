import { describe, expect, it } from "vitest";
import { SUPPORTED_LOCALES, translations } from "./i18n";
import { DEFAULT_AMOUNT, buildOgImageUrl, parseCalcParams } from "./params";
import { MAX_AMOUNT, MIN_AMOUNT } from "./calculator";

function flatten(obj: object, prefix = ""): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") Object.assign(acc, flatten(value, path));
    else acc[path] = value;
    return acc;
  }, {});
}

describe("translations", () => {
  const flat = Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l, flatten(translations[l])]));

  it("define the same keys in every locale", () => {
    const keys = Object.keys(flat.kk).sort();
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(flat[locale]).sort()).toEqual(keys);
    }
  });

  it("contain no empty or broken interpolations", () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const [key, value] of Object.entries(flat[locale])) {
        expect(typeof value, `${locale}.${key}`).toBe("string");
        expect(value, `${locale}.${key}`).not.toMatch(/undefined|NaN|\[object/);
        expect((value as string).trim(), `${locale}.${key}`).not.toBe("");
      }
    }
  });

  it("reflect the 2026 rules in user-facing copy", () => {
    expect(translations.ru.calculator.deductionLabel).toContain("30 МРП");
    expect(translations.ru.calculator.deductionHint).toMatch(/129\s750/);
    expect(translations.en.calculator.so).toBe("SO (5%)");
    expect(translations.kk.calculator.opvr).toContain("3.5%");
    expect(translations.ru.calculator.tooltips.ipn.desc).not.toContain("90%");
  });
});

describe("parseCalcParams", () => {
  const parse = (query: string) => parseCalcParams(new URLSearchParams(query));

  it("falls back to defaults", () => {
    expect(parse("")).toEqual({
      mode: "net",
      amount: DEFAULT_AMOUNT,
      locale: "kk",
      useDeduction: true,
      hasExplicitLocale: false,
    });
  });

  it("parses and clamps values", () => {
    const p = parse("mode=gross&amount=10&lang=ru&deduction=false");
    expect(p).toMatchObject({ mode: "gross", amount: MIN_AMOUNT, locale: "ru", useDeduction: false });
    expect(parse("salary=500000").amount).toBe(500000);
    expect(parse("amount=1e400").amount).toBe(DEFAULT_AMOUNT);
    expect(parse("amount=99999999999999").amount).toBe(MAX_AMOUNT);
    expect(parse("lang=de").locale).toBe("kk");
    expect(parse("deduction=0").useDeduction).toBe(false);
  });
});

describe("buildOgImageUrl", () => {
  it("carries every parameter that affects the numbers", () => {
    const url = new URL(
      buildOgImageUrl("https://tenge.work", parseCalcParams(new URLSearchParams("amount=500000&deduction=false&lang=en"))),
    );
    expect(url.pathname).toBe("/api/og.png");
    expect(url.searchParams.get("amount")).toBe("500000");
    expect(url.searchParams.get("deduction")).toBe("false");
    expect(url.searchParams.get("lang")).toBe("en");
    expect(url.searchParams.get("v")).toBe("2026");
  });
});
