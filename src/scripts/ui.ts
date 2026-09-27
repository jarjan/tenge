import {
  calculateFromGross,
  calculateFromNet,
  fetchLiveExchangeRates,
  formatCurrency,
  formatNumber,
  formatUsdEur,
  formatUsd,
  formatEur,
  DEFAULT_RATES,
  MAX_AMOUNT,
  MIN_AMOUNT,
  type ExchangeRates,
  type SalaryBreakdown,
} from "./calculator";
import {
  DEFAULT_LOCALE,
  getLocale,
  isSupportedLocale,
  setLocale,
  translations,
  type SupportedLocale,
} from "./i18n";
import { DEFAULT_AMOUNT, parseCalcParams, type CalcMode } from "./params";

export interface AppState {
  mode: CalcMode;
  amount: number;
  useDeduction: boolean;
  locale: SupportedLocale;
  theme: "dark" | "light";
  rates: ExchangeRates;
}

let state: AppState = {
  mode: "net",
  amount: DEFAULT_AMOUNT,
  useDeduction: true,
  locale: DEFAULT_LOCALE,
  theme: "dark",
  rates: DEFAULT_RATES,
};

const numberLocale = (locale: SupportedLocale): string => (locale === "en" ? "en-US" : "ru-RU");

/**
 * Shows a toast message
 */
function showToast(message: string, isError = false): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = isError ? "toast toast-error" : "toast";
  toast.innerHTML = isError
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const text = document.createElement("span");
  text.textContent = message;
  toast.appendChild(text);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

/**
 * Initializes state from URL params and localStorage
 */
function loadStateFromUrl(): void {
  if (typeof window === "undefined") return;

  const params = parseCalcParams(new URLSearchParams(window.location.search));
  state.mode = params.mode;
  state.amount = params.amount;
  state.useDeduction = params.useDeduction;
  state.locale = getLocale();

  let savedTheme: string | null = null;
  try {
    savedTheme = localStorage.getItem("tenge_theme");
  } catch {
    // Storage unavailable
  }
  if (savedTheme === "light" || savedTheme === "dark") {
    state.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    state.theme = "light";
  }
}

/**
 * Sync URL params
 */
function updateUrlParams(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("mode", state.mode);
  url.searchParams.set("amount", state.amount.toString());
  url.searchParams.set("lang", state.locale);
  if (!state.useDeduction) {
    url.searchParams.set("deduction", "false");
  } else {
    url.searchParams.delete("deduction");
  }

  window.history.replaceState({}, "", url.toString());
}

/**
 * Formats the salary input with thousands separators while keeping the caret
 * after the same digit the user was editing.
 */
function formatInputInPlace(input: HTMLInputElement, value: number): void {
  const caret = input.selectionStart ?? input.value.length;
  const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, "").length;
  const formatted = value > 0 ? value.toLocaleString(numberLocale(state.locale)) : "";
  input.value = formatted;

  let pos = 0;
  let seen = 0;
  while (pos < formatted.length && seen < digitsBeforeCaret) {
    if (/\d/.test(formatted[pos])) seen++;
    pos++;
  }
  input.setSelectionRange(pos, pos);
}

function calculate(): SalaryBreakdown {
  const options = { useStandardDeduction: state.useDeduction };
  return state.mode === "net"
    ? calculateFromNet(state.amount, options)
    : calculateFromGross(state.amount, options);
}

/**
 * Recalculates and updates the entire UI
 */
