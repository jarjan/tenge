export const MIN_SALARY = {
  "2010": 14952,
  "2011": 15999,
  "2012": 17439,
  "2013": 18660,
  "2014": 19966,
  "2015": 21364,
  "2016": 22859,
  "2017": 24459,
  "2018": 28284,
  "2019": 42500,
  "2020": 42500,
};

export const getPension = (nettoSalary, minSalary) =>
  nettoSalary * 0.1 < minSalary * 75 ? nettoSalary * 0.1 : minSalary * 75;

export const getTax = (nettoSalary, minSalary, pension) =>
  nettoSalary === minSalary ? 0 : (nettoSalary - pension - minSalary) * 0.1;

export const getGrossSalary = (nettoSalary, pension, tax) =>
  nettoSalary - pension - tax;

export const getSalaryInfo = (salary, year = "2020", netto = true) => {
  const minSalary = MIN_SALARY[year];
  if (salary < minSalary) {
    return { nettoSalary: salary, pension: 0, tax: 0, grossSalary: salary };
  }

  const nettoSalary = netto ? (salary - minSalary * 0.1) / 0.81 : salary;
  const pension = getPension(nettoSalary, minSalary);
  const tax = getTax(nettoSalary, minSalary, pension);
  const grossSalary = getGrossSalary(nettoSalary, pension, tax);

  return { nettoSalary, pension, tax, grossSalary };
};

export const round = (number) =>
  Number(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$& ") + " ₸";
