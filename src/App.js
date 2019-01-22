import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
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
            <input className="App-input" type="text" /> ₸
            <label className="App-label" htmlFor="net">
              На руки
            </label>
            <input className="App-checkbox" type="checkbox" id="net" />
          </section>
          <hr />
          <dl className="App-list">
            <dt>Оклад:</dt>
            <dd>–</dd>

            <dt>
              <abbr title="Обязательный пенсионный взнос">ОПВ</abbr>:
            </dt>
            <dd>–</dd>

            <dt>
              <abbr title="Индивидуальный подоходный налог">ИПН</abbr>:
            </dt>
            <dd>–</dd>

            <dt>Заработная плата в месяц:</dt>
            <dd>–</dd>

            <dt>Заработная плата за год:</dt>
            <dd>–</dd>

            <dt>Оклад за год:</dt>
            <dd>–</dd>
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
            Калькулятор делает примерные расчеты, уточняйте всё у бухгалетра.
          </small>
        </footer>
      </div>
    );
  }
}

export default App;