export function render(): void {
  const t = translations[state.locale];

  // 1. Calculate breakdown
  const breakdown = calculate();

  // 2. Update Input elements
  const inputEl = document.getElementById("salary-input") as HTMLInputElement | null;
  if (inputEl && document.activeElement !== inputEl) {
    inputEl.value = state.amount > 0 ? state.amount.toLocaleString(numberLocale(state.locale)) : "";
  }

  const inputHelpEl = document.getElementById("input-help-text");
  if (inputHelpEl) {
    inputHelpEl.textContent = state.mode === "net" ? t.calculator.netInputHelp : t.calculator.grossInputHelp;
  }

  // 3. Update Mode Pills
  const netModeBtn = document.getElementById("mode-btn-net");
  const grossModeBtn = document.getElementById("mode-btn-gross");
  if (netModeBtn) {
    netModeBtn.classList.toggle("active", state.mode === "net");
    netModeBtn.setAttribute("aria-checked", String(state.mode === "net"));
  }
  if (grossModeBtn) {
    grossModeBtn.classList.toggle("active", state.mode === "gross");
    grossModeBtn.setAttribute("aria-checked", String(state.mode === "gross"));
  }

  // 4. Update Preset Chips
  document.querySelectorAll<HTMLButtonElement>(".preset-chip").forEach((chip) => {
    const val = Number(chip.dataset.value);
    chip.classList.toggle("active", val === state.amount);
    if (!chip.dataset.i18n) chip.textContent = formatCurrency(val, state.locale);
  });

  // 5. Update Deduction toggle
  const deductionCheckbox = document.getElementById("deduction-toggle") as HTMLInputElement | null;
  if (deductionCheckbox) {
    deductionCheckbox.checked = state.useDeduction;
  }

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  // 7. Update Top Summary Cards (Monthly & Yearly + USD/EUR)
  // Monthly Net
  setText("val-monthly-net", formatCurrency(breakdown.netSalary, state.locale));
  setText("val-monthly-net-fx", formatUsdEur(breakdown.netSalary, state.rates));
  
  // Yearly Net
  setText("val-yearly-net", formatCurrency(breakdown.netSalary * 12, state.locale));
  setText("val-yearly-net-fx", formatUsdEur(breakdown.netSalary * 12, state.rates));

  // Monthly Gross
  setText("val-monthly-gross", formatCurrency(breakdown.grossSalary, state.locale));
  setText("val-monthly-gross-fx", formatUsdEur(breakdown.grossSalary, state.rates));

  // Yearly Gross
  setText("val-yearly-gross", formatCurrency(breakdown.grossSalary * 12, state.locale));
  setText("val-yearly-gross-fx", formatUsdEur(breakdown.grossSalary * 12, state.rates));

  // 8. Update Table Items (Monthly + Yearly + FX)
  const updateTableRow = (prefix: string, monthVal: number) => {
    setText(`val-m-${prefix}`, formatCurrency(monthVal, state.locale));
    setText(`val-y-${prefix}`, formatCurrency(monthVal * 12, state.locale));
    setText(`val-fx-${prefix}`, formatUsdEur(monthVal, state.rates));
  };

  updateTableRow("net", breakdown.netSalary);
  updateTableRow("gross", breakdown.grossSalary);
  updateTableRow("opv", breakdown.opv);
  updateTableRow("ipn", breakdown.ipn);
  updateTableRow("vosms", breakdown.vosms);
  updateTableRow("total-employee", breakdown.totalEmployeeDeductions);

  // Employer rows
  updateTableRow("so", breakdown.so);
  updateTableRow("oosms", breakdown.oosms);
  updateTableRow("opvr", breakdown.opvr);
  updateTableRow("sn", breakdown.sn);
  updateTableRow("total-employer-cost", breakdown.totalEmployerCost);

  // 9. Update Rates Disclaimer with exact live rate
  const ratesEl = document.getElementById("rates-disclaimer-text");
  if (ratesEl) {
    const usd = formatNumber(state.rates.usd, state.locale);
    const eur = formatNumber(state.rates.eur, state.locale);
    const liveTag = state.rates.isLive ? ` • ${t.calculator.liveTag}` : "";
    ratesEl.textContent = `1$ ≈ ${usd} ₸ · 1€ ≈ ${eur} ₸${liveTag}`;
  }

  // 10. Update Distribution Bar & Percentage Badges
  const segNet = document.getElementById("seg-net");
  const segOpv = document.getElementById("seg-opv");
  const segVosms = document.getElementById("seg-vosms");
  const segIpn = document.getElementById("seg-ipn");

  const pctNet = document.getElementById("pct-net");
  const pctOpv = document.getElementById("pct-opv");
  const pctVosms = document.getElementById("pct-vosms");
  const pctIpn = document.getElementById("pct-ipn");
  const distGrossLabel = document.getElementById("dist-gross-label");

  const grossVal = breakdown.grossSalary;
  if (grossVal > 0) {
    const netPct = (breakdown.netSalary / grossVal) * 100;
    const opvPct = (breakdown.opv / grossVal) * 100;
    const vosmsPct = (breakdown.vosms / grossVal) * 100;
    const ipnPct = (breakdown.ipn / grossVal) * 100;

    if (segNet) {
      segNet.style.width = `${netPct}%`;
      segNet.setAttribute("title", `${t.calculator.netSalary}: ${formatCurrency(breakdown.netSalary, state.locale)} (${netPct.toFixed(1)}%)`);
    }
    if (segOpv) {
      segOpv.style.width = `${opvPct}%`;
      segOpv.setAttribute("title", `${t.calculator.opv}: ${formatCurrency(breakdown.opv, state.locale)} (${opvPct.toFixed(1)}%)`);
    }
    if (segVosms) {
      segVosms.style.width = `${vosmsPct}%`;
      segVosms.setAttribute("title", `${t.calculator.vosms}: ${formatCurrency(breakdown.vosms, state.locale)} (${vosmsPct.toFixed(1)}%)`);
    }
    if (segIpn) {
      segIpn.style.width = `${ipnPct}%`;
      segIpn.setAttribute("title", `${t.calculator.ipn}: ${formatCurrency(breakdown.ipn, state.locale)} (${ipnPct.toFixed(1)}%)`);
    }

    if (pctNet) pctNet.textContent = `${netPct.toFixed(1)}%`;
    if (pctOpv) pctOpv.textContent = `${opvPct.toFixed(1)}%`;
    if (pctVosms) pctVosms.textContent = `${vosmsPct.toFixed(1)}%`;
    if (pctIpn) pctIpn.textContent = `${ipnPct.toFixed(1)}%`;
    if (distGrossLabel) distGrossLabel.textContent = `${formatCurrency(grossVal, state.locale)} (100%)`;
  } else {
    if (segNet) segNet.style.width = "100%";
    if (segOpv) segOpv.style.width = "0%";
    if (segVosms) segVosms.style.width = "0%";
    if (segIpn) segIpn.style.width = "0%";

    if (pctNet) pctNet.textContent = "100%";
    if (pctOpv) pctOpv.textContent = "0%";
    if (pctVosms) pctVosms.textContent = "0%";
    if (pctIpn) pctIpn.textContent = "0%";
    if (distGrossLabel) distGrossLabel.textContent = "0 ₸";
  }

  // 11. Update Language Switcher UI
  document.querySelectorAll<HTMLButtonElement>(".lang-btn").forEach((btn) => {
    const isActive = btn.dataset.lang === state.locale;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  // 12. Update Theme & Lang attributes
  document.documentElement.lang = state.locale;
  document.documentElement.setAttribute("data-theme", state.theme);

  // Update URL
  updateUrlParams();
}

/**
 * Updates text content of all elements with `data-i18n` attribute
 */
export function applyTranslations(): void {
  const t = translations[state.locale];
  document.title = t.meta.title;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t.meta.description);

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;

    const parts = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = t;
    for (const part of parts) {
      if (val && typeof val === "object" && part in val) {
        val = val[part];
      } else {
        val = null;
        break;
      }
    }

    if (typeof val === "string") {
      el.textContent = val;
    }
  });

  render();
}

