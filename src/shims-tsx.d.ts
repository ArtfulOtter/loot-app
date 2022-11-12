import Vue, { VNode } from "vue";

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

// declare module "vue-good-table" {
//   import { VueGoodTable } from "vue-good-table"; // notice the syntax change
//   export default VueGoodTable;
// }
