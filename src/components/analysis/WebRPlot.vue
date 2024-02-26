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

    this.loadingMsg = "Loading webR environment";

    const webR = new WebR({interactive: false});
    await webR.init();

    // bind dataset json data into R environment
    console.log(JSON.stringify(this.data));
    await webR.objs.globalEnv.bind('jsonStr', JSON.stringify(this.data));

    this.loadingMsg = "Installing webR packages";

    await webR.installPackages(['jsonlite', 'ggplot2', 'plotly'], true);

    this.loadingMsg = "Fetching widget source code";

    const response = await fetch('https://raw.githubusercontent.com/nickpalladino/analysis-widgets/main/histograms.R', {
      method: 'GET',
    });
    const codeText = await response.text();
    console.log(codeText);

    this.loadingMsg = "Running R code";
    const plotlyData = await webR.evalRString(codeText);

    this.loading = false;
    Plotly.newPlot('out', JSON.parse(plotlyData), {});
  }

}
</script>


