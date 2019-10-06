import React, { Component } from 'react';

import { getSalaryInfo, round } from './calculator';
import './App.css';

class App extends Component {
  state = {
    year: new Date().getFullYear(),
    salary: 52000,
    net: true,
  };

  handleInputChange = (event) => {
    const { id, value, ...args } = event.target;
    // console.log(value);

    this.setState({ [id]: value });
  };

  handleCheckboxChange = (event) => {
    const { id, checked } = event.target;

    this.setState({ [id]: checked });
  };

  render() {
    const { salary, year, net } = this.state;
    const { netSalary, pension, tax, grossSalary } = getSalaryInfo(
      salary,
      year,
      net,
    );

    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Теңге
            <span role="img" aria-label="party">
              🎉
            </span>
            {' – '}
            Посчитай свою зарплату.
          </h1>
        </header>
        <main className="App-content">
          <section className="App-input-section">
            <p>Введите свою заработную плату в месяц в теңге:</p>
            <section className="App-form">
              <input
                className="App-input"
                type="number"
                min="52000"
                step="any"
                id="salary"
                value={salary}
                onChange={this.handleInputChange}
                autoFocus
              />
              <label className="App-label" htmlFor="net">
                На руки
              </label>
              <input
                className="App-checkbox"
                type="checkbox"
                id="net"
                checked={net}
                onChange={this.handleCheckboxChange}
              />
            </section>
          </section>          
          <table className="App-list">
            <tbody>  
              <tr className="App-row">
                <td>
                  <p>Оклад</p>
                  <p>{round(netSalary)}</p>
                </td>
                <td>
                  <p className="App-list-right"><abbr title="Обязательный пенсионный взнос">ОПВ</abbr></p>
                  <p className="App-list1 App-list-right">{round(pension)}</p>
                </td>
              </tr>
              <tr className="App-row">
                <td>
                  <p><abbr title="Индивидуальный подоходный налог">ИПН</abbr></p>
                  <p className="App-list1">{round(tax)}</p>
                </td>
                <td>
                  <p className="App-list-right">Заработная плата в месяц</p>
                  <p  className="App-list2 App-list-right">{round(grossSalary)}</p>
                </td>
              </tr>
              <tr className="App-row">
                <td>
                  <p>Заработная плата за год</p>
                  <p className="App-list3">{round(grossSalary * 12)}</p>
                </td>
                <td>
                  <p className="App-list-right">Оклад за год</p>
                  <p className="App-list3 App-list-right">{round(netSalary * 12)}</p>
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
              rel="noopener noreferrer"
            >
              @jarjan.xyz
            </a>
          </p>
          <small>
            Калькулятор делает примерные расчеты, уточняйте всё у бухгалтера.
          </small>
        </footer>
      </div>
    );
  }
}

export default App;
