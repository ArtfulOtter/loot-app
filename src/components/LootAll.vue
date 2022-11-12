<template>
  <div class="container p-3">
    <h2>All Loot</h2>
    <div class="col-lg-12 col-md-6">
      <div v-if="data.items">
        <table class="table table-striped" v-if="data.items.length > 1">
          <thead class="table-group-divider">
            <tr>
              <th scope="col">Item Name</th>
              <th scope="col">Player</th>
              <th scope="col">Date</th>
              <th scope="col">Option</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data.items" v-bind:key="item.id">
              <th
                v-if="item.response != 'Disenchant'"
                scope="row"
                style="text-align: left"
              >
                {{ item.itemName }}
              </th>
              <td v-if="item.response != 'Disenchant'" scope="row">
                {{ item.player }}
              </td>
              <td v-if="item.response != 'Disenchant'" scope="row">
                {{ item.created }}
              </td>
              <td v-if="item.response != 'Disenchant'" scope="row">
                {{ item.response }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import PocketBase from "pocketbase";
import { mixins } from "vue-class-component";

const client = new PocketBase("http://127.0.0.1:8090/");

@Component({
  components: {},
})
export default class LootAll extends mixins() {
  data: any = {};
  data2: any = {};

  async getData() {
    this.data = await client.records.getList("loot", 1, 1000, {
      filter: 'created >= "2022-01-01 00:00:00"',
      sort: "+player",
    });

    // console.log(this.data);

    if (this.data.totalItems > 400) {
      this.data2 = await client.records.getList("loot", 2, 1000, {
        filter: 'created >= "2022-01-01 00:00:00"',
        sort: "+player",
      });

      this.data.items = this.data.items.concat(this.data2.items);

      console.log(this.data);
    }
  }

  mounted() {
    this.getData();
  }
}
</script>
