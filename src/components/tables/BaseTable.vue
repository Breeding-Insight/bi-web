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
    <table
      v-if="tableRows.length > 0"
      class="table is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <template v-for="(header, index) in headers">
            <th
              v-bind:key="'header' + index"
              v-bind:class="{'is-hidden-mobile': hideMobileHeaders !== undefined && hideMobileHeaders.indexOf(header) !== -1 }"
            >
              {{ header }}
            </th>
          </template>
          <template v-if="editable">
            <th />
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in tableRows">
          <BaseTableRow
            v-bind:key="'row' + index"
            v-bind:row-data="row"
            v-on:edit="row.toggleEdit()"
            v-on:remove="$emit('remove', row.data)"
          >
            <slot
              v-bind="row.data"
              name="columns"
            />
          </BaseTableRow>
          <template v-if="row.edit">
            <tr
              v-bind:key="'edit' + index"
              v-bind:class="{'is-selected': row.edit, 'is-new': row.new}"
            >
              <td v-bind:colspan="columnSpan">
                <EditDataRowForm
                  @submit="validateAndSubmit(index)"
                  @cancel="cancelEdit(row, index)"
                >
                  <slot
                    v-bind:editData="row.editData"
                    v-bind:validations="getValidations(index)"
                    name="edit"
                  />
                </EditDataRowForm>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div v-else>
      <slot name="emptyMessage" />
    </div>

    <!--<nav class="pagination" v-if="pagination">
      <ul class="pagination-list">
        <li>
          <a
              class="pagination-link"
              v-bind:disabled="pagination.totalPages <= 1"
              v-on:click="$emit('paginate', pagination.currentPage - 1)"
              v-bind:aria-label="'Page ' + pagination.currentPage - 1"
          >
            Previous
          </a>
        </li>
        <template v-if="pagination.totalPages > 5">
          <li v-if="pagination.currentPage > 2" class="pagination-link">
            <a
              role="button"
              aria-label="Page 1"
              class="pagination-link"
              v-on:click="$emit('paginate', 1)"
            >
              1
            </a>
          </li>
          <li v-if="pagination.currentPage > 2 && pagination.currentPage != 3">
            <span></span>
          </li>

          <li v-if="pagination.currentPage != 1">
            <a
              role="button"
              v-bind:aria-label="`Page ${pagination.currentPage - 1}`"
              class="pagination-link"
              v-on:click="$emit('paginate', pagination.currentPage - 1)"
            >
              {{ pagination.currentPage - 1 }}
            </a>
          </li>
          <li>
            <a
              role="button"
              class="has-background-info pagination-link"
            >
              {{ pagination.currentPage }}
            </a>
          </li>
          <li v-if="pagination.currentPage != pagination.totalPages">
            <a
                class="pagination-link"
                v-bind:aria-label="`Page ${pagination.currentPage + 1}`"
                v-on:click="$emit('paginate', pagination.currentPage + 1)"
            >
              {{ pagination.currentPage + 1 }}
            </a>
          </li>

          <li v-if="pagination.currentPage < pagination.totalPages - 1 && pagination.currentPage != pagination.totalPages - 2">
            <span></span>
          </li>

          <li v-if="pagination.currentPage < pagination.totalPages - 1">
            <a
              role="button"
              v-bind:aria-label="`Page ${pagination.totalPages}`"
              class="pagination-link"
              v-on:click="$emit('paginate', pagination.totalPages)"
            >
              {{ pagination.totalPages }}
            </a>
          </li>

        </template>
        <template
          v-for="pageNumber in pagination.totalPages"
          v-else
        >
          <li v-bind:key="pageNumber">
            <a
              role="button"
              v-bind:aria-label="`Page ${pageNumber}`"
              class="pagination-link"
              v-on:click="$emit('paginate', pageNumber)"
            >
              {{ pageNumber }}
            </a>
          </li>

        </template>
        <li>
          <a
              class="pagination-link"
              v-bind:disabled="pagination.totalPages <= 1"
              v-on:click="$emit('paginate', pagination.currentPage + 1)"
              v-bind:aria-label="'Page ' + pagination.currentPage + 1"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>-->

    <b-pagination
      v-if="pagination"
      :total="pagination.totalCount"
      :current="pagination.currentPage"
      range-before="1"
      range-after="1"
      order="is-centered"
      size="is-small"
      :simple="false"
      :rounded="false"
      :per-page="pagination.pageSize"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page"
      v-on:change="$emit('paginate', $event)"
    >
      <b-pagination-button
        slot="previous"
        slot-scope="props"
        :page="props.page"
        tag="a"
      >
        Previous
      </b-pagination-button>

      <template
        slot="next"
        slot-scope="props"
      >
        <b-pagination-button
          :page="props.page"
          tag="a"
        >
          Next
        </b-pagination-button>

        <div class="pagination-extras">
          <div class="page-size-select pagination-link">
            <div class="select is-small">
              <select
                v-model="pagination.pageSize"
                v-on:change="$emit('paginate-page-size', $event.target.value)"
              >
                <option value="50">
                  50
                </option>
                <option value="100">
                  100
                </option>
                <option value="200">
                  200
                </option>
              </select>
            </div>
            <span>per page</span>
          </div>

          <a
            role="button"
            class="pagination-link show-all-button"
            v-bind:class="{ 'has-background-info': pagination.totalPages === 1}"
            v-on:click="$emit('paginate-toggle-all')"
          >
            Show All
          </a>
        </div>
      </template>
    </b-pagination>
  </div>
</template>


<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import BaseTableRow from "@/components/tables/BaseTableRow.vue"
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
  import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
  import {Validations} from "vuelidate-property-decorators";
  import {Pagination} from "@/breeding-insight/model/BiResponse";

  @Component({
    components: { BaseTableRow, EditDataRowForm }
  })
  export default class BaseTable extends Vue {
    //<slot name="table-row" v-bind:row-data="program"></slot>
    // Knows all of the data
    @Prop()
    headers!: string[];
    @Prop()
    hideMobileHeaders!: string[];
    @Prop()
    records!: Array<any>;
    @Prop()
    rowValidations!: Object;
    @Prop()
    editable!: boolean;
    @Prop()
    pagination!: Pagination;

    initialUpdate: boolean = false;

    private tableRows: Array<TableRow<any>> = new Array<TableRow<any>>();

    mounted() {
      console.log(this.pagination);
    }
    updated() {
      this.initialUpdate = true;
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

    @Validations()
    validations() {
      if (this.rowValidations) {
        return {
          tableRows: {
            $each: {
              editData: {
                ...this.rowValidations
              }
            }
          }
        }
      }

      return {}
    }

    get columnSpan() {
      return this.editable ? this.headers.length + 1 : this.headers.length;
    }

    getValidations(index: number) {
      return this.$v.tableRows.$each[index].editData;
    }

    validateAndSubmit(rowIndex: number) {

      this.$v.tableRows.$each[rowIndex].editData.$touch();
      if (this.$v.tableRows.$each[rowIndex].editData.$anyError){
        this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.$v.tableRows.$each[rowIndex].editData.$reset();
        const editedRecord = this.tableRows[rowIndex].editData;
        this.$emit('submit', editedRecord);
      }
    }

    cancelEdit(record: TableRow<any>, rowIndex: number) {
      record.toggleEdit();
      record.revertChanges();
      // clear form
      this.$v.tableRows.$each[rowIndex].editData.$reset();
    }

  }
</script>