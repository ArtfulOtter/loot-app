<template>
  <div id="app">
    <ViewLoot @new-data-inserted="test()" />
    <br />
    <hr />
    <br />
    <LootAll v-if="load_loot" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ViewLoot from "./components/ViewLoot.vue";
import TestBox from "./components/TestBox.vue";
import LootAll from "./components/LootAll.vue";

@Component({
  components: {
    ViewLoot,
    TestBox,
    LootAll,
  },
})
export default class App extends Vue {
  load_loot = false;

  test() {
    this.load_loot = true;
  }
}
</script>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: small;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
