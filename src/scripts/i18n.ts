export type SupportedLocale = "kk" | "ru" | "en";

export interface LocaleContent {
  meta: {
    title: string;
    description: string;
  };
  header: {
    title: string;
    subtitle: string;
    themeToggle: string;
    langSelect: string;
  };
  calculator: {
    directionLabel: string;
    netMode: string;
    grossMode: string;
    netInputHelp: string;
    grossInputHelp: string;
    inputPlaceholder: string;
    salaryPresetsTitle: string;
    mzpPresetLabel: string;
    minSalaryWarning: string;
    
    deductionLabel: string;
    deductionHint: string;

    monthlyNet: string;
    yearlyNet: string;
    monthlyGross: string;
    yearlyGross: string;
    distributionTitle: string;
    
    colItem: string;
    colMonth: string;
    colYear: string;
    colFx: string;

    toggleEmployer: string;
    employerSectionTitle: string;

    // Line items
    netSalary: string;
    grossSalary: string;
    opv: string;
    opvFull: string;
    opvDesc: string;
    vosms: string;
    vosmsFull: string;
    vosmsDesc: string;
    ipn: string;
    ipnFull: string;
    ipnDesc: string;
    standardDeduction: string;
    totalEmployeeTaxes: string;

    so: string;
    oosms: string;
    opvr: string;
    sn: string;
    totalEmployerTaxes: string;
    totalEmployerCost: string;

    actions: {
      copySummary: string;
      copied: string;
      shareLink: string;
      linkCopied: string;
    };

    ratesDisclaimer: string;
  };
  footer: {
    madeBy: string;
    disclaimer: string;
    sourceCode: string;
  };
}

