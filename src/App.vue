<template>
  <div id="app">
    <header>
      <span>₸🎉 – расчитай свою зарплату</span>
    </header>
    <main>
      <calculator></calculator>
    </main>
  </div>
</template>

<script>
import Calculator from './components/Calculator'

export default {
  name: 'app',
  components: {
    Calculator
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  padding: 0 16px 0 24px;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #123258;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
