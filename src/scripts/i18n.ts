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
    formulaLabel: string;

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

    tooltips: {
      net: { title: string; desc: string; formula: string };
      gross: { title: string; desc: string; formula: string };
      opv: { title: string; desc: string; formula: string };
      vosms: { title: string; desc: string; formula: string };
      ipn: { title: string; desc: string; formula: string };
      totalEmployee: { title: string; desc: string; formula: string };
      so: { title: string; desc: string; formula: string };
      oosms: { title: string; desc: string; formula: string };
      opvr: { title: string; desc: string; formula: string };
      sn: { title: string; desc: string; formula: string };
      totalEmployer: { title: string; desc: string; formula: string };
    };

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
      title: "Теңге.work",
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
      formulaLabel: "Есептеу формуласы:",

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

      tooltips: {
        net: {
          title: "Қолға алатын жалақы (Net)",
          desc: "Барлық салықтар мен міндетті жарналар ұсталғаннан кейін қызметкердің банк шотына түсетін таза табыс.",
          formula: "Оклад − (МЗЖ + МӘМСЖ + ЖКН)",
        },
        gross: {
          title: "Еңбек шартындағы оклад (Gross)",
          desc: "Салықтар мен зейнетақы аударымдарына дейінгі келісімшартта бекітілген жалақы сомасы.",
          formula: "Қолға ақша + барлық ұсталымдар",
        },
        opv: {
          title: "Міндетті зейнетақы жарнасы (МЗЖ / ОПВ)",
          desc: "БЖЗҚ-ға (ЕНПФ) қызметкердің жеке зейнетақы шотына аударылатын 10% жарна. Ең жоғарғы шегі — 50 ЕТЖ (425 000 ₸).",
          formula: "Оклад × 10% (макс 425 000 ₸)",
        },
        vosms: {
          title: "МӘМС жарнасы (МӘМСЖ / ВОСМС)",
          desc: "Міндетті әлеуметтік медициналық сақтандыру қорына (ӘМСҚ) қызметкер жалақысынан ұсталатын 2% жарна. Ең жоғарғы шегі — 10 ЕТЖ (17 000 ₸).",
          formula: "Оклад × 2% (макс 17 000 ₸)",
        },
        ipn: {
          title: "Жеке табыс салығы (ЖКН / ИПН)",
          desc: "Мемлекеттік бюджетке төленетін 10% табыс салығы. Салық салынатын базадан МЗЖ, МӘМСЖ және 14 АЕК стандартты шегерім (55 048 ₸) алынып тасталады. Жалақы ≤ 25 АЕК болса 90% жеңілдік қолданылады.",
          formula: "(Оклад − МЗЖ − МӘМСЖ − 14 АЕК) × 10%",
        },
        totalEmployee: {
          title: "Жұмыскердің барлық ұсталымдары",
          desc: "Қызметкер окладынан ұсталатын зейнетақы (10%), медициналық сақтандыру (2%) және табыс салығының (10%) жиынтығы.",
          formula: "МЗЖ + МӘМСЖ + ЖКН",
        },
        so: {
          title: "Әлеуметтік аударымдар (ӘА / СО)",
          desc: "Мемлекеттік әлеуметтік сақтандыру қорына (МӘСҚ) жұмыс берушінің өз қаражаты есебінен төленетін 3.5% төлемі. База: 1 ЕТЖ-ден 7 ЕТЖ-ге дейін.",
          formula: "(Оклад − МЗЖ) × 3.5%",
        },
        oosms: {
          title: "Жұмыс берушінің МӘМС аударымы (МӘМСА / ООСМС)",
          desc: "Медициналық сақтандыру қорына жұмыс беруші төлейтін 3% аударым. Қызметкердің жалақысынан ұсталмайды.",
          formula: "Оклад × 3% (макс 25 500 ₸)",
        },
        opvr: {
          title: "Жұмыс берушінің зейнетақы жарнасы (ЖМЗВ / ОПВР)",
          desc: "1975 жылдан кейін туған жұмыскерлер үшін жұмыс берушінің өз есебінен төленетін 1.5% зейнетақы жарнасы.",
          formula: "Оклад × 1.5%",
        },
        sn: {
          title: "Әлеуметтік салық (ӘС / СН)",
          desc: "Жұмыс беруші бюджетке төлейтін 9.5% салық (ОУР). Одан әлеуметтік аударымдар (ӘА) сомасы шегеріледі.",
          formula: "(Оклад − МЗЖ − МӘМСЖ) × 9.5% − ӘА",
        },
        totalEmployer: {
          title: "Компанияның барлық шығыны",
          desc: "Қызметкерге төленетін оклад пен жұмыс берушінің барлық қосымша салықтары мен аударымдарының жиынтығы.",
          formula: "Оклад + ӘА + МӘМСА + ЖМЗВ + ӘС",
        },
      },

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
      title: "Теңге.work",
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
      formulaLabel: "Формула расчета:",

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

      tooltips: {
        net: {
          title: "Зарплата на руки (Net)",
          desc: "Сумма, которую сотрудник фактически получает на банковскую карту после вычета всех обязательных налогов и взносов.",
          formula: "Оклад − (ОПВ + ВОСМС + ИПН)",
        },
        gross: {
          title: "Оклад по договору (Gross)",
          desc: "Сумма заработной платы, зафиксированная в трудовом договоре до удержания обязательных налогов и взносов.",
          formula: "На руки + все удержания",
        },
        opv: {
          title: "Обязательные пенсионные взносы (ОПВ)",
          desc: "10% от оклада, направляемые на индивидуальный пенсионный счет в ЕНПФ. Максимальный предел — 50 МЗП (425 000 ₸).",
          formula: "Оклад × 10% (макс 425 000 ₸)",
        },
        vosms: {
          title: "Взносы на медстрахование (ВОСМС)",
          desc: "2% от оклада в Фонд обязательного медстрахования (ФСМС), удерживаемые из дохода работника. Максимальный предел — 10 МЗП (17 000 ₸).",
          formula: "Оклад × 2% (макс 17 000 ₸)",
        },
        ipn: {
          title: "Индивидуальный подоходный налог (ИПН)",
          desc: "10% налог на доходы физлиц в бюджет. Рассчитывается от базы после вычета ОПВ, ВОСМС и 14 МРП (55 048 ₸). При окладе ≤ 25 МРП действует скидка 90%.",
          formula: "(Оклад − ОПВ − ВОСМС − 14 МРП) × 10%",
        },
        totalEmployee: {
          title: "Все удержания с работника",
          desc: "Общая сумма, удерживаемая из оклада сотрудника (ОПВ + ВОСМС + ИПН).",
          formula: "ОПВ + ВОСМС + ИПН",
        },
        so: {
          title: "Социальные отчисления (СО)",
          desc: "3.5% выплачивается работодателем за свой счет в Государственный фонд соцстрахования (ГФСС). База: от 1 до 7 МЗП.",
          formula: "(Оклад − ОПВ) × 3.5%",
        },
        oosms: {
          title: "Отчисления на медстрахование (ООСМС)",
          desc: "3% от оклада за счет средств работодателя в Фонд медстрахования. Не удерживается из зарплаты сотрудника.",
          formula: "Оклад × 3% (макс 25 500 ₸)",
        },
        opvr: {
          title: "ОПВ работодателя (ОПВР)",
          desc: "1.5% от оклада за счет работодателя для сотрудников, рожденных с 1975 года и позже.",
          formula: "Оклад × 1.5%",
        },
        sn: {
          title: "Социальный налог (СН)",
          desc: "9.5% налог работодателя (ОУР) за вычетом суммы социальных отчислений (СО).",
          formula: "(Оклад − ОПВ − ВОСМС) × 9.5% − СО",
        },
        totalEmployer: {
          title: "Полные расходы компании",
          desc: "Сумма оклада сотрудника и всех налогов/отчислений, которые работодатель платит сверх оклада.",
          formula: "Оклад + СО + ООСМС + ОПВР + СН",
        },
      },

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
      title: "Tenge.work",
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
      formulaLabel: "Calculation formula:",

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

      tooltips: {
        net: {
          title: "Take-Home Pay (Net)",
          desc: "The net amount deposited into the employee's bank account after all mandatory employee taxes and contributions.",
          formula: "Gross − (OPV + VOSMS + IPN)",
        },
        gross: {
          title: "Contract Gross Salary",
          desc: "The stated base monthly salary specified in the employment agreement before any deductions.",
          formula: "Net + all employee deductions",
        },
        opv: {
          title: "Mandatory Pension Contribution (OPV)",
          desc: "10% pension contribution deposited to the employee's personal UAPF retirement account. Capped at 50 minimum wages (425,000 ₸).",
          formula: "Gross × 10% (cap 425,000 ₸)",
        },
        vosms: {
          title: "Employee Health Insurance (VOSMS)",
          desc: "2% mandatory health insurance contribution paid by the employee to FSMS. Capped at 10 minimum wages (17,000 ₸).",
          formula: "Gross × 2% (cap 17,000 ₸)",
        },
        ipn: {
          title: "Personal Income Tax (IPN)",
          desc: "10% state personal income tax. Calculated on taxable base after subtracting OPV, VOSMS, and the 14 MRP relief (55,048 ₸). 90% discount applies if salary ≤ 25 MRP.",
          formula: "(Gross − OPV − VOSMS − 14 MRP) × 10%",
        },
        totalEmployee: {
          title: "Total Employee Deductions",
          desc: "Combined sum deducted from gross salary (OPV + VOSMS + IPN).",
          formula: "OPV + VOSMS + IPN",
        },
        so: {
          title: "Social Contributions (SO)",
          desc: "3.5% social contribution paid directly by the employer to GFSS. Base: min 1 MZP, max 7 MZP.",
          formula: "(Gross − OPV) × 3.5%",
        },
        oosms: {
          title: "Employer Health Contribution (OOSMS)",
          desc: "3% healthcare contribution paid directly by the employer. Not deducted from employee salary.",
          formula: "Gross × 3% (cap 25,500 ₸)",
        },
        opvr: {
          title: "Employer Pension Contribution (OPVR)",
          desc: "1.5% supplementary pension contribution paid by the employer for employees born in 1975 or later.",
          formula: "Gross × 1.5%",
        },
        sn: {
          title: "Social Tax (SN)",
          desc: "9.5% employer state tax (General regime) reduced by the Social Contribution (SO) amount.",
          formula: "(Gross − OPV − VOSMS) × 9.5% − SO",
        },
        totalEmployer: {
          title: "Total Company Payroll Cost",
          desc: "The complete cost to the employer: Gross salary + all employer-paid payroll taxes.",
          formula: "Gross + SO + OOSMS + OPVR + SN",
        },
      },

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
