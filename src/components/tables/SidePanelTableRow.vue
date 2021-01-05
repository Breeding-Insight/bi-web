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
  <tr v-on:click="state.bus.$emit(state.selectRowEvent, rowData)"
      v-bind:class="{'is-new': (rowData.new && !rowData.selected), 'is-selected': checkIsOpen()}" >
    <slot></slot>
    <td class="has-text-right is-narrow">
        <a
          v-if="!checkIsOpen()"
          data-testid="showDetails"
          v-on:click.stop="state.bus.$emit(state.openPanelEvent, rowData)"
          v-on:keypress.enter.space.stop="state.bus.$emit(state.openPanelEvent, rowData)"
          tabindex="0"
        >
          Show details
        </a>
        <ChevronRightIcon
          v-if="!checkIsOpen()"
          class="has-vertical-align-middle has-text-link"
          size="1x"
          aria-hidden="true">
        </ChevronRightIcon>
    </td>
    
  </tr>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import { TableRow } from '@/breeding-insight/model/view_models/TableRow';
  import {ChevronRightIcon} from 'vue-feather-icons'
  import {SidePanelTableEventBusHandler} from "@/components/tables/SidePanelTableEventBus";

  @Component({
    components: {
      ChevronRightIcon
    }
  })
  export default class SidePanelTableRow extends Vue {

    // Knows its row values and its column objects
    @Prop()
    rowData!: TableRow<any>;
    @Prop()
    state!: SidePanelTableEventBusHandler;

    checkIsOpen(): boolean {
      if (this.rowData === this.state.openedRow) {
        return true;
      } else {
        return false;
      }
    }

  }
</script>