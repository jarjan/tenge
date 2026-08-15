import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import {
  calculateFromNet,
  calculateFromGross,
  formatCurrency,
  formatUsd,
  formatEur,
  DEFAULT_RATES,
} from "../../scripts/calculator";
import { translations, type SupportedLocale } from "../../scripts/i18n";

export const prerender = false;

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

let cachedFontFiles: string[] | null = null;

function getFontFiles(): string[] {
  if (cachedFontFiles && cachedFontFiles.length > 0) {
    return cachedFontFiles;
  }

  const possibleDirs = [
    path.resolve("src/assets/fonts"),
    path.resolve(process.cwd(), "src/assets/fonts"),
    path.resolve(process.cwd(), "public/fonts"),
    path.resolve("public/fonts"),
    path.resolve(process.cwd(), "dist/fonts"),
  ];

  for (const dir of possibleDirs) {
    try {
      const robotoBold = path.join(dir, "Roboto-Bold.ttf");
      const monoBold = path.join(dir, "JetBrainsMono-Bold.ttf");

      if (fs.existsSync(robotoBold) && fs.existsSync(monoBold)) {
        cachedFontFiles = [
          robotoBold,
          path.join(dir, "Roboto-Medium.ttf"),
          path.join(dir, "Roboto-Regular.ttf"),
          monoBold,
        ].filter((f) => fs.existsSync(f));
        return cachedFontFiles;
      }
    } catch {
      // Continue to next directory
    }
  }

  return [];
}

