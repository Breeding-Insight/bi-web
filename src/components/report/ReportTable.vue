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

<!--
  Documentation
  -------------
  Displays brapi objects in table format. Requires a formatter to get the data into the correct
  shape. Accepts a ReportStruct as input.

  - Details Panel:
    - You can define your own content for the details panel by using the 'details' slot. The details
      slot is passed the original object for the row being displayed. Example:
      <template v-slot:details="{row}"></template>

    - If you do not specify your own details slot, this component will display all the details
      that you specified in the configuration.

    - To show the expandable row details, include `detailed` as a prop on this component when specified.

  Example Usage With Automated Details
  -------------
  <report-table
      v-bind:report="processPreviewData(currentImport.import)"
      v-bind:config="importConfig"
      detailed
      paginated
  />

  Example Usage with Custom Details
  ------------
  <report-table
      v-bind:report="processPreviewData(currentImport.import)"
      v-bind:config="importConfig"
      detailed
      paginated
  >
    <template v-slot:details="{row}">
      <p>Detail JSON Dump: {{row}}</p>
    </template>
  </report-table>
-->

<template>
    <b-table
        v-bind:data="report.data"
        v-bind:columns="report.columns"
        v-bind:detailed="detailed"
        v-bind:debounce-search="200"
        v-bind:paginated="paginated"
        v-bind:per-page.sync="pagination.pageSize"
        v-bind:current-page="pagination.currentPage"
        v-bind:default-sort="report.defaultSort"
        v-bind:default-sort-direction="report.defaultSortOrder"
        scrollable
    >

      <template v-slot:detail="props">
        <slot name="details" v-bind:row="getDetails(props.row.rowId)"></slot>

        <!-- Default content if slot not used -->
        <ReportExpandableDetails
            v-if="!hasDetailSlot()"
            v-bind:details="getDetails(props.row.rowId)"
            v-bind:config="config"
        ></ReportExpandableDetails>
      </template>

      <template v-slot:pagination>
        <pagination-controls
            v-show="report.data.length > 0"
            v-bind:pagination.sync="pagination"
            v-on:paginate="updatePage($event)"
            v-on:paginate-toggle-all="toggleShowAll()"
            v-on:paginate-page-size="updatePageSize($event)"
        />
      </template>
    </b-table>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {ReportStruct} from "@/breeding-insight/model/report/ReportStruct";
import ReportExpandableDetails from "@/components/report/ReportExpandableDetails.vue";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import {Pagination} from "@/breeding-insight/model/BiResponse";

@Component({
  components: {ReportExpandableDetails, PaginationControls}
})
export default class ReportTable extends Vue {
  @Prop()
  report!: ReportStruct;
  @Prop()
  detailed!: boolean;
  @Prop()
  config!: any;
  @Prop()
  paginated!: boolean;

  defaultPageSize: number = 20;
  pagination: Pagination = new Pagination({
    totalPages: this.report ? this.report.data.length / this.defaultPageSize : 0,
    currentPage: 1,
    totalCount: this.report ? this.report.data.length : 0,
    pageSize: this.report ? this.defaultPageSize : 0
  });

  getDetails(rowId: string): any {
    if (this.report && this.report.details) {
      return this.report.details[rowId];
    }
  }

  hasDetailSlot() {
    return !!this.$scopedSlots.details;
  }

  updatePage(i: number) {
    this.pagination.currentPage = i;
  }

  updatePageSize(i: number) {
    this.pagination.pageSize = i;
  }

  toggleShowAll() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = this.report ? this.report.data.length : 0;
  }
}

</script>