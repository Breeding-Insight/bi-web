<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <tr v-bind:class="{'is-new': (rowData.new && !rowData.edit), 'is-selected': rowData.edit}" >
    <slot></slot>
    <template v-if="rowData.editable">
      <td class="has-text-right">
        <a
          v-on:click="$emit('edit')"
          v-on:keypress.enter.space="$emit('edit')"
          tabindex="0"
        >
          Edit
        </a>
        <span v-if="!rowData.edit" class="icon is-small margin-right-2 has-vertical-align-middle">
          <ChevronRightIcon size="1x" aria-hidden="true"></ChevronRightIcon>
        </span>
        <span v-if="rowData.edit" class="icon is-small margin-right-2 has-vertical-align-middle">
          <ChevronDownIcon size="1x" aria-hidden="true"></ChevronDownIcon>
        </span>
        <a
          v-on:click="$emit('remove')"
          v-on:keypress.enter.space="$emit('remove')"
          tabindex="0"
        >
          Deactivate
        </a>
      </td>
    </template>
  </tr>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {ChevronRightIcon, ChevronDownIcon} from 'vue-feather-icons'

  @Component({
    components: { ChevronRightIcon, ChevronDownIcon }
  })
  export default class BaseTableRow extends Vue {

    // Knows its row values and its column objects
    @Prop()
    rowData!: any;
  }
</script>