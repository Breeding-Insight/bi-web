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

  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import GermplasmTable from '@/components/germplasm/GermplasmTable.vue';
import {mapGetters} from 'vuex';
import {Program} from '@/breeding-insight/model/Program';
import GermplasmDownloadButton from '@/components/germplasm/GermplasmDownloadButton.vue';
import BrAPI from '@solgenomics/brapijs';
import GraphicalFilter from '@solgenomics/brapi-graphical-filtering';


@Component({
  components: {GermplasmTable, GermplasmDownloadButton},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmAdvancedSearch extends GermplasmBase {

  private activeProgram?: Program;

  mounted() {
    this.drawGraphicalFilter();
  }


  drawGraphicalFilter() {
    /**
     * BrAPI - initializes a BrAPI client handler
     *
     * @param   {String} server      URL without trailing '/' to the BrAPI endpoint
     * @param   {String} version     Optional. BrAPI version of endpoint (e.g. "1.2" or "v1.1")
     * @param   {String} auth_token  Optional. BrAPI Auth Bearer token.
     * @param   {Int}    call_limit  Optional. Maximum number of simultanious calls the server which can be running.
     * @param   {String} credentials Optional. credentials option to use for fetch API.  See: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     * @returns {EmptyBrAPINode}
     */
    let gf = GraphicalFilter(
        // BrAPI search of observationUnits to be displayed
        BrAPI(`${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram!.id}/brapi/v2`,
            undefined,
            undefined,
            undefined,
            'include').search_observations(),
        // Accessor describing traits for each observationUnit (returns object)
        function (d) {
          var traits = {}
          d.observations.forEach(function (obs) {
            traits[obs.observationVariableName] = obs.value;
          });
          return traits;
        },
        // Accessor describing extra columns to display in the table (returns object)
        function (d) {
          return {
            'Accession': d.germplasmName
          }
        },
        // Order to display the above columns in (array)
        ["Accession"],
        // key to group observationUnits by in the table (key value or undefined for no grouping)
        function (d) { // groupBy function
          return d.germplasmDbId
        }
    );

    gf.draw("#filter_div","#filtered_results");

  }

}
</script>
