import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import { sync } from "vuex-router-sync";

Vue.config.productionTip = false;

const moment = require("moment");
require("moment/locale/fr");
Vue.use(require("vue-moment"), {
  moment,
});
const unsync = sync(store, router);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

unsync();
