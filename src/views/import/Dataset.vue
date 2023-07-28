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
import {Trial} from '@/breeding-insight/model/Trial';

@Component({
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class Dataset extends ProgramsBase {
  private activeProgram: Program;
  private datasetModel: DatasetModel;
  private experiment: Trial;
  private loading: boolean = true;
  private resultDatasetId: string;


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