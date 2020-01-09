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
  "2020": 42500
};

export const getPension = (netSalary, minSalary) =>
  netSalary * 0.1 < minSalary * 75 ? netSalary * 0.1 : minSalary * 75;

export const getTax = (netSalary, minSalary, pension) =>
  netSalary === minSalary ? 0 : (netSalary - pension - minSalary) * 0.1;

export const getGrossSalary = (netSalary, pension, tax) =>
  netSalary - pension - tax;

export const getSalaryInfo = (salary, year = 2020, net = true) => {
  const minSalary = MIN_SALARY[year];
  const netSalary = net ? (salary - minSalary * 0.1) / 0.81 : salary;
  const pension = getPension(netSalary, minSalary);
  const tax = getTax(netSalary, minSalary, pension);
  const grossSalary = getGrossSalary(netSalary, pension, tax);

  return { netSalary, pension, tax, grossSalary };
};

export const round = number =>
  Number(number)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$& ") + " ₸";
