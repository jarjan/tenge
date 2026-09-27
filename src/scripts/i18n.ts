import {
  DEFAULT_CONSTANTS as C,
  DEFAULT_RATES,
  formatNumber,
  formatRate,
  ipnMonthlyThreshold,
} from "./calculator";

export type SupportedLocale = "kk" | "ru" | "en";

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["kk", "ru", "en"];

export function isSupportedLocale(value: unknown): value is SupportedLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

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
      copyFailed: string;
    };

    ratesDisclaimer: string;
    liveTag: string;
    perMonthShort: string;
    perYearShort: string;
  };
  og: {
    perMonth: string;
    perYear: string;
    yearlyNetDesc: string;
    yearlyGrossDesc: string;
    deductionBadge: string;
    noDeductionBadge: string;
  };
  footer: {
    madeBy: string;
    disclaimer: string;
    sourceCode: string;
  };
}

// Figures shown in copy are derived from the active tax rules so they never drift.
const mzp = C.mzp;
const deductionMrp = C.standardDeductionMrpCount;
const deductionAmount = deductionMrp * C.mrp;
const deductionSaving = deductionAmount * C.ipnRate;
const opvCap = C.opvMaxMzp * mzp * C.opvRate;
const vosmsCap = C.vosmsMaxMzp * mzp * C.vosmsRate;
const oosmsCap = C.oosmsMaxMzp * mzp * C.oosmsRate;
const opvrCap = C.opvrMaxMzp * mzp * C.opvrRate;
const ipnThreshold = ipnMonthlyThreshold(C);
const ipnHighMrp = formatNumber(C.ipnHighThresholdMrpYear, "ru");

const rate = {
  opv: formatRate(C.opvRate),
  vosms: formatRate(C.vosmsRate),
  ipn: formatRate(C.ipnRate),
  ipnHigh: formatRate(C.ipnHighRate),
  so: formatRate(C.soRate),
  oosms: formatRate(C.oosmsRate),
  opvr: formatRate(C.opvrRate),
  sn: formatRate(C.snRate),
};

const kk = (v: number) => `${formatNumber(v, "kk")} ₸`;
const ru = (v: number) => `${formatNumber(v, "ru")} ₸`;
const en = (v: number) => `${formatNumber(v, "en")} ₸`;
const usdEur = (l: SupportedLocale) =>
  `1$ ≈ ${formatNumber(DEFAULT_RATES.usd, l)} ₸ · 1€ ≈ ${formatNumber(DEFAULT_RATES.eur, l)} ₸`;

