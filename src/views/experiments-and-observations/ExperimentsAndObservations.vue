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
  <div class="experiments-observations">
    <h1 class="title">
      Experiments & Observations
    </h1>
    <button
        v-if="$ability.can('create', 'Import')"
        class="button is-primary is-pulled-right has-text-weight-bold"
        v-on:click="$router.push({name: 'experiment-import', params: {programId: activeProgram.id}})"
    >
        <span class="icon is-small">
          <PlusCircleIcon
              size="1.5x"
              aria-hidden="true"
          />
        </span>
      <span>
          Import Experiments & Observations
        </span>
    </button>
    <ExperimentsObservationsTable
        v-on:show-success-notification="$emit('show-success-notification', $event)"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-bind:experiments-fetch="experimentsFetch"
    >
    </ExperimentsObservationsTable>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ExperimentsObservationsTable from '@/components/experiments/ExperimentsObservationsTable.vue';
import {PlusCircleIcon} from 'vue-feather-icons'
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import TrialsAndStudiesBase from "@/components/trials/TrialsAndStudiesBase.vue";
import {ExperimentSort, ExperimentSortField} from "@/breeding-insight/model/Sort";
import {BackendPaginationController} from "@/breeding-insight/model/view_models/BackendPaginationController";
import {BiResponse} from "@/breeding-insight/model/BiResponse";
import {BrAPIService, BrAPIType} from "@/breeding-insight/service/BrAPIService";

@Component({
  components: {
    ExperimentsObservationsTable, PlusCircleIcon
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentsAndObservations extends TrialsAndStudiesBase {

  private activeProgram?: Program;

  // Set the method used to populate the experiment table
  private experimentsFetch: (programId: string, sort: ExperimentSort, paginationController: BackendPaginationController) => ((filters: any) => Promise<BiResponse>) =
      function (programId: string, sort: ExperimentSort, paginationController: BackendPaginationController) {
        return function (filters: any) {
          return BrAPIService.get<ExperimentSortField>(
              BrAPIType.EXPERIMENT,
              programId,
              sort,
              { pageSize: paginationController.pageSize, page: paginationController.currentPage - 1 },
              filters)
        };
      };

}
</script>