export const GET: APIRoute = async ({ url }) => {
  const params = url.searchParams;

  // 1. Extract params
  const rawAmount = Number(params.get("amount") || params.get("salary")) || 350000;
  const amount = Math.max(85000, rawAmount);
  const mode = (params.get("mode") === "gross" ? "gross" : "net") as "net" | "gross";
  const lang = (["kk", "ru", "en"].includes(params.get("lang") || "")
    ? params.get("lang")
    : "kk") as SupportedLocale;
  const useDeduction = params.get("deduction") !== "false" && params.get("deduction") !== "0";

  // 2. Tax Calculations
  const breakdown =
    mode === "net"
      ? calculateFromNet(amount, { useStandardDeduction: useDeduction })
      : calculateFromGross(amount, { useStandardDeduction: useDeduction });

  const t = translations[lang] || translations.kk;
  const rates = DEFAULT_RATES; // 1$ ≈ 500₸, 1€ ≈ 545₸

  // Localized string helpers
  const monthSuffix = lang === "kk" ? "/ айына" : lang === "ru" ? "/ месяц" : "/ mo";
  const yearSuffix = lang === "kk" ? "/ жыл" : lang === "ru" ? "/ год" : "/ yr";

  const yearlyNetDesc =
    lang === "kk"
      ? "12 айлық таза табыс жиынтығы"
      : lang === "ru"
        ? "Сумма чистого дохода за 12 месяцев"
        : "12-month total take-home pay";

  const yearlyGrossDesc =
    lang === "kk"
      ? "Жылдық барлық келісімшарт оклады"
      : lang === "ru"
        ? "Годовой оклад по трудовому договору"
        : "Total annual contract gross salary";

  const deductionBadgeText = useDeduction
    ? lang === "kk"
      ? "14 АЕК шегерімі"
      : lang === "ru"
        ? "Вычет 14 МРП"
        : "14 MRP Relief"
    : lang === "kk"
      ? "Шегерімсіз"
      : lang === "ru"
        ? "Без вычета"
        : "No Relief";

  // Monthly & Yearly formatted numbers
  const mNetFormatted = formatCurrency(breakdown.netSalary, lang);
  const mNetFx = `${formatUsd(breakdown.netSalary, rates.usd)} · ${formatEur(breakdown.netSalary, rates.eur)}`;
  const yNetFormatted = formatCurrency(breakdown.netSalary * 12, lang);
  const yNetFx = `${formatUsd(breakdown.netSalary * 12, rates.usd)} · ${formatEur(breakdown.netSalary * 12, rates.eur)}`;

  const mGrossFormatted = formatCurrency(breakdown.grossSalary, lang);
  const mGrossFx = `${formatUsd(breakdown.grossSalary, rates.usd)} · ${formatEur(breakdown.grossSalary, rates.eur)}`;
  const yGrossFormatted = formatCurrency(breakdown.grossSalary * 12, lang);
  const yGrossFx = `${formatUsd(breakdown.grossSalary * 12, rates.usd)} · ${formatEur(breakdown.grossSalary * 12, rates.eur)}`;

  // Percentages & Bar widths
  const gross = breakdown.grossSalary || 1;
  const pctNetNum = (breakdown.netSalary / gross) * 100;
  const pctOpvNum = (breakdown.opv / gross) * 100;
  const pctVosmsNum = (breakdown.vosms / gross) * 100;
  const pctIpnNum = (breakdown.ipn / gross) * 100;

  const pctNetStr = pctNetNum.toFixed(1) + "%";
  const pctOpvStr = pctOpvNum.toFixed(1) + "%";
  const pctVosmsStr = pctVosmsNum.toFixed(1) + "%";
  const pctIpnStr = pctIpnNum.toFixed(1) + "%";

  const totalTrackWidth = 950;
  const wNet = Math.max(10, Math.round((pctNetNum / 100) * totalTrackWidth) - 4);
  const wOpv = Math.max(10, Math.round((pctOpvNum / 100) * totalTrackWidth) - 4);
  const wVosms = Math.max(10, Math.round((pctVosmsNum / 100) * totalTrackWidth) - 4);
  const wIpn = Math.max(10, Math.round((pctIpnNum / 100) * totalTrackWidth) - 4);

  const xOpv = 2 + wNet + 4;
  const xVosms = xOpv + wOpv + 4;
  const xIpn = xVosms + wVosms + 4;

  const yOpvShort = Math.round((breakdown.opv * 12) / 1000) + "K ₸";
  const yVosmsShort = Math.round((breakdown.vosms * 12) / 1000) + "K ₸";
  const yIpnShort = Math.round((breakdown.ipn * 12) / 1000) + "K ₸";
  const yNetShort = (Math.round((breakdown.netSalary * 12) / 100000) / 10).toFixed(1) + "M ₸";

  // 3. Render clean SVG
  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" style="background:#0b0f19; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#0b0f19" stop-opacity="1"/>
    </radialGradient>
    <radialGradient id="emeraldGlow" cx="15%" cy="45%" r="35%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blueGlow" cx="85%" cy="45%" r="35%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#182234" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#111827" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="netYearlyGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0.06"/>
    </linearGradient>
    <linearGradient id="grossYearlyGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0.06"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGlow)"/>
  <rect width="1200" height="630" fill="url(#emeraldGlow)"/>
  <rect width="1200" height="630" fill="url(#blueGlow)"/>

  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="500" y1="0" x2="500" y2="630"/>
    <line x1="700" y1="0" x2="700" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="1100" y1="0" x2="1100" y2="630"/>
  </g>

  <!-- Top Header Section -->
  <g transform="translate(90, 38)">
    <rect x="0" y="0" width="52" height="52" rx="13" fill="#1e293b" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1.5"/>
    <text x="26" y="36" fill="#f59e0b" font-size="28" font-weight="bold" text-anchor="middle" font-family="'JetBrains Mono', 'Roboto', sans-serif">₸</text>
    
    <text x="68" y="26" fill="#ffffff" font-size="25" font-weight="bold" letter-spacing="-0.5px">${escapeXml(t.header.title)}</text>
    <text x="68" y="46" fill="#94a3b8" font-size="13" font-weight="normal">tenge.work • ${escapeXml(t.header.subtitle)}</text>
    
    <rect x="870" y="8" width="150" height="34" rx="17" fill="#1e293b" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="1"/>
    <text x="945" y="30" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">tenge.work ↗</text>
  </g>

  <!-- Main Card -->
  <g transform="translate(90, 108)">
    <rect x="0" y="0" width="1020" height="485" rx="22" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5"/>

    <!-- Input Bar Summary -->
    <g transform="translate(35, 20)">
      <rect x="0" y="0" width="950" height="50" rx="12" fill="#0b0f19" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
      
      <rect x="8" y="8" width="175" height="34" rx="8" fill="#2563eb"/>
      <text x="95" y="30" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle">${escapeXml(mode === "net" ? t.calculator.netMode : t.calculator.grossMode)}</text>
      
      <!-- Flowing label and value to prevent overlapping in any language -->
      <text x="200" y="32">
        <tspan fill="#94a3b8" font-size="13" font-weight="500">${escapeXml(mode === "net" ? t.calculator.monthlyNet : t.calculator.monthlyGross)}: </tspan>
        <tspan fill="#f8fafc" font-size="18" font-weight="bold" font-family="'JetBrains Mono', 'Roboto', sans-serif"> ${escapeXml(formatCurrency(amount, lang))}</tspan>
      </text>

      <rect x="770" y="9" width="170" height="32" rx="16" fill="#1e293b" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>
      <text x="855" y="30" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="middle">${escapeXml(deductionBadgeText)}</text>
    </g>

    <!-- Side-by-Side Result Cards with Prominent Yearly Figures -->
    <g transform="translate(35, 88)">
      <!-- Net Card -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="460" height="240" rx="16" fill="#0f172a" stroke="#10b981" stroke-opacity="0.35" stroke-width="1.5"/>
        
        <text x="24" y="32" fill="#94a3b8" font-size="13" font-weight="500">${escapeXml(t.calculator.monthlyNet)}:</text>
        <rect x="360" y="15" width="76" height="24" rx="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.3" stroke-width="1"/>
        <text x="398" y="31" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Net</text>
        
        <text x="24" y="68" fill="#10b981" font-size="30" font-weight="bold" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(mNetFormatted)}</text>
        <text x="24" y="90" fill="#64748b" font-size="13" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">≈ ${escapeXml(mNetFx)} ${monthSuffix}</text>
        
        <!-- Yearly Box Highlight -->
        <g transform="translate(18, 110)">
          <rect x="0" y="0" width="424" height="110" rx="12" fill="url(#netYearlyGrad)" stroke="#10b981" stroke-opacity="0.45" stroke-width="1.2"/>
          <text x="16" y="28" fill="#10b981" font-size="12" font-weight="bold" letter-spacing="0.06em">${escapeXml(t.calculator.yearlyNet.toUpperCase())}:</text>
          <text x="16" y="68" fill="#ffffff" font-size="30" font-weight="bold" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yNetFormatted)}</text>
          <text x="408" y="66" fill="#10b981" font-size="14" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">≈ ${escapeXml(yNetFx)}</text>
          <text x="16" y="94" fill="#6ee7b7" font-size="12" font-weight="500">${escapeXml(yearlyNetDesc)}</text>
        </g>
      </g>

      <!-- Gross Card -->
      <g transform="translate(490, 0)">
        <rect x="0" y="0" width="460" height="240" rx="16" fill="#0f172a" stroke="#3b82f6" stroke-opacity="0.35" stroke-width="1.5"/>
        
        <text x="24" y="32" fill="#94a3b8" font-size="13" font-weight="500">${escapeXml(t.calculator.monthlyGross)}:</text>
        <rect x="355" y="15" width="81" height="24" rx="12" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-opacity="0.3" stroke-width="1"/>
        <text x="395" y="31" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">Gross</text>
        
        <text x="24" y="68" fill="#38bdf8" font-size="30" font-weight="bold" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(mGrossFormatted)}</text>
        <text x="24" y="90" fill="#64748b" font-size="13" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">≈ ${escapeXml(mGrossFx)} ${monthSuffix}</text>
        
        <!-- Yearly Box Highlight -->
        <g transform="translate(18, 110)">
          <rect x="0" y="0" width="424" height="110" rx="12" fill="url(#grossYearlyGrad)" stroke="#3b82f6" stroke-opacity="0.45" stroke-width="1.2"/>
          <text x="16" y="28" fill="#38bdf8" font-size="12" font-weight="bold" letter-spacing="0.06em">${escapeXml(t.calculator.yearlyGross.toUpperCase())}:</text>
          <text x="16" y="68" fill="#ffffff" font-size="30" font-weight="bold" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yGrossFormatted)}</text>
          <text x="408" y="66" fill="#38bdf8" font-size="14" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">≈ ${escapeXml(yGrossFx)}</text>
          <text x="16" y="94" fill="#93c5fd" font-size="12" font-weight="500">${escapeXml(yearlyGrossDesc)}</text>
        </g>
      </g>
    </g>

    <!-- Distribution Track & Breakdown -->
    <g transform="translate(35, 345)">
      <text x="0" y="18" fill="#cbd5e1" font-size="12" font-weight="bold">${escapeXml(t.calculator.distributionTitle)}</text>
      <text x="950" y="18" fill="#94a3b8" font-size="12" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(mGrossFormatted)} ${monthSuffix} · ${escapeXml(yGrossFormatted)} ${yearSuffix}</text>
      
      <!-- Track -->
      <g transform="translate(0, 26)">
        <rect x="0" y="0" width="950" height="14" rx="7" fill="#0b0f19" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
        <rect x="2" y="2" width="${wNet}" height="10" rx="4" fill="#10b981"/>
        <rect x="${xOpv}" y="2" width="${wOpv}" height="10" rx="3" fill="#3b82f6"/>
        <rect x="${xVosms}" y="2" width="${wVosms}" height="10" rx="2" fill="#06b6d4"/>
        <rect x="${xIpn}" y="2" width="${wIpn}" height="10" rx="3" fill="#f59e0b"/>
      </g>

      <!-- Legend Badges with Monthly & Yearly values -->
      <g transform="translate(0, 52)">
        <!-- Net -->
        <rect x="0" y="0" width="226" height="42" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
        <rect x="0" y="0" width="4" height="42" rx="2" fill="#10b981"/>
        <circle cx="18" cy="21" r="4" fill="#10b981"/>
        <text x="30" y="18" fill="#f8fafc" font-size="11" font-weight="bold">${escapeXml(t.calculator.netSalary)}</text>
        <text x="30" y="34" fill="#94a3b8" font-size="11" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yNetShort)} ${yearSuffix}</text>
        <text x="214" y="26" fill="#10b981" font-size="12" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">${pctNetStr}</text>

        <!-- OPV -->
        <g transform="translate(241, 0)">
          <rect x="0" y="0" width="226" height="42" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
          <rect x="0" y="0" width="4" height="42" rx="2" fill="#3b82f6"/>
          <circle cx="18" cy="21" r="4" fill="#3b82f6"/>
          <text x="30" y="18" fill="#f8fafc" font-size="11" font-weight="bold">${escapeXml(t.calculator.opv)}</text>
          <text x="30" y="34" fill="#94a3b8" font-size="11" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yOpvShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#3b82f6" font-size="12" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">${pctOpvStr}</text>
        </g>

        <!-- VOSMS -->
        <g transform="translate(482, 0)">
          <rect x="0" y="0" width="226" height="42" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
          <rect x="0" y="0" width="4" height="42" rx="2" fill="#06b6d4"/>
          <circle cx="18" cy="21" r="4" fill="#06b6d4"/>
          <text x="30" y="18" fill="#f8fafc" font-size="11" font-weight="bold">${escapeXml(t.calculator.vosms)}</text>
          <text x="30" y="34" fill="#94a3b8" font-size="11" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yVosmsShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#06b6d4" font-size="12" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">${pctVosmsStr}</text>
        </g>

        <!-- IPN -->
        <g transform="translate(723, 0)">
          <rect x="0" y="0" width="226" height="42" rx="8" fill="#0f172a" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>
          <rect x="0" y="0" width="4" height="42" rx="2" fill="#f59e0b"/>
          <circle cx="18" cy="21" r="4" fill="#f59e0b"/>
          <text x="30" y="18" fill="#f8fafc" font-size="11" font-weight="bold">${escapeXml(t.calculator.ipn)}</text>
          <text x="30" y="34" fill="#94a3b8" font-size="11" font-weight="500" font-family="'JetBrains Mono', 'Roboto', sans-serif">${escapeXml(yIpnShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#f59e0b" font-size="12" font-weight="bold" text-anchor="end" font-family="'JetBrains Mono', 'Roboto', sans-serif">${pctIpnStr}</text>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

  const fontFiles = getFontFiles();
  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: true,
      fontFiles: fontFiles.length > 0 ? fontFiles : undefined,
      defaultFontFamily: "Roboto",
      sansSerifFamily: "Roboto",
      monospaceFamily: "JetBrains Mono",
    },
  });

  const pngData = resvg.render().asPng();

  return new Response(new Uint8Array(pngData), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, s-maxage=31536000, immutable",
    },
  });
};
