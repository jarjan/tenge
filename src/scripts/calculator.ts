export interface TaxConstants {
  taxYear: number;
  mrp: number; // АЕК / МРП (Месячный расчетный показатель)
  mzp: number; // ЕТЖ / МЗП (Минимальная заработная плата)
  standardDeductionMrpCount: number; // Базовый вычет, МРП в месяц

  // Employee
  opvRate: number;
  opvMaxMzp: number;
  vosmsRate: number;
  vosmsMaxMzp: number;
  ipnRate: number;
  ipnHighRate: number; // Прогрессивная ставка ИПН
  ipnHighThresholdMrpYear: number; // Порог прогрессивной ставки, МРП в год

  // Employer
  soRate: number;
  soMinMzp: number;
  soMaxMzp: number;
  oosmsRate: number;
  oosmsMaxMzp: number;
  opvrRate: number;
  opvrMaxMzp: number;
  snRate: number;
  snMinBaseMrp: number;
}

/**
 * Payroll rules under the Tax Code of the RK effective 1 January 2026.
 */
export const TAX_RULES_2026: TaxConstants = {
  taxYear: 2026,
  mrp: 4325,
  mzp: 85000,
  standardDeductionMrpCount: 30,

  opvRate: 0.1,
  opvMaxMzp: 50,
  vosmsRate: 0.02,
  vosmsMaxMzp: 20,
  ipnRate: 0.1,
  ipnHighRate: 0.15,
  ipnHighThresholdMrpYear: 8500,

  soRate: 0.05,
  soMinMzp: 1,
  soMaxMzp: 7,
  oosmsRate: 0.03,
  oosmsMaxMzp: 40,
  opvrRate: 0.035,
  opvrMaxMzp: 50,
  snRate: 0.06,
  snMinBaseMrp: 14,
};

export const DEFAULT_CONSTANTS: TaxConstants = TAX_RULES_2026;

/** Minimum accepted salary input (1 МЗП) */
export const MIN_AMOUNT = DEFAULT_CONSTANTS.mzp;

/** Upper bound for salary input, keeps math and layout sane */
export const MAX_AMOUNT = 1_000_000_000;

/**
 * Clamps a raw salary amount into the supported [MIN_AMOUNT, MAX_AMOUNT] range.
 */
export function clampAmount(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return MIN_AMOUNT;
  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, Math.round(value)));
}

export interface ExchangeRates {
  usd: number; // KZT per 1 USD
  eur: number; // KZT per 1 EUR
  isLive?: boolean;
  updatedAt?: string;
}

// Offline fallback, approximate market rates as of September 2026
export const DEFAULT_RATES: ExchangeRates = {
  usd: 445,
  eur: 505,
  isLive: false,
};

const RATES_CACHE_KEY = "tenge_rates_cache";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours cache

/**
 * Fetch real-time exchange rates for KZT (USD & EUR)
 */
