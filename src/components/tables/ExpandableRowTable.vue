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
        v-bind="$props"
        v-on="$listeners"
      >
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

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
  import BaseTable from '@/components/tables/BaseTable.vue'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import PaginationControls from '@/components/tables/PaginationControls.vue'

  @Component({
    components: { BaseTable, PaginationControls }
  })
  export default class ExpandableRowTable extends Vue {
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
   
  }
</script>