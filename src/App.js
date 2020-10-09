import { h } from "preact";
import { useState } from "preact/hooks";

import { getSalaryInfo, round, MIN_SALARY } from "./calculator";
import "./App.css";

const App = () => {
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [salary, setSalary] = useState(52000);
  const [isNetto, setIsNetto] = useState(true);

  const handleChangeSalary = (event) => {
    setSalary(event.target.value);
  };

  const handleChangeNetto = (event) => {
    setIsNetto(event.target.checked);
  };

  const handleSelectYear = (event) => {
    console.log(event);
    setYear(`${event.target.value}`);
  };

  const { nettoSalary, pension, tax, grossSalary } = getSalaryInfo(
    salary,
    year,
    isNetto
  );
  const yearList = Object.keys(MIN_SALARY);

  console.log({ year, salary, isNetto });
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
          <p>Введите свою заработную плату в месяц в теңге:</p>
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
            <label className="App-label" htmlFor="netto">
              На руки
            </label>
            <input
              className="App-checkbox"
              type="checkbox"
              id="netto"
              checked={isNetto}
              onChange={handleChangeNetto}
            />
            {/* TODO: fix and return year select
            <select
              className="App-select"
              onInput={handleSelectYear}
              value={year}
            >
              {yearList.map((item) => {
                return <option key={item}>{item}</option>;
              })}
            </select>
            */}
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
              <td className="App-value">{round(nettoSalary)}</td>
              <td className="App-list1 App-list-right App-value">
                {round(pension)}
              </td>
            </tr>
            <tr className="App-row">
              <td>
                <abbr title="Индивидуальный подоходный налог">ИПН</abbr>
              </td>
              <td className="App-list-right">Заработная плата в месяц</td>
            </tr>
            <tr>
              <td className="App-list1 App-value">{round(tax)}</td>
              <td className="App-list2 App-list-right App-value">
                {round(grossSalary)}
              </td>
            </tr>
            <tr className="App-row">
              <td>Заработная плата за год</td>
              <td className="App-list-right">Оклад за год</td>
            </tr>
            <tr>
              <td className="App-list3 App-value">{round(grossSalary * 12)}</td>
              <td className="App-list3 App-list-right App-value">
                {round(nettoSalary * 12)}
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
            href="https://jarjan.xyz"
            target="_blank"
            rel="noopener noreferrer">
            @jarjan.xyz
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
