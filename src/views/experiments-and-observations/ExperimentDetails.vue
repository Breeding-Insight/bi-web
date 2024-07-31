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

    <ExperimentObservationsDownloadModal
        v-bind:experiment="experiment"
        v-bind:modal-title="`Download ${experiment.trialName}`"
        v-bind:trial-id="experimentUUID"
        v-bind:active="downloadModalActive"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:deactivate="downloadModalActive = false"
    />

    <SubEntityDatasetModal
        v-bind:experiment="experiment"
        v-bind:default-observation-level="experimentObservationUnit"
        v-bind:dataset-name-options="datasetNameOptions"
        v-bind:modal-title="`Create Sub-Entity Dataset`"
        v-bind:trial-id="experimentUUID"
        v-bind:active="subEntityModalActive"
        v-bind:create="createSubEntityDataset"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:deactivate="subEntityModalActive = false"
    />

    <div v-if="!experimentLoading && experiment!=null">

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
<!--              the following may be revived later-->
<!--              <li><b>Environments: </b> {{ environmentsCount }}</li>-->
            </ul>
          </section>
        </article>
        <article class="column is-narrow">
          <ActionMenu v-bind:is-primary="true"
                      v-bind:id="'manage-experiment-dropdown-button'"
                      v-bind:button-text="'Manage Experiment'"
                      v-bind:action-menu-items="actions"
                      v-on:import-file="importFile()"
                      v-on:download-file="downloadFile()"
                      v-on:create-sub-entity-dataset="openSubEntityModal()"
          />
        </article>
      </div>

    </div>
    <section>
      <nav class="tabs is-boxed">
        <ul>
          <router-link
            v-for="dataset in datasetMetadata"
            v-bind:key="dataset.id"
            v-bind:to="{name: 'experiment_dataset', params: {programId: activeProgram.id, experimentId: experimentUUID, datasetId: dataset.id}}"
            tag="li"
            active-class="is-active"
          >
            <a>{{ dataset.name }}</a>
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
import {Program} from "@/breeding-insight/model/Program";
import {Result} from "@/breeding-insight/model/Result";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";
import ClickOutside from 'vue-click-outside';
import {Trial} from "@/breeding-insight/model/Trial";
import ProgramsBase from "@/components/program/ProgramsBase.vue";
import ActionMenu from "@/components/layouts/menus/ActionMenu.vue";
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";
import ExperimentObservationsDownloadModal from "@/components/experiments/ExperimentObservationsDownloadModal.vue";
import SubEntityDatasetModal from "@/components/modals/SubEntityDatasetModal.vue";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {SubEntityDatasetNewRequest} from "@/breeding-insight/model/SubEntityDatasetNewRequest";
import {DatasetModel} from "@/breeding-insight/model/DatasetModel";

@Component({
  components: {
    SubEntityDatasetModal,
    PlusCircleIcon,
    ExperimentObservationsDownloadModal,
    ActionMenu
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
export default class ExperimentDetails extends ProgramsBase {
  private activeProgram: Program;
  private experiment: Trial;
  private experimentLoading: boolean = true;
  private downloadModalActive: boolean = false;
  private subEntityModalActive: boolean = false;
  private datasetMetadata: DatasetMetadata[] = [];

  private actions: ActionMenuItem[] = [
      new ActionMenuItem('experiment-import-file', 'import-file', 'Import file'),
      new ActionMenuItem('experiment-download-file', 'download-file', 'Download file'),
      // new ActionMenuItem('experiment-create-sub-entity-dataset', 'create-sub-entity-dataset', 'Create Sub-Entity Dataset')
  ];

  mounted () {
    this.getExperiment();
    this.getDatasetMetadata();
  }

  private importFile() {
    this.$router.push({
      name: 'experiment-import',
      params: {
        programId: this.activeProgram!.id!
      },
    });
  }

  private downloadFile() {
    this.downloadModalActive = true;
  }

  private async createSubEntityDataset(subEntityRequest: SubEntityDatasetNewRequest): Promise<boolean> {
    console.log("createSubEntityDataset invoked with arguments: datasetName=" + subEntityRequest.name + ", repeatedMeasures=" + subEntityRequest.repeatedMeasures);
    const response: Result<Error, DatasetModel> = await ExperimentService.createSubEntityDataset(this.activeProgram!.id!, this.experimentUUID, subEntityRequest);
    if (response.isErr()) {
      throw response.value;
    }
    await this.$router.push({name: 'experiment_dataset', params: {datasetId: response.value.id, programId: this.activeProgram!.id!, experimentId: this.experimentUUID}});
    return true;
  }

  private openSubEntityModal() {
    this.subEntityModalActive = true;
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
  // This is not being used.  But may be used later.
  // get environmentsCount(): string {
  //   if( !this.experiment.additionalInfo ){return '';}
  //   return this.experiment.additionalInfo.environmentsCount;
  // }

  get datasetNameOptions(): String[] {
    // TODO: [BI-2182] fetch and return all sub-entity names for experiments in this program, excluding the current experiment.
    // TODO: [BI-2182] exclude top level dataset names.
    return [];
  }

  get experimentObservationUnit(): string | null {
    if (this.experiment && this.experiment.additionalInfo) {
      return this.experiment.additionalInfo.defaultObservationLevel;
    }
    return null;
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

  // Get metadata for all datasets available in this experiment.
  @Watch('$route')
  async getDatasetMetadata(): DatasetMetadata[] {
    try {
      const response: Result<Error, DatasetMetadata[]> = await ExperimentService.getDatasetMetadata(this.activeProgram!.id!, this.experimentUUID, true);
      if (response.isErr()) {
        throw response.value;
      }
      this.datasetMetadata = response.value;
    } catch (err) {
      // Display error that experiment cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load datasets');
      throw err;
    }
  }
}
</script>