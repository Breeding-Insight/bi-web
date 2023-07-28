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
  <div id="data_set">
    <div v-if="loading">
      loading dataset...
      <progress
        class="progress is-normal"
        max="80"
      />
    </div>
    <article
      v-if="!loading"
      class="message is-success"
    >
      <div class="message-body">
        <div class="columns is-multiline">
          <div class="column is-one-fifth">
            <div class="has-text-right">
              <b>Observation unit: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{ observationUnit }}</span><br>
              <b>Phenotypes: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{ phenotypesCount }}</span><br>
              <b>Total observations: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{ totalObservationsCount }}</span><br>
              <b>Observations with data: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{ observationsWithData }}</span><br>
              <b>Observations without data: </b> <span style="width: 30px;" class="is-inline-block has-text-left">{{ observationsWithoutData }}</span><br>
            </div>
          </div>
        </div>
      </div>
    </article>
    <ExpandableTable
        v-bind:records.sync="datasetTableRows"
        v-bind:loading="false"
        v-bind:pagination="paginationController"
        v-bind:default-sort="['observationUnits.germplasmName', 'asc']"
        v-bind:debounce-search="400"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
    >
      <b-table-column
          v-slot="props"
          field="data.germplasmName"
          label="Germplasm Name"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.germplasmName }}
      </b-table-column>
      <b-table-column
          v-slot="props"
          field="data.studyName"
          label="Env"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.env }}
      </b-table-column>
      <b-table-column
          v-slot="props"
          field="data.envLocation"
          label="Env Location"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.envLocation }}
      </b-table-column>
      <b-table-column
          v-slot="props"
          field="data.observationUnitName"
          label="Exp Unit ID"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.expUnitId }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.observationUnitID"
        label="ObsUnitID"
        sortable
        searchable
        :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.obsUnitId }}
      </b-table-column>
      <b-table-column
          v-for="( {trait}, index ) in this.datasetModel.observationVariables" :key="trait.traitName"
          v-slot="props"
          field="data.observationUnitID"
          :label="removeUnique( trait.traitName )"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.traitValues[index] }}
      </b-table-column>
      <template v-slot:emptyMessage>
        <p class="has-text-weight-bold">
          No datasets exist.
        </p>
      </template>
    </ExpandableTable>
  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {Result} from "@/breeding-insight/model/Result";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import {Program} from "@/breeding-insight/model/Program";
import {mapGetters} from "vuex";
import {ObservationUnit} from "@/breeding-insight/model/ObservationUnit";
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import ExpandableTable from "@/components/tables/expandableTable/ExpandableTable.vue";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import {ExternalReferences} from "@/breeding-insight/brapi/model/externalReferences";
import {DatasetTableRow} from "@/breeding-insight/model/DatasetTableRow";

