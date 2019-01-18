<template>
  <main>
    <b-navbar toggleable="sm" type="dark" variant="primary">
      <b-container>
        <b-navbar-brand>Tenge 🎉</b-navbar-brand>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav>
            <b-nav-item>посчитай свою зарплату</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item href="https://jarjan.xyz">@jarjan</b-nav-item>
            <b-nav-item href="https://github.com/jarjan/tenge.party">
              <svg
                width="16px"
                height="16px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 499.36"
                focusable="false"
                class="navbar-nav-svg"
              >
                <title>GitHub</title>
                <path
                  d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container>
      <b-row>
        <b-col md="8">
          <h2>Введите вашу зарплату в месяц</h2>
          <!-- {{ rate }} -->
          <b-row class="row">
            <b-col sm="5" cols="7">
              <b-input-group size="lg">
                <b-form-input v-model="inputSalary" v-on:change="calculate"></b-form-input>
                <div class="input-group-append">
                  <span class="input-group-text">₸</span>
                </div>
              </b-input-group>
            </b-col>
            <b-col sm="7" cols="5">
              <b-input-group size="lg">
                <span class="input-group-text">
                  <b-form-checkbox
                    size="lg"
                    plain
                    v-model="check"
                    value="gross"
                    unchecked-value="net"
                    v-on:change="calculate"
                  >На руки</b-form-checkbox>
                </span>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div class="row">
        <b-col md="6">
          <h2>Расчеты</h2>
          <b-list-group>
            <b-list-group-item class="d-flex justify-content-between align-items-center">Оклад
              <b-badge variant="primary">+ {{ formatResult(result.netSalary) }}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <abbr v-b-tooltip.hover title="Обязательный пенсионный взнос">ОПВ</abbr>
              <b-badge variant="danger">- {{ formatResult(result.pension) }}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <abbr v-b-tooltip.hover title="Индивидуальный подоходный налог">ИПН</abbr>
              <b-badge variant="danger">- {{ formatResult(result.tax) }}</b-badge>
            </b-list-group-item>
            <b-list-group-item class="d-flex justify-content-between align-items-center">
              <span v-b-tooltip.hover title="Доход на руки">Заработная плата</span>
              <b-badge variant="success">= {{ formatResult(result.salary) }}</b-badge>
            </b-list-group-item>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >Заработная плата за год
              <b-badge variant="info">
                {{ formatResult(result.salary * 12) }}
                <br>
                <small>{{ toUSD(result.salary * 12) }}</small>
                |
                <small>{{ toEUR(result.salary * 12) }}</small>
              </b-badge>
            </b-list-group-item>
            <b-list-group-item
              class="d-flex justify-content-between align-items-center"
            >Оклад за год
              <b-badge variant="info">
                {{ formatResult(result.netSalary * 12) }}
                <br>
                <small>{{ toUSD(result.netSalary * 12) }}</small>
                |
                <small>{{ toEUR(result.netSalary * 12) }}</small>
              </b-badge>
            </b-list-group-item>
          </b-list-group>
          <!--
          <script src="//yastatic.net/es5-shims/0.0.2/es5-shims.min.js"></script>
          <script src="//yastatic.net/share2/share.js"></script>
          <div class="ya-share2" data-services="vkontakte,facebook,twitter,linkedin,whatsapp,telegram" data-counter=""></div>
          -->
        </b-col>
        <b-col md="4" class="text-light">
          <share-facebook title_social="Facebook" has_counter has_icon></share-facebook>
          <share-vkontakte title_social="VK.com" has_counter has_icon></share-vkontakte>
          <share-twitter title_social="Twitter" has_icon></share-twitter>
          <share-telegram title_social="Telegram" has_icon></share-telegram>
          <share-whatsapp title_social="WhatsApp" has_icon></share-whatsapp>
        </b-col>
      </div>
    </b-container>
  </main>
</template>

<script>
import ShareFacebook from "vue-goodshare/src/providers/Facebook";
import ShareTwitter from "vue-goodshare/src/providers/Twitter";
import ShareVkontakte from "vue-goodshare/src/providers/Vkontakte";
import ShareTelegram from "vue-goodshare/src/providers/Telegram";
import ShareWhatsapp from "vue-goodshare/src/providers/WhatsApp";

export default {
  name: "app",
  components: {
    ShareFacebook,
    ShareTwitter,
    ShareVkontakte,
    ShareTelegram,
    ShareWhatsapp
  },
  data() {
    return {
      currentYear: 2019,
      minimalSalary: 42500,
      inputSalary: 42500,
      check: "gross",
      result: {
        netSalary: 0,
        pension: 0,
        tax: 0,
        salary: 0
      },
      rate: {
        usd: 321,
        eur: 396
      }
    };
  },
  beforeMount() {
    switch (this.currentYear) {
      case 2019:
        this.minimalSalary = 42500;
        break;
      case 2018:
        this.minimalSalary = 28284;
        break;
      default:
        this.currentYear = 2019;
        this.minimalSalary = 42500;
    }
    const todaysDate = new Date();
    const storedDate = new Date(localStorage.getItem("today"));
    if (
      localStorage.getItem("rate") &&
      todaysDate.setHours(0, 0, 0, 0) === storedDate.setHours(0, 0, 0, 0)
    ) {
      this.rate = JSON.parse(localStorage.getItem("rate"));
    } else {
      const apiUrl =
        "https://openexchangerates.org/api/latest.json?app_id=0a7936c4fdc04243a2a994352484ae28";
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          this.rate.usd = Math.round(data.rates.KZT * 100) / 100;
          this.rate.eur = Math.round(this.rate.usd / data.rates.EUR);
          localStorage.setItem("today", todaysDate);
          localStorage.setItem("rate", JSON.stringify(this.rate));
          this.calculate();
        });
    }
    this.calculate();
  },
  methods: {
    calculate() {
      if (this.check === "net") {
        this.check = "gross";
        this.result.netSalary =
          (this.inputSalary - this.minimalSalary * 0.1) / 0.81;
        this.result.pension =
          this.result.netSalary * 0.1 < this.minimalSalary * 75
            ? this.result.netSalary * 0.1
            : this.minimalSalary * 75;
        this.result.tax =
          this.result.netSalary === this.minimalSalary
            ? 0
            : (this.result.netSalary -
                this.result.pension -
                this.minimalSalary) *
              0.1;
        this.result.tax += 0;
        this.result.salary = this.inputSalary;
      } else if (this.check === "gross") {
        this.check = "net";
        this.result.netSalary = this.inputSalary;
        this.result.pension =
          this.result.netSalary * 0.1 < this.minimalSalary * 75
            ? this.result.netSalary * 0.1
            : this.minimalSalary * 75;
        this.result.tax =
          this.result.netSalary === this.minimalSalary
            ? 0
            : (this.result.netSalary -
                this.result.pension -
                this.minimalSalary) *
              0.1;
        this.result.tax += 0;
        this.result.salary =
          this.result.netSalary - this.result.pension - this.result.tax;
      }
    },
    formatResult(value) {
      let val = (Math.abs(value) / 1).toFixed(2).replace(".", ",");
      val += " ₸";
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    toUSD(salary) {
      let val = parseInt(salary, 10) / this.rate.usd;
      val = (val / 1).toFixed(0).replace(".", ",");
      val = `$${val}`;
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    toEUR(salary) {
      let val = parseInt(salary, 10) / this.rate.eur;
      val = (val / 1).toFixed(0).replace(".", ",");
      val = `${val}€`;
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
  }
};
</script>

<style>
.input-group-text {
  padding: 0.7rem 0.75rem;
}
</style>
