import { useState } from "preact/hooks";

import { getSalaryInfo, formatCurrency } from "./calculator";

import "./App.css";

const App = () => {
  const [salary, setSalary] = useState(70000);

  const handleChangeSalary = (event) => {
    setSalary(event.target.value);
  };

  const { nettoSalary, pension, tax, grossSalary, insurance } =
    getSalaryInfo(salary);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Теңге
          <span role="img" aria-label="work">
            💼
          </span>
          {" – "}
          Посчитай свою зарплату
        </h1>
      </header>
      <main className="App-content">
        <div className="App-input-section">
          <p>Введите свою заработную плату на руки в месяц в теңге:</p>
          <section className="App-form">
            <input
              className="App-input"
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
        <table className="App-table">
          <tbody>
            <tr className="App-row">
              <td>Оклад</td>
              <td className="App-list-right">
                <abbr title="Обязательный пенсионный взнос">ОПВ</abbr>
              </td>
            </tr>
            <tr>
              <td className="App-value">{formatCurrency(nettoSalary)}</td>
              <td className="App-list1 App-list-right App-value">
                {formatCurrency(pension)}
              </td>
            </tr>
            <tr className="App-row">
              <td>
                <abbr title="Индивидуальный подоходный налог">ИПН</abbr>
              </td>
              <td className="App-list-right">
                <abbr title="Обязательное социальное медицинское страхование">
                  ОСМС
                </abbr>
              </td>
            </tr>
            <tr>
              <td className="App-list1 App-value">{formatCurrency(tax)}</td>
              <td className="App-list2 App-list-right App-value">
                {formatCurrency(insurance)}
              </td>
            </tr>
            <tr className="App-row">
              <td>Заработная плата за год</td>
              <td className="App-list-right">Оклад за год</td>
            </tr>
            <tr>
              <td className="App-list3 App-value">
                {formatCurrency(grossSalary * 12)}
              </td>
              <td className="App-list3 App-list-right App-value">
                {formatCurrency(nettoSalary * 12)}
              </td>
            </tr>
          </tbody>
        </table>
      </main>
      <footer className="App-footer">
        <p>
          Сделал{` `}
          <a
            className="App-link"
            href="https://twitter.com/jarjan"
            target="_blank"
            rel="noopener noreferrer"
          >
            @jarjan
          </a>
        </p>
        <small>
          Калькулятор делает примерные расчеты, уточняйте всё у бухгалтера.
        </small>
      </footer>
    </div>
  );
};

export default App;
