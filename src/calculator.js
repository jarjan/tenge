const MIN_SALARY = {
  '2018': 28284,
  '2019': 42500,
};

const getPension = (netSalary, minSalary) =>
  netSalary * 0.1 < minSalary * 75 ? netSalary * 0.1 : minSalary * 75;

const getTax = (netSalary, minSalary, pension) =>
  netSalary === minSalary ? 0 : (netSalary - pension - minSalary) * 0.1;

const getGrossSalary = (netSalary, pension, tax) => netSalary - pension - tax;

export const getSalaryInfo = (salary, year = 2019, net = true) => {
  const minSalary = MIN_SALARY[year];
  const netSalary = net ? (salary - minSalary * 0.1) / 0.81 : salary;
  const pension = getPension(netSalary, minSalary);
  const tax = getTax(netSalary, minSalary, pension);
  const grossSalary = getGrossSalary(netSalary, pension, tax);

  return { netSalary, pension, tax, grossSalary };
};
