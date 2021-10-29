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
  <tr v-on:click="state.bus.$emit(state.selectRowEvent, rowData.data)"
      v-bind:class="{
        'is-new':           (rowData.new && !checkIsOpen()),
        'is-selected':      checkIsOpen(),
        'is-edit-selected': state.editActive && checkIsOpen(),
        'is-dup':            checkIsDup()}" >
    <slot></slot>

    <td class="has-text-right is-narrow">
        <a
          v-if="!state.openedRow && !checkIsOpen()"
          data-testid="showDetails"
          v-on:click.stop="state.bus.$emit(state.selectRowEvent, rowData.data)"
          v-on:keypress.enter.space.stop="state.bus.$emit(state.selectRowEvent, rowData.data)"
          tabindex="0"
        >
          Show details
        </a>
        <ChevronRightIcon
          v-if="!state.openedRow || checkIsOpen()"
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
//  import { AlertTriangleIcon } from 'vue-feather-icons';

  @Component({
    components: {
      ChevronRightIcon,
//      AlertTriangleIcon,
    }
  })
  export default class SidePanelTableRow extends Vue {

    // Knows its row values and its column objects
    @Prop()
    rowData!: TableRow<any>;
    @Prop()
    state!: SidePanelTableEventBusHandler;

    checkIsOpen(): boolean {
      // A match is either the exact row for import confirmations
      // or id match. This will have to be fixed in the future.
      // TODO: Get this to match on table rows, but still work with the editing
        if (this.state.openedRow) {
        return this.rowData.data === this.state.openedRow ||
          (this.rowData.data.id && this.rowData.data.id === this.state.openedRow.id);
      } else {
        return false;
      }
    }

    checkIsDup(): boolean {
        return this.rowData.data.isDup;
    }

  }
</script>
