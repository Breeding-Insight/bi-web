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
  <DeleteModal
    v-bind:unique-id="trialId"
    v-bind:modal-title="modalTitle"
    v-bind:deleteAction ="deleteAction"
    v-bind:active="active && loadingDatasetOptionsComplete"
    modal-class="experiment-observations-download-button"
    v-on:deactivate="resetExportOptions"
  >
    <template #form>
      <p>{{obsCount}} observations will be deleted. All records will be lost. Are you sure you want to delete the experimental data?</p>
    </template>
    <slot />
  </DeleteModal>
</template>


<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import {validationMixin} from "vuelidate";
import {mapGetters} from "vuex";
import {Program} from "@/breeding-insight/model/Program";
import {ExperimentExportOptions} from "@/breeding-insight/model/ExperimentExportOptions";
import {FileTypeOption} from "@/breeding-insight/model/FileTypeOption";
import {AlertTriangleIcon} from 'vue-feather-icons';
import {Trial} from "@/breeding-insight/model/Trial";
import {Metadata} from "@/breeding-insight/model/BiResponse";
import {Study} from "@/breeding-insight/model/Study";
import {StudyService} from "@/breeding-insight/service/StudyService";
import {Result} from "@/breeding-insight/model/Result";
import {BrAPIUtils} from "@/breeding-insight/utils/BrAPIUtils";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import {DatasetMetadata} from "@/breeding-insight/model/DatasetMetadata";
import {ExperimentService} from "@/breeding-insight/service/ExperimentService";

@Component({
  mixins: [validationMixin],
  components: {DeleteModal, AlertTriangleIcon},
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class ExperimentDeleteModal extends Vue {

  @Prop()
  active!: boolean;
  @Prop()
  trialId!: string;
  @Prop()
  obsCount!: number;
  @Prop()
  experiment!: Trial;
  @Prop()
  modalTitle?: string;
  @Prop()
  defaultDatasetId?: string; // TODO do I need this?

  private activeProgram?: Program;
  private fileOptions: ExperimentExportOptions = new ExperimentExportOptions();
  // private obsCount: number = 5;
  //private showEnvironmentsValidationError: boolean = false;
  private fileExtensionOptions: object[] = Object.values(FileTypeOption);
  private datasetOptions: DatasetMetadata[] = [];
  private environmentOptions: object[] = [];
  // private loadingStudyOptionsComplete: boolean = false;
  private loadingDatasetOptionsComplete: boolean = true;

  // //TODO remove?
  // @Watch('experiment', {immediate: true})
  // onExperimentChanged() {
  //   // Reset loading flag.
  //   this.loadingDatasetOptionsComplete = false;
  //   this.getDatasetOptions();
  // }

  async getDatasetOptions() {
    // Fetch all datasets available for this experiment.
    try {
      const response: Result<Error, DatasetMetadata[]> = await ExperimentService.getDatasetMetadataByTrial(this.activeProgram!.id!, this.experiment!);
      if (response.isErr()) {
        throw response.value;
      }
      this.datasetOptions = response.value;
      this.setDefaultDatasetOption();

      this.loadingDatasetOptionsComplete = true;
    } catch (err) {
      // Display error that datasets cannot be loaded
      this.$emit('show-error-notification', 'Error while trying to load datasets');
      throw err;
    }
  }

  setDefaultDatasetOption() {
    // Set default selected dataset to property if provided, fall back to first in list of options.
    if (this.defaultDatasetId !== undefined) {
      this.fileOptions.datasetId = this.defaultDatasetId;
    } else if (this.datasetOptions.length > 0){
      this.fileOptions.datasetId = this.datasetOptions[0].id;
    }
  }

  async deleteAction(): Promise<void> {
    if (this.activeProgram) {
      try {
        // Call the service method and await its completion
        let hasObsUnits: boolean = this.obsCount > 0;
        await ExperimentService.deleteExperiment(
            this.activeProgram.id,
            this.trialId,
            hasObsUnits,
        );
        this.$router.push({
          name: 'experiments-observations',
          params: {
            programId: this.activeProgram!.id!
          },
        });
        // If the above call doesn't throw an error, we assume it was successful
        // Emit the event after the promise is resolved
        this.$emit('remove-collaborator');

      } catch (error) {
        // Handle any errors that might occur during the async operation
        console.error('Error while trying to delete experiment:', error);
        // Optionally emit an error event or handle the error in some way
        this.$emit('show-error-notification', `Error while trying to delete experiment`);
      }
    }
  }

  resetExportOptions(){
    // Notify parent when deactivated to close modal
    this.$emit('deactivate');
    // Reset file export options.
    this.fileOptions = new ExperimentExportOptions();
    // Make sure default dataset option is selected.
    this.setDefaultDatasetOption();
    // Reset validation state.
    // this.showEnvironmentsValidationError = false;
  }

  validateOptions(): boolean {
    // Either "All environments" or one or more specific environments must be selected.
    if (this.fileOptions.environments.length === 0 && !this.fileOptions.allEnvironments){
      this.$emit('show-error-notification', 'One or more environments must be selected.');
       // this.showEnvironmentsValidationError = true;
      return false;
    }
    return true;
  }
  // mounted() {
  //   this.obsCount = 77;
  // }
}
</script>