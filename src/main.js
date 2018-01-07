import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
});
