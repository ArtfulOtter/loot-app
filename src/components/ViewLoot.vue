<template>
  <div class="container">
    <h1>Soggy Loot</h1>
    <br />
    <div class="col-lg-3"></div>
    <div class="col-lg=6">
      <h4 class="col-lg-12">Paste Loot Below</h4>
      <textarea v-model="dump" style="width: 600px; height: 300px"></textarea>
    </div>
    <br />
    <div>
      <div class="row">
        <div class="col-lg-4 smaller-col"></div>
        <button class="btn btn-primary col-md-2" @click="toggleLoot">
          Show Loot2
        </button>
        <div class="col-lg-1"></div>
        <button class="btn btn-primary col-md-2" @click="insertDump">
          Add Loot!
        </button>
        <div class="col-lg-1"></div>
        <button class="btn btn-primary col-lg-2" @click="parseLoot">
          Sort!2
        </button>
        <div class="col-lg-1"></div>
      </div>
      <br />
    </div>
    <hr />
    <br />
    <div class="row">
      <div class="col-lg-6">
        <div class="row">
          <h5 class="col-lg-5">Ordered By BiS</h5>
        </div>
        <table class="table table-striped">
          <thead class="table-group-divider">
            <tr>
              <th scope="col">Player</th>
              <th scope="col">BIS</th>
              <th scope="col">Major</th>
              <th scope="col">Minor</th>
              <th scope="col">Offspec</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in player_data" v-bind:key="item.player">
              <th
                scope="row"
                @click="getLootForPlayer(item.player)"
                style="text-align: left"
              >
                {{ item.player }}
              </th>
              <td scope="row" v-if="item.bis_count">{{ item.bis_count }}</td>
              <td scope="row" v-else>0</td>
              <td scope="row" v-if="item.major_count">
                {{ item.major_count }}
              </td>
              <td scope="row" v-else>0</td>
              <td scope="row" v-if="item.minor_count">
                {{ item.minor_count }}
              </td>
              <td scope="row" v-else>0</td>
              <td scope="row" v-if="item.offspec_count">
                {{ item.offspec_count }}
              </td>
              <td scope="row" v-else>0</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-6">
        <br />
        <div class="row" v-if="loot_table">
          <div class="col-lg-8"></div>
          <button class="btn btn-warning col-lg-3 mb-3" @click="clear">
            Clear!
          </button>
          <div class="col-lg-1"></div>
          <div class="col-lg-11" style="border-style: groove">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Roll</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in player_loot.items" v-bind:key="item.id">
                  <th
                    v-if="item.response != 'Disenchant'"
                    scope="row"
                    style="text-align: left"
                  >
                    {{ item.itemName }}
                  </th>
                  <td v-if="item.response != 'Disenchant'" scope="row">
                    {{ item.response }}
                  </td>
                  <td v-if="item.response != 'Disenchant'" scope="row">
                    {{ item.timestamp }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PocketBase from "pocketbase";
const client = new PocketBase("http://127.0.0.1:8090/");

@Component({
  components: {},
})
export default class ViewLoot extends Vue {
  data: any = {};
  data2: any = {};
  dump: any = {};
  hide_loot: any = false;

  player_data: any = [
    {
      player: "",
      bis_count: 0,
      major_count: 0,
      minor_count: 0,
      offspec_count: 0,
    },
  ];

  player_loot: any = {};
  loot_table: any = false;

  toggleLoot(visibility: any) {
    switch (visibility) {
      case "hide":
        break;
      case "show":
      this.$emit("new-data-inserted");
        break;
    }
  }

  clear() {
    this.loot_table = false;
  }

  async getData() {
    this.data = await client.records.getList("loot", 1, 1000, {
      filter: 'created >= "2022-01-01 00:00:00"',
      sort: "+player",
    });

    if (this.data.totalItems > 400) {
      this.data2 = await client.records.getList("loot", 2, 1000, {
        filter: 'created >= "2022-01-01 00:00:00"',
        sort: "+player",
      });

      this.data.items = this.data.items.concat(this.data2.items);
    }
  }

  async getLootForPlayer(player: any) {
    this.player_loot = {};
    this.player_loot = await client.records.getList("loot", 1, 1000, {
      filter: `player = "${player}"`,
      sort: "+timestamp",
    });
    this.loot_table = true;

    console.log(this.player_loot);
  }

  async insertDump() {
    Object.values(JSON.parse(this.dump)).forEach((val: any) =>
      client.records.create(
        "loot",
        {
          itemName: val.itemName,
          itemId: val.itemID,
          player: val.player,
          response: val.response,
          instance: val.instance,
          boss: val.boss,
          class: val.class,
          timestamp: val.date,
        },
        { $autoCancel: false }
      )
    );

    this.getData();
    this.player_data = [
      {
        player: "",
        bis_count: 0,
      },
    ];
    this.$emit("new-data-inserted");
  }

  parseLoot() {
    console.log("Parsing Loot");
    if (this.player_data.length > 1) {
      return;
    }

    let bis: any = [];
    let major: any = [];
    let minor: any = [];
    let offspec: any = [];

    this.data.items.forEach((val: any, index: any) => {
      if (val.response == "BIS") {
        if (bis[val.player] != undefined) {
          bis[val.player] += 1;
        } else {
          bis[val.player] = 1;
        }
      } else if (val.response == "Big uppgrade") {
        if (major[val.player] != undefined) {
          major[val.player] += 1;
        } else {
          major[val.player] = 1;
        }
      } else if (val.response == "Minor Upgrade") {
        if (minor[val.player] != undefined) {
          minor[val.player] += 1;
        } else {
          minor[val.player] = 1;
        }
      } else if (val.response == "offspec") {
        if (offspec[val.player] != undefined) {
          offspec[val.player] += 1;
        } else {
          offspec[val.player] = 1;
        }
      }
    });

    this.parseBis(bis);
    this.parseMajor(major);
    this.parseMinor(minor);
    this.parseOffspec(offspec);
  }

  parseBis(bis: any) {
    for (let [key, value] of Object.entries(bis)) {
      let found = false;
      this.player_data.forEach((val: any, index: any) => {
        if (val.player == key) {
          val.bis_count += value;
          found = true;
        }
      });
      if (!found) {
        this.player_data.push({
          player: key,
          bis_count: value,
        });
      }
    }

    this.player_data.sort((a: any, b: any) => {
      return b.bis_count - a.bis_count;
    });
  }

  parseMajor(major: any) {
    for (let [key, value] of Object.entries(major)) {
      let found = false;
      this.player_data.forEach((val: any, index: any) => {
        if (val.player == key && val.major_count !== undefined) {
          val.major_count += value;
          found = true;
        }
      });
      if (!found) {
        this.player_data.forEach((val: any, index: any) => {
          if (val.player == key) {
            val.major_count = value;
          }
        });
      }
    }
  }

  parseMinor(minor: any) {
    for (let [key, value] of Object.entries(minor)) {
      let found = false;
      this.player_data.forEach((val: any, index: any) => {
        if (val.player == key && val.minor_count !== undefined) {
          val.minor_count += value;
          found = true;
        }
      });
      if (!found) {
        this.player_data.forEach((val: any, index: any) => {
          if (val.player == key) {
            val.minor_count = value;
          }
        });
      }
    }
  }

  parseOffspec(offspec: any) {
    for (let [key, value] of Object.entries(offspec)) {
      let found = false;
      this.player_data.forEach((val: any, index: any) => {
        if (val.player == key && val.offspec_count !== undefined) {
          val.offspec_count += value;
          found = true;
        }
      });
      if (!found) {
        this.player_data.forEach((val: any, index: any) => {
          if (val.player == key) {
            val.offspec_count = value;
          }
        });
      }
    }
  }

  mounted() {
    this.getData();
  }
}
</script>
<style>
.smaller-col {
  width: 380px !important;
}
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css";
</style>