/**
 * Writes text to the clipboard, falling back to execCommand where the async
 * Clipboard API is unavailable (insecure context, older browsers).
 */
async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  if (!ok) throw new Error("Copy command failed");
}

function copyWithToast(text: string, successMessage: string): void {
  const t = translations[state.locale];
  writeClipboard(text)
    .then(() => showToast(successMessage))
    .catch(() => showToast(t.calculator.actions.copyFailed, true));
}

/**
 * Copy calculation summary text to clipboard
 */
export function copyCalculationSummary(): void {
  const t = translations[state.locale];
  const breakdown = calculate();
  const mo = t.calculator.perMonthShort;
  const yr = t.calculator.perYearShort;

  const summaryText = `tenge.work

${t.calculator.monthlyNet}: ${formatCurrency(breakdown.netSalary, state.locale)} (${formatUsd(breakdown.netSalary, state.rates.usd)} / ${formatEur(breakdown.netSalary, state.rates.eur)})
${t.calculator.yearlyNet}: ${formatCurrency(breakdown.netSalary * 12, state.locale)} (${formatUsd(breakdown.netSalary * 12, state.rates.usd)} / ${formatEur(breakdown.netSalary * 12, state.rates.eur)})
${t.calculator.monthlyGross}: ${formatCurrency(breakdown.grossSalary, state.locale)}
${t.calculator.yearlyGross}: ${formatCurrency(breakdown.grossSalary * 12, state.locale)}

${t.calculator.opv}: ${formatCurrency(breakdown.opv, state.locale)} ${mo}
${t.calculator.vosms}: ${formatCurrency(breakdown.vosms, state.locale)} ${mo}
${t.calculator.ipn}: ${formatCurrency(breakdown.ipn, state.locale)} ${mo}
${t.calculator.totalEmployeeTaxes}: ${formatCurrency(breakdown.totalEmployeeDeductions, state.locale)} ${mo} (${formatCurrency(breakdown.totalEmployeeDeductions * 12, state.locale)} ${yr})

${window.location.href}`;

  copyWithToast(summaryText, t.calculator.actions.copied);
}

