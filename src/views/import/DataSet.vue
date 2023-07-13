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
    </div>
    <div v-if="!loading" class="detail">
      <div class="columns is-multiline is-align-items-stretch mt-4">
        <article class="column ">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Observation unit: </b> {{ observationUnit }}</li>
              <li><b>phenotypes: </b> {{ phenotypesCount }}</li>
              <li><b>Total observations: </b> {{ totalObservationsCount }}</li>
              <li><b>Observations with data: </b> {{ observationsWithData }}</li>
              <li><b>Observations without data: </b> {{ observationsWithoutData }}</li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import {Result} from "@/breeding-insight/model/Result";
import {Dataset} from "@/breeding-insight/model/Dataset";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import {Program} from "@/breeding-insight/model/Program";
import {mapGetters} from "vuex";

@Component({
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class DataSet extends ProgramsBase {
  private activeProgram: Program;
  private dataSet: Dataset;
  private experiment: Experiment;
  private loading: boolean = true;
  private resultDatasetId: string;


  mounted () {
    this.getDataSetAndExperiment();
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

  get phenotypesCount(): string{
    let count = 'N/A';

    if(this.dataSet && this.dataSet.observationVariables){
      let nCount = this.dataSet.observationVariables.length;
      count = String(nCount);
    }
    return count
  }

  // Total observations
  get totalObservationsCount(): string {
    let count = 'N/A';

    if(this.dataSet && this.dataSet.observationUnits){
      let ouCount = this.dataSet.observationUnits.length;
      if(this.dataSet && this.dataSet.observationVariables){
        let oVarCount = this.dataSet.observationVariables.length;
        count = String(ouCount * oVarCount);
      }
    }
    return count
  }

  // Observations with data
  get observationsWithData(): string {
    let count = 'N/A';

    if(this.dataSet && this.dataSet.data){
      let nCount = this.dataSet.data.length;
      count = String(nCount);
    }
    return count
  }

  // Observations without data
  get observationsWithoutData(): string {
    let count = 'N/A';

    if(this.dataSet && this.dataSet.observationUnits){
      let ouCount = this.dataSet.observationUnits.length;
      if(this.dataSet && this.dataSet.observationVariables){
        let oVarCount = this.dataSet.observationVariables.length;
        let totalObs = (ouCount * oVarCount);
        if(this.dataSet && this.dataSet.data){
          let obsWithData = this.dataSet.data.length;
          count = String(totalObs-obsWithData);
        }
      }
    }

    return count
  }

  @Watch('$route')
  async getDataSetAndExperiment () {
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
      const response: Result<Error, DataSet> = await ExperimentService.getDataSet(this.activeProgram!.id!, this.experimentUUID, this.resultDatasetId);
      this.dataSet = response.result;
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