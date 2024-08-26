import { useState } from "preact/hooks";

import { getSalaryInfo, formatCurrency } from "./utils";

import "./Calculator.css";

const Calculator = () => {
  const [salary, setSalary] = useState<string>("70000");

  const handleChangeSalary = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      setSalary(event.target.value);
    }
  };

  const { nettoSalary, pension, tax, grossSalary, insurance } = getSalaryInfo(
    Number(salary),
  );

  return (
    <div className="Calculator">
      <header className="Calculator-header">
        <h1>
          Теңге
          <span role="img" aria-label="work">
            💼
          </span>
          {" – "}
          Посчитай свою зарплату
        </h1>
      </header>
      <main className="Calculator-content">
        <div className="Calculator-input-section">
          <p>Введите свою заработную плату на руки в месяц в теңге:</p>
          <section className="Calculator-form">
            <input
              className="Calculator-input"
              type="number"
              min="52000"
              step="any"
              id="salary"
              value={salary}
              onInput={handleChangeSalary}
              autoFocus
            />
          </section>
        </div>
        <table className="Calculator-table">
          <tbody>
            <tr className="Calculator-row">
              <td>Оклад</td>
              <td className="Calculator-list-right">
                <abbr title="Обязательный пенсионный взнос">ОПВ</abbr>
              </td>
            </tr>
            <tr>
              <td className="Calculator-value">
                {formatCurrency(nettoSalary)}
              </td>
              <td className="Calculator-list1 Calculator-list-right Calculator-value">
                {formatCurrency(pension)}
              </td>
            </tr>
            <tr className="Calculator-row">
              <td>
                <abbr title="Индивидуальный подоходный налог">ИПН</abbr>
              </td>
              <td className="Calculator-list-right">
                <abbr title="Обязательное социальное медицинское страхование">
                  ОСМС
                </abbr>
              </td>
            </tr>
            <tr>
              <td className="Calculator-list1 Calculator-value">
                {formatCurrency(tax)}
              </td>
              <td className="Calculator-list2 Calculator-list-right Calculator-value">
                {formatCurrency(insurance)}
              </td>
            </tr>
            <tr className="Calculator-row">
              <td>Заработная плата за год</td>
              <td className="Calculator-list-right">Оклад за год</td>
            </tr>
            <tr>
              <td className="Calculator-list3 Calculator-value">
                {formatCurrency(grossSalary * 12)}
              </td>
              <td className="Calculator-list3 Calculator-list-right Calculator-value">
                {formatCurrency(nettoSalary * 12)}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
      <footer className="Calculator-footer">
        <p>
          Сделал{` `}
          <a
            className="Calculator-link"
            href="https://jarjan.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            jarjan
          </a>
        </p>
        <small>
          Калькулятор делает примерные расчеты, уточняйте всё у бухгалтера.
        </small>
      </footer>
    </div>
  );
};

export default Calculator;
