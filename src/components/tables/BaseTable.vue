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
  <div>
    <v-breakpoint v-on:mobile="emitAndUpdateIsMobile('mobile')"></v-breakpoint>
    <v-breakpoint v-on:tablet="emitAndUpdateIsMobile('tablet')"></v-breakpoint>
    <v-breakpoint v-on:desktop="emitAndUpdateIsMobile('desktop')"></v-breakpoint>
    <table
      class="table is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead v-if="updatedColumns.length">
        <tr>
          <!-- Header space for left row icon if desired -->
          <th v-if="showRowIcon" width="40px"/>
          <th v-for="(column, index) in visibleColumns"
              v-bind:key="index"
              v-bind:style="{
                width: column.width === undefined ? null :
                (isNaN(column.width) ? column.width : column.width + 'px')
              }"
          >
            {{ column.label }}
          </th>
          <!-- Add a header column to match spacing for row controls if specified -->
          <template v-if="showExpandControls">
            <td />
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in tableRows">
          <!-- slot to customize each row in table -->
          <slot name="row" v-bind:row="row" v-bind:index="index"></slot>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
  import TableColumn from "@/components/tables/TableColumn.vue";
  import { VBreakpoint } from '@/components/VBreakpoint';

  @Component({
    components: { VBreakpoint
    }
  })
  export default class BaseTable extends Vue {

    //<slot name="table-row" v-bind:row-data="program"></slot>
    // Knows all of the data
    @Prop()
    records!: Array<any>;
    @Prop()
    editable!: boolean;
    @Prop({default: () => []})
    columns!: Array<TableColumn>;
    @Prop()
    showExpandControls!: boolean;
    @Prop()
    showRowIcon!: boolean;
    
    private initialUpdate: boolean = false;
    private tableRows: Array<TableRow<any>> = new Array<TableRow<any>>();
    private updatedColumns: Array<TableColumn> = [...this.columns];
    private isMobile = false;

    /**
     * Used by TableColumn component to find it's parent BaseTable
     */
    private isTable = true;

    updated() {
      this.initialUpdate = true;
    }

    @Watch('updatedColumns', {immediate:true})
    updateColSpan() {
      this.$emit('colspan', this.visibleColumns.length);
    }

    get visibleColumns() {
      return this.updatedColumns.filter((column) => {
          return column.isVisible || column.isVisible === undefined
      })
    }

    @Watch('records', {immediate: true, deep:true})
    updateTableRows(newRecords: any, oldRecords: any) {
      let difference: Array<string> = [];
      if (oldRecords !== null && this.initialUpdate) {
        const newSet: Set<string> = new Set(newRecords
          .filter( (record: any) => record.id !== undefined)
          .map( (filteredRecord: any) => filteredRecord.id)
        );
        const oldSet: Set<string> = new Set(oldRecords
          .filter( (record: any) => record.id !== undefined)
          .map( (filteredRecord: any) => filteredRecord.id)
        );
        difference = [...newSet].filter( (record: any) => !oldSet.has(record));
      }

      const rowArray = new Array<TableRow<any>>();
      for (const record of this.records){
        const newTableRow = new TableRow<any>(this.editable, record);

        // See if it is our new row
        if (difference.length === 1) {
          if (record.id === difference[0]) {
            newTableRow.toggleNew();
          }
        }
        rowArray.push(newTableRow);
      }
      this.tableRows = rowArray;
    }

    /**
     * Used by TableColumn component to add itself to BaseTable
     * @param column
     */
    addColumn(column: TableColumn) {
      const repeated = this.updatedColumns.some(
          (col) => col.newKey === column.newKey)

      if (!repeated) {
        this.updatedColumns.push(column);
      }
    }

    emitAndUpdateIsMobile(event: string) {
      this.$emit(event);
      if (this.isMobile) {
        if (event === 'tablet' || event === 'desktop') {
          this.isMobile = false;
          this.$emit('is-mobile', false);
        }
      }
      else {
        if (event === 'mobile') {
          this.isMobile = true;
          this.$emit('is-mobile', true);
        }
      }
    }

  }
</script>