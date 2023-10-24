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
  <div class="germplasm">
    <h1 class="title">
      Germplasm
    </h1>

    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'germplasm-all', params: {programId: activeProgram.id}}"
              tag="li"
              active-class="is-active"
          >
            <a>View</a>
          </router-link>
          <router-link
              v-bind:to="{name: 'germplasm-lists', params: {programId: activeProgram.id}}"
              tag="li"
              active-class="is-active"
          >
            <a>Lists</a>
          </router-link>
            <ActionMenu
                class = "is-pulled-right has-text-weight-bold above-tabs-button"
                v-bind:is-primary="true"
                        v-bind:id="'manage-experiment-dropdown-button'"
                        v-bind:button-text="'Manage Germplasm'"
                        v-bind:action-menu-items=actions
                        v-on:import-file="importFile()"
                        v-on:download-file="downloadFile()"
            />

        </ul>
      </nav>
    </section>

    <div class="tab-content">
      <router-view
          @show-success-notification="$emit('show-success-notification', $event)"
          @show-info-notification="$emit('show-info-notification', $event)"
          @show-error-notification="$emit('show-error-notification', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import {PlusCircleIcon} from 'vue-feather-icons'
import ActionMenu from "@/components/layouts/menus/ActionMenu.vue";
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";

@Component({
  components: {
    PlusCircleIcon,
    ActionMenu
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Germplasm extends GermplasmBase {

  private activeProgram?: Program;

  private actions: ActionMenuItem[] = [
    new ActionMenuItem('germplasm-import-file', 'import-file', 'Import file', this.$ability.cannot('create', 'Import')),
    new ActionMenuItem('germplasm-download-file', 'download-file', 'Download file',  false)
  ];

  private importFile() {
    this.$router.push({
      name: 'germplasm-import',
      params: {
        programId: this.activeProgram!.id!
      },
    });
  }

  private downloadFile() {
    console.info('download file.');
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT + '/v1/programs/' + this.activeProgram.id + '/germplasm/export?fileExtension=XLS' , '_blank');
      return true;
    }
    return false;
  }
}
</script>
