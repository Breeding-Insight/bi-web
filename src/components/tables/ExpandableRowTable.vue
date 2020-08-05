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
    <template v-if="records.length > 0">
      <base-table
        v-bind:show-expand-controls="true"
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
              v-bind:class="{'is-edited': row.edit, 'is-new': row.new}"
            >
              <td v-bind:colspan="colSpan" class="py-0 px-0">
                <EditDataRowForm class="mb-0"
                  @submit="validateAndSubmit(row, index)"
                  @cancel="cancelEdit(row, index)"
                >
                  <slot
                    v-bind:editData="row.editData"
                    v-bind:validations="getValidations(row, index)"
                    name="edit"
                  />
                </EditDataRowForm>
              </td>
            </tr>
          </template>
        </template>

        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
      </base-table>

      <pagination-controls v-bind="$props" v-on="$listeners"/>
    </template>
    <template v-else>
      <slot name="emptyMessage" />
    </template>

  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch, Mixins} from 'vue-property-decorator'
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
  import BaseTable from '@/components/tables/BaseTable.vue'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import PaginationControls from '@/components/tables/PaginationControls.vue'
  import BaseTableRow from "@/components/tables/BaseTableRow.vue"
  import EditDataRowForm from '@/components/forms/EditDataRowForm.vue'
  import {Validations} from "vuelidate-property-decorators";

  import ValidationMixin from '@/mixins/ValidationMixin'

  @Component({
    components: { BaseTable, BaseTableRow, EditDataRowForm, PaginationControls }
  })
  export default class ExpandableRowTable extends Mixins(ValidationMixin) {
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

    private colSpan = 0;
   
  }
</script>