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
  <div class="experiment" v-if="!experimentLoading && experiment!=null">
    <router-link v-bind:to="{name: 'experiments-observations', params: {programId: activeProgram.id}}">
      &lt; All Experiments
    </router-link>
    <div class="mb-4" />
    <h1 class="title">
      {{experiment.trialName}}
    </h1>
      <span class="is-pulled-right is-flex" >
        <router-link
            v-bind:to="{name: 'experiment-import', params: {programId: activeProgram.id}}"
            role="menuitem"
            class="button is-primary is-outlined mr-2"
        >
          Import file
        </router-link>

        <ExperimentObservationsDownloadButton
            v-bind:modal-title="`Download ${experiment.trialName}`"
            v-bind:trial-db-id="experimentUUID"
            v-on:show-error-notification ="$emit('show-error-notification', $event)"
            anchor-class="button is-primary is-outlined"
        >
          Download file
        </ExperimentObservationsDownloadButton>
      </span>


    <div v-if="!experimentLoading && experiment!=null">
      <br/>
      <div class="columns is-multiline is-align-items-stretch mt-4">
        <article class="column ">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Description: </b> {{experiment.trialDescription}}</li>
              <li><b>Experimental unit: </b> {{ experimentalUnit }}</li>
              <li><b>Type: </b> {{ experimentType }}</li>
              <li><b>User: </b> {{ userName }}</li>
              <li><b>Creation Date: </b> {{ createdDate }}</li>
              <li><b>Experimental design: </b>Externally generated</li>
            </ul>
          </section>
        </article>
        <article class="column px-2">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Germplasm: </b> {{ germplasmCount }}</li>
              <li><b>Environments: </b> {{ environmentsCount }}</li>
            </ul>
          </section>
        </article>
      </div>

    </div>
    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
              v-bind:to="{name: 'experiment_obs_dataset', params: {programId: activeProgram.id, experimentId: experimentUUID, datasetId: 'observation'}}"
              tag="li" active-class="is-active">
            <a>Observation Dataset</a>
          </router-link>
        </ul>
      </nav>
    </section>
    <div class="tab-content">
      <router-view
          @show-success-notification="$emit('show-success-notification', $event)"
          @show-info-notification="$emit('show-info-notification', $event)"
          @show-error-notification="$emit('show-error-notification', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {PlusCircleIcon} from 'vue-feather-icons'
import TrialsAndStudiesBase from "@/components/trials/TrialsAndStudiesBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import {Result} from "@/breeding-insight/model/Result";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import ClickOutside from 'vue-click-outside';
import {Trial} from "@/breeding-insight/model/Trial";
import ExperimentObservationsDownloadButton from "@/components/experiments/ExperimentObservationsDownloadButton.vue";

@Component({
  components: {
    PlusCircleIcon,
    ExperimentObservationsDownloadButton
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  },
  directives: {
    ClickOutside
  }
})
export default class ExperimentDetails extends TrialsAndStudiesBase {
  private activeProgram: Program;
  private experiment: Trial;
  private experimentLoading: boolean = true;
  private actionSelectActive: boolean = false;


  mounted () {
    this.getExperiment();
  }


  get experimentUUID(): string {
    return this.$route.params.experimentId;
  }

  get userName(): string {
    if( !this.experiment.additionalInfo ){return '';}
    if( !this.experiment.additionalInfo.createdBy){return '';}
    return this.experiment.additionalInfo.createdBy.userName;
  }
  get experimentalUnit(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.defaultObservationLevel;
  }
  get experimentType(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.experimentType;
  }
  get createdDate(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.createdDate;
  }
  get germplasmCount(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.germplasmCount;
  }
  get environmentsCount(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.environmentsCount;
  }

  @Watch('$route')
  async getExperiment () {
    this.experimentLoading = true;
    try {
      const response: Result<Error, Trial> = await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID, true);
      if (response.isErr()) {
        throw response.value;
      }
      this.experiment = response.value;
    } catch (err) {
      // Display error that experiment cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load experiment');
      throw err;
    } finally {
      this.experimentLoading = false;
    }
  }

  downloadFile(){
    alert("'Download file' is not yet implemented.");
    this.actionSelectActive = false;
  }
  hideActionSelector(){
    this.actionSelectActive = false;
  }

}
</script>