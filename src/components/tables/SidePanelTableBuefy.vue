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
    <WarningModal
        v-bind:active.sync="sidePanelState.closeEditModalActive"
        v-bind:msg-title="'Close edit panel?'"
        v-on:deactivate="sidePanelState.bus.$emit(sidePanelState.cancelCloseEditEvent)"
    >
      <section>
        <p class="has-text-dark" :class="this.$modalTextClass">
          You will lose any edits you have made upon closing.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              type="button"
              v-on:click="sidePanelState.bus.$emit(sidePanelState.confirmCloseEditEvent)"
          >
            <strong>Yes, close</strong>
          </button>
          <button
              class="button"
              type="button"
              v-on:click="sidePanelState.bus.$emit(sidePanelState.cancelCloseEditEvent)"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>
    <div class="side-panel-table table-min-height" >
      <div class="columns is-mobile">
        <div class="column pr-0">
          <b-table
              :class="{'loading-active': loading}"
              :data.sync="tableRows"
              narrowed
              :show-detail-icon="false"
              :ref="tableRef"
              paginated
              :per-page.sync="pagination.pageSize"
              :current-page.sync="pagination.currentPage"
              striped
              detailed
              :mobile-cards="false"
              :has-detailed-visible="detailsVisible"
              :opened-detailed="openDetail"
              v-on:details-open="detailsOpened"
              aria-next-label="Next"
              aria-previous-label="Previous"
              aria-page-label="Page"
              aria-current-label="Current"
              v-bind="$attrs"
              :default-sort="defaultSort"
              v-on="$listeners"
              v-bind:loading="loading"
              :row-class="calculateRowClass"
              v-bind:debounce-search="searchDebounce"
              v-on:filters-change="cloneFilters"
          >
            <slot></slot>

            <template v-slot:empty v-if="this.loading !== true">
              <slot name="emptyMessage"/>
            </template>

            <template v-slot:pagination>
                <pagination-controls v-show="records.length > 0" v-bind="$props" v-on:paginate="paginate" v-on:paginate-toggle-all="toggleShowAll" v-on:paginate-page-size="updatePageSize" />
            </template>

          </b-table>
        </div>
        <div
            class="column is-gapless pl-0"
            v-bind:class="{'is-narrow': !sidePanelState.panelOpen,
              'is-one-third-widescreen is-half-tablet is-half-mobile': (sidePanelState.panelOpen && !sidePanelState.editActive),
              'is-one-half-desktop is-half-tablet is-half-mobile': (sidePanelState.panelOpen && sidePanelState.editActive)}"
        >
          <SidePanel
              v-bind:state="sidePanelState"
              v-show="records.length > 0"
              class="side-panel-scroll"
              v-if="sidePanelState.panelOpen"
              v-bind:background-color-class="sidePanelState.editActive ? 'has-background-primary-light' : 'has-background-info-light'"
          >
            <slot
                v-bind:table-row="sidePanelState.openedRow"
                name="side-panel"
            />
          </SidePanel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch, Mixins} from 'vue-property-decorator'
import PaginationControls from '@/components/tables/PaginationControls.vue'
import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
import ValidationMixin from '@/mixins/ValidationMixin'
import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
import {ChevronRightIcon, ChevronDownIcon} from 'vue-feather-icons'
import { TableRow } from '@/breeding-insight/model/view_models/TableRow';
import SidePanel from "@/components/tables/SidePanel.vue";
import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
import TraitDetailPanel from "@/components/trait/TraitDetailPanel.vue";
import WarningModal from "@/components/modals/WarningModal.vue";
import { PaginationController } from '@/breeding-insight/model/view_models/PaginationController';

@Component({
  components: { EditDataRowForm, PaginationControls, ChevronRightIcon, ChevronDownIcon, SidePanel, TraitDetailPanel,
  WarningModal }
})
export default class SidePanelTableBuefy extends Mixins(ValidationMixin) {

