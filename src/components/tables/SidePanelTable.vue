<template>
  <div class="side-panel-table">
    <div class="columns is-mobile">
      <div class="column pr-0">
        <BaseTable
          v-show="records.length > 0"
          v-bind:show-expand-controls="true"
          v-bind="$props"
          v-on:mobile="collapseService.send(BreakpointEvent.MOBILE)"
          v-on:tablet="collapseService.send(BreakpointEvent.TABLET)"
          v-on:desktop="collapseService.send(BreakpointEvent.DESKTOP)"
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
              v-on:details="rowSelected(row)"
            >
              <slot
                v-bind="row.data"
                name="columns"
              />
            </SidePanelTableRow>
          </template>

        </BaseTable>
      </div>
      <div v-bind:class="{'column is-narrow is-gapless pl-0': !panelOpen, 'column is-one-third-desktop is-half-tablet is-half-mobile is-gapless pl-0': panelOpen}" >
        <SidePanel v-show="records.length > 0" class="side-panel-scroll" v-if="panelOpen" v-on:close-panel="closePanel" v-bind:background-color-class="'has-background-info-light'">
          <slot v-bind:data="selectedRow.data" name="side-panel"/>
        </SidePanel>
      </div>
    </div>
    <PaginationControls v-show="records.length > 0" v-bind="$props" v-on="$listeners"/>
    
    <template v-if="records.length === 0">
      <slot name="emptyMessage" />
    </template>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import BaseTable from '@/components/tables/BaseTable.vue'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import SidePanelTableRow from '@/components/tables/SidePanelTableRow.vue'
  import PaginationControls from '@/components/tables/PaginationControls.vue'
  import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
  import { createMachine, interpret } from '@xstate/fsm';

  enum CollapseColumnsState {
    SMALL_PANEL_OPEN = "SMALL_PANEL_OPEN",
    SMALL_PANEL_CLOSED = "SMALL_PANEL_CLOSED",
    NORMAL_PANEL_OPEN = "NORMAL_PANEL_OPEN",
    NORMAL_PANEL_CLOSED = "NORMAL_PANEL_CLOSED"
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
      BaseTable, SidePanel, SidePanelTableRow, PaginationControls
    }
  })
  export default class SidePanelTable extends Vue {

    @Prop()
    records!: Array<any>;
    @Prop()
    rowValidations!: Object;
    @Prop()
    editable!: boolean;
    @Prop()
    pagination!: Pagination;

    private panelOpen = false;
    private BreakpointEvent = BreakpointEvent;
    private selectedRow: TableRow<any> = new TableRow(false, {});
    private state = CollapseColumnsState.NORMAL_PANEL_CLOSED;
    private collapseStateMachine = createMachine({
      id: 'collapse',
      initial: CollapseColumnsState.NORMAL_PANEL_CLOSED,
      states: {
        [CollapseColumnsState.NORMAL_PANEL_CLOSED]: {
          on: {
            [BreakpointEvent.TABLET]: CollapseColumnsState.SMALL_PANEL_CLOSED,
            [BreakpointEvent.MOBILE]: CollapseColumnsState.SMALL_PANEL_CLOSED,
            [PanelEvent.OPEN]: CollapseColumnsState.NORMAL_PANEL_OPEN,
          } 
        },
        [CollapseColumnsState.NORMAL_PANEL_OPEN]: {
          on: {
            [BreakpointEvent.TABLET]: CollapseColumnsState.SMALL_PANEL_OPEN,
            [BreakpointEvent.MOBILE]: CollapseColumnsState.SMALL_PANEL_OPEN,
            [PanelEvent.CLOSED]: CollapseColumnsState.NORMAL_PANEL_CLOSED,
          } 
        },
        [CollapseColumnsState.SMALL_PANEL_CLOSED]: {
          entry: CollapseColumnAction.UNCOLLAPSE,
          on: { 
            [BreakpointEvent.DESKTOP]: CollapseColumnsState.NORMAL_PANEL_CLOSED,
            [PanelEvent.OPEN]: CollapseColumnsState.SMALL_PANEL_OPEN
          }
        },
        [CollapseColumnsState.SMALL_PANEL_OPEN]: {
          entry: CollapseColumnAction.COLLAPSE,
          on: { 
            [BreakpointEvent.DESKTOP]: {
              target: CollapseColumnsState.NORMAL_PANEL_OPEN,
              actions: [CollapseColumnAction.UNCOLLAPSE]
            },
            [PanelEvent.CLOSED]: CollapseColumnsState.SMALL_PANEL_CLOSED,
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
        this.state = CollapseColumnsState[state.value as keyof typeof CollapseColumnsState];
      });
      this.collapseService.start();
    }

    // send events and allow caller to customize what column(s) are shown for collapsed state
    collapse() {
      this.$emit('collapse-columns');
    }

    unCollapse() {
      this.$emit('uncollapse-columns');
    }

    rowSelected(row: TableRow<any>) {
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

