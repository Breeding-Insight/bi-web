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

    <div class="side-panel-table table-min-height" v-bind:class="{'loading-indicator': loading}">
      <div class="columns is-mobile">
        <div class="column pr-0">
          <BaseTable
              v-show="records.length > 0"
              v-bind:show-expand-controls="true"
              v-bind:editable="true"
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
                  v-bind:state="sidePanelState"
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
      <PaginationControls v-show="records.length > 0"
                          v-bind="$props"
                          v-on:paginate="closePanelAndReEmit('paginate', $event)"
                          v-on:paginate-toggle-all="closePanelAndReEmit('paginate-toggle-all', $event)"
                          v-on:paginate-page-size="closePanelAndReEmit('paginate-page-size', $event)"/>

      <template v-if="records.length === 0">
        <slot v-if="this.loading !== true" name="emptyMessage" />
      </template>
    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Pagination} from "@/breeding-insight/model/BiResponse";
  import BaseTable from '@/components/tables/BaseTable.vue'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import SidePanelTableRow from '@/components/tables/SidePanelTableRow.vue'
  import PaginationControls from '@/components/tables/PaginationControls.vue'
  import { createMachine, interpret } from '@xstate/fsm';
  import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";
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
    data: () => ({})
  })
  export default class SidePanelTable extends Vue {

    @Prop()
    records!: Array<any>;
    @Prop()
    pagination!: Pagination;
    @Prop()
    autoHandleClosePanelEvent!: boolean;
    @Prop()
    sidePanelState!: SidePanelTableEventBusHandler;
    @Prop()
    loading!: boolean;

    private BreakpointEvent = BreakpointEvent;
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

    @Watch('autoHandleClosePanelEvent', {immediate: true})
    public setupClosePanelEvent(newVal: boolean) {
      if (newVal){
        this.sidePanelState.bus.$on(this.sidePanelState.requestClosePanelEvent, this.confirmClose);
      } else {
        this.sidePanelState.bus.$off(this.sidePanelState.requestClosePanelEvent, this.confirmClose);
      }
    }

    confirmClose() {
      this.sidePanelState.bus.$emit(this.sidePanelState.confirmCloseEditEvent);
    }

    created() {
      this.collapseService.subscribe(state => {
        this.state = CollapseColumnsState[state.value as keyof typeof CollapseColumnsState];
      });
      this.collapseService.start();

      this.sidePanelState.bus.$on(this.sidePanelState.confirmOpenPanel, () => { this.collapseService.send(PanelEvent.OPEN); });
      this.sidePanelState.bus.$on(this.sidePanelState.closePanelEvent, () => { this.collapseService.send(PanelEvent.CLOSED); });
    }

    // send events and allow caller to customize what column(s) are shown for collapsed state
    collapse() {
      this.sidePanelState.bus.$emit(this.sidePanelState.collapseColumnsEvent);
    }

    unCollapse() {
      this.sidePanelState.bus.$emit(this.sidePanelState.uncollapseColumnsEvent);
    }

    closePanelAndReEmit(eventType: string, event: any) {
      this.sidePanelState.bus.$emit(this.sidePanelState.closePanelEvent, () => {this.$emit(eventType, event)});
    }

  }
</script>