  @Prop()
  sidePanelState!: SidePanelTableEventBusHandler;
  @Prop()
  records!: Array<any>;
  @Prop()
  editable!: boolean;
  @Prop()
  rowEditable!: Function;
  @Prop()
  rowArchivable!: Function;
  @Prop()
  archivable!: boolean;
  @Prop()
  pagination!: PaginationController;
  @Prop()
  dataFormState!: DataFormEventBusHandler;
  @Prop()
  defaultSort!: String[];
  @Prop()
  rowClasses: any;
  @Prop()
  loading!: boolean;
  @Prop()
  details!: boolean;
  @Prop()
  searchDebounce!: number;
  @Prop({default: "Deactivate"})
  deactivateLinkText?: string;

  private tableRows: Array<TableRow<any>> = new Array<TableRow<any>>();
  private openDetail: Array<TableRow<any>> = new Array<TableRow<any>>();
  private initialUpdate: boolean = false;
  private tableRef = "table-"+Math.random()*1000;

  @Watch('records', {immediate: true, deep:true})
  updateTableRows(newRecords: any, oldRecords: any) {
    let difference: Array<string> = [];
    let difference_direction: number | undefined = undefined;
    if (oldRecords !== undefined) {
      difference_direction = newRecords.length - oldRecords.length;
    }
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
      const newTableRow = new TableRow<any>(this.editable, this.archivable, record);

      // TODO: this is a hack to try and deal with pagination edge cases
      // Should probably implement this in a different way or get rid of new row highlighting
      const paginationCases = this.pagination.totalCount.valueOf() % this.pagination.pageSize.valueOf() === 1 &&
                              this.pagination.currentPage === this.pagination.totalPages ||
                              this.pagination.totalCount.valueOf() % this.pagination.pageSize.valueOf() === this.pagination.totalCount.valueOf() &&
                              this.pagination.currentPage === this.pagination.totalPages &&
                              this.pagination.currentPage === 1;

      if (difference.length === 1 && difference_direction !== undefined && difference_direction > 0 && !paginationCases) {
        if (record.id === difference[0]) {
          newTableRow.toggleNew();
        }
      }

      rowArray.push(newTableRow);
    }
    this.tableRows = rowArray;
  }

  detailsOpened(row: TableRow<any>) {
    this.openDetail = [row]; //closes other opened row details
    this.setValidationRow(row);
  }

  isVisibleDetailRow(row:any) {
    // If data is passed in at same time as component loading, this ref won't be assigned yet. Check if assigned before referencing.
    return this.$refs[this.tableRef] ? (this.$refs[this.tableRef] as Vue & { isVisibleDetailRow: (row:any) => boolean }).isVisibleDetailRow(row): false;
  }

  detailsVisible() {
    return this.editable || this.archivable;
  }

  calculateRowClass(row: TableRow<any>, index: Number) {
    if (this.isVisibleDetailRow(row)) {
      return this.rowClasses && this.rowClasses[row.data.id] ? this.rowClasses[row.data.id] + " is-edited" : "is-edited";
    } else if (row.new) {
      return this.rowClasses && this.rowClasses[row.data.id] ? this.rowClasses[row.data.id] + " is-new" : "is-new";
    }

    return this.rowClasses && this.rowClasses[row.data.id] ? this.rowClasses[row.data.id] : "";
  }

  updated() {
    this.initialUpdate = true;
  }

  cancelEditClicked(row:any) {
    this.cancelEdit(row);
    this.openDetail = [];
  }

  // A patch so if we're listening the filters, we can still debounce
  cloneFilters(event: any) {
    this.$emit('search', JSON.parse(JSON.stringify(event)));
  }

  isRowEditable(row: any) {
    return ((typeof this.rowEditable === "function") ? this.rowEditable(row) : true) && this.editable;
  }

  isRowArchivable(row: any) {
    return ((typeof this.rowArchivable === "function") ? this.rowArchivable(row) : true) && this.archivable;
  }

  paginate(event: any) {
    this.pagination.updatePage(event);
  }

  toggleShowAll(event: any) {
    this.pagination.toggleShowAll()
  }

  updatePageSize(event: any) {
    this.pagination.updatePageSize(event);
  }
}
</script>