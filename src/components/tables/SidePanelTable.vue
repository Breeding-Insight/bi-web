<template>
  <div>
    <WarningModal
        v-bind:active.sync="closeEditModalActive"
        v-bind:msg-title="'Close edit panel?'"
        v-on:deactivate="cancelCloseEdit"
    >
      <section>
        <p class="has-text-dark">
          You will lose any edits you have made upon closing.
        </p>
      </section>
      <div class="columns">
        <div class="column is-whole has-text-centered buttons">
          <button
              class="button is-danger"
              type="button"
              v-on:click="closePanel"
          >
            <strong>Yes, close</strong>
          </button>
          <button
              class="button"
              type="button"
              v-on:click="cancelCloseEdit"
          >
            Cancel
          </button>
        </div>
      </div>
    </WarningModal>

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
              >
                <slot
                    v-bind="row.data"
                    name="columns"
                />
              </SidePanelTableRow>
            </template>

          </BaseTable>
        </div>
        <div
            class="column is-gapless pl-0"
            v-bind:class="{'is-narrow': !SidePanelTableEventBus.panelOpen,
              'is-one-third-desktop is-half-tablet is-half-mobile': (SidePanelTableEventBus.panelOpen & !SidePanelTableEventBus.editActive),
              'is-one-half-desktop is-half-tablet is-half-mobile': (SidePanelTableEventBus.panelOpen & SidePanelTableEventBus.editActive)}"
        >
          <SidePanel
              v-show="records.length > 0"
              class="side-panel-scroll"
              v-if="SidePanelTableEventBus.panelOpen"
              v-bind:background-color-class="SidePanelTableEventBus.editActive ? 'has-background-primary-light' : 'has-background-info-light'"
          >
            <slot v-bind:data="SidePanelTableEventBus.openedRow.data" name="side-panel"/>
          </SidePanel>
        </div>
      </div>
      <PaginationControls v-show="records.length > 0"
                          v-bind="$props"
                          v-on:paginate="closePanelAndReEmit('paginate', $event)"
                          v-on:paginate-toggle-all="closePanelAndReEmit('paginate-toggle-all', $event)"
                          v-on:paginate-page-size="closePanelAndReEmit('paginate-page-size', $event)"/>

      <template v-if="records.length === 0">
        <slot name="emptyMessage" />
      </template>
    </div>

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
  import {PageEvent} from "@/breeding-insight/model/view_models/PageEvent";
  import {SidePanelTableEventBus} from "@/components/tables/SidePanelTableEventBus";
  import WarningModal from "@/components/modals/WarningModal.vue";

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
      BaseTable, SidePanel, SidePanelTableRow, PaginationControls, WarningModal
    },
    data: () => ({SidePanelTableEventBus})
  })
  export default class SidePanelTable extends Vue {

    @Prop()
    records!: Array<any>;
    @Prop()
    rowValidations!: Object;
    @Prop()
    pagination!: Pagination;
    @Prop({default: false})
    panelClose!: boolean;

    private closeEditModalActive = false;
    private storedEvent?: PageEvent;
    private BreakpointEvent = BreakpointEvent;
    private selectedRow: TableRow<any> = new TableRow(false, false,{});
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

      // Events
      //SidePanelTableEventBus.bus.$on(SidePanelTableEventBus.closePanelEvent, this.closeSidePanel);
      //SidePanelTableEventBus.bus.$on(SidePanelTableEventBus.openPanelEvent, this.rowSelected);
      //SidePanelTableEventBus.bus.$on(SidePanelTableEventBus.selectRowEvent, this.rowSelected);
      //SidePanelTableEventBus.bus.$on(SidePanelTableEventBus.activateEditEvent, this.activateEdit);
    }

    activateEdit(row: TableRow<any>) {
      //this.editActive = true;
    }

    closeSidePanel(askConfirm: boolean) {
      if (askConfirm) {
        this.closeEditModalActive = true;
      } else {
        this.closePanel();
      }
    }

    cancelCloseEdit() {
      this.closeEditModalActive = false;
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
      //this.panelOpen = true;
      this.collapseService.send(PanelEvent.OPEN);
    }

    closePanel() {
      //this.editActive = false;
      //this.panelOpen = false;
      this.closeEditModalActive = false;
      this.selectedRow = new TableRow(false, false,{});
      this.collapseService.send(PanelEvent.CLOSED);
    }

    closePanelAndReEmit(eventType: string, event: any) {
      this.closePanel();
      if (event) {
        this.$emit(eventType, event);
      }
      else {
        this.$emit(eventType);
      }
    }

  }
</script>