export const translations: Record<SupportedLocale, LocaleContent> = {
  kk: {
    meta: {
      title: "Теңге 💼 – Қазақстандағы жалақы калькуляторы",
      description: "Қазақстандағы жалақыңызды (айлық және жылдық), салықтарды (МЗЖ, ЖКН, МӘМС) және USD / EUR бағамын жылдам әрі оңай есептеңіз.",
    },
    header: {
      title: "Теңге",
      subtitle: "Қазақстандағы жалақы калькуляторы",
      themeToggle: "Тақырыпты ауыстыру",
      langSelect: "Тілді таңдау",
    },
    calculator: {
      directionLabel: "Есептеу түрі:",
      netMode: "Қолға алатын (Net)",
      grossMode: "Оклад (Gross)",
      netInputHelp: "Қолға алатын айлық жалақыңызды енгізіңіз:",
      grossInputHelp: "Окладыңызды (салыққа дейінгі) енгізіңіз:",
      inputPlaceholder: "Мысалы: 350 000",
      salaryPresetsTitle: "Жиі сомалар:",
      mzpPresetLabel: "ЕТЖ (85 мың)",
      minSalaryWarning: "Ең төменгі жалақыдан (85 000 ₸) кем емес",

      deductionLabel: "14 АЕК стандартты шегерім",
      deductionHint: "Салықты 5 505 ₸-ге азайтады (55 048 ₸ жеңілдік базасы)",

      monthlyNet: "Айлық таза табыс (Net)",
      yearlyNet: "Жылдық таза табыс",
      monthlyGross: "Айлық оклад (Gross)",
      yearlyGross: "Жылдық оклад",
      distributionTitle: "Окладтың бөлінуі (100%):",

      colItem: "Төлем түрі",
      colMonth: "Айына (₸)",
      colYear: "Жылына (₸)",
      colFx: "USD / EUR",

      toggleEmployer: "Жұмыс берушінің шығындарын көрсету",
      employerSectionTitle: "Жұмыс берушінің қосымша салықтары",

      netSalary: "Қолға (Net)",
      grossSalary: "Оклад (Gross)",
      opv: "МЗЖ (ОПВ 10%)",
      opvFull: "Міндетті зейнетақы жарнасы",
      opvDesc: "Окладтың 10%-ы (макс 425 000 ₸)",
      vosms: "МӘМСЖ (ВОСМС 2%)",
      vosmsFull: "Міндетті медсақтандыру жарнасы",
      vosmsDesc: "Окладтың 2%-ы (макс 17 000 ₸)",
      ipn: "ЖКН (ИПН 10%)",
      ipnFull: "Жеке табыс салығы",
      ipnDesc: "Салық салынатын базаның 10%-ы",
      standardDeduction: "14 АЕК шегерімі",
      totalEmployeeTaxes: "Барлық ұсталымдар",

      so: "ӘА (СО 3.5%)",
      oosms: "МӘМСА (ООСМС 3%)",
      opvr: "ЖМЗВ (ОПВР 1.5%)",
      sn: "ӘС (СН)",
      totalEmployerTaxes: "Жұмыс беруші салықтары",
      totalEmployerCost: "Компанияның барлық шығыны",

      actions: {
        copySummary: "Есепті көшіру",
        copied: "Көшірілді!",
        shareLink: "Сілтемені бөлісу",
        linkCopied: "Сілтеме көшірілді!",
      },

      ratesDisclaimer: "Шамамен: 1$ ≈ 500 ₸ · 1€ ≈ 545 ₸",
    },
    footer: {
      madeBy: "Жоба авторы",
      disclaimer: "Калькулятор жуықталған есепті көрсетеді. Нақты мәліметтер үшін өз есепшіңізбен кеңесіңіз.",
      sourceCode: "GitHub",
    },
  },

  ru: {
    meta: {
      title: "Теңге 💼 – Калькулятор зарплаты в Казахстане",
      description: "Быстрый и удобный расчет зарплаты на руки и оклада (в месяц и за год), налогов (ОПВ, ИПН, ВОСМС) и эквивалентов в USD / EUR в Казахстане.",
    },
    header: {
      title: "Теңге",
      subtitle: "Калькулятор зарплаты в Казахстане",
      themeToggle: "Сменить тему",
      langSelect: "Выбор языка",
    },
    calculator: {
      directionLabel: "Направление расчета:",
      netMode: "На руки (Net)",
      grossMode: "Оклад (Gross)",
      netInputHelp: "Введите сумму зарплаты на руки в месяц:",
      grossInputHelp: "Введите сумму оклада до вычета налогов:",
      inputPlaceholder: "Например: 350 000",
      salaryPresetsTitle: "Частые суммы:",
      mzpPresetLabel: "МЗП (85 тыс.)",
      minSalaryWarning: "Не менее минимальной зарплаты (85 000 ₸)",

      deductionLabel: "Стандартный налоговый вычет 14 МРП",
      deductionHint: "Уменьшает налог на 5 505 ₸ в месяц (база вычета 55 048 ₸)",

      monthlyNet: "Зарплата на руки (в месяц)",
      yearlyNet: "Зарплата на руки (за год)",
      monthlyGross: "Оклад до вычетов (в месяц)",
      yearlyGross: "Оклад до вычетов (за год)",
      distributionTitle: "Распределение оклада (100%):",

      colItem: "Наименование",
      colMonth: "В месяц (₸)",
      colYear: "В год (₸)",
      colFx: "USD / EUR",

      toggleEmployer: "Показать налоги работодателя",
      employerSectionTitle: "Налоги и отчисления работодателя",

      netSalary: "На руки (Net)",
      grossSalary: "Оклад (Gross)",
      opv: "ОПВ (10%)",
      opvFull: "Обязательные пенсионные взносы",
      opvDesc: "10% от оклада (максимум до 425 000 ₸)",
      vosms: "ВОСМС (2%)",
      vosmsFull: "Взносы на медстрахование",
      vosmsDesc: "2% от оклада (максимум до 17 000 ₸)",
      ipn: "ИПН (10%)",
      ipnFull: "Индивидуальный подоходный налог",
      ipnDesc: "10% от базы налогообложения",
      standardDeduction: "Вычет 14 МРП",
      totalEmployeeTaxes: "Всего удержаний",

      so: "СО (3.5%)",
      oosms: "ООСМС (3%)",
      opvr: "ОПВР (1.5%)",
      sn: "СН",
      totalEmployerTaxes: "Налоги работодателя",
      totalEmployerCost: "Полные расходы компании",

      actions: {
        copySummary: "Скопировать расчет",
        copied: "Скопировано!",
        shareLink: "Поделиться ссылкой",
        linkCopied: "Ссылка скопирована!",
      },

      ratesDisclaimer: "Примерный курс: 1$ ≈ 500 ₸ · 1€ ≈ 545 ₸",
    },
    footer: {
      madeBy: "Создатель проекта",
      disclaimer: "Калькулятор выполняет предварительный расчет. Для точных данных консультируйтесь с бухгалтером.",
      sourceCode: "GitHub",
    },
  },

  en: {
    meta: {
      title: "Tenge 💼 – Kazakhstan Salary & Tax Calculator",
      description: "Quick & simple salary calculator for Kazakhstan: monthly and yearly take-home pay, gross salary, taxes (OPV, IPN, VOSMS), and USD/EUR conversions.",
    },
    header: {
      title: "Tenge",
      subtitle: "Kazakhstan Salary Calculator",
      themeToggle: "Toggle Theme",
      langSelect: "Select Language",
    },
    calculator: {
      directionLabel: "Calculation Mode:",
      netMode: "Take-Home (Net)",
      grossMode: "Gross Salary",
      netInputHelp: "Enter monthly take-home salary:",
      grossInputHelp: "Enter monthly gross contract salary:",
      inputPlaceholder: "E.g.: 350,000",
      salaryPresetsTitle: "Popular amounts:",
      mzpPresetLabel: "Min Wage (85k)",
      minSalaryWarning: "Minimum salary in Kazakhstan is 85,000 ₸",

      deductionLabel: "14 MRP standard personal tax relief",
      deductionHint: "Reduces income tax by 5,505 ₸/mo (55,048 ₸ relief base)",

      monthlyNet: "Take-Home Pay (Monthly)",
      yearlyNet: "Take-Home Pay (Yearly)",
      monthlyGross: "Gross Salary (Monthly)",
      yearlyGross: "Gross Salary (Yearly)",
      distributionTitle: "Gross Salary Breakdown (100%):",

      colItem: "Item",
      colMonth: "Monthly (₸)",
      colYear: "Yearly (₸)",
      colFx: "USD / EUR",

      toggleEmployer: "Show employer payroll taxes",
      employerSectionTitle: "Employer Contributions & Taxes",

      netSalary: "Take-Home (Net)",
      grossSalary: "Gross Salary",
      opv: "OPV (Pension)",
      opvFull: "Mandatory Pension Contribution",
      opvDesc: "10% of gross (capped at 425,000 ₸)",
      vosms: "VOSMS (Health)",
      vosmsFull: "Health Insurance Contribution",
      vosmsDesc: "2% of gross (capped at 17,000 ₸)",
      ipn: "IPN (Income Tax)",
      ipnFull: "Personal Income Tax",
      ipnDesc: "10% of taxable base",
      standardDeduction: "14 MRP Relief",
      totalEmployeeTaxes: "Total Deductions",

      so: "SO (3.5%)",
      oosms: "OOSMS (3%)",
      opvr: "OPVR (1.5%)",
      sn: "Social Tax (SN)",
      totalEmployerTaxes: "Employer Taxes",
      totalEmployerCost: "Total Employer Expense",

      actions: {
        copySummary: "Copy Summary",
        copied: "Copied!",
        shareLink: "Share Link",
        linkCopied: "Link Copied!",
      },

      ratesDisclaimer: "Approx: $1 ≈ 500 ₸ · €1 ≈ 545 ₸",
    },
    footer: {
      madeBy: "Created by",
      disclaimer: "This calculator provides estimates. Please consult an accountant for official payroll.",
      sourceCode: "GitHub",
    },
  },
};

export const DEFAULT_LOCALE: SupportedLocale = "kk";

export function getLocale(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get("lang");
  if (paramLang && (paramLang === "kk" || paramLang === "ru" || paramLang === "en")) {
    return paramLang;
  }

  const savedLang = localStorage.getItem("tenge_locale");
  if (savedLang && (savedLang === "kk" || savedLang === "ru" || savedLang === "en")) {
    return savedLang as SupportedLocale;
  }

  return DEFAULT_LOCALE;
}

export function setLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tenge_locale", locale);
  document.documentElement.lang = locale;
}
