import React, { Component, Fragment } from "react";

import { getSalaryInfo, round, MIN_SALARY } from "./utils/calculator";
import {
  GlobalStyle,
  Tenge,
  TengeInput,
  TengeLabel,
  TengeList
} from "./utils/styles";

const currentYear = new Date().getFullYear();

class App extends Component {
  state = {
    year: currentYear,
    salary: MIN_SALARY[currentYear],
    net: true
  };

  handleInputChange = event => {
    const { id, value } = event.target;
    const { year } = this.state;

    const val = Math.max(value, MIN_SALARY[year]);

    this.setState({ [id]: val });
  };

  handleCheckboxChange = event => {
    const { id, checked } = event.target;

    this.setState({ [id]: checked });
  };

  render() {
    const { salary, year, net } = this.state;
    const { netSalary, pension, tax, grossSalary } = getSalaryInfo(
      salary,
      year,
      net
    );

    return (
      <Fragment>
        <Tenge>
          <header>
            <h1>
              Теңге
              <span role="img" aria-label="party">
                🎉
              </span>
            </h1>
            <p>Посчитай свою зарплату</p>
          </header>
          <main>
            <p>Введите свою заработную плату в месяц в теңге:</p>
            <section>
              <TengeInput
                type="number"
                min="52000"
                step="any"
                id="salary"
                value={salary}
                onChange={this.handleInputChange}
              />
              <TengeLabel htmlFor="net">На руки</TengeLabel>
              <TengeInput
                type="checkbox"
                id="net"
                checked={net}
                onChange={this.handleCheckboxChange}
              />
            </section>
            <hr />
            <TengeList>
              <dt>Оклад:</dt>
              <dd>{round(netSalary)}</dd>

              <dt>
                <abbr title="Обязательный пенсионный взнос">ОПВ</abbr>:
              </dt>
              <dd>{round(pension)}</dd>

              <dt>
                <abbr title="Индивидуальный подоходный налог">ИПН</abbr>:
              </dt>
              <dd>{round(tax)}</dd>

              <dt>Заработная плата в месяц:</dt>
              <dd>{round(grossSalary)}</dd>

              <dt>Заработная плата за год:</dt>
              <dd>{round(grossSalary * 12)}</dd>

              <dt>Оклад за год:</dt>
              <dd>{round(netSalary * 12)}</dd>
            </TengeList>
            <hr />
          </main>
          <footer>
            <p>
              Код 💻:{` `}
              <a
                href="https://jarjan.xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                @jarjan
              </a>
              Дизайн 🖋:{` `}
              <a
                href="http://roose.kz/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @roose
              </a>
            </p>
            <small>
              Калькулятор делает примерные расчеты, уточняйте всё у бухгалтера.
            </small>
          </footer>
        </Tenge>
        <GlobalStyle />
      </Fragment>
    );
  }
}

export default App;