/**
 * Share URL to clipboard
 */
export function shareCurrentUrl(): void {
  const t = translations[state.locale];
  copyWithToast(window.location.href, t.calculator.actions.linkCopied);
}

/**
 * Attaches event listeners and boots app
 */
export function initApp(): void {
  loadStateFromUrl();
  applyTranslations();

  // Async fetch live rates in the background
  fetchLiveExchangeRates().then((rates) => {
    state.rates = rates;
    render();
  });

  // 1. Input Event & Minimum Salary enforcement
  const salaryInput = document.getElementById("salary-input") as HTMLInputElement | null;
  const minWarning = document.getElementById("min-salary-warning");

  if (salaryInput) {
    // Let Backspace/Delete skip over thousands separators instead of being undone by reformatting
    salaryInput.addEventListener("keydown", (e) => {
      const { selectionStart: start, selectionEnd: end, value } = salaryInput;
      if (start === null || start !== end) return;
      if (e.key === "Backspace" && start > 0 && /\D/.test(value[start - 1])) {
        salaryInput.setSelectionRange(start - 1, start - 1);
      } else if (e.key === "Delete" && start < value.length && /\D/.test(value[start])) {
        salaryInput.setSelectionRange(start + 1, start + 1);
      }
    });

    salaryInput.addEventListener("input", () => {
      const cleanVal = salaryInput.value.replace(/\D/g, "");
      const num = Math.min(MAX_AMOUNT, Number(cleanVal) || 0);
      state.amount = num;
      formatInputInPlace(salaryInput, num);

      if (num > 0 && num < MIN_AMOUNT) {
        if (minWarning) minWarning.style.display = "flex";
      } else {
        if (minWarning) minWarning.style.display = "none";
      }

      render();
    });

    salaryInput.addEventListener("blur", () => {
      if (state.amount < MIN_AMOUNT) {
        state.amount = MIN_AMOUNT;
        if (minWarning) minWarning.style.display = "none";
      }
      render();
    });
  }

  // 2. Mode Switches
  document.getElementById("mode-btn-net")?.addEventListener("click", () => {
    state.mode = "net";
    render();
  });

  document.getElementById("mode-btn-gross")?.addEventListener("click", () => {
    state.mode = "gross";
    render();
  });

  // 3. Preset Chips
  document.querySelectorAll<HTMLButtonElement>(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const val = Number(chip.dataset.value);
      if (!isNaN(val)) {
        state.amount = val;
        render();
      }
    });
  });

  // 4. Deduction Checkbox
  document.getElementById("deduction-toggle")?.addEventListener("change", (e) => {
    state.useDeduction = (e.target as HTMLInputElement).checked;
    render();
  });

  // 5. Language Switcher Buttons
  document.querySelectorAll<HTMLButtonElement>(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (isSupportedLocale(lang)) {
        state.locale = lang;
        setLocale(lang);
        applyTranslations();
        if (salaryInput && state.amount > 0) {
          salaryInput.value = state.amount.toLocaleString(numberLocale(state.locale));
        }
      }
    });
  });

  // 7. Theme Toggle Button
  document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("tenge_theme", state.theme);
    } catch {
      // Storage unavailable
    }
    document.documentElement.setAttribute("data-theme", state.theme);
  });

  // 8. Copy and Share Buttons
  document.getElementById("btn-copy-summary")?.addEventListener("click", () => {
    copyCalculationSummary();
  });

  document.getElementById("btn-share-link")?.addEventListener("click", () => {
    shareCurrentUrl();
  });

  // 9. Contextual Tax Tooltip Triggers (Hover, Focus, & Click)
  document.querySelectorAll<HTMLElement>(".tax-term-info").forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      const id = trigger.dataset.tooltipId;
      if (id) showTaxTooltip(id, trigger);
    });

    trigger.addEventListener("mouseleave", () => {
      hideTaxTooltip();
    });

    trigger.addEventListener("focusin", () => {
      const id = trigger.dataset.tooltipId;
      if (id) showTaxTooltip(id, trigger);
    });

    trigger.addEventListener("focusout", () => {
      hideTaxTooltip();
    });

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = trigger.dataset.tooltipId;
      const tooltip = document.getElementById("tax-info-popover");
      if (tooltip && tooltip.style.display !== "none" && tooltip.dataset.activeId === id) {
        hideTaxTooltip();
      } else if (id) {
        showTaxTooltip(id, trigger);
      }
    });
  });

  // Global dismiss on click outside or escape
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest(".tax-term-info") && !target?.closest("#tax-info-popover")) {
      hideTaxTooltip();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideTaxTooltip();
    }
  });
}

