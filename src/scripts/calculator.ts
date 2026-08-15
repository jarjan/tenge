export interface TaxConstants {
  mrp: number; // АЕК / МРП (Месячный расчетный показатель)
  mzp: number; // ЕТЖ / МЗП (Минимальная заработная плата)
  standardDeductionMrpCount: number; // 14 МРП
  opvRate: number; // 10%
  vosmsRate: number; // 2%
  ipnRate: number; // 10%
  soRate: number; // 3.5%
  oosmsRate: number; // 3%
  opvrRate: number; // 1.5%
  snRate: number; // 9.5%
}

export const DEFAULT_CONSTANTS: TaxConstants = {
  mrp: 3932, // 2025/2026 Kazakhstan MRP / АЕК
  mzp: 85000, // 2025/2026 Kazakhstan MZP / ЕТЖ
  standardDeductionMrpCount: 14,
  opvRate: 0.1,
  vosmsRate: 0.02,
  ipnRate: 0.1,
  soRate: 0.035,
  oosmsRate: 0.03,
  opvrRate: 0.015,
  snRate: 0.095,
};

export interface ExchangeRates {
  usd: number; // KZT per 1 USD
  eur: number; // KZT per 1 EUR
  isLive?: boolean;
  updatedAt?: string;
}

export const DEFAULT_RATES: ExchangeRates = {
  usd: 500, // Fallback rate
  eur: 545, // Fallback rate
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
          isLive: true,
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {}

  return DEFAULT_RATES;
}

export interface CalculationOptions {
  useStandardDeduction?: boolean; // Стандартный вычет 14 МРП
  constants?: TaxConstants;
}

export interface SalaryBreakdown {
  grossSalary: number; // Оклад / Лауазымдық жалақы
  netSalary: number; // На руки / Қолға алатын жалақы
  
  // Employee deductions (Жұмыскердің ұсталымдары)
  opv: number; // ОПВ / МЗЖ (10%)
  vosms: number; // ВОСМС / МӘМСЖ (2%)
  ipn: number; // ИПН / ЖКН (10%)
  totalEmployeeDeductions: number; // Барлық ұсталымдар
  
  // Tax basis details
  taxBase: number;
  standardDeduction: number;
  hasSmallSalaryCorrection: boolean; // 90% жеңілдік (<= 25 АЕК)
  correction90: number;

  // Employer contributions (Жұмыс берушінің шығындары)
  so: number; // СО / ӘА (3.5%)
  oosms: number; // ООСМС / МӘМСА (3%)
  opvr: number; // ОПВР / ЖМЗВ (1.5%)
  sn: number; // СН / ӘС (9.5% - СО)
  totalEmployerTaxes: number; // Барлық салықтар мен аударымдар
  totalEmployerCost: number; // Барлық шығын (Gross + Employer Taxes)

  // Percentages relative to Gross
  netPercentage: number;
  taxPercentage: number;
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

  // 1. ОПВ (МЗЖ) - 10%, max 50 МЗП
  const maxOpvBase = 50 * c.mzp;
  const opv = Math.min(gross, maxOpvBase) * c.opvRate;

  // 2. ВОСМС (МӘМСЖ) - 2%, max 10 МЗП
  const maxVosmsBase = 10 * c.mzp;
  const vosms = Math.min(gross, maxVosmsBase) * c.vosmsRate;

  // 3. Стандартный вычет 14 МРП (14 АЕК)
  const standardDeduction = useDeduction ? c.standardDeductionMrpCount * c.mrp : 0;

  // 4. ИПН (ЖКН)
  // Налогооблагаемая база = Оклад - ОПВ - ВОСМС - Стандартный вычет
  let taxBase = gross - opv - vosms - standardDeduction;
  if (taxBase < 0) taxBase = 0;

  // 90% корректировка для зарплат <= 25 МРП (ст. 341 п. 1 пп. 49 НК РК)
  const isSmallSalary = gross > 0 && gross <= 25 * c.mrp;
  let ipn = 0;
  let correction90 = 0;

  if (taxBase > 0) {
    const rawIpn = taxBase * c.ipnRate;
    if (isSmallSalary) {
      correction90 = rawIpn * 0.9;
      ipn = rawIpn - correction90;
    } else {
      ipn = rawIpn;
    }
  }

  const totalEmployeeDeductions = opv + vosms + ipn;
  const netSalary = Math.max(0, gross - totalEmployeeDeductions);

  // 5. Расходы работодателя
  // СО (ӘА) - 3.5%, база: Gross - OPV (от 1 МЗП до 7 МЗП)
  let soBase = gross - opv;
  if (gross > 0) {
    if (soBase < c.mzp) soBase = c.mzp;
    if (soBase > 7 * c.mzp) soBase = 7 * c.mzp;
  } else {
    soBase = 0;
  }
  const so = gross > 0 ? soBase * c.soRate : 0;

  // ООСМС (МӘМСА) - 3%, max 10 МЗП
  const oosms = Math.min(gross, 10 * c.mzp) * c.oosmsRate;

  // ОПВР (ЖМЗВ) - 1.5%, max 50 МЗП (с 2024 г.)
  const opvr = Math.min(gross, 50 * c.mzp) * c.opvrRate;

  // СН (ӘС) - 9.5% от (Gross - OPV - VOSMS) за минусом СО (минимум 1 МЗП при наличии дохода)
  let snBase = gross - opv - vosms;
  if (gross > 0) {
    if (snBase < c.mzp) snBase = c.mzp;
  } else {
    snBase = 0;
  }
  const rawSn = snBase * c.snRate;
  const sn = Math.max(0, rawSn - so);

  const totalEmployerTaxes = so + oosms + opvr + sn;
  const totalEmployerCost = gross + totalEmployerTaxes;

  const netPercentage = gross > 0 ? (netSalary / gross) * 100 : 100;
  const taxPercentage = gross > 0 ? (totalEmployeeDeductions / gross) * 100 : 0;

  return {
    grossSalary: Math.round(gross * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
    opv: Math.round(opv * 100) / 100,
    vosms: Math.round(vosms * 100) / 100,
    ipn: Math.round(ipn * 100) / 100,
    totalEmployeeDeductions: Math.round(totalEmployeeDeductions * 100) / 100,
    taxBase: Math.round(taxBase * 100) / 100,
    standardDeduction: Math.round(standardDeduction * 100) / 100,
    hasSmallSalaryCorrection: isSmallSalary,
    correction90: Math.round(correction90 * 100) / 100,
    so: Math.round(so * 100) / 100,
    oosms: Math.round(oosms * 100) / 100,
    opvr: Math.round(opvr * 100) / 100,
    sn: Math.round(sn * 100) / 100,
    totalEmployerTaxes: Math.round(totalEmployerTaxes * 100) / 100,
    totalEmployerCost: Math.round(totalEmployerCost * 100) / 100,
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
  if (net === 0) {
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
 * Formats currency amount in KZT
 */
export function formatCurrency(
  amount: number,
  locale: "kk" | "ru" | "en" = "kk",
  showSymbol: boolean = true,
): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toLocaleString(locale === "en" ? "en-US" : "ru-RU");
  return showSymbol ? `${formatted} ₸` : formatted;
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
