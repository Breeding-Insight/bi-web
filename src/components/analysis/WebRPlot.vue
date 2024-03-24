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
  <div class="mb-5">
    <div v-if="loading">
      <ProgressBar v-bind:label=loadingMsg />
    </div>
    <div id="out"></div>
    <div class="has-text-right">
      <a v-if="!loading" class="has-text-right" v-on:click="edit = !edit">Edit</a>
    </div>
    <div v-if="edit">
      <div class="columns">
        <div class="column is-half" style="height: 500px;">
          <template>
            <vue-monaco-editor
                v-model="codeM"
                theme="vs-dark"
                :options="MONACO_EDITOR_OPTIONS"
                :language="'r'"
                @mount="handleMount"
            />
          </template>
        </div>
        <div class="column is-half" style="height: 500px;">
          <vue-monaco-editor
              v-model="jsonData"
              theme="vs-dark"
              :options="JSON_MONACO_EDITOR_OPTIONS"
              :language="'json'"
              @mount="handleJsonMount"
          />
        </div>
      </div>

      <button class="button is-primary" v-bind:class="{ 'is-loading': codeRunning }" v-on:click="runCode">Run Code</button>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {WebR} from 'webr';
import Plotly from 'plotly.js';
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";
import ProgressBar from "@/components/forms/ProgressBar.vue";
import { Ref, ref, ShallowRef, shallowRef } from 'vue'

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
  private edit = false;
  private code = "";
  private codeM : Ref<string> = ref('// some code...');
  private jsonData = "";
  private codeRunning = false;

  private MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
  }

  private JSON_MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    wordWrap: 'on',
    minimap: { enabled: false },
    showFoldingControls: 'always',
    folding: true,
    foldingStrategy: 'indentation',
  }

  private editorRef: ShallowRef = shallowRef();
  private jsonEditor: ShallowRef = shallowRef();

  private shelter = null;
  private webr = null;

  handleMount(editor: any) {
    this.editorRef = editor;
  }

  handleJsonMount(editor: any) {
    this.jsonEditor = editor;
  }

  mounted() {
    this.plot();
  }

  async plot() {

    const webr = new WebR({interactive: false});
    this.loadingMsg = "Loading webR environment";
    await webr.init();

    //this.shelter = await new WebR.Shelter();

    // bind dataset json data into R environment
    console.log(JSON.stringify(this.data));
    this.jsonData = JSON.stringify(this.data);
    await webr.objs.globalEnv.bind('jsonStr', JSON.stringify(this.data));

    this.loadingMsg = "Installing webR packages";

    await webr.installPackages(['jsonlite', 'ggplot2', 'plotly'], true);

    this.loadingMsg = "Fetching widget source code";

    const response = await fetch('https://raw.githubusercontent.com/nickpalladino/analysis-widgets/main/histograms.R', {
      method: 'GET',
    });
    this.code = await response.text();
    this.codeM = this.code;
    console.log(this.code);

    this.loadingMsg = "Running R code";
    const plotlyData = await webr.evalRString(this.code);

    this.loading = false;
    Plotly.newPlot('out', JSON.parse(plotlyData), {});

    // TODO: this is causing an error on the console
    this.webr = webr;
  }

  async runCode() {
    this.codeRunning = true;
    console.log(this.codeM);

    // TODO: manage resources properly, shelter?
    /*
    const result = await this.shelter.captureR(this.codeM, {
      withAutoprint: true,
      captureStreams: true,
      captureConditions: false
    });

    console.log(result);
    */


    // TODO: handle errors in case code syntax errors, etc.
    const plotlyData = await this.webr.evalRString(this.codeM);
    console.log(plotlyData);

    Plotly.newPlot('out', JSON.parse(plotlyData), {});

    // TODO: isn't working
    Plotly.relayout('out', {
      'xaxis.autorange': true,
      'yaxis.autorange': true
    });

    this.codeRunning = false;

  }

}
</script>


