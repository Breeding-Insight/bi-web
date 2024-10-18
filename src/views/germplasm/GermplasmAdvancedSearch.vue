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
  <div id="germplasm-advanced-search">
      <div id="filter_div"></div>
      <div style="width:100%;overflow-x:scroll;">
        <table id="filtered_results"></table>
      </div>
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
import * as d3 from 'd3';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import '@solgenomics/brapi-graphical-filtering/css/GraphicalFilter.css';
import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core';

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
    window.d3 = Object.assign(
        d3
    );
    window.$ = $;

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
    const brapiClient = BrAPI(
        `${process.env.VUE_APP_BI_API_V1_PATH}/programs/${this.activeProgram.id}/brapi/v2`,
        undefined,
        undefined,
        undefined,
        'include'
    );

    const params = {
      "includeObservations": true
    };

    // Get brapi_node
    const brapiNode = brapiClient.observationunits(params);

    // Create GraphicalFilter without changing its code
    let gf = GraphicalFilter(
        brapiNode,
        // Accessor describing traits for each observationUnit (returns object)
        function(d) {
          console.log(d);
          var traits = {}
          d.observations.forEach(function(obs){
            traits[obs.observationVariableName] = obs.value;
          });
          console.log(traits);
          return traits;
        },
        // Accessor describing extra columns to display in the table (returns object)
        function(d) {
          return {
            'GID':d.additionalInfo.gid,
            'Germplasm Name':d.germplasmName,
            'Experiment':d.trialName,
            'Environment':d.studyName,
            'Exp Unit ID':d.observationUnitName
          }
        },
        // Order to display the above columns in (array)
        ["GID", "Germplasm Name", "Experiment", "Environment", "Exp Unit ID"],
        // key to group observationUnits by in the table (key value or undefined for no grouping)
        undefined
        //function(d) { // groupBy function
        //  return d.observationUnitDbId
        //}
    );

    // Draw the filter
    gf.draw("#filter_div", "#filtered_results");

  }

}
</script>
