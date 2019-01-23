import React, { Component } from 'react';

import { getSalaryInfo } from './calculator';
import './App.css';

class App extends Component {
  state = {
    year: new Date().getFullYear(),
    salary: 52000,
    net: true,
  };

  handleChange = (event) => {
    const { id, value } = event.target;

    this.setState({ [id]: value });
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
          <p>Введите свою заработную плату в месяц в теңге:</p>
          <section className="App-form">
            <input
              className="App-input"
              type="text"
              id="salary"
              value={salary}
              onChange={this.handleChange}
            />{' '}
            ₸
            <label className="App-label" htmlFor="net">
              На руки
            </label>
            <input
              className="App-checkbox"
              type="checkbox"
              id="net"
              defaultValue={net}
              onChange={this.handleChange}
            />
          </section>
          <hr />
          <dl className="App-list">
            <dt>Оклад:</dt>
            <dd>{netSalary}</dd>

            <dt>
              <abbr title="Обязательный пенсионный взнос">ОПВ</abbr>:
            </dt>
            <dd>{pension}</dd>

            <dt>
              <abbr title="Индивидуальный подоходный налог">ИПН</abbr>:
            </dt>
            <dd>{tax}</dd>

            <dt>Заработная плата в месяц:</dt>
            <dd>{grossSalary}</dd>

            <dt>Заработная плата за год:</dt>
            <dd>{grossSalary * 12}</dd>

            <dt>Оклад за год:</dt>
            <dd>{netSalary * 12}</dd>
          </dl>
          <hr />
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
