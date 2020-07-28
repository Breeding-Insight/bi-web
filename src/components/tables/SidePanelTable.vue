<template>
  <div class="side-panel-table">
    <div class="columns is-mobile">
      <div class="column pr-0">
        <v-breakpoint v-on:mobile="collapseService.send(BreakpointEvent.MOBILE)"></v-breakpoint>
        <v-breakpoint v-on:tablet="collapseService.send(BreakpointEvent.TABLET)"></v-breakpoint>
        <v-breakpoint v-on:desktop="collapseService.send(BreakpointEvent.DESKTOP)"></v-breakpoint>
        <base-table 
          v-bind:show-expand-controls="true"
          v-bind="$props"
          v-on="$listeners"
        >          

          <!-- 
            Table row slot customization
            row:   TableRow<any>
            index: number
          -->
          <template v-slot:row="{row, index}">
            <SidePanelTableRow
              v-bind:key="'row' + index"
              v-bind:row-data="row"
              v-bind:selectedRow="selectedRow"
              v-bind:panelOpen="panelOpen"
              v-on:edit="row.toggleEdit()"
              v-on:remove="$emit('remove', row.data)"
              v-on:selected="rowSelected(row)"
            >
              <slot
                v-bind="row.data"
                name="columns"
              />
            </SidePanelTableRow>
          </template>

          <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
          <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData"><slot :name="name" v-bind="slotData" /></template>
        </base-table>
      </div>
      <!-- <div class="column is-narrow is-gapless px-0"> -->
      <!-- is-one-third-desktop is-half-tablet -is-half-mobile -->
      <div v-bind:class="{'column is-narrow is-gapless pl-0': !panelOpen, 'column is-one-third-desktop is-half-tablet is-half-mobile is-gapless pl-0': panelOpen}" >
        <side-panel v-if="panelOpen" v-on:close-panel="closePanel" v-bind:background-color-class="'has-background-info-light'">
          <slot name="side-panel"/>
        </side-panel>
        
        <!-- <slot v-if="panelOpen" name="side-panel"/> -->
        <!-- <side-panel v-bind:background-color-class="'has-background-info-light'" /> -->
        <!-- sidepanel stuff -->
      </div>
    </div>
    <pagination-controls v-bind="$props" v-on="$listeners"/>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import BaseTable from '@/components/tables/BaseTable.vue'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import BaseTableRow from '@/components/tables/BaseTableRow.vue'
  import SidePanelTableRow from '@/components/tables/SidePanelTableRow.vue'
  import PaginationControls from '@/components/tables/PaginationControls.vue'
  import { TableColumn } from '../../breeding-insight/model/view_models/TableColumn';
  import { VBreakpoint } from '@/components/VBreakpoint';
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"

  import { createMachine, interpret } from '@xstate/fsm';

  enum CollapseColumnsState {
    NOT_COLLAPSED = "NOT_COLLAPSED",
    COLLAPSED = "COLLAPSED",
  }

  enum BreakpointEvent {
    MOBILE = "MOBILE",
    TABLET = "TABLET",
    DESKTOP = "DESKTOP",
  }

  enum PanelEvent {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
  }

  enum CollapseColumnAction {
    COLLAPSE = "COLLAPSE",
    UNCOLLAPSE = "UNCOLLAPSE",
  }

  @Component({
    components: {
      BaseTable, SidePanel, BaseTableRow, SidePanelTableRow, PaginationControls, VBreakpoint
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

    private panelOpen = false;

    private collapseColumns: boolean = false;
    private columns: Array<any> = [];
    private CollapseColumnsState = CollapseColumnsState;
    private BreakpointEvent = BreakpointEvent;
    private PanelEvent = PanelEvent;
    private CollapseColumnAction = CollapseColumnAction;
    private selectedRow: TableRow<any> = new TableRow(false, {});

    private state = CollapseColumnsState.NOT_COLLAPSED;
    private collapseStateMachine = createMachine({
      id: 'collapse',
      initial: CollapseColumnsState.NOT_COLLAPSED,
      states: {
        [CollapseColumnsState.NOT_COLLAPSED]: {
          entry: CollapseColumnAction.UNCOLLAPSE,
          on: {
            [BreakpointEvent.TABLET]: CollapseColumnsState.COLLAPSED,
            [BreakpointEvent.MOBILE]: CollapseColumnsState.COLLAPSED,
          } 
        },
        [CollapseColumnsState.COLLAPSED]: {
          entry: CollapseColumnAction.COLLAPSE,
          on: { 
            [BreakpointEvent.DESKTOP]: CollapseColumnsState.NOT_COLLAPSED,
            [PanelEvent.CLOSED]: CollapseColumnsState.NOT_COLLAPSED,
            [PanelEvent.OPEN]: CollapseColumnsState.COLLAPSED
          }
        },
      }
    },
    {
      actions: {
        [CollapseColumnAction.COLLAPSE]: (context, event) => {
          this.collapse();
        },
        [CollapseColumnAction.UNCOLLAPSE]: (context, event) => {
          this.unCollapse();
        },
      }

    });

    private initialState = this.collapseStateMachine;
    private collapseService = interpret(this.collapseStateMachine);

    created() {
      this.collapseService.subscribe(state => {
        console.log(state);
        this.state = CollapseColumnsState[state.value as keyof typeof CollapseColumnsState];
      });
      this.collapseService.start();
    }

    // send events and allow caller to customize what column(s) are shown for collapsed state
    collapse() {
      console.log('collapse')
      this.$emit('collapse-columns');
    }

    unCollapse() {
      console.log('uncollapse')
      this.$emit('uncollapse-columns');
    }

    rowSelected(row: TableRow<any>) {
      console.log('row selected');
      row.selected = true;
      this.selectedRow = row;
      this.panelOpen = true;
      this.collapseService.send(PanelEvent.OPEN);
    }

    closePanel() {
      this.panelOpen = false
      this.selectedRow = new TableRow(false, {});
      this.collapseService.send(PanelEvent.CLOSED);
    }

  }
</script>