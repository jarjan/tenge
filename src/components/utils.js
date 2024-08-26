const currencyFormatter = new Intl.NumberFormat("ru-KZ", {
  style: "currency",
  currency: "KZT",
});

export const getPension = (nettoSalary, minSalary) =>
  nettoSalary * 0.1 < minSalary * 75 ? nettoSalary * 0.1 : minSalary * 75;

export const getTax = (nettoSalary, minSalary, pension) =>
  nettoSalary === minSalary ? 0 : (nettoSalary - pension - minSalary) * 0.1;

export const getGrossSalary = (nettoSalary, pension, tax) =>
  nettoSalary - pension - tax;

export const getInsurance = (salary) => salary * 0.01;

export const getSalaryInfo = (salary) => {
  const minSalary = 70000;
  if (salary <= minSalary) {
    return { nettoSalary: salary, pension: 0, tax: 0, grossSalary: salary };
  }

  const nettoSalary = (salary - minSalary * 0.3) / 0.81;
  const insurance = getInsurance(salary);
  const pension = getPension(nettoSalary, minSalary);
  const tax = getTax(nettoSalary, minSalary, pension);
  const grossSalary = getGrossSalary(nettoSalary, pension, tax);

  return { nettoSalary, pension, tax, grossSalary, insurance };
};

export const formatCurrency = (number) => currencyFormatter.format(number);
