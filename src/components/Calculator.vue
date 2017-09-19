<template>
  <div class="calculator">
    <label for="salary_month">Зарплата в месяц</label>
    <vue-numeric name="salary_month" :min="min_salary" currency="₸" v-model="salary.month" @input="recalculate"></vue-numeric>
    <p>
      Годовая зарплата(в руки): {{ salary.year.toLocaleString() }} ₸
      <small>~ $ {{ (salary.year / usd).toLocaleString() }}</small>
    </p>
    <p>
      Оклад за месяц: {{ net.month.toLocaleString() }} ₸
      <small>~ $ {{ (net.month / usd).toLocaleString() }}</small>
    </p>
    <p>
      Оклад за год: {{ net.year.toLocaleString() }} ₸
      <small>~ $ {{ (net.year / usd).toLocaleString() }}</small>
    </p>
    <p>Пенсия: {{ tax.pension }} ₸</p>
    <p>Подоходный налог: {{ tax.other }} ₸</p>
    <p></p>
  </div>
</template>

<script>
// import axios from 'axios'
import VueNumeric from 'vue-numeric'

export default {
  name: 'calulator',
  components: {
    VueNumeric
  },
  data () {
    return {
      min_salary: 24459,
      usd: 341,
      salary: {
        month: 24459,
        year: 0
      },
      net: {
        month: 24459,
        year: 0
      },
      tax: {
        pension: 0,
        other: 0
      }
    }
  },
  computed: {

  },
  methods: {
    recalculate () {
      const salaryMonth = this.salary.month
      this.salary.year = salaryMonth * 12
      this.net.month = ((salaryMonth - this.min_salary) / 0.9 + this.min_salary) / 0.9
      const netMonth = this.net.month
      this.tax.pension = netMonth * 0.1
      this.tax.other = (netMonth * 0.9 - this.min_salary) * 0.1
      this.net.year = netMonth * 12
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
