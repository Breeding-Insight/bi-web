<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <td
    v-if="isVisible"
  >
    <slot/>
  </td>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component
  export default class TableColumn extends Vue {

    @Prop({ default: true })
    private visible!: boolean;

    @Prop({ default: false })
    private collapsed!: boolean;

    @Prop()
    private label!: string;

    @Prop([Number, String])
    private width!: number | string | undefined;

    private newKey = this.label;

    private table!: Vue;

    get isVisible() {
      return this.visible;
    }

    // any update to column props here will update column in parent table
    // that's how reactive changes are propagated up
    beforeMount() {

      // find table component and add this component to list of columns
      // based on buefy data table method
      var parent = this.$parent;
      while(parent !== undefined && !parent.$data.isTable) {
        parent = parent.$parent;
      }
      const repeated = parent.$data.updatedColumns.some(
          (column) => column.newKey === this.newKey)

      if (!repeated) {
        this.table = parent;
        parent.$data.updatedColumns.push(this);
      }
    }

    beforeDestroy() {
      if (!this.table) return;
      if (!this.table.$data.tableRows.length) return;
      if (this.table.$data.updatedColumns.length !== 1) return;
      if (this.table.$data.updatedColumns.length) {
          const index = this.table.$data.updatedColumns.map(
              (column) => column.newKey).indexOf(this.newKey)
          if (index >= 0) {
              this.table.$data.updatedColumns.splice(index, 1);
          }
      }
    }
  }

</script>