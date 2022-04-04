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
import BaseTable from '@/components/tables/BaseTable.vue';
import {SortOrder} from "@/breeding-insight/model/Sort";

@Component({
  })
  export default class TableColumn extends Vue {

    @Prop({ default: true })
    private visible!: boolean;

    @Prop({ default: false })
    private collapsed!: boolean;

    @Prop()
    private label!: string;

    @Prop([Number, String])
    private width!: number | string | undefined;

    @Prop()
    private sortField!: string;

    @Prop()
    private sortFieldLabel!: string;

    @Prop()
    private sortOrder!: SortOrder;

    @Prop()
    private sortable!: boolean;

    private table!: BaseTable;

    changeSortColumn(field: string) {
      if (this.sortField === this.sortFieldLabel) {
        this.$emit('toggleSortOrder');
      } else {
        this.$emit('newSortColumn', field);
      }
    }

    get isVisible() {
      return this.visible;
    }

    get newKey() {
      return this.label;
    }

    get isSortable() {
      return this.sortable;
    }

    get currentSortField() {
      return this.sortField;
    }

    get sortLabel() {
      return this.sortFieldLabel;
    }

    get order() {
      return this.sortOrder === SortOrder.Ascending;
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

      if (parent === undefined) {
        this.$destroy()
        throw new Error('TableColumn should be a child of BaseTable');
      }
      this.table = parent as BaseTable;
      this.table.addColumn(this);
    }

  }

</script>
