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
  <div class="experiment">
    <router-link v-bind:to="{name: 'experiments-observations', params: {programId: activeProgram.id}}">
      &lt; All Experiments
    </router-link>
    <div class="mb-4"></div>
    <h1 class="title">
      Experiments & Observations Details
    </h1>
    <template v-if="!experimentLoading && experiment!=null">

      <div class="dropdown is-pulled-right"
           v-bind:class="{'is-active': actionSelectActive}"
      >
        <div class="dropdown-trigger"
             v-on:click.stop="actionSelectActive = !actionSelectActive">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Actions</span>
            <span class="icon is-small">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <router-link
                v-bind:to="{name: 'experiment-import', params: {programId: activeProgram.id}}"
                class="dropdown-item"
                active-class="is-active"
                role="menuitem"
            >
              Import file
            </router-link>
            <a class="dropdown-item"
              v-on:click="downloadFile"
            >
              Download file
            </a>
          </div>
        </div>
      </div>
    </template>
    <template v-if="!experimentLoading && experiment!=null">
<!--      <p> {{ experimentUUID }} </p>-->
<!--      <p> {{ activeProgram.id }} </p>-->

      <br/>
      <div class="columns is-multiline is-align-items-stretch mt-4">
        <article class="column ">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Description: </b> {{experiment.trialDescription}}</li>
              <li><b>Experimental unit: </b> {{ experimentalUnit }}</li>
              <li><b>User: </b> {{ userName }}</li>
              <li><b>Creation Date: </b> {{ createdDate }}</li>
            </ul>
          </section>
        </article>
        <article class="column px-2">
          <section>
            <ul style="list-style-type: none;">
              <li><b>Experiments: </b> {{ environmentsCount }}</li>
              <li><b>Germplasm: </b> {{ germplasmCount }}</li>
            </ul>
          </section>
        </article>
      </div>

    </template>
  </div>
</template>

<script lang="ts">
import {Component, Watch} from "vue-property-decorator";
import GermplasmLink from "@/components/germplasm/GermplasmLink.vue";
import {mapGetters} from "vuex";
import {PlusCircleIcon} from 'vue-feather-icons'
import TrialsAndStudiesBase from "@/components/trials/TrialsAndStudiesBase.vue";
import {Program} from "@/breeding-insight/model/Program";
import {Result} from "@/breeding-insight/model/Result";
import {Germplasm} from "@/breeding-insight/brapi/model/germplasm";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import ExperimentsObservationsTable from "@/components/experiments/ExperimentsObservationsTable.vue";

@Component({
  components: {
    PlusCircleIcon
  },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentDetails extends TrialsAndStudiesBase {
  private activeProgram?: Program;
  private experiment?: Trial;
  private environmentsCount? : number;
  private germplasmCount? : number;
  private experimentLoading: boolean = true;
  private actionSelectActive: boolean = false;


  mounted () {
    console.log("-------mount----------");
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
  get createdDate(): string {
    if( !this.experiment.additionalInfo ){return '';}
    return this.experiment.additionalInfo.createdDate;
  }

  @Watch('$route')
  async getExperiment () {
    this.experimentLoading = true;
    try {
      const response: Result<Error, Trial> = await ExperimentService.getSingleExperiment(this.activeProgram!.id!, this.experimentUUID);
      if (response.isErr()) {
        throw response.value;
      }
      this.experiment = response.value["trialData"];
      this.environmentsCount = response.value["environmentsCount"];
      this.germplasmCount = response.value["germplasmCount"];

      console.log(',.,,..,.,.,.,.,.,Experiment ,.,,.,...,.,.,.,');
      console.log(this.experiment);

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
  }

}
</script>