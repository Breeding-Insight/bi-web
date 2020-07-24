<template>
  <div class="side-panel-table">
    <div class="columns">
      <div class="column">
        <base-table 
          v-bind="$props"
          v-on="$listeners"
        >
          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
          <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
        </base-table>
      </div>
      <!-- <div class="column is-narrow is-gapless px-0"> -->
      <div class="column is-four-fifths is-gapless px-0 has-background-info-light">
        <!-- sidepanel stuff -->
      </div>
    </div>
    <pagination-controls v-bind="$props" v-on="$listeners"/>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import BaseTable from '@/components/tables/BaseTable.vue'
  import PaginationControls from '@/components/tables/PaginationControls.vue'

  @Component({
    components: {
      BaseTable, PaginationControls
    }
  })
  export default class SidePanelTable extends Vue {

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