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
    <div id="out"></div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {WebR} from 'webr';
import Plotly from 'plotly.js';
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";

@Component({
  components: {
  }
})
export default class WebRPlot extends Vue {

  @Prop()
  private data!: DatasetModel;

  mounted() {
    this.plot();
  }

  async plot() {

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

    const webR = new WebR({interactive: false});
    console.log('new');
    await webR.init();
    console.log('init');
    console.log(JSON.stringify(this.data.data));

    await webR.objs.globalEnv.bind('jsonString', JSON.stringify(this.data.data));

    await webR.installPackages(['jsonlite', 'purrr', 'tidyr', 'ggplot2', 'plotly'], true);
    const plotlyData = await webR.evalRString(`
    library(purrr)
    library(tidyr)
    library(ggplot2)
    library(plotly)
    library(jsonlite)

    #data <- fromJson(jsonString)

    p <- mtcars %>%
    keep(is.numeric) %>%
    gather() %>%
    ggplot(aes(value)) +
    facet_wrap(~ key, scales = "free") +
    geom_histogram() +
    ggtitle("Histograms")

    plotly_json(p, pretty = FALSE)
    `);

    Plotly.newPlot('out', JSON.parse(plotlyData), {});
  }

}
</script>