export async function fetchLiveExchangeRates(): Promise<ExchangeRates> {
  if (typeof window === "undefined") return DEFAULT_RATES;

  // 1. Try Cache
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return {
          usd: parsed.usd,
          eur: parsed.eur,
          isLive: true,
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {
    // Ignore cache parse error
  }

  // 2. Fetch fresh rates with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.KZT) {
        const kztPerUsd = Math.round(data.rates.KZT * 100) / 100;
        const kztPerEur = data.rates.EUR
          ? Math.round((data.rates.KZT / data.rates.EUR) * 100) / 100
          : DEFAULT_RATES.eur;

        const liveRates: ExchangeRates = {
          usd: kztPerUsd,
          eur: kztPerEur,
          isLive: true,
          updatedAt: new Date().toISOString(),
        };

        // Store to cache
        try {
          localStorage.setItem(
            RATES_CACHE_KEY,
            JSON.stringify({
              ...liveRates,
              timestamp: Date.now(),
            }),
          );
        } catch (e) {}

        return liveRates;
      }
    }
  } catch (err) {
    // Fallback on network failure
  }

  // Fallback to cache even if older than TTL
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.usd && parsed.eur) {
        return {
          usd: parsed.usd,
          eur: parsed.eur,
          isLive: false,
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {}

  return DEFAULT_RATES;
}

export interface CalculationOptions {
  useStandardDeduction?: boolean; // Базовый вычет 30 МРП
  constants?: TaxConstants;
}

export interface SalaryBreakdown {
  grossSalary: number; // Оклад / Лауазымдық жалақы
  netSalary: number; // На руки / Қолға алатын жалақы

  // Employee deductions (Жұмыскердің ұсталымдары)
  opv: number; // ОПВ / МЗЖ
  vosms: number; // ВОСМС / МӘМСЖ
  ipn: number; // ИПН / ЖКН
  totalEmployeeDeductions: number; // Барлық ұсталымдар

  // Tax basis details
  taxBase: number;
  standardDeduction: number;
  ipnHighRateApplied: boolean; // Прогрессивная ставка ИПН применена

  // Employer contributions (Жұмыс берушінің шығындары)
  so: number; // СО / ӘА
  oosms: number; // ООСМС / МӘМСА
  opvr: number; // ОПВР / ЖМЗВ
  sn: number; // СН / ӘС
  totalEmployerTaxes: number; // Барлық салықтар мен аударымдар
  totalEmployerCost: number; // Барлық шығын (Gross + Employer Taxes)

  // Percentages relative to Gross
  netPercentage: number;
  taxPercentage: number;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;
const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * Monthly taxable income above which the progressive ИПН rate applies.
 * The Tax Code sets the threshold per year; a flat monthly salary crosses it
 * at 1/12 of the annual amount.
 */
export function ipnMonthlyThreshold(c: TaxConstants = DEFAULT_CONSTANTS): number {
  return (c.ipnHighThresholdMrpYear * c.mrp) / 12;
}

/**
 * Calculate full salary and taxes given GROSS salary (Оклад / До вычетов)
 */
export function calculateFromGross(
  grossAmount: number,
  options: CalculationOptions = {},
): SalaryBreakdown {
  const c = options.constants ?? DEFAULT_CONSTANTS;
  const useDeduction = options.useStandardDeduction ?? true;

  const gross = Math.max(0, Number(grossAmount) || 0);
  const hasIncome = gross > 0;

  // 1. ОПВ (МЗЖ), max 50 МЗП
  const opv = Math.min(gross, c.opvMaxMzp * c.mzp) * c.opvRate;

  // 2. ВОСМС (МӘМСЖ), max 20 МЗП
  const vosms = Math.min(gross, c.vosmsMaxMzp * c.mzp) * c.vosmsRate;

  // 3. Базовый вычет 30 МРП
  const standardDeduction = useDeduction ? c.standardDeductionMrpCount * c.mrp : 0;

  // 4. ИПН (ЖКН): 10% до порога, 15% с превышения
  const taxBase = Math.max(0, gross - opv - vosms - standardDeduction);
  const threshold = ipnMonthlyThreshold(c);
  const ipn =
    Math.min(taxBase, threshold) * c.ipnRate + Math.max(0, taxBase - threshold) * c.ipnHighRate;

  const totalEmployeeDeductions = opv + vosms + ipn;
  const netSalary = Math.max(0, gross - totalEmployeeDeductions);

  // 5. Расходы работодателя
  // СО (ӘА): (Оклад − ОПВ), база от 1 до 7 МЗП
  const so = hasIncome
    ? clamp(gross - opv, c.soMinMzp * c.mzp, c.soMaxMzp * c.mzp) * c.soRate
    : 0;

  // ООСМС (МӘМСА), max 40 МЗП
  const oosms = Math.min(gross, c.oosmsMaxMzp * c.mzp) * c.oosmsRate;

  // ОПВР (ЖМЗВ), max 50 МЗП
  const opvr = Math.min(gross, c.opvrMaxMzp * c.mzp) * c.opvrRate;

  // СН (ӘС): (Оклад − ОПВ − ВОСМС) × 6%, без уменьшения на СО, база не ниже 14 МРП
  const sn = hasIncome
    ? Math.max(gross - opv - vosms, c.snMinBaseMrp * c.mrp) * c.snRate
    : 0;

  const totalEmployerTaxes = so + oosms + opvr + sn;
  const totalEmployerCost = gross + totalEmployerTaxes;

  const netPercentage = hasIncome ? (netSalary / gross) * 100 : 100;
  const taxPercentage = hasIncome ? (totalEmployeeDeductions / gross) * 100 : 0;

  return {
    grossSalary: round2(gross),
    netSalary: round2(netSalary),
    opv: round2(opv),
    vosms: round2(vosms),
    ipn: round2(ipn),
    totalEmployeeDeductions: round2(totalEmployeeDeductions),
    taxBase: round2(taxBase),
    standardDeduction: round2(standardDeduction),
    ipnHighRateApplied: taxBase > threshold,
    so: round2(so),
    oosms: round2(oosms),
    opvr: round2(opvr),
    sn: round2(sn),
    totalEmployerTaxes: round2(totalEmployerTaxes),
    totalEmployerCost: round2(totalEmployerCost),
    netPercentage: Math.round(netPercentage * 10) / 10,
    taxPercentage: Math.round(taxPercentage * 10) / 10,
  };
}

/**
 * Calculate full salary and taxes given NET salary (На руки / Қолға алатын)
 */
export function calculateFromNet(
  netAmount: number,
  options: CalculationOptions = {},
): SalaryBreakdown {
  const net = Math.max(0, Number(netAmount) || 0);
  if (net === 0 || !Number.isFinite(net)) {
    return calculateFromGross(0, options);
  }

  let low = net;
  let high = net * 2.5;
  
  while (calculateFromGross(high, options).netSalary < net) {
    high *= 2;
  }

  for (let i = 0; i < 70; i++) {
    const mid = (low + high) / 2;
    const currentNet = calculateFromGross(mid, options).netSalary;
    if (Math.abs(currentNet - net) < 0.0001) {
      low = mid;
      high = mid;
      break;
    }
    if (currentNet < net) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return calculateFromGross((low + high) / 2, options);
}

/**
 * Formats a plain number with locale-specific thousands separators
 */
export function formatNumber(amount: number, locale: "kk" | "ru" | "en" = "kk"): string {
  return Math.round(amount).toLocaleString(locale === "en" ? "en-US" : "ru-RU");
}

/**
 * Formats currency amount in KZT
 */
export function formatCurrency(
  amount: number,
  locale: "kk" | "ru" | "en" = "kk",
  showSymbol: boolean = true,
): string {
  const formatted = formatNumber(amount, locale);
  return showSymbol ? `${formatted} ₸` : formatted;
}

/**
 * Formats a rate (0.035) as a percentage string ("3.5%")
 */
export function formatRate(rate: number): string {
  return `${Math.round(rate * 1000) / 10}%`;
}

/**
 * Converts KZT to USD and formats as currency
 */
export function formatUsd(
  kztAmount: number,
  rate: number = DEFAULT_RATES.usd,
): string {
  if (!kztAmount || rate <= 0) return "$0";
  const usd = Math.round(kztAmount / rate);
  return `$${usd.toLocaleString("en-US")}`;
}

/**
 * Converts KZT to EUR and formats as currency
 */
export function formatEur(
  kztAmount: number,
  rate: number = DEFAULT_RATES.eur,
): string {
  if (!kztAmount || rate <= 0) return "€0";
  const eur = Math.round(kztAmount / rate);
  return `€${eur.toLocaleString("en-US")}`;
}

/**
 * Returns formatted dual USD / EUR string: e.g. "≈ $700 · €642"
 */
export function formatUsdEur(
  kztAmount: number,
  rates: ExchangeRates = DEFAULT_RATES,
): string {
  if (!kztAmount) return "≈ $0 · €0";
  return `≈ ${formatUsd(kztAmount, rates.usd)} · ${formatEur(kztAmount, rates.eur)}`;
}
