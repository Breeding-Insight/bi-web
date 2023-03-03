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
  <ontology-table
      v-bind:active="false"
      v-bind:ontologySort="archivedOntologySort"
      v-bind:ontologyFetch="ontologyFetch"
      v-on:updateSort="updateSort"
      @show-success-notification="$emit('show-success-notification', $event)"
      @show-info-notification="$emit('show-info-notification', $event)"
      @show-error-notification="$emit('show-error-notification', $event)"
  >
  </ontology-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import OntologyTable from "@/components/ontology/OntologyTable.vue";
import { mapGetters, mapMutations } from 'vuex'
import { UPDATE_ARCHIVED_ONT_SORT } from "@/store/sorting/mutation-types";
import { OntologySort } from "@/breeding-insight/model/Sort";
import { BackendPaginationController } from "@/breeding-insight/model/view_models/BackendPaginationController";
import { BiResponse } from "@/breeding-insight/model/BiResponse";
import { TraitField } from "@/breeding-insight/model/TraitSelector";
import {TraitService } from "@/breeding-insight/service/TraitService";


@Component({
  components: {OntologyTable},
  computed: {
    ...mapGetters('sorting', [
        'archivedOntologySort'
    ])
  },
  methods: {
    ...mapMutations('sorting', {
      updateSort: UPDATE_ARCHIVED_ONT_SORT
    })
  }
})
export default class OntologyArchivedTable extends Vue {

  private archivedOntologySort!: OntologySort;

  // Set the method used to populate the archived ontology table
  private ontologyFetch: (programId: string, sort: OntologySort, paginationController: BackendPaginationController) => ((filters: any) => Promise<BiResponse>) =
      function (programId: string, sort: OntologySort, paginationController: BackendPaginationController) {
        return function (filters: any) {
          filters[TraitField.STATUS] = false; // only request archived traits
          return TraitService.getTraits(
              programId,
              sort,
              { pageSize: paginationController.pageSize, page: paginationController.currentPage },
              filters)
        };
      };

}
</script>
