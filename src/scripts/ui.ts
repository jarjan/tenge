import {
  calculateFromGross,
  calculateFromNet,
  fetchLiveExchangeRates,
  formatCurrency,
  formatUsdEur,
  formatUsd,
  formatEur,
  DEFAULT_RATES,
  type ExchangeRates,
  type SalaryBreakdown,
} from "./calculator";
import {
  DEFAULT_LOCALE,
  getLocale,
  setLocale,
  translations,
  type SupportedLocale,
} from "./i18n";

export interface AppState {
  mode: "net" | "gross";
  amount: number;
  useDeduction: boolean;
  locale: SupportedLocale;
  theme: "dark" | "light";
  rates: ExchangeRates;
}

let state: AppState = {
  mode: "net",
  amount: 350000,
  useDeduction: true,
  locale: DEFAULT_LOCALE,
  theme: "dark",
  rates: DEFAULT_RATES,
};

/**
 * Shows a toast message
 */
function showToast(message: string): void {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

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

  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get("mode");
  if (modeParam === "net" || modeParam === "gross") {
    state.mode = modeParam;
  }

  const amountParam = params.get("amount") || params.get("salary");
  if (amountParam && !isNaN(Number(amountParam))) {
    const val = Number(amountParam);
    if (val > 0) state.amount = Math.max(85000, val);
  }

  const deductionParam = params.get("deduction");
  if (deductionParam !== null) {
    state.useDeduction = deductionParam !== "false" && deductionParam !== "0";
  }

  state.locale = getLocale();

  const savedTheme = localStorage.getItem("tenge_theme");
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
 * Recalculates and updates the entire UI
 */
export function render(): void {
  const t = translations[state.locale];

  // 1. Calculate breakdown
  const breakdown: SalaryBreakdown = state.mode === "net"
    ? calculateFromNet(state.amount, { useStandardDeduction: state.useDeduction })
    : calculateFromGross(state.amount, { useStandardDeduction: state.useDeduction });

  // 2. Update Input elements
  const inputEl = document.getElementById("salary-input") as HTMLInputElement | null;
  if (inputEl && document.activeElement !== inputEl) {
    inputEl.value = state.amount > 0 ? state.amount.toLocaleString(state.locale === "en" ? "en-US" : "ru-RU") : "";
  }

  const inputHelpEl = document.getElementById("input-help-text");
  if (inputHelpEl) {
    inputHelpEl.textContent = state.mode === "net" ? t.calculator.netInputHelp : t.calculator.grossInputHelp;
  }

  // 3. Update Mode Pills
  const netModeBtn = document.getElementById("mode-btn-net");
  const grossModeBtn = document.getElementById("mode-btn-gross");
  if (netModeBtn) netModeBtn.classList.toggle("active", state.mode === "net");
  if (grossModeBtn) grossModeBtn.classList.toggle("active", state.mode === "gross");

  // 4. Update Preset Chips
  document.querySelectorAll<HTMLButtonElement>(".preset-chip").forEach((chip) => {
    const val = Number(chip.dataset.value);
    chip.classList.toggle("active", val === state.amount);
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
    const usdRounded = Math.round(state.rates.usd);
    const eurRounded = Math.round(state.rates.eur);
    const liveTag = state.rates.isLive ? " • Live" : "";
    ratesEl.textContent = `1$ ≈ ${usdRounded} ₸ · 1€ ≈ ${eurRounded} ₸${liveTag}`;
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
    btn.classList.toggle("active", btn.dataset.lang === state.locale);
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
 * Copy calculation summary text to clipboard
 */
export function copyCalculationSummary(): void {
  const t = translations[state.locale];
  const breakdown = state.mode === "net"
    ? calculateFromNet(state.amount, { useStandardDeduction: state.useDeduction })
    : calculateFromGross(state.amount, { useStandardDeduction: state.useDeduction });

  const summaryText = `💼 tenge.work
═════════════════════════════════
💵 ${t.calculator.monthlyNet}: ${formatCurrency(breakdown.netSalary, state.locale)} (${formatUsd(breakdown.netSalary, state.rates.usd)} / ${formatEur(breakdown.netSalary, state.rates.eur)})
🗓️ ${t.calculator.yearlyNet}: ${formatCurrency(breakdown.netSalary * 12, state.locale)} (${formatUsd(breakdown.netSalary * 12, state.rates.usd)} / ${formatEur(breakdown.netSalary * 12, state.rates.eur)})
─────────────────────────────────
📄 ${t.calculator.monthlyGross}: ${formatCurrency(breakdown.grossSalary, state.locale)}
🗓️ ${t.calculator.yearlyGross}: ${formatCurrency(breakdown.grossSalary * 12, state.locale)}

📉 ${t.calculator.colItem}:
• ${t.calculator.opv}: ${formatCurrency(breakdown.opv, state.locale)} / mo
• ${t.calculator.vosms}: ${formatCurrency(breakdown.vosms, state.locale)} / mo
• ${t.calculator.ipn}: ${formatCurrency(breakdown.ipn, state.locale)} / mo
• ${t.calculator.totalEmployeeTaxes}: ${formatCurrency(breakdown.totalEmployeeDeductions, state.locale)} / mo (${formatCurrency(breakdown.totalEmployeeDeductions * 12, state.locale)} / yr)
═════════════════════════════════
🔗 ${window.location.href}`;

  navigator.clipboard.writeText(summaryText).then(() => {
    showToast(t.calculator.actions.copied);
  });
}

/**
 * Share URL to clipboard
 */
export function shareCurrentUrl(): void {
  const t = translations[state.locale];
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast(t.calculator.actions.linkCopied);
  });
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
    salaryInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const cleanVal = target.value.replace(/\D/g, "");
      const num = Number(cleanVal) || 0;
      state.amount = num;

      if (num > 0 && num < 85000) {
        if (minWarning) minWarning.style.display = "flex";
      } else {
        if (minWarning) minWarning.style.display = "none";
      }

      render();
    });

    salaryInput.addEventListener("blur", () => {
      if (state.amount < 85000) {
        state.amount = 85000;
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
      const lang = btn.dataset.lang as SupportedLocale;
      if (lang && (lang === "kk" || lang === "ru" || lang === "en")) {
        state.locale = lang;
        setLocale(lang);
        applyTranslations();
      }
    });
  });

  // 7. Theme Toggle Button
  document.getElementById("theme-toggle-btn")?.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("tenge_theme", state.theme);
    document.documentElement.setAttribute("data-theme", state.theme);
  });

  // 8. Copy and Share Buttons
  document.getElementById("btn-copy-summary")?.addEventListener("click", () => {
    copyCalculationSummary();
  });

  document.getElementById("btn-share-link")?.addEventListener("click", () => {
    shareCurrentUrl();
  });

  // 9. Tax Info Tooltip Popover Triggers
  document.querySelectorAll<HTMLButtonElement>(".info-trigger-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.tooltipId;
      if (id) showTaxPopover(id);
    });
  });

  document.getElementById("popover-close-btn")?.addEventListener("click", () => {
    hideTaxPopover();
  });

  const popoverModal = document.getElementById("tax-info-popover");
  popoverModal?.addEventListener("click", (e) => {
    if (e.target === popoverModal) {
      hideTaxPopover();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideTaxPopover();
    }
  });
}

/**
 * Displays tax line item information popover
 */
export function showTaxPopover(tooltipId: string): void {
  const t = translations[state.locale];
  const item = t.calculator.tooltips[tooltipId as keyof typeof t.calculator.tooltips];
  if (!item) return;

  const popover = document.getElementById("tax-info-popover");
  const titleEl = document.getElementById("popover-title");
  const descEl = document.getElementById("popover-desc");
  const formulaEl = document.getElementById("popover-formula");

  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;
  if (formulaEl) formulaEl.textContent = item.formula;

  if (popover) {
    popover.style.display = "flex";
    popover.setAttribute("aria-hidden", "false");
  }
}

/**
 * Hides tax line item information popover
 */
export function hideTaxPopover(): void {
  const popover = document.getElementById("tax-info-popover");
  if (popover) {
    popover.style.display = "none";
    popover.setAttribute("aria-hidden", "true");
  }
}
