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
      <progress class="progress is-normal" max="80"></progress>
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
        v-bind:records.sync="observationUnits"
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
        {{ props.row.data.studyName }}
      </b-table-column>
      <b-table-column
          v-slot="props"
          field="data.locationName"
          label="Env Location"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.locationName }}
      </b-table-column>
      <b-table-column
          v-slot="props"
          field="data.observationUnitName"
          label="Exp Unit ID"
          sortable
          searchable
          :th-attrs="(column) => ({scope:'col'})"
      >
        {{ props.row.data.observationUnitName }}
      </b-table-column>
      <b-table-column
        v-slot="props"
        field="data.observationUnitName"
        label="Exp Unit ID"
        sortable
        searchable
        :th-attrs="(column) => ({scope:'col'})"
    >
      {{ props.row.data.observationUnitName }}
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
  private datasetModel: DatasetModel;
  private experiment: Experiment;
  private observationUnits: ObservationUnit[] = [];
  private loading: boolean = true;
  private resultDatasetId: string;
  private paginationController: PaginationController = new PaginationController();


  mounted () {
    this.getDatasetModelAndExperiment();
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

  @Watch('$route')
  async getDatasetModelAndExperiment () {
    this.loading = true;


    let experimentResult =  await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID,false);
    this.experiment = experimentResult.value;

    if( this.datasetId==='observation'){
      this.resultDatasetId = this.experiment.additionalInfo.observationDatasetId;
    }
    else{
      this.resultDatasetId = this.datasetId;
    }
    try {
      const response: Result<Error, DatasetModel> = await ExperimentService.getDatasetModel(this.activeProgram!.id!, this.experimentUUID, this.resultDatasetId);
      this.datasetModel = response.result;
      this.observationUnits = this.datasetModel.observationUnits;
console.log("wwwwwwwwwwwwwwwwwww");
console.log(this.observationUnits.length);
      console.log("wwwwwwwwwwwwwwwwwww");
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
