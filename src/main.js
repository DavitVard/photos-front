import "./boot";
import Vue from "vue";
import App from "./App.vue";
import store from "@/plugins/store";
import router from "@/plugins/router";
import vuetify from "@/plugins/vuetify";
import { RestifyConfig } from "vue-restify";

RestifyConfig.set('origin', 'http://api-photos.myninjadev.com');

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
  created() {
    RestifyConfig.set('headers', {
      Authorization: `Bearer ${this.$store.getters.token}`
    });
  }
}).$mount('#app')