export const translations: Record<SupportedLocale, LocaleContent> = {
  kk: {
    meta: {
      title: "Теңге – Қазақстандағы жалақы калькуляторы",
      description: `Қазақстандағы жалақыңызды (айлық және жылдық), салықтарды (МЗЖ, ЖКН, МӘМС) және USD / EUR бағамын ${C.taxYear} жылғы ережелер бойынша жылдам есептеңіз.`,
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
      mzpPresetLabel: `ЕТЖ (${mzp / 1000} мың)`,
      minSalaryWarning: `Ең төменгі жалақыдан (${kk(mzp)}) кем емес`,

      deductionLabel: `${deductionMrp} АЕК базалық шегерім`,
      deductionHint: `Салықты ${kk(deductionSaving)}-ге азайтады (${kk(deductionAmount)} шегерім базасы)`,

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
      opv: `МЗЖ (ОПВ ${rate.opv})`,
      opvFull: "Міндетті зейнетақы жарнасы",
      opvDesc: `Окладтың ${rate.opv}-ы (макс ${kk(opvCap)})`,
      vosms: `МӘМСЖ (ВОСМС ${rate.vosms})`,
      vosmsFull: "Міндетті медсақтандыру жарнасы",
      vosmsDesc: `Окладтың ${rate.vosms}-ы (макс ${kk(vosmsCap)})`,
      ipn: `ЖКН (ИПН ${rate.ipn})`,
      ipnFull: "Жеке табыс салығы",
      ipnDesc: `Салық салынатын базаның ${rate.ipn}-ы (${ipnHighMrp} АЕК/жыл асса — ${rate.ipnHigh})`,
      standardDeduction: `${deductionMrp} АЕК шегерімі`,
      totalEmployeeTaxes: "Барлық ұсталымдар",

      so: `ӘА (СО ${rate.so})`,
      oosms: `МӘМСА (ООСМС ${rate.oosms})`,
      opvr: `ЖМЗВ (ОПВР ${rate.opvr})`,
      sn: `ӘС (СН ${rate.sn})`,
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
          desc: `БЖЗҚ-ға (ЕНПФ) қызметкердің жеке зейнетақы шотына аударылатын ${rate.opv} жарна. Ең жоғарғы шегі — ${C.opvMaxMzp} ЕТЖ (${kk(opvCap)}).`,
          formula: `Оклад × ${rate.opv} (макс ${kk(opvCap)})`,
        },
        vosms: {
          title: "МӘМС жарнасы (МӘМСЖ / ВОСМС)",
          desc: `Міндетті әлеуметтік медициналық сақтандыру қорына (ӘМСҚ) қызметкер жалақысынан ұсталатын ${rate.vosms} жарна. Ең жоғарғы шегі — ${C.vosmsMaxMzp} ЕТЖ (${kk(vosmsCap)}).`,
          formula: `Оклад × ${rate.vosms} (макс ${kk(vosmsCap)})`,
        },
        ipn: {
          title: "Жеке табыс салығы (ЖКН / ИПН)",
          desc: `Мемлекеттік бюджетке төленетін ${rate.ipn} табыс салығы. Салық салынатын базадан МЗЖ, МӘМСЖ және ${deductionMrp} АЕК базалық шегерім (${kk(deductionAmount)}) алынып тасталады. Жылдық табыстың ${ipnHighMrp} АЕК-тен асатын бөлігіне (айына ≈ ${kk(ipnThreshold)}) ${rate.ipnHigh} мөлшерлеме қолданылады.`,
          formula: `(Оклад − МЗЖ − МӘМСЖ − ${deductionMrp} АЕК) × ${rate.ipn}`,
        },
        totalEmployee: {
          title: "Жұмыскердің барлық ұсталымдары",
          desc: `Қызметкер окладынан ұсталатын зейнетақы (${rate.opv}), медициналық сақтандыру (${rate.vosms}) және табыс салығының (${rate.ipn}) жиынтығы.`,
          formula: "МЗЖ + МӘМСЖ + ЖКН",
        },
        so: {
          title: "Әлеуметтік аударымдар (ӘА / СО)",
          desc: `Мемлекеттік әлеуметтік сақтандыру қорына (МӘСҚ) жұмыс берушінің өз қаражаты есебінен төленетін ${rate.so} төлемі. База: ${C.soMinMzp} ЕТЖ-ден ${C.soMaxMzp} ЕТЖ-ге дейін.`,
          formula: `(Оклад − МЗЖ) × ${rate.so}`,
        },
        oosms: {
          title: "Жұмыс берушінің МӘМС аударымы (МӘМСА / ООСМС)",
          desc: `Медициналық сақтандыру қорына жұмыс беруші төлейтін ${rate.oosms} аударым. Қызметкердің жалақысынан ұсталмайды. Ең жоғарғы шегі — ${C.oosmsMaxMzp} ЕТЖ.`,
          formula: `Оклад × ${rate.oosms} (макс ${kk(oosmsCap)})`,
        },
        opvr: {
          title: "Жұмыс берушінің зейнетақы жарнасы (ЖМЗВ / ОПВР)",
          desc: `1975 жылдан кейін туған жұмыскерлер үшін жұмыс берушінің өз есебінен төленетін ${rate.opvr} зейнетақы жарнасы. Ең жоғарғы шегі — ${C.opvrMaxMzp} ЕТЖ.`,
          formula: `Оклад × ${rate.opvr} (макс ${kk(opvrCap)})`,
        },
        sn: {
          title: "Әлеуметтік салық (ӘС / СН)",
          desc: `Жұмыс беруші бюджетке төлейтін ${rate.sn} салық (ЖБР). ${C.taxYear} жылдан бастап әлеуметтік аударымдар (ӘА) сомасы шегерілмейді.`,
          formula: `(Оклад − МЗЖ − МӘМСЖ) × ${rate.sn}`,
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
        copyFailed: "Көшіру мүмкін болмады",
      },

      ratesDisclaimer: `Шамамен: ${usdEur("kk")}`,
      liveTag: "Өзекті бағам",
      perMonthShort: "/ ай",
      perYearShort: "/ жыл",
    },
    og: {
      perMonth: "/ айына",
      perYear: "/ жыл",
      yearlyNetDesc: "12 айлық таза табыс жиынтығы",
      yearlyGrossDesc: "Жылдық барлық келісімшарт оклады",
      deductionBadge: `${deductionMrp} АЕК шегерімі`,
      noDeductionBadge: "Шегерімсіз",
    },
    footer: {
      madeBy: "Жоба авторы",
      disclaimer: "Калькулятор жуықталған есепті көрсетеді. Нақты мәліметтер үшін өз есепшіңізбен кеңесіңіз.",
      sourceCode: "GitHub",
    },
  },

  ru: {
    meta: {
      title: "Теңге – Калькулятор зарплаты в Казахстане",
      description: `Быстрый расчет зарплаты на руки и оклада (в месяц и за год), налогов (ОПВ, ИПН, ВОСМС) и эквивалентов в USD / EUR по правилам ${C.taxYear} года.`,
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
      mzpPresetLabel: `МЗП (${mzp / 1000} тыс.)`,
      minSalaryWarning: `Не менее минимальной зарплаты (${ru(mzp)})`,

      deductionLabel: `Базовый налоговый вычет ${deductionMrp} МРП`,
      deductionHint: `Уменьшает налог на ${ru(deductionSaving)} в месяц (база вычета ${ru(deductionAmount)})`,

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
      opv: `ОПВ (${rate.opv})`,
      opvFull: "Обязательные пенсионные взносы",
      opvDesc: `${rate.opv} от оклада (максимум ${ru(opvCap)})`,
      vosms: `ВОСМС (${rate.vosms})`,
      vosmsFull: "Взносы на медстрахование",
      vosmsDesc: `${rate.vosms} от оклада (максимум ${ru(vosmsCap)})`,
      ipn: `ИПН (${rate.ipn})`,
      ipnFull: "Индивидуальный подоходный налог",
      ipnDesc: `${rate.ipn} от облагаемой базы (${rate.ipnHigh} свыше ${ipnHighMrp} МРП/год)`,
      standardDeduction: `Вычет ${deductionMrp} МРП`,
      totalEmployeeTaxes: "Всего удержаний",

      so: `СО (${rate.so})`,
      oosms: `ООСМС (${rate.oosms})`,
      opvr: `ОПВР (${rate.opvr})`,
      sn: `СН (${rate.sn})`,
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
          desc: `${rate.opv} от оклада, направляемые на индивидуальный пенсионный счет в ЕНПФ. Максимальный предел — ${C.opvMaxMzp} МЗП (${ru(opvCap)}).`,
          formula: `Оклад × ${rate.opv} (макс ${ru(opvCap)})`,
        },
        vosms: {
          title: "Взносы на медстрахование (ВОСМС)",
          desc: `${rate.vosms} от оклада в Фонд обязательного медстрахования (ФСМС), удерживаемые из дохода работника. Максимальный предел — ${C.vosmsMaxMzp} МЗП (${ru(vosmsCap)}).`,
          formula: `Оклад × ${rate.vosms} (макс ${ru(vosmsCap)})`,
        },
        ipn: {
          title: "Индивидуальный подоходный налог (ИПН)",
          desc: `${rate.ipn} налог на доходы физлиц в бюджет. Рассчитывается от базы после вычета ОПВ, ВОСМС и базового вычета ${deductionMrp} МРП (${ru(deductionAmount)}). С части годового дохода свыше ${ipnHighMrp} МРП (≈ ${ru(ipnThreshold)} в месяц) взимается ${rate.ipnHigh}.`,
          formula: `(Оклад − ОПВ − ВОСМС − ${deductionMrp} МРП) × ${rate.ipn}`,
        },
        totalEmployee: {
          title: "Все удержания с работника",
          desc: "Общая сумма, удерживаемая из оклада сотрудника (ОПВ + ВОСМС + ИПН).",
          formula: "ОПВ + ВОСМС + ИПН",
        },
        so: {
          title: "Социальные отчисления (СО)",
          desc: `${rate.so} выплачивается работодателем за свой счет в Государственный фонд соцстрахования (ГФСС). База: от ${C.soMinMzp} до ${C.soMaxMzp} МЗП.`,
          formula: `(Оклад − ОПВ) × ${rate.so}`,
        },
        oosms: {
          title: "Отчисления на медстрахование (ООСМС)",
          desc: `${rate.oosms} от оклада за счет средств работодателя в Фонд медстрахования. Не удерживается из зарплаты сотрудника. Максимальная база — ${C.oosmsMaxMzp} МЗП.`,
          formula: `Оклад × ${rate.oosms} (макс ${ru(oosmsCap)})`,
        },
        opvr: {
          title: "ОПВ работодателя (ОПВР)",
          desc: `${rate.opvr} от оклада за счет работодателя для сотрудников, рожденных с 1975 года и позже. Максимальная база — ${C.opvrMaxMzp} МЗП.`,
          formula: `Оклад × ${rate.opvr} (макс ${ru(opvrCap)})`,
        },
        sn: {
          title: "Социальный налог (СН)",
          desc: `${rate.sn} налог работодателя (ОУР). С ${C.taxYear} года не уменьшается на сумму социальных отчислений (СО).`,
          formula: `(Оклад − ОПВ − ВОСМС) × ${rate.sn}`,
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
        copyFailed: "Не удалось скопировать",
      },

      ratesDisclaimer: `Примерный курс: ${usdEur("ru")}`,
      liveTag: "Актуальный курс",
      perMonthShort: "/ мес",
      perYearShort: "/ год",
    },
    og: {
      perMonth: "/ месяц",
      perYear: "/ год",
      yearlyNetDesc: "Сумма чистого дохода за 12 месяцев",
      yearlyGrossDesc: "Годовой оклад по трудовому договору",
      deductionBadge: `Вычет ${deductionMrp} МРП`,
      noDeductionBadge: "Без вычета",
    },
    footer: {
      madeBy: "Создатель проекта",
      disclaimer: "Калькулятор выполняет предварительный расчет. Для точных данных консультируйтесь с бухгалтером.",
      sourceCode: "GitHub",
    },
  },

  en: {
    meta: {
      title: "Tenge – Kazakhstan Salary & Tax Calculator",
      description: `Quick & simple ${C.taxYear} salary calculator for Kazakhstan: monthly and yearly take-home pay, gross salary, taxes (OPV, IPN, VOSMS), and USD/EUR conversions.`,
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
      mzpPresetLabel: `Min Wage (${mzp / 1000}k)`,
      minSalaryWarning: `Minimum salary in Kazakhstan is ${en(mzp)}`,

      deductionLabel: `${deductionMrp} MRP basic tax deduction`,
      deductionHint: `Reduces income tax by ${en(deductionSaving)}/mo (${en(deductionAmount)} deduction base)`,

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
      opvDesc: `${rate.opv} of gross (capped at ${en(opvCap)})`,
      vosms: "VOSMS (Health)",
      vosmsFull: "Health Insurance Contribution",
      vosmsDesc: `${rate.vosms} of gross (capped at ${en(vosmsCap)})`,
      ipn: "IPN (Income Tax)",
      ipnFull: "Personal Income Tax",
      ipnDesc: `${rate.ipn} of taxable base (${rate.ipnHigh} above ${ipnHighMrp} MRP/yr)`,
      standardDeduction: `${deductionMrp} MRP Deduction`,
      totalEmployeeTaxes: "Total Deductions",

      so: `SO (${rate.so})`,
      oosms: `OOSMS (${rate.oosms})`,
      opvr: `OPVR (${rate.opvr})`,
      sn: `Social Tax (SN ${rate.sn})`,
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
          desc: `${rate.opv} pension contribution deposited to the employee's personal UAPF retirement account. Capped at ${C.opvMaxMzp} minimum wages (${en(opvCap)}).`,
          formula: `Gross × ${rate.opv} (cap ${en(opvCap)})`,
        },
        vosms: {
          title: "Employee Health Insurance (VOSMS)",
          desc: `${rate.vosms} mandatory health insurance contribution paid by the employee to FSMS. Capped at ${C.vosmsMaxMzp} minimum wages (${en(vosmsCap)}).`,
          formula: `Gross × ${rate.vosms} (cap ${en(vosmsCap)})`,
        },
        ipn: {
          title: "Personal Income Tax (IPN)",
          desc: `${rate.ipn} state personal income tax, calculated on the taxable base after subtracting OPV, VOSMS, and the ${deductionMrp} MRP basic deduction (${en(deductionAmount)}). Annual income above ${ipnHighMrp} MRP (≈ ${en(ipnThreshold)}/mo) is taxed at ${rate.ipnHigh}.`,
          formula: `(Gross − OPV − VOSMS − ${deductionMrp} MRP) × ${rate.ipn}`,
        },
        totalEmployee: {
          title: "Total Employee Deductions",
          desc: "Combined sum deducted from gross salary (OPV + VOSMS + IPN).",
          formula: "OPV + VOSMS + IPN",
        },
        so: {
          title: "Social Contributions (SO)",
          desc: `${rate.so} social contribution paid directly by the employer to GFSS. Base: min ${C.soMinMzp} MZP, max ${C.soMaxMzp} MZP.`,
          formula: `(Gross − OPV) × ${rate.so}`,
        },
        oosms: {
          title: "Employer Health Contribution (OOSMS)",
          desc: `${rate.oosms} healthcare contribution paid directly by the employer. Not deducted from employee salary. Base capped at ${C.oosmsMaxMzp} MZP.`,
          formula: `Gross × ${rate.oosms} (cap ${en(oosmsCap)})`,
        },
        opvr: {
          title: "Employer Pension Contribution (OPVR)",
          desc: `${rate.opvr} supplementary pension contribution paid by the employer for employees born in 1975 or later. Base capped at ${C.opvrMaxMzp} MZP.`,
          formula: `Gross × ${rate.opvr} (cap ${en(opvrCap)})`,
        },
        sn: {
          title: "Social Tax (SN)",
          desc: `${rate.sn} employer state tax (general regime). Since ${C.taxYear} it is no longer reduced by the Social Contribution (SO) amount.`,
          formula: `(Gross − OPV − VOSMS) × ${rate.sn}`,
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
        copyFailed: "Couldn't copy to clipboard",
      },

      ratesDisclaimer: `Approx: ${usdEur("en")}`,
      liveTag: "Live rate",
      perMonthShort: "/ mo",
      perYearShort: "/ yr",
    },
    og: {
      perMonth: "/ mo",
      perYear: "/ yr",
      yearlyNetDesc: "12-month total take-home pay",
      yearlyGrossDesc: "Total annual contract gross salary",
      deductionBadge: `${deductionMrp} MRP Deduction`,
      noDeductionBadge: "No Deduction",
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
  if (isSupportedLocale(paramLang)) return paramLang;

  try {
    const savedLang = localStorage.getItem("tenge_locale");
    if (isSupportedLocale(savedLang)) return savedLang;
  } catch {
    // Storage unavailable (private mode, blocked cookies)
  }

  return DEFAULT_LOCALE;
}

export function setLocale(locale: SupportedLocale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("tenge_locale", locale);
  } catch {
    // Storage unavailable
  }
  document.documentElement.lang = locale;
}
