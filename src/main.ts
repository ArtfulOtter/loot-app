import Vue from "vue";
import App from "./App.vue";
import ViewLoot from "/loot-app/src/components/ViewLoot.vue";
import TestBox from "/loot-app/src/components/TestBox.vue";
import LootAll from "/loot-app/src/components/LootAll.vue";
export const eventBus = new Vue();
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.component("my-test", ViewLoot)
  .component("my-test2", TestBox)
  .component("my-test3", LootAll);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
