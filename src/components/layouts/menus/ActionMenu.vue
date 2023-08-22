<!--
  - See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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
  <b-dropdown
              position="is-bottom-left"
              append-to-body
              aria-role="menu">
    <template #trigger>
      <button
          class="button is-primary has-text-weight-bold"
          v-bind:id="dropDownId"
      >
        Actions
        <b-icon icon="chevron-down" class="ml-1"></b-icon>
      </button>
    </template>
    <b-dropdown-item v-for="menuItem in actionMenuItems" v-bind:key="menuItem.id" aria-role="menuitem" @click="$emit(menuItem.event)">
      {{menuItem.label}}
    </b-dropdown-item>

  </b-dropdown>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";

@Component({
  components: {},
})
export default class ActionMenu extends Vue {
  @Prop()
  actionMenuItems!: ActionMenuItem[];

  private dropDownId: string = "actionmenu-dropdown-button";
}

</script>