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
    <!-- need to have base-table loaded for watching records 
         for new highlighting so use v-show 
    -->
    <BaseTable
      v-show="records.length > 0"
      v-bind:show-expand-controls="editable || archivable"
      v-bind="$props"
      v-on:colspan="colSpan = $event + 1"
      v-on="$listeners"
    >
      <!-- 
        Table row slot customization
        row:   TableRow<any>
        index: number
      -->
      <template v-slot:row="{row, index}">
        <ExpandableTableRow
          v-bind:key="'row' + index"
          v-bind:row-data="row"
          v-on:edit="toggleRowEdit(row)"
          v-on:remove="$emit('remove', row.data)"
        >
          <slot
            v-bind="row.data"
            name="columns"
          />
        </ExpandableTableRow>
        <template v-if="row.edit">
          <tr
            v-bind:key="'edit' + index"
            v-bind:class="{'is-edited': row.edit, 'is-new': row.new}"
          >
            <td v-bind:colspan="colSpan" class="py-0 px-0">
              <EditDataRowForm class="mb-0"
                v-bind:data-form-state="dataFormState"
                v-on:submit="validateAndSubmit(row)"
                v-on:cancel="cancelEdit(row)"
              >
                <slot
                  v-bind:editData="row.editData"
                  v-bind:validations="getValidations()"
                  name="edit"
                />
              </EditDataRowForm>
            </td>
          </tr>
        </template>
      </template>
    </BaseTable>
    <pagination-controls v-show="records.length > 0" v-bind="$props" v-on="$listeners"/>

    <template v-if="records.length === 0">
      <slot name="emptyMessage" />
    </template>

  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch, Mixins} from 'vue-property-decorator'
  import BaseTable from '@/components/tables/BaseTable.vue'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import PaginationControls from '@/components/tables/PaginationControls.vue'
  import ExpandableTableRow from "@/components/tables/ExpandableTableRow.vue"
  import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
  import ValidationMixin from '@/mixins/ValidationMixin'
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';

  @Component({
    components: { BaseTable, ExpandableTableRow, EditDataRowForm, PaginationControls }
  })
  export default class ExpandableRowTable extends Mixins(ValidationMixin) {

    @Prop()
    records!: Array<any>;
    @Prop()
    editable!: boolean;
    @Prop()
    archivable!: boolean;
    @Prop()
    pagination!: Pagination;
    @Prop()
    dataFormState!: DataFormEventBusHandler;

    private colSpan = 0;

    toggleRowEdit(row: TableRow<any>) {
      row.toggleEdit();
      if (row.edit){
        this.setValidationRow(row);
      }
    }
  }
</script>