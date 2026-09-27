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
import { translations } from "../../scripts/i18n";
import { parseCalcParams } from "../../scripts/params";

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
    path.resolve(process.cwd(), "public/fonts"),
    path.resolve("public/fonts"),
    path.resolve(process.cwd(), "dist/fonts"),
  ];

  for (const dir of possibleDirs) {
    try {
      const robotoBold = path.join(dir, "Roboto-Bold.ttf");

      if (fs.existsSync(robotoBold)) {
        cachedFontFiles = [
          robotoBold,
          path.join(dir, "Roboto-Medium.ttf"),
          path.join(dir, "Roboto-Regular.ttf"),
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
  // 1. Extract params (same parsing as the page itself)
  const { amount, mode, locale: lang, useDeduction } = parseCalcParams(url.searchParams);

  // 2. Tax Calculations
  const breakdown =
    mode === "net"
      ? calculateFromNet(amount, { useStandardDeduction: useDeduction })
      : calculateFromGross(amount, { useStandardDeduction: useDeduction });

  const t = translations[lang];
  const rates = DEFAULT_RATES;

  // Localized string helpers
  const monthSuffix = t.og.perMonth;
  const yearSuffix = t.og.perYear;
  const yearlyNetDesc = t.og.yearlyNetDesc;
  const yearlyGrossDesc = t.og.yearlyGrossDesc;
  const deductionBadgeText = useDeduction ? t.og.deductionBadge : t.og.noDeductionBadge;

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
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" style="background:#121314; font-family: Roboto, sans-serif;">
  <rect width="1200" height="630" fill="#121314"/>

  <!-- Top Header Section -->
  <g transform="translate(90, 38)">
    <rect x="0" y="0" width="52" height="52" rx="8" fill="#f2c230"/>
    <text x="26" y="36" fill="#17191b" font-size="28" font-weight="bold" text-anchor="middle" font-family="Roboto">₸</text>
    
    <text x="68" y="26" fill="#ededea" font-size="25" font-weight="bold" letter-spacing="-0.5px">${escapeXml(t.header.title)}</text>
    <text x="68" y="46" fill="#a8aaa6" font-size="13" font-weight="normal">${escapeXml(t.header.subtitle)}</text>
    
    
    <text x="1020" y="30" fill="#a8aaa6" font-size="15" font-weight="500" text-anchor="end">tenge.work</text>
  </g>

  <!-- Main Card -->
  <g transform="translate(90, 108)">
    <rect x="0" y="0" width="1020" height="485" rx="12" fill="#1a1b1d" stroke="#2a2c2f" stroke-width="1"/>

    <!-- Input Bar Summary -->
    <g transform="translate(35, 20)">
      <rect x="0" y="0" width="950" height="50" rx="8" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
      
      <rect x="8" y="8" width="175" height="34" rx="5" fill="#26282a"/>
      <text x="95" y="30" fill="#ededea" font-size="13" font-weight="bold" text-anchor="middle">${escapeXml(mode === "net" ? t.calculator.netMode : t.calculator.grossMode)}</text>
      
      <!-- Flowing label and value to prevent overlapping in any language -->
      <text x="200" y="32">
        <tspan fill="#a8aaa6" font-size="13" font-weight="500">${escapeXml(mode === "net" ? t.calculator.monthlyNet : t.calculator.monthlyGross)}: </tspan>
        <tspan fill="#ededea" font-size="18" font-weight="bold" font-family="Roboto"> ${escapeXml(formatCurrency(amount, lang))}</tspan>
      </text>

      <rect x="770" y="9" width="170" height="32" rx="5" fill="none" stroke="#3a3d40" stroke-width="1"/>
      <text x="855" y="30" fill="#a8aaa6" font-size="12" font-weight="500" text-anchor="middle">${escapeXml(deductionBadgeText)}</text>
    </g>

    <!-- Side-by-Side Result Cards with Prominent Yearly Figures -->
    <g transform="translate(35, 88)">
      <!-- Net Card -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="460" height="240" rx="8" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
        
        <text x="24" y="32" fill="#a8aaa6" font-size="13" font-weight="500">${escapeXml(t.calculator.monthlyNet)}:</text>
        
        <text x="24" y="68" fill="#3cc0d8" font-size="30" font-weight="bold" font-family="Roboto">${escapeXml(mNetFormatted)}</text>
        <text x="24" y="90" fill="#7a7c79" font-size="13" font-weight="500" font-family="Roboto">≈ ${escapeXml(mNetFx)} ${monthSuffix}</text>
        
        <!-- Yearly Box Highlight -->
        <g transform="translate(18, 110)">
          <rect x="0" y="0" width="424" height="110" rx="6" fill="#1a1b1d" stroke="#2a2c2f" stroke-width="1"/>
          <text x="16" y="28" fill="#3cc0d8" font-size="13" font-weight="500">${escapeXml(t.calculator.yearlyNet)}</text>
          <text x="16" y="68" fill="#ededea" font-size="30" font-weight="bold" font-family="Roboto">${escapeXml(yNetFormatted)}</text>
          <text x="408" y="66" fill="#3cc0d8" font-size="14" font-weight="bold" text-anchor="end" font-family="Roboto">≈ ${escapeXml(yNetFx)}</text>
          <text x="16" y="94" fill="#7a7c79" font-size="12" font-weight="500">${escapeXml(yearlyNetDesc)}</text>
        </g>
      </g>

      <!-- Gross Card -->
      <g transform="translate(490, 0)">
        <rect x="0" y="0" width="460" height="240" rx="8" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
        
        <text x="24" y="32" fill="#a8aaa6" font-size="13" font-weight="500">${escapeXml(t.calculator.monthlyGross)}:</text>
        
        <text x="24" y="68" fill="#ededea" font-size="30" font-weight="bold" font-family="Roboto">${escapeXml(mGrossFormatted)}</text>
        <text x="24" y="90" fill="#7a7c79" font-size="13" font-weight="500" font-family="Roboto">≈ ${escapeXml(mGrossFx)} ${monthSuffix}</text>
        
        <!-- Yearly Box Highlight -->
        <g transform="translate(18, 110)">
          <rect x="0" y="0" width="424" height="110" rx="6" fill="#1a1b1d" stroke="#2a2c2f" stroke-width="1"/>
          <text x="16" y="28" fill="#ededea" font-size="13" font-weight="500">${escapeXml(t.calculator.yearlyGross)}</text>
          <text x="16" y="68" fill="#ededea" font-size="30" font-weight="bold" font-family="Roboto">${escapeXml(yGrossFormatted)}</text>
          <text x="408" y="66" fill="#ededea" font-size="14" font-weight="bold" text-anchor="end" font-family="Roboto">≈ ${escapeXml(yGrossFx)}</text>
          <text x="16" y="94" fill="#7a7c79" font-size="12" font-weight="500">${escapeXml(yearlyGrossDesc)}</text>
        </g>
      </g>
    </g>

    <!-- Distribution Track & Breakdown -->
    <g transform="translate(35, 345)">
      <text x="0" y="18" fill="#ededea" font-size="12" font-weight="bold">${escapeXml(t.calculator.distributionTitle)}</text>
      <text x="950" y="18" fill="#a8aaa6" font-size="12" font-weight="bold" text-anchor="end" font-family="Roboto">${escapeXml(mGrossFormatted)} ${monthSuffix} · ${escapeXml(yGrossFormatted)} ${yearSuffix}</text>
      
      <!-- Track -->
      <g transform="translate(0, 26)">
        
        <rect x="2" y="2" width="${wNet}" height="10" rx="4" fill="#3cc0d8"/>
        <rect x="${xOpv}" y="2" width="${wOpv}" height="10" rx="3" fill="#8d9094"/>
        <rect x="${xVosms}" y="2" width="${wVosms}" height="10" rx="2" fill="#62656a"/>
        <rect x="${xIpn}" y="2" width="${wIpn}" height="10" rx="3" fill="#45484c"/>
      </g>

      <!-- Legend Badges with Monthly & Yearly values -->
      <g transform="translate(0, 52)">
        <!-- Net -->
        <rect x="0" y="0" width="226" height="42" rx="6" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
        <circle cx="18" cy="21" r="4" fill="#3cc0d8"/>
        <text x="30" y="18" fill="#ededea" font-size="11" font-weight="bold">${escapeXml(t.calculator.netSalary)}</text>
        <text x="30" y="34" fill="#a8aaa6" font-size="11" font-weight="500" font-family="Roboto">${escapeXml(yNetShort)} ${yearSuffix}</text>
        <text x="214" y="26" fill="#ededea" font-size="12" font-weight="bold" text-anchor="end" font-family="Roboto">${pctNetStr}</text>

        <!-- OPV -->
        <g transform="translate(241, 0)">
          <rect x="0" y="0" width="226" height="42" rx="6" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
          <circle cx="18" cy="21" r="4" fill="#8d9094"/>
          <text x="30" y="18" fill="#ededea" font-size="11" font-weight="bold">${escapeXml(t.calculator.opv)}</text>
          <text x="30" y="34" fill="#a8aaa6" font-size="11" font-weight="500" font-family="Roboto">${escapeXml(yOpvShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#ededea" font-size="12" font-weight="bold" text-anchor="end" font-family="Roboto">${pctOpvStr}</text>
        </g>

        <!-- VOSMS -->
        <g transform="translate(482, 0)">
          <rect x="0" y="0" width="226" height="42" rx="6" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
          <circle cx="18" cy="21" r="4" fill="#62656a"/>
          <text x="30" y="18" fill="#ededea" font-size="11" font-weight="bold">${escapeXml(t.calculator.vosms)}</text>
          <text x="30" y="34" fill="#a8aaa6" font-size="11" font-weight="500" font-family="Roboto">${escapeXml(yVosmsShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#ededea" font-size="12" font-weight="bold" text-anchor="end" font-family="Roboto">${pctVosmsStr}</text>
        </g>

        <!-- IPN -->
        <g transform="translate(723, 0)">
          <rect x="0" y="0" width="226" height="42" rx="6" fill="#151617" stroke="#2a2c2f" stroke-width="1"/>
          <circle cx="18" cy="21" r="4" fill="#45484c"/>
          <text x="30" y="18" fill="#ededea" font-size="11" font-weight="bold">${escapeXml(t.calculator.ipn)}</text>
          <text x="30" y="34" fill="#a8aaa6" font-size="11" font-weight="500" font-family="Roboto">${escapeXml(yIpnShort)} ${yearSuffix}</text>
          <text x="214" y="26" fill="#ededea" font-size="12" font-weight="bold" text-anchor="end" font-family="Roboto">${pctIpnStr}</text>
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
      
    },
  });

  const pngData = resvg.render().asPng();

  return new Response(new Uint8Array(pngData), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // The page links images with a tax-year version param, so a moderate TTL is enough
      "Cache-Control": "public, max-age=86400, s-maxage=2592000",
    },
  });
};
