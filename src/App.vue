<template>
  <main>
    <b-navbar toggleable="sm" type="dark" variant="info">
      <b-container>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand>Tenge 🎉</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
         <b-navbar-nav>
           <b-nav-item>посчитай свою зарплату</b-nav-item>
         </b-navbar-nav>
         <b-navbar-nav class="ml-auto">
           <b-nav-item href="https://github.com/jarjan/tenge.party">
             <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 499.36" focusable="false" class="navbar-nav-svg"><title>GitHub</title><path d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z" fill="currentColor" fill-rule="evenodd"></path></svg>
           </b-nav-item>
         </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-container>
      <b-row>
        <b-col md="8">
          <h1>Введите вашу зарплату в месяц</h1>
          <b-row class="row">
            <b-col md="6">
              <b-input-group size="lg">
                <b-form-input v-model="salary"></b-form-input>
                <b-input-group-addon>₸</b-input-group-addon>
                <b-input-group-addon>
                  <input v-model="net" type="checkbox" aria-label="На руки">
                  На руки
                </b-input-group-addon>
              </b-input-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div class="row">
        <b-col md="4">
          <h2>Расчеты</h2>
          <b-list-group>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              Оклад
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              <span v-b-tooltip.hover title="Обязательный пенсионный взнос">
                ОПВ
              </span>
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              <span v-b-tooltip.hover title="Индивидуальный подоходный налог">
                ИПН
              </span>
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              <span v-b-tooltip.hover title="Доход на руки">
                Заработная плата
              </span>
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              Заработная плата за год
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
            <b-list-group-item  class="d-flex justify-content-between align-items-center">
              Оклад за год
              <b-badge variant="primary" pill>11000</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col md="4">
          <!-- Фильтры -->
        </b-col>
      </div>
    </b-container>
  </main>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      minimalSalary: 20000,
      salary: 20000,
      net: true,
      result: {

      }
    }
  },
  methods: {
    calculate () {

    }
  }
}
</script>

<style>
</style>
