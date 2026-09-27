import { DEFAULT_CONSTANTS, clampAmount } from "./calculator";
import { DEFAULT_LOCALE, isSupportedLocale, type SupportedLocale } from "./i18n";

export type CalcMode = "net" | "gross";

export const DEFAULT_AMOUNT = 350000;

export interface CalcParams {
  mode: CalcMode;
  amount: number;
  locale: SupportedLocale;
  useDeduction: boolean;
  /** Whether `lang` was explicitly present in the URL */
  hasExplicitLocale: boolean;
}

/**
 * Parses calculator state from URL search params. Shared by the client app,
 * the server-rendered page and the OG image endpoint so they always agree.
 */
export function parseCalcParams(params: URLSearchParams): CalcParams {
  const rawAmount = Number(params.get("amount") ?? params.get("salary"));
  const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? clampAmount(rawAmount) : DEFAULT_AMOUNT;

  const lang = params.get("lang");
  const deduction = params.get("deduction");

  return {
    mode: params.get("mode") === "gross" ? "gross" : "net",
    amount,
    locale: isSupportedLocale(lang) ? lang : DEFAULT_LOCALE,
    useDeduction: deduction !== "false" && deduction !== "0",
    hasExplicitLocale: isSupportedLocale(lang),
  };
}

/**
 * Builds the dynamic Open Graph image URL for the given state. The tax year is
 * included so CDN-cached images are invalidated when the rules change.
 */
export function buildOgImageUrl(site: string | URL, p: CalcParams): string {
  const url = new URL("/api/og.png", site);
  url.searchParams.set("amount", String(p.amount));
  url.searchParams.set("mode", p.mode);
  url.searchParams.set("lang", p.locale);
  if (!p.useDeduction) url.searchParams.set("deduction", "false");
  url.searchParams.set("v", String(DEFAULT_CONSTANTS.taxYear));
  return url.toString();
}
