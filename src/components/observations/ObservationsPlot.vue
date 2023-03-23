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
  <div>
    <div class="columns mb-0">
      <div class="column is-one-half pb-0">
        <!-- TODO: Make an autocomplete select -->
        <!--
        <AutoCompleteField
            class="pb-2"
            v-bind:options="studyOptions"
            v-bind:value="unit"
            v-bind:show-label="true"
            v-bind:field-name="'Study'"
            v-on:input="$emit('study-change', $event)"
        />
        -->
        <BasicSelectField
            v-model="selectedStudyId"
            v-bind:options="studyOptions"
            v-bind:field-name="'Study'"
        />
      </div>
      <div class="column is-one-half pb-0">

      </div>
    </div>
    <div class="columns">
      <div class="column is-one-half">
        <BasicSelectField
            v-model="selectedVariableId"
            v-bind:options="variableOptions"
            v-bind:field-name="'Variable'"
        />
      </div>
      <div class="column is-one-half">
        <BasicSelectField
            v-model="selectedPlotType"
            v-bind:options="plotTypes"
            v-bind:field-name="'Plot Type'"
        />
      </div>
    </div>
    <Plotly :data="data" :layout="layout" :display-mode-bar="true"></Plotly>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { Plotly } from 'vue-plotly'
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import {PaginationQuery} from "@/breeding-insight/model/PaginationQuery";
import {VariableService} from "@/breeding-insight/service/VariableService";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {SelectOption} from "@/components/observations/SelectOption";
import {ObservationVariable} from "@/breeding-insight/brapi/model/observationVariable";
import {Result} from "@/breeding-insight/model/Result";
import {Observation} from "@/breeding-insight/model/Observation";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {ObservationService} from "@/breeding-insight/service/ObservationService";
import {Study} from "@/breeding-insight/model/Study";
import {StudyService} from "@/breeding-insight/service/StudyService";
import {SeedLot} from "@/breeding-insight/brapi/model/seedLot";

@Component({
      components: {Plotly, BasicSelectField , AutoCompleteField},
      computed: {
        ...mapGetters([
          'activeProgram'
        ])
      },
    }
)

export default class ObservationsPlot extends Vue {

  private data : Array<any> = [];

  private layout = {
  };

  private activeProgram?: Program;
  private variables: Array<ObservationVariable> = [];
  private variableOptions: Array<SelectOption> = [];
  private studyOptions: Array<SelectOption> = [];

  private plotTypes = ["Scatter Plot", "Histogram"];
  private selectedVariable : string = '';
  private selectedVariableId : string = '';
  private selectedStudyId : string = '';
  private selectedPlotType : string = '';

  private observations: Observation[] = [];
  private filteredObservations: Observation[] = [];

  mounted() {
    this.getStudies();
  }

  async getStudies() {

    let paginationQuery = new PaginationQuery(1, 100000, false);

    try {
      const response: Result<Error, [Study[], Metadata]> = await StudyService.getAll(this.activeProgram!.id!, undefined, paginationQuery);
      if(response.isErr()) throw response.value;
      let [studies, metadata] = response.value;

      this.studyOptions = studies.map((study: Study) => {
        return new SelectOption(study.id, study.name);
      })

    } catch (error) {
      // Display error that studies cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load studies');
    }

  }

  getVariables() {

    let paginationQuery = new PaginationQuery(1, 100000, false);

    VariableService.getByStudyDbId(this.activeProgram!.id!, this.selectedStudyId, paginationQuery).then(([variables, metadata]) => {
      this.variables = variables;
      this.variableOptions = variables.map((variable: ObservationVariable) => {
        return new SelectOption(variable.observationVariableDbId, variable.observationVariableName);
      });
      console.log(this.variableOptions);
    }).catch((error) => {
      this.$emit('show-error-notification', 'Error while trying to load variables');
      throw error;
    });
  }

  async getObservations() {

    let paginationQuery = new PaginationQuery(1, 100000, false);

    console.log('get observations');

    try {
      const response: Result<Error, [Observation[], Metadata]> = await ObservationService.getByStudy(this.activeProgram!.id!, this.selectedStudyId, paginationQuery);
      if (response.isErr()) throw response.value;
      let [observations, metadata] = response.value;

      this.observations = observations;

    } catch (err) {
      this.$emit('show-error-notification', 'Error while trying to load observations');
    }
  }

  @Watch('selectedStudyId')
  updateStudyData() {
    console.log('studychanged');
    this.getVariables();
    this.getObservations();
  }


  //@Watch('selectedVariableId')
  get filterObservations(): Observation[] {
    return this.observations.filter(observation => {
      return observation.observationVariableId === this.selectedVariableId
    });
  }

  @Watch('selectedPlotType')
  plotTypeSelected() {

  }

  @Watch('filterObservations')
  updateData(filterObservations: Observation[]) {
    const observations : Array<number> = filterObservations.map((observation: Observation) => {
      return observation.value;
    });

    const timestamps : Array<string | null | undefined> = filterObservations.map((observation: Observation) => {
      return observation.timeStamp!.toISOString();
    });

    console.log(this.selectedPlotType);
    console.log(filterObservations);
    console.log(observations);
    console.log(timestamps);

    if (this.selectedPlotType === 'Histogram') {
      this.data = [{
        x: observations,
        type: 'histogram'
      }]
    }

    if (this.selectedPlotType === 'Scatter Plot') {
      console.log('SCATTER');
      this.data = [{
        x: timestamps,
        y: observations,
        mode: 'markers',
        type: 'scatter'
      }]
    }

  }

}

</script>