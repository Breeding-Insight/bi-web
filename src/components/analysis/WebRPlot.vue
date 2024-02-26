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
    <div v-if="loading">
      <ProgressBar v-bind:label=loadingMsg />
    </div>
    <div id="out" class="mb-5" ></div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {WebR} from 'webr';
import Plotly from 'plotly.js';
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import ProgressBar from "@/components/forms/ProgressBar.vue";

@Component({
  components: {
    ProgressBar
  }
})
export default class WebRPlot extends Vue {

  @Prop()
  private data!: DatasetModel;

  private loading = true;
  private loadingMsg = "";

  mounted() {
    this.plot();
  }

  async plot() {

    /*
    const response = await fetch('http://192.168.0.11:8083/brapi/v2/observations?studyDbId=9df80d67-3eee-4557-a5f0-d7db4fe78461', {
      mode:  'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseJson = await response.json();
    console.log(responseJson.result.data);
    console.log(JSON.stringify(responseJson.result.data));
     */

    this.loadingMsg = "Loading webR environment";

    const webR = new WebR({interactive: false});
    await webR.init();

    // bind dataset json data into R environment
    console.log(JSON.stringify(this.data));
    await webR.objs.globalEnv.bind('jsonStr', JSON.stringify(this.data));

    this.loadingMsg = "Installing webR packages";

    await webR.installPackages(['jsonlite', 'ggplot2', 'plotly'], true);

    this.loadingMsg = "Running R code";

    const plotlyData = await webR.evalRString(`
    library(ggplot2)
    library(plotly)
    library(jsonlite)

    data <- fromJSON(jsonStr)
    obs <- data$data

    # Filter out non numeric observation values
    obs$value <- as.numeric(as.character(obs$value))
    df_filtered <- obs %>% filter(!is.na(value))

    p <- ggplot(df_filtered, aes(x = value)) +
      geom_histogram() +
      facet_wrap(~ observationVariableName, scales = "free") +
      labs(title = "Histograms for Each Numeric Observation Variable",
           x = "Value",
           y = "Count")

    plotly_json(p, pretty = FALSE)
    `);

    this.loading = false;
    Plotly.newPlot('out', JSON.parse(plotlyData), {});
  }

}
</script>