/**
 * Displays anchored floating tax item tooltip near trigger element
 */
export function showTaxTooltip(tooltipId: string, triggerEl: HTMLElement): void {
  const t = translations[state.locale];
  const item = t.calculator.tooltips[tooltipId as keyof typeof t.calculator.tooltips];
  if (!item) return;

  const tooltip = document.getElementById("tax-info-popover");
  const titleEl = document.getElementById("popover-title");
  const descEl = document.getElementById("popover-desc");
  const formulaEl = document.getElementById("popover-formula");

  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (formulaEl) formulaEl.textContent = item.formula;

  if (!tooltip) return;

  document
    .querySelectorAll('[aria-describedby="tax-info-popover"]')
    .forEach((el) => el.removeAttribute("aria-describedby"));
  triggerEl.setAttribute("aria-describedby", "tax-info-popover");

  tooltip.dataset.activeId = tooltipId;
  tooltip.style.display = "block";
  tooltip.setAttribute("aria-hidden", "false");

  // Dynamic positioning relative to viewport
  const rect = triggerEl.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = rect.left;
  if (left + tooltipRect.width > window.innerWidth - 16) {
    left = Math.max(16, window.innerWidth - tooltipRect.width - 16);
  }
  if (left < 16) {
    left = 16;
  }

  let top = rect.bottom + 6;
  if (top + tooltipRect.height > window.innerHeight - 16) {
    top = Math.max(16, rect.top - tooltipRect.height - 6);
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

/**
 * Hides anchored floating tax item tooltip
 */
export function hideTaxTooltip(): void {
  const tooltip = document.getElementById("tax-info-popover");
  if (tooltip) {
    tooltip.style.display = "none";
    tooltip.removeAttribute("data-active-id");
    tooltip.setAttribute("aria-hidden", "true");
  }
}