@Component({
  components: {
    ExpandableTable
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Dataset extends ProgramsBase {
  private activeProgram: Program;
  private datasetModel: DatasetModel = [];
  private experiment: Experiment;
  private observationUnits: ObservationUnit[] = [];
  private loading: boolean = true;
  private resultDatasetId: string;
  private paginationController: PaginationController = new PaginationController();
  private datasetTableRows: DatasetTableRow[] = [];

  private unitDbId_to_traitValues = {};

  mounted () {
    this.load();
  }

  @Prop()
  private datasetId?: string;

  get experimentUUID(): string {
    return this.$route.params.experimentId;
  }

  get observationUnit(): string{
    let ou = "NA"
    if(this.experiment && this.experiment.additionalInfo && this.experiment.additionalInfo.defaultObservationLevel){
      ou = this.experiment.additionalInfo.defaultObservationLevel;
    }
    return ou;
  }

  get phenotypesCount(): number{
    let count = 0;

    if(this.datasetModel && this.datasetModel.observationVariables){
      count = this.datasetModel.observationVariables.length;
    }
    return count
  }

  // Total observations
  get totalObservationsCount(): number {
    let count = 0;

    if(this.datasetModel && this.datasetModel.observationUnits){
      let ouCount = this.datasetModel.observationUnits.length;
      count = ouCount * this.phenotypesCount;
    }
    return count
  }

  // Observations with data
  get observationsWithData(): number {
    let count = 0;
    if(this.datasetModel && this.datasetModel.data){
      count = this.datasetModel.data.length;
    }
    return count
  }

  // Observations without data
  get observationsWithoutData(): number {
    return this.totalObservationsCount-this.observationsWithData
  }
  getBreedingInsightId(refs: ExternalReferences, source: string): string{
    return BrAPIUtils.getBreedingInsightId(refs, source);
  }

  removeUnique(str: string): string{
    str = str.trim();
    const reg = /\[[^\]]*\]$/;
    return str.replace(reg, '').trim();
  }

  createDatasetTableRows (){
    for (let unit of this.datasetModel.observationUnits) {
      let datasetTableRow: DatasetTableRow = new DatasetTableRow();
      datasetTableRow.germplasmName = this.removeUnique(unit.germplasmName);

      datasetTableRow.env = this.removeUnique(unit.studyName);
      datasetTableRow.envLocation = this.removeUnique(unit.locationName);
      datasetTableRow.expUnitId = this.removeUnique(unit.observationUnitName);
      datasetTableRow.obsUnitId = BrAPIUtils.getBreedingInsightId(unit.externalReferences, "/observationunits");
      datasetTableRow.traitValues = this.unitDbId_to_traitValues[ unit.observationUnitDbId ];
      this.datasetTableRows.push(datasetTableRow);
    }
  }

  createUnitDbId_to_traitValues(): {} {
    let unitDbId_to_traitValues = {};
    let arrayLength:number = this.phenotypesCount;

    let units: [ObservationUnit] = this.datasetModel.observationUnits;
    for (let unit of units) {
      unitDbId_to_traitValues[unit.observationUnitDbId] = new Array<string>(arrayLength);
    }
    for (let observation of this.datasetModel.data) {
      let variableDbId_to_index = this.createVariableDbId_to_index();
      let obsVar_index = variableDbId_to_index[observation.observationVariableDbId];
      let obs_value = observation.value;
      let unitDbId = observation.observationUnitDbId;
      let traitValueArray = unitDbId_to_traitValues[unitDbId];
      traitValueArray[obsVar_index] = obs_value;
      }
    return unitDbId_to_traitValues;
  }


  createVariableDbId_to_index(): {}{
    let variableDbId_to_index = {}
    for (let index = 0; index < this.datasetModel.observationVariables.length; index++) {
      variableDbId_to_index[ this.datasetModel.observationVariables[index].observationVariableDbId ] = index;
    }
    return variableDbId_to_index;
  }



  @Watch('$route')
  async load () {
    this.loading = true;

    //Set this.experiment
    let experimentResult =  await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID,false);
    this.experiment = experimentResult.value;

    if( this.datasetId==='observation'){
      this.resultDatasetId = this.experiment.additionalInfo.observationDatasetId;
    }
    else{
      this.resultDatasetId = this.datasetId;
    }

    try {
      // Set this.datasetModel
      const response: Result<Error, DatasetModel> = await ExperimentService.getDatasetModel(this.activeProgram!.id!, this.experimentUUID, this.resultDatasetId);
      this.datasetModel = response.result;

      // Use this.datasetModel to initialize this.unitDbId_to_traitValues
      this.unitDbId_to_traitValues = this.createUnitDbId_to_traitValues();

      // Use this.datasetModel to initialize this.datasetTableRows
      this.createDatasetTableRows();

      //Initialize the paginationController
      this.paginationController.totalCount = this.observationUnits.length;
      this.paginationController.currentPage = 1;
      this.paginationController.totalPages = this.paginationController.totalCount.valueOf() / this.paginationController.pageSize.valueOf();

    } catch (err) {
      // Display error that experiment cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load data set' + err.message());
      throw err;
    } finally {
      this.loading = false;
    }
  }
}
</script>
