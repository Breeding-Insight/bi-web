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
    <div class="columns">
      <div class="column is-one-half">
        <BasicSelectField
            v-model="selectedVariable"
            v-bind:options="variables"
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
    <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { Plotly } from 'vue-plotly'
import BasicSelectField from "@/components/forms/BasicSelectField.vue";

@Component({
      components: {Plotly, BasicSelectField}
    }
)

export default class ObservationsPlot extends Vue {

  private data = [{
    x: [1,2,3,4],
    y: [10,15,13,17],
    type:"scatter"
  }];

  private layout = {
    title: "My graph"
  };

  private variables = ["test1", "test2"];
  private plotTypes = ["Scatter Plot", "Histogram"];
  private selectedVariable : string | undefined;
  private selectedPlotType : string | undefined;

}

</script>