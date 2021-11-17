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
      v-bind:active="true"
      v-bind:ontologySort="activeOntologySort"
      v-on:newSortColumn="newSortColumn"
      v-on:toggleSortOrder="toggleSortOrder"
      @show-success-notification="$emit('show-success-notification', $event)"
      @show-info-notification="$emit('show-info-notification', $event)"
      @show-error-notification="$emit('show-error-notification', $event)"
  >
  </ontology-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import OntologyTable from "@/components/ontology/OntologyTable.vue";
import {mapGetters, mapMutations} from 'vuex'
import {
  ACTIVE_ONT_NEW_SORT_COLUMN,
  ACTIVE_ONT_TOGGLE_SORT_ORDER
} from "@/store/sorting/mutation-types";
import {OntologySort, OntologySortField} from "@/breeding-insight/model/Sort";

@Component({
  components: {OntologyTable},
  computed: {
    ...mapGetters('sorting',[
      'activeOntologySort'
    ])
  },
  methods: {
    ...mapMutations('sorting', {
      newSortColumn: ACTIVE_ONT_NEW_SORT_COLUMN,
      toggleSortOrder: ACTIVE_ONT_TOGGLE_SORT_ORDER
    })
  }
})

export default class OntologyActiveTable extends Vue {

  private activeOntologySort!: OntologySort;
  private newSortColumn!: (field: OntologySortField) => void;
  private toggleSortOrder!: () => void;
}
</script>
